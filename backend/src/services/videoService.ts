import AWS from 'aws-sdk';
import { config } from '../config';
import { logger } from '../utils/logger';

const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB.DocumentClient();

export interface Video {
  videoId: string;
  deviceId: string;
  crossingId: string;
  alertId?: string;
  url: string;
  thumbnailUrl?: string;
  duration: number;
  size: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

export class VideoService {
  private tableName = 'xingaeye-videos';
  private bucketName = config.aws.s3Bucket;

  async getVideos(filters: {
    crossingId?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ videos: Video[]; total: number }> {
    try {
      const params: any = {
        TableName: this.tableName,
      };

      if (filters.crossingId) {
        params.FilterExpression = 'crossingId = :crossingId';
        params.ExpressionAttributeValues = {
          ':crossingId': filters.crossingId,
        };
      }

      const result = await dynamodb.scan(params).promise();
      let videos = (result.Items as Video[]) || [];

      // Sort by timestamp
      videos.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      const total = videos.length;
      const offset = filters.offset || 0;
      const limit = filters.limit || 50;
      videos = videos.slice(offset, offset + limit);

      // Generate signed URLs for each video
      videos = await Promise.all(
        videos.map(async (video) => ({
          ...video,
          url: await this.getSignedUrl(video.videoId),
        }))
      );

      return { videos, total };
    } catch (error) {
      logger.error('Error getting videos:', error);
      throw error;
    }
  }

  async getVideoById(videoId: string): Promise<Video | null> {
    try {
      const params = {
        TableName: this.tableName,
        Key: { videoId },
      };

      const result = await dynamodb.get(params).promise();
      const video = result.Item as Video;

      if (video) {
        video.url = await this.getSignedUrl(videoId);
      }

      return video || null;
    } catch (error) {
      logger.error('Error getting video:', error);
      throw error;
    }
  }

  async getStreamUrl(videoId: string): Promise<string> {
    try {
      return await this.getSignedUrl(videoId);
    } catch (error) {
      logger.error('Error getting stream URL:', error);
      throw error;
    }
  }

  async generateUploadUrl(data: {
    deviceId: string;
    crossingId: string;
    alertId?: string;
    metadata?: Record<string, any>;
  }): Promise<{ uploadUrl: string; videoId: string }> {
    try {
      const videoId = `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const key = `videos/${data.crossingId}/${videoId}.mp4`;

      const uploadUrl = s3.getSignedUrl('putObject', {
        Bucket: this.bucketName,
        Key: key,
        Expires: 3600, // 1 hour
        ContentType: 'video/mp4',
      });

      // Create video record in database
      const video: Video = {
        videoId,
        deviceId: data.deviceId,
        crossingId: data.crossingId,
        alertId: data.alertId,
        url: key,
        duration: 0,
        size: 0,
        timestamp: new Date().toISOString(),
        metadata: data.metadata,
      };

      await dynamodb
        .put({
          TableName: this.tableName,
          Item: video,
        })
        .promise();

      return { uploadUrl, videoId };
    } catch (error) {
      logger.error('Error generating upload URL:', error);
      throw error;
    }
  }

  async deleteVideo(videoId: string): Promise<void> {
    try {
      const video = await this.getVideoById(videoId);
      if (!video) {
        throw new Error('Video not found');
      }

      // Delete from S3
      await s3
        .deleteObject({
          Bucket: this.bucketName,
          Key: video.url,
        })
        .promise();

      // Delete from DynamoDB
      await dynamodb
        .delete({
          TableName: this.tableName,
          Key: { videoId },
        })
        .promise();

      logger.info(`Video deleted: ${videoId}`);
    } catch (error) {
      logger.error('Error deleting video:', error);
      throw error;
    }
  }

  async getLiveStream(deviceId: string): Promise<string> {
    try {
      // In production, this would return a WebRTC or HLS stream URL
      // For now, return a placeholder
      return `wss://stream.xingaeye.com/live/${deviceId}`;
    } catch (error) {
      logger.error('Error getting live stream:', error);
      throw error;
    }
  }

  private async getSignedUrl(videoId: string): Promise<string> {
    try {
      const video = await this.getVideoById(videoId);
      if (!video) {
        throw new Error('Video not found');
      }

      return s3.getSignedUrl('getObject', {
        Bucket: this.bucketName,
        Key: video.url,
        Expires: 3600, // 1 hour
      });
    } catch (error) {
      logger.error('Error generating signed URL:', error);
      throw error;
    }
  }
}
