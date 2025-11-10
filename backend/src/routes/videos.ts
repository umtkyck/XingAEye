import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { VideoService } from '../services/videoService';
import { logger } from '../utils/logger';

const router = Router();
const videoService = new VideoService();

/**
 * GET /api/videos
 * Get all video recordings
 */
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { crossingId, startDate, endDate, limit = '50', offset = '0' } = req.query;

    const videos = await videoService.getVideos({
      crossingId: crossingId as string,
      startDate: startDate as string,
      endDate: endDate as string,
      limit: parseInt(limit as string, 10),
      offset: parseInt(offset as string, 10),
    });

    res.json({
      success: true,
      data: videos,
    });
  } catch (error) {
    logger.error('Error fetching videos:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch videos',
    });
  }
});

/**
 * GET /api/videos/:videoId
 * Get specific video details and signed URL
 */
router.get('/:videoId', async (req: AuthRequest, res: Response) => {
  try {
    const { videoId } = req.params;
    const video = await videoService.getVideoById(videoId);

    if (!video) {
      res.status(404).json({
        success: false,
        error: 'Video not found',
      });
      return;
    }

    res.json({
      success: true,
      data: video,
    });
  } catch (error) {
    logger.error('Error fetching video:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch video',
    });
  }
});

/**
 * GET /api/videos/:videoId/stream
 * Get video stream URL
 */
router.get('/:videoId/stream', async (req: AuthRequest, res: Response) => {
  try {
    const { videoId } = req.params;
    const streamUrl = await videoService.getStreamUrl(videoId);

    res.json({
      success: true,
      data: { streamUrl },
    });
  } catch (error) {
    logger.error('Error getting stream URL:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get stream URL',
    });
  }
});

/**
 * POST /api/videos/upload
 * Upload video from device
 */
router.post('/upload', async (req: AuthRequest, res: Response) => {
  try {
    const { deviceId, crossingId, alertId, metadata } = req.body;

    const uploadUrl = await videoService.generateUploadUrl({
      deviceId,
      crossingId,
      alertId,
      metadata,
    });

    res.json({
      success: true,
      data: uploadUrl,
    });
  } catch (error) {
    logger.error('Error generating upload URL:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate upload URL',
    });
  }
});

/**
 * DELETE /api/videos/:videoId
 * Delete video
 */
router.delete('/:videoId', async (req: AuthRequest, res: Response) => {
  try {
    const { videoId } = req.params;
    await videoService.deleteVideo(videoId);

    res.json({
      success: true,
      message: 'Video deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting video:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete video',
    });
  }
});

/**
 * GET /api/videos/live/:deviceId
 * Get live video stream from device
 */
router.get('/live/:deviceId', async (req: AuthRequest, res: Response) => {
  try {
    const { deviceId } = req.params;
    const liveStreamUrl = await videoService.getLiveStream(deviceId);

    res.json({
      success: true,
      data: { liveStreamUrl },
    });
  } catch (error) {
    logger.error('Error getting live stream:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get live stream',
    });
  }
});

export default router;
