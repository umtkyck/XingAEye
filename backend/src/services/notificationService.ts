import twilio from 'twilio';
import sgMail from '@sendgrid/mail';
import { config } from '../config';
import { logger } from '../utils/logger';

// Initialize Twilio
const twilioClient = config.notifications.twilio.accountSid
  ? twilio(
      config.notifications.twilio.accountSid,
      config.notifications.twilio.authToken
    )
  : null;

// Initialize SendGrid
if (config.notifications.sendgrid.apiKey) {
  sgMail.setApiKey(config.notifications.sendgrid.apiKey);
}

interface PushNotification {
  title: string;
  body: string;
  data?: Record<string, any>;
  priority?: 'high' | 'normal';
}

interface SMS {
  to: string;
  message: string;
}

interface Email {
  to: string | string[];
  subject: string;
  body: string;
  html?: string;
}

export class NotificationService {
  /**
   * Send push notification to mobile devices
   */
  async sendPushNotification(notification: PushNotification): Promise<void> {
    try {
      // TODO: Implement with Firebase Cloud Messaging (FCM) or AWS SNS
      // For now, just log
      logger.info('Push notification would be sent:', notification);

      // Example FCM implementation:
      // await admin.messaging().send({
      //   notification: {
      //     title: notification.title,
      //     body: notification.body,
      //   },
      //   data: notification.data,
      //   android: {
      //     priority: notification.priority || 'high',
      //   },
      //   topic: 'all-users', // or specific user tokens
      // });
    } catch (error) {
      logger.error('Error sending push notification:', error);
      throw error;
    }
  }

  /**
   * Send SMS notification
   */
  async sendSMS(sms: SMS): Promise<void> {
    try {
      if (!twilioClient) {
        logger.warn('Twilio not configured, skipping SMS');
        return;
      }

      await twilioClient.messages.create({
        body: sms.message,
        from: config.notifications.twilio.phoneNumber,
        to: sms.to,
      });

      logger.info(`SMS sent to ${sms.to}`);
    } catch (error) {
      logger.error('Error sending SMS:', error);
      throw error;
    }
  }

  /**
   * Send email notification
   */
  async sendEmail(email: Email): Promise<void> {
    try {
      if (!config.notifications.sendgrid.apiKey) {
        logger.warn('SendGrid not configured, skipping email');
        return;
      }

      const msg = {
        to: email.to,
        from: config.notifications.sendgrid.fromEmail,
        subject: email.subject,
        text: email.body,
        html: email.html || email.body.replace(/\n/g, '<br>'),
      };

      await sgMail.send(msg);

      logger.info(`Email sent to ${email.to}`);
    } catch (error) {
      logger.error('Error sending email:', error);
      throw error;
    }
  }

  /**
   * Send multi-channel notification
   */
  async sendMultiChannelNotification(
    channels: {
      push?: PushNotification;
      sms?: SMS;
      email?: Email;
    }
  ): Promise<void> {
    try {
      const promises = [];

      if (channels.push) {
        promises.push(this.sendPushNotification(channels.push));
      }

      if (channels.sms) {
        promises.push(this.sendSMS(channels.sms));
      }

      if (channels.email) {
        promises.push(this.sendEmail(channels.email));
      }

      await Promise.allSettled(promises);
    } catch (error) {
      logger.error('Error sending multi-channel notification:', error);
      // Don't throw - partial success is acceptable for notifications
    }
  }
}
