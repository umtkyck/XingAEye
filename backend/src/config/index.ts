import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:19006').split(','),

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  // AWS
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    iotEndpoint: process.env.AWS_IOT_ENDPOINT,
    s3Bucket: process.env.AWS_S3_BUCKET || 'xingaeye-videos',
    dynamodbTable: process.env.AWS_DYNAMODB_TABLE || 'xingaeye-devices',
  },

  // Database
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'xingaeye',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  },

  // Notifications
  notifications: {
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      phoneNumber: process.env.TWILIO_PHONE_NUMBER,
    },
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY,
      fromEmail: process.env.SENDGRID_FROM_EMAIL || 'alerts@xingaeye.com',
    },
  },

  // Video streaming
  video: {
    maxDuration: parseInt(process.env.VIDEO_MAX_DURATION || '300', 10), // 5 minutes
    retentionDays: parseInt(process.env.VIDEO_RETENTION_DAYS || '30', 10),
  },

  // Alerts
  alerts: {
    maxRetries: parseInt(process.env.ALERT_MAX_RETRIES || '3', 10),
    retryDelay: parseInt(process.env.ALERT_RETRY_DELAY || '5000', 10),
  },
};
