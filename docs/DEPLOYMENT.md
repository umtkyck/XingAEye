# XingAEye Deployment Guide

This guide walks through deploying the XingAEye railroad crossing safety system to production.

## Prerequisites

- AWS Account with appropriate permissions
- Node.js 18+ installed
- AWS CLI configured
- Vercel account (for web dashboard)
- Expo/EAS account (for mobile app)

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    AWS Infrastructure                    │
│  - IoT Core (Device Management)                         │
│  - DynamoDB (Data Storage)                              │
│  - S3 (Video Storage)                                   │
│  - Lambda (Serverless Functions)                        │
│  - CloudWatch (Monitoring)                              │
└─────────────────────────────────────────────────────────┘
           │                    │                    │
           ▼                    ▼                    ▼
    ┌──────────┐         ┌──────────┐        ┌──────────┐
    │ Backend  │         │   Web    │        │  Mobile  │
    │ (ECS/EC2)│         │ (Vercel) │        │  (Expo)  │
    └──────────┘         └──────────┘        └──────────┘
```

## Step 1: Deploy AWS Infrastructure

### 1.1 Configure AWS Credentials

```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Default region: us-east-1
```

### 1.2 Deploy CDK Stack

```bash
cd aws/cdk
npm install
npm run build

# Bootstrap CDK (first time only)
cdk bootstrap

# Deploy infrastructure
cdk deploy
```

This will create:
- DynamoDB tables for devices, crossings, alerts, videos, users
- S3 bucket for video storage
- IoT Core rules for device communication
- Lambda functions for alert processing

### 1.3 Note the Output Values

After deployment, save these values:
- IoT Endpoint
- S3 Bucket Name
- DynamoDB Table Names

## Step 2: Deploy Backend API

### Option A: Deploy to AWS ECS (Recommended for Production)

```bash
cd backend

# Build Docker image
docker build -t xingaeye-backend .

# Tag and push to ECR
aws ecr create-repository --repository-name xingaeye-backend
docker tag xingaeye-backend:latest <YOUR_ECR_URI>:latest
docker push <YOUR_ECR_URI>:latest

# Deploy to ECS (use AWS Console or CLI)
```

### Option B: Deploy to AWS Lambda (Serverless)

```bash
cd backend
npm run build

# Package and deploy using Serverless Framework or AWS SAM
```

### 2.1 Set Environment Variables

Configure these environment variables in your deployment:

```env
NODE_ENV=production
AWS_REGION=us-east-1
AWS_IOT_ENDPOINT=<your-iot-endpoint>
AWS_S3_BUCKET=xingaeye-videos
JWT_SECRET=<your-secure-secret>
TWILIO_ACCOUNT_SID=<your-twilio-sid>
SENDGRID_API_KEY=<your-sendgrid-key>
```

## Step 3: Deploy Web Dashboard

### 3.1 Configure Vercel

```bash
cd web

# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 3.2 Set Environment Variables in Vercel

Go to your Vercel project settings and add:

```env
NEXT_PUBLIC_API_URL=https://api.xingaeye.com
NEXT_PUBLIC_MAPBOX_TOKEN=<your-mapbox-token>
```

### 3.3 Configure Custom Domain (Optional)

In Vercel dashboard:
1. Go to Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

## Step 4: Deploy Mobile App

### 4.1 Configure EAS Build

```bash
cd mobile

# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure
```

### 4.2 Update app.json

Update the following in `app.json`:
- Bundle identifiers (iOS and Android)
- App name and version
- Notification settings

### 4.3 Build for iOS

```bash
# Create iOS build
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

### 4.4 Build for Android

```bash
# Create Android build
eas build --platform android

# Submit to Google Play
eas submit --platform android
```

## Step 5: Configure IoT Devices

### 5.1 Create IoT Thing

For each Jetson Orin Nano device:

```bash
# Create thing
aws iot create-thing --thing-name device-001

# Create and attach certificate
aws iot create-keys-and-certificate \
  --set-as-active \
  --certificate-pem-outfile device-001.cert.pem \
  --public-key-outfile device-001.public.key \
  --private-key-outfile device-001.private.key

# Attach policy
aws iot attach-policy \
  --policy-name XingAEyeDevicePolicy \
  --target <certificate-arn>
