import AWS from 'aws-sdk';
import { config } from '../config';
import { logger } from '../utils/logger';

AWS.config.update({
  region: config.aws.region,
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
});

const iot = new AWS.Iot();
const iotData = new AWS.IotData({
  endpoint: config.aws.iotEndpoint,
});
const dynamodb = new AWS.DynamoDB.DocumentClient();

export interface Device {
  deviceId: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  crossingId: string;
  status: 'online' | 'offline' | 'maintenance';
  lastSeen?: Date;
  config?: Record<string, any>;
  metadata?: Record<string, any>;
}

export class DeviceService {
  private tableName = config.aws.dynamodbTable;

  /**
   * Get all devices
   */
  async getAllDevices(): Promise<Device[]> {
    try {
      const params = {
        TableName: this.tableName,
      };

      const result = await dynamodb.scan(params).promise();
      return (result.Items as Device[]) || [];
    } catch (error) {
      logger.error('Error getting all devices:', error);
      throw error;
    }
  }

  /**
   * Get device by ID
   */
  async getDeviceById(deviceId: string): Promise<Device | null> {
    try {
      const params = {
        TableName: this.tableName,
        Key: { deviceId },
      };

      const result = await dynamodb.get(params).promise();
      return (result.Item as Device) || null;
    } catch (error) {
      logger.error('Error getting device:', error);
      throw error;
    }
  }

  /**
   * Get device status from IoT shadow
   */
  async getDeviceStatus(deviceId: string): Promise<any> {
    try {
      const params = {
        thingName: deviceId,
      };

      const shadow = await iotData.getThingShadow(params).promise();
      const shadowData = JSON.parse(shadow.payload as string);

      return {
        deviceId,
        status: shadowData.state.reported,
        lastUpdated: shadowData.metadata.reported,
        connected: shadowData.state.reported.connected,
        version: shadowData.version,
      };
    } catch (error) {
      logger.error('Error getting device status:', error);
      return {
        deviceId,
        status: 'unknown',
        connected: false,
        error: 'Failed to fetch device status',
      };
    }
  }

  /**
   * Send command to device via MQTT
   */
  async sendCommand(
    deviceId: string,
    command: string,
    params?: Record<string, any>
  ): Promise<any> {
    try {
      const topic = `device/${deviceId}/command`;
      const payload = JSON.stringify({
        command,
        params,
        timestamp: new Date().toISOString(),
      });

      const publishParams = {
        topic,
        payload,
        qos: 1,
      };

      await iotData.publish(publishParams).promise();

      logger.info(`Command sent to device ${deviceId}:`, { command, params });

      return {
        success: true,
        command,
        deviceId,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Error sending command to device:', error);
      throw error;
    }
  }

  /**
   * Update device configuration
   */
  async updateDeviceConfig(
    deviceId: string,
    config: Record<string, any>
  ): Promise<Device> {
    try {
      // Update in DynamoDB
      const params = {
        TableName: this.tableName,
        Key: { deviceId },
        UpdateExpression: 'set #config = :config, #updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#config': 'config',
          '#updatedAt': 'updatedAt',
        },
        ExpressionAttributeValues: {
          ':config': config,
          ':updatedAt': new Date().toISOString(),
        },
        ReturnValues: 'ALL_NEW',
      };

      const result = await dynamodb.update(params).promise();

      // Send config update command to device
      await this.sendCommand(deviceId, 'updateConfig', config);

      return result.Attributes as Device;
    } catch (error) {
      logger.error('Error updating device config:', error);
      throw error;
    }
  }

  /**
   * Register new device
   */
  async registerDevice(deviceData: Partial<Device>): Promise<Device> {
    try {
      const device: Device = {
        deviceId: deviceData.deviceId!,
        name: deviceData.name!,
        location: deviceData.location!,
        crossingId: deviceData.crossingId!,
        status: 'offline',
        metadata: {
          createdAt: new Date().toISOString(),
          ...deviceData.metadata,
        },
      };

      // Create IoT Thing
      await iot
        .createThing({
          thingName: device.deviceId,
          attributePayload: {
            attributes: {
              name: device.name,
              crossingId: device.crossingId,
            },
          },
        })
        .promise();

      // Save to DynamoDB
      const params = {
        TableName: this.tableName,
        Item: device,
      };

      await dynamodb.put(params).promise();

      logger.info(`Device registered: ${device.deviceId}`);

      return device;
    } catch (error) {
      logger.error('Error registering device:', error);
      throw error;
    }
  }

  /**
   * Get devices by crossing ID
   */
  async getDevicesByCrossing(crossingId: string): Promise<Device[]> {
    try {
      const params = {
        TableName: this.tableName,
        FilterExpression: 'crossingId = :crossingId',
        ExpressionAttributeValues: {
          ':crossingId': crossingId,
        },
      };

      const result = await dynamodb.scan(params).promise();
      return (result.Items as Device[]) || [];
    } catch (error) {
      logger.error('Error getting devices by crossing:', error);
      throw error;
    }
  }
}
