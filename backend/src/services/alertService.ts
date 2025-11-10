import AWS from 'aws-sdk';
import { config } from '../config';
import { logger } from '../utils/logger';
import { NotificationService } from './notificationService';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
export type AlertType =
  | 'obstacle_on_tracks'
  | 'pedestrian_crossing'
  | 'vehicle_on_tracks'
  | 'train_approaching'
  | 'gate_malfunction'
  | 'camera_failure'
  | 'device_offline'
  | 'suspicious_activity';

export interface Alert {
  alertId: string;
  type: AlertType;
  severity: AlertSeverity;
  crossingId: string;
  deviceId: string;
  status: 'new' | 'acknowledged' | 'resolved';
  title: string;
  description: string;
  detectionData?: {
    objectType?: string;
    confidence?: number;
    position?: { x: number; y: number };
    imageUrl?: string;
    videoUrl?: string;
  };
  timestamp: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  resolution?: string;
  notes?: string;
}

export class AlertService {
  private tableName = 'xingaeye-alerts';
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  /**
   * Get alerts with filtering
   */
  async getAlerts(filters: {
    status?: string;
    severity?: string;
    crossingId?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ alerts: Alert[]; total: number }> {
    try {
      let filterExpression = '';
      const expressionAttributeValues: any = {};
      const expressionAttributeNames: any = {};

      // Build filter expression
      if (filters.status) {
        filterExpression += '#status = :status';
        expressionAttributeNames['#status'] = 'status';
        expressionAttributeValues[':status'] = filters.status;
      }

      if (filters.severity) {
        if (filterExpression) filterExpression += ' AND ';
        filterExpression += 'severity = :severity';
        expressionAttributeValues[':severity'] = filters.severity;
      }

      if (filters.crossingId) {
        if (filterExpression) filterExpression += ' AND ';
        filterExpression += 'crossingId = :crossingId';
        expressionAttributeValues[':crossingId'] = filters.crossingId;
      }

      const params: any = {
        TableName: this.tableName,
      };

      if (filterExpression) {
        params.FilterExpression = filterExpression;
        params.ExpressionAttributeValues = expressionAttributeValues;
        if (Object.keys(expressionAttributeNames).length > 0) {
          params.ExpressionAttributeNames = expressionAttributeNames;
        }
      }

      const result = await dynamodb.scan(params).promise();
      let alerts = (result.Items as Alert[]) || [];

      // Sort by timestamp (newest first)
      alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      const total = alerts.length;

      // Apply pagination
      const offset = filters.offset || 0;
      const limit = filters.limit || 50;
      alerts = alerts.slice(offset, offset + limit);

      return { alerts, total };
    } catch (error) {
      logger.error('Error getting alerts:', error);
      throw error;
    }
  }

  /**
   * Get alert by ID
   */
  async getAlertById(alertId: string): Promise<Alert | null> {
    try {
      const params = {
        TableName: this.tableName,
        Key: { alertId },
      };

      const result = await dynamodb.get(params).promise();
      return (result.Item as Alert) || null;
    } catch (error) {
      logger.error('Error getting alert:', error);
      throw error;
    }
  }

  /**
   * Create new alert
   */
  async createAlert(alertData: Partial<Alert>): Promise<Alert> {
    try {
      const alert: Alert = {
        alertId: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: alertData.type!,
        severity: alertData.severity!,
        crossingId: alertData.crossingId!,
        deviceId: alertData.deviceId!,
        status: 'new',
        title: alertData.title!,
        description: alertData.description!,
        detectionData: alertData.detectionData,
        timestamp: new Date().toISOString(),
      };

      // Save to DynamoDB
      const params = {
        TableName: this.tableName,
        Item: alert,
      };

      await dynamodb.put(params).promise();

      logger.info(`Alert created: ${alert.alertId}`, { type: alert.type, severity: alert.severity });

      // Send notifications based on severity
      this.sendAlertNotifications(alert);

      return alert;
    } catch (error) {
      logger.error('Error creating alert:', error);
      throw error;
    }
  }

  /**
   * Acknowledge alert
   */
  async acknowledgeAlert(
    alertId: string,
    data: { acknowledgedBy?: string; notes?: string }
  ): Promise<Alert> {
    try {
      const params = {
        TableName: this.tableName,
        Key: { alertId },
        UpdateExpression:
          'set #status = :status, acknowledgedBy = :acknowledgedBy, acknowledgedAt = :acknowledgedAt, notes = :notes',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':status': 'acknowledged',
          ':acknowledgedBy': data.acknowledgedBy || 'unknown',
          ':acknowledgedAt': new Date().toISOString(),
          ':notes': data.notes || '',
        },
        ReturnValues: 'ALL_NEW',
      };

      const result = await dynamodb.update(params).promise();

      logger.info(`Alert acknowledged: ${alertId}`);

      return result.Attributes as Alert;
    } catch (error) {
      logger.error('Error acknowledging alert:', error);
      throw error;
    }
  }