```

### 5.2 Configure Device

Copy the certificates to your Jetson device and configure MQTT connection:

```python
# device_config.py
AWS_IOT_ENDPOINT = "xxxxx.iot.us-east-1.amazonaws.com"
DEVICE_ID = "device-001"
CERT_PATH = "/path/to/device-001.cert.pem"
KEY_PATH = "/path/to/device-001.private.key"
ROOT_CA_PATH = "/path/to/AmazonRootCA1.pem"
```

## Step 6: Configure Notifications

### 6.1 Twilio SMS Setup

1. Create Twilio account
2. Get phone number
3. Configure credentials in backend

### 6.2 SendGrid Email Setup

1. Create SendGrid account
2. Generate API key
3. Verify sender domain
4. Configure in backend

### 6.3 Push Notifications

1. Firebase Cloud Messaging:
   - Create Firebase project
   - Download service account key
   - Configure in backend

2. Apple Push Notification Service (APNs):
   - Generate APNs certificate
   - Upload to Firebase/AWS SNS

## Step 7: Monitoring and Logging

### 7.1 CloudWatch Setup

```bash
# Create log groups
aws logs create-log-group --log-group-name /xingaeye/backend
aws logs create-log-group --log-group-name /xingaeye/devices
```

### 7.2 Set Up Alarms

```bash
# CPU utilization alarm
aws cloudwatch put-metric-alarm \
  --alarm-name xingaeye-high-cpu \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --threshold 80

# Error rate alarm
aws cloudwatch put-metric-alarm \
  --alarm-name xingaeye-high-errors \
  --alarm-description "Alert on high error rate" \
  --metric-name Errors \
  --threshold 10
```

## Step 8: Security Hardening

### 8.1 Enable AWS WAF

Protect your API with AWS WAF:
- Rate limiting
- SQL injection protection
- XSS protection

### 8.2 Secrets Management

Use AWS Secrets Manager for sensitive data:

```bash
aws secretsmanager create-secret \
  --name xingaeye/prod/db \
  --secret-string '{"username":"admin","password":"secure123"}'
```

### 8.3 SSL/TLS Certificates

Ensure all endpoints use HTTPS:
- Use AWS Certificate Manager for backend
- Vercel provides automatic HTTPS
- Configure SSL for custom domains

## Step 9: Backup and Disaster Recovery

### 9.1 DynamoDB Backups

```bash
# Enable point-in-time recovery
aws dynamodb update-continuous-backups \
  --table-name xingaeye-devices \
  --point-in-time-recovery-specification PointInTimeRecoveryEnabled=true
```

### 9.2 S3 Versioning

Already enabled in CDK stack. Verify:

```bash
aws s3api get-bucket-versioning --bucket xingaeye-videos
```

## Step 10: Testing Production Deployment

### 10.1 Smoke Tests

```bash
# Test backend health
curl https://api.xingaeye.com/health

# Test authentication
curl -X POST https://api.xingaeye.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### 10.2 Load Testing

Use tools like Apache Bench or k6:

```bash
# Install k6
brew install k6

# Run load test
k6 run loadtest.js
```

## Maintenance

### Regular Tasks

- **Daily**: Check CloudWatch dashboards
- **Weekly**: Review error logs and alerts
- **Monthly**: Review and optimize AWS costs
- **Quarterly**: Security audit and dependency updates

### Updates

```bash
# Backend updates
cd backend
npm update
npm run build
# Deploy new version

# Web updates
cd web
npm update
vercel --prod

# Mobile updates
cd mobile
npm update
eas build --platform all
```

## Rollback Procedures

### Backend Rollback

```bash
# Revert to previous ECS task definition
aws ecs update-service \
  --cluster xingaeye \
  --service backend \
  --task-definition xingaeye-backend:previous-version
```

### Web Rollback

```bash
# In Vercel dashboard, go to Deployments
# Click on previous deployment and "Promote to Production"
```

### Database Rollback

```bash
# Restore DynamoDB from backup
aws dynamodb restore-table-from-backup \
  --target-table-name xingaeye-devices \
  --backup-arn <backup-arn>
```

## Support

For issues during deployment:
- Check CloudWatch Logs
- Review AWS Service Health Dashboard
- Contact support@xingaeye.com

## Cost Estimation

Estimated monthly AWS costs for 50 railroad crossings:

- IoT Core: $50
- DynamoDB: $100
- S3: $50
- Lambda: $20
- ECS/EC2: $100
- CloudWatch: $20
- Data Transfer: $30

**Total**: ~$370/month

Costs scale based on:
- Number of devices
- Video storage duration
- API request volume
- Alert frequency
