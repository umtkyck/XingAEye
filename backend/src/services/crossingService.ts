import AWS from 'aws-sdk';
import { config } from '../config';
import { logger } from '../utils/logger';
import { DeviceService } from './deviceService';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export interface Crossing {
  crossingId: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: 'active' | 'inactive' | 'maintenance';
  region?: string;
  trackCount: number;
  hasBarriers: boolean;
  hasLights: boolean;
  metadata?: Record<string, any>;
}

export class CrossingService {
  private tableName = 'xingaeye-crossings';
  private deviceService: DeviceService;

  constructor() {
    this.deviceService = new DeviceService();
  }

  async getAllCrossings(filters?: {
    status?: string;
    region?: string;
  }): Promise<Crossing[]> {
    try {
      const params: any = {
        TableName: this.tableName,
      };

      if (filters?.status || filters?.region) {
        let filterExpression = '';
        const expressionAttributeValues: any = {};

        if (filters.status) {
          filterExpression = '#status = :status';
          expressionAttributeValues[':status'] = filters.status;
        }

        if (filters.region) {
          if (filterExpression) filterExpression += ' AND ';
          filterExpression += 'region = :region';
          expressionAttributeValues[':region'] = filters.region;
        }

        params.FilterExpression = filterExpression;
        params.ExpressionAttributeValues = expressionAttributeValues;
        if (filters.status) {
          params.ExpressionAttributeNames = { '#status': 'status' };
        }
      }

      const result = await dynamodb.scan(params).promise();
      return (result.Items as Crossing[]) || [];
    } catch (error) {
      logger.error('Error getting crossings:', error);
      throw error;
    }
  }

  async getCrossingById(crossingId: string): Promise<Crossing | null> {
    try {
      const params = {
        TableName: this.tableName,
        Key: { crossingId },
      };

      const result = await dynamodb.get(params).promise();
      return (result.Item as Crossing) || null;
    } catch (error) {
      logger.error('Error getting crossing:', error);
      throw error;
    }
  }

  async createCrossing(crossingData: Partial<Crossing>): Promise<Crossing> {
    try {
      const crossing: Crossing = {
        crossingId: `crossing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: crossingData.name!,
        location: crossingData.location!,
        status: 'active',
        region: crossingData.region,
        trackCount: crossingData.trackCount || 1,
        hasBarriers: crossingData.hasBarriers || false,
        hasLights: crossingData.hasLights || false,
        metadata: {
          createdAt: new Date().toISOString(),
          ...crossingData.metadata,
        },
      };

      const params = {
        TableName: this.tableName,
        Item: crossing,
      };

      await dynamodb.put(params).promise();
      logger.info(`Crossing created: ${crossing.crossingId}`);

      return crossing;
    } catch (error) {
      logger.error('Error creating crossing:', error);
      throw error;
    }
  }

  async updateCrossing(
    crossingId: string,
    updates: Partial<Crossing>
  ): Promise<Crossing> {
    try {
      const updateExpressions = [];
      const expressionAttributeValues: any = {};
      const expressionAttributeNames: any = {};

      if (updates.name) {
        updateExpressions.push('#name = :name');
        expressionAttributeNames['#name'] = 'name';
        expressionAttributeValues[':name'] = updates.name;
      }

      if (updates.status) {
        updateExpressions.push('#status = :status');
        expressionAttributeNames['#status'] = 'status';
        expressionAttributeValues[':status'] = updates.status;
      }

      const params = {
        TableName: this.tableName,
        Key: { crossingId },
        UpdateExpression: `set ${updateExpressions.join(', ')}, updatedAt = :updatedAt`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: {
          ...expressionAttributeValues,
          ':updatedAt': new Date().toISOString(),
        },
        ReturnValues: 'ALL_NEW',
      };

      const result = await dynamodb.update(params).promise();
      return result.Attributes as Crossing;
    } catch (error) {
      logger.error('Error updating crossing:', error);
      throw error;
    }
  }

  async getLiveStatus(crossingId: string): Promise<any> {
    try {
      const [crossing, devices] = await Promise.all([
        this.getCrossingById(crossingId),
        this.deviceService.getDevicesByCrossing(crossingId),
      ]);

      if (!crossing) {
        throw new Error('Crossing not found');
      }

      const deviceStatuses = await Promise.all(
        devices.map((device) => this.deviceService.getDeviceStatus(device.deviceId))
      );

      return {
        crossing,
        devices: deviceStatuses,
        liveMetrics: {
          onlineDevices: deviceStatuses.filter((d) => d.connected).length,
          totalDevices: devices.length,
          lastUpdate: new Date().toISOString(),
        },
      };
    } catch (error) {
      logger.error('Error getting live status:', error);
      throw error;
    }
  }

  async getStatistics(
    crossingId: string,
    dateRange: { startDate?: string; endDate?: string }
  ): Promise<any> {
    try {
      // Mock statistics - in real implementation, query from analytics database
      return {
        crossingId,
        period: {
          start: dateRange.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          end: dateRange.endDate || new Date().toISOString(),
        },
        incidents: {
          total: 12,
          byType: {
            obstacle_on_tracks: 3,
            pedestrian_crossing: 5,
            vehicle_on_tracks: 2,
            gate_malfunction: 2,
          },
        },
        alerts: {
          total: 45,
          bySeverity: {
            critical: 5,
            high: 12,
            medium: 18,
            low: 10,
          },
        },
        trafficFlow: {
          avgVehiclesPerDay: 1250,
          avgPedestriansPerDay: 340,
          peakHours: ['08:00-09:00', '17:00-18:00'],
        },
      };
    } catch (error) {
      logger.error('Error getting statistics:', error);
      throw error;
    }
  }
}