  /**
   * Resolve alert
   */
  async resolveAlert(
    alertId: string,
    data: { resolvedBy?: string; resolution: string; notes?: string }
  ): Promise<Alert> {
    try {
      const params = {
        TableName: this.tableName,
        Key: { alertId },
        UpdateExpression:
          'set #status = :status, resolvedBy = :resolvedBy, resolvedAt = :resolvedAt, resolution = :resolution, notes = :notes',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':status': 'resolved',
          ':resolvedBy': data.resolvedBy || 'unknown',
          ':resolvedAt': new Date().toISOString(),
          ':resolution': data.resolution,
          ':notes': data.notes || '',
        },
        ReturnValues: 'ALL_NEW',
      };

      const result = await dynamodb.update(params).promise();

      logger.info(`Alert resolved: ${alertId}`);

      return result.Attributes as Alert;
    } catch (error) {
      logger.error('Error resolving alert:', error);
      throw error;
    }
  }

  /**
   * Get active alert counts by severity
   */
  async getActiveAlertCounts(): Promise<Record<AlertSeverity, number>> {
    try {
      const params = {
        TableName: this.tableName,
        FilterExpression: '#status <> :resolved',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':resolved': 'resolved',
        },
      };

      const result = await dynamodb.scan(params).promise();
      const alerts = (result.Items as Alert[]) || [];

      const counts: Record<AlertSeverity, number> = {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
      };

      alerts.forEach((alert) => {
        counts[alert.severity]++;
      });

      return counts;
    } catch (error) {
      logger.error('Error getting active alert counts:', error);
      throw error;
    }
  }

  /**
   * Send notifications for alert
   */
  private async sendAlertNotifications(alert: Alert): Promise<void> {
    try {
      // Critical alerts get immediate notifications
      if (alert.severity === 'critical' || alert.severity === 'high') {
        await Promise.all([
          this.notificationService.sendPushNotification({
            title: `🚨 ${alert.title}`,
            body: alert.description,
            data: { alertId: alert.alertId, crossingId: alert.crossingId },
          }),
          this.notificationService.sendSMS({
            to: '+1234567890', // This should come from user preferences
            message: `CRITICAL ALERT: ${alert.title} at crossing ${alert.crossingId}. ${alert.description}`,
          }),
          this.notificationService.sendEmail({
            to: 'alerts@xingaeye.com', // This should come from configuration
            subject: `🚨 Critical Alert: ${alert.title}`,
            body: `
              Alert Type: ${alert.type}
              Severity: ${alert.severity}
              Crossing: ${alert.crossingId}
              Time: ${alert.timestamp}

              ${alert.description}
            `,
          }),
        ]);
      } else {
        // Medium/low alerts only get push notifications
        await this.notificationService.sendPushNotification({
          title: alert.title,
          body: alert.description,
          data: { alertId: alert.alertId, crossingId: alert.crossingId },
        });
      }
    } catch (error) {
      logger.error('Error sending alert notifications:', error);
      // Don't throw - notifications failing shouldn't stop alert creation
    }
  }
}
