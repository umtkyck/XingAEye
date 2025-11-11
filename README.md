# XingAEye - Railroad Crossing Safety System

AI-powered railroad crossing monitoring and safety system with edge processing on Jetson Orin Nano and cloud-based management.

## 🚂 Project Overview

XingAEye is a comprehensive safety solution for railroad crossings that prevents accidents through:

- **Real-time monitoring** of railroad crossings via edge AI cameras
- **Intelligent alerts** for vehicles, pedestrians, and obstacles
- **Cloud-based management** of multiple crossing locations
- **Mobile & web dashboards** for operators and administrators
- **Historical analytics** and incident reporting

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Railroad Crossing Site                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Jetson Orin Nano (Edge Processing)                    │ │
│  │  - AI Object Detection (vehicles, pedestrians, trains) │ │
│  │  - Real-time video analysis                            │ │
│  │  - Local alerting                                      │ │
│  └────────────┬───────────────────────────────────────────┘ │
└───────────────┼─────────────────────────────────────────────┘
                │ MQTT/WebSocket
                ▼
┌───────────────────────────────────────────────────────────────┐
│                        AWS Cloud                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  IoT Core    │  │  API Gateway │  │  Lambda/ECS      │   │
│  │  (Device Mgmt)│  │  (REST API)  │  │  (Business Logic)│   │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘   │
│         │                  │                    │              │
│  ┌──────▼──────────────────▼────────────────────▼─────────┐  │
│  │  DynamoDB    S3 (Videos)    RDS    CloudWatch Events  │  │
│  └───────────────────────────────────────────────────────┘  │
└───────────────────────┬──────────────────┬───────────────────┘
                        │                  │
         ┌──────────────┴────────┬─────────┴────────────┐
         ▼                       ▼                      ▼
    ┌─────────┐           ┌──────────┐          ┌──────────┐
    │ Mobile  │           │   Web    │          │  Email/  │
    │   App   │           │ Dashboard│          │   SMS    │
    │iOS/Android│         │ (Vercel) │          │ Alerts   │
    └─────────┘           └──────────┘          └──────────┘
```

## 📁 Project Structure

```
XingAEye/
├── backend/              # Backend API services
│   ├── src/
│   │   ├── api/         # REST API endpoints
│   │   ├── services/    # Business logic
│   │   ├── models/      # Data models
│   │   └── utils/       # Helper functions
│   └── package.json
│
├── mobile/              # React Native mobile app
│   ├── src/
│   │   ├── screens/     # App screens
│   │   ├── components/  # Reusable components
│   │   ├── services/    # API clients
│   │   └── navigation/  # Navigation setup
│   └── package.json
│
├── web/                 # Next.js web dashboard
│   ├── src/
│   │   ├── app/         # Next.js 14 app directory
│   │   ├── components/  # React components
│   │   └── lib/         # Utilities
│   └── package.json
│
├── aws/                 # AWS infrastructure
│   ├── cdk/            # AWS CDK infrastructure code
│   ├── lambda/         # Lambda functions
│   └── iot/            # IoT device configs
│
├── shared/              # Shared types and utilities
│   ├── types/          # TypeScript types
│   └── constants/      # Shared constants
│
└── docs/               # Documentation
    ├── API.md          # API documentation
    ├── DEPLOYMENT.md   # Deployment guide
    └── DEVICE.md       # Device integration guide
```

## 🎯 Key Features

### 1. Device Management
- Monitor all Jetson Orin Nano devices in real-time
- Remote configuration and updates
- Device health monitoring and diagnostics
- Connection status tracking

### 2. Video Monitoring & Storage
- Live video streaming from crossing cameras
- Cloud storage for incident recordings
- Video playback and analysis
- Automatic video retention policies

### 3. Intelligent Alerting System
- **Obstacle Detection**: Vehicles or objects on tracks
- **Pedestrian Alerts**: People crossing when unsafe
- **Train Approaching**: Coordination with train schedules
- **Gate Malfunction**: Barrier gate issues
- **Multi-channel Notifications**: Push, SMS, Email, Dashboard

### 4. Dashboard & Analytics
- Real-time map view of all crossings
- Individual crossing status and camera feeds
- Incident history and statistics
- Performance metrics and reports
- Heatmaps of high-risk areas

### 5. Mobile App Features
- Real-time alerts and notifications
- Quick access to live camera feeds
- Incident acknowledgment and reporting
- Device status overview
- Emergency response coordination

### 6. Safety Features
- Automated incident detection
- Emergency protocol activation
- Integration with railway control systems
- Audit logs for all actions
- Compliance reporting

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- AWS Account with IoT Core, Lambda, S3, DynamoDB
- Vercel account for web deployment
- Expo/React Native development environment

### Installation

```bash
# Clone the repository
git clone https://github.com/umtkyck/XingAEye.git
cd XingAEye

# Install dependencies for all packages
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your AWS and configuration values

# Deploy AWS infrastructure
cd aws/cdk
npm install
cdk deploy

# Start backend development server
cd ../../backend
npm run dev

# Start web dashboard
cd ../web
npm run dev

# Start mobile app
cd ../mobile
npm start
```

## 🔧 Configuration

### AWS IoT Device Setup
Each Jetson Orin Nano device needs:
1. AWS IoT Thing certificate
2. MQTT endpoint configuration
3. Device shadow for state management

See [docs/DEVICE.md](docs/DEVICE.md) for detailed setup.

### Environment Variables

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_IOT_ENDPOINT=xxxxx.iot.us-east-1.amazonaws.com
AWS_S3_BUCKET=xingaeye-videos

# API Configuration
API_BASE_URL=https://api.xingaeye.com
JWT_SECRET=your-secret-key

# Notification Services
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
SENDGRID_API_KEY=xxx
```

## 📱 Deployment

### Web Dashboard → Vercel (Recommended) 🚀

**Quick Deploy:**
1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Set environment variables
4. Deploy! ✨

**Detailed Guide:** See [docs/VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md)

**One-Click Deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/umtkyck/XingAEye&project-name=xingaeye&repository-name=XingAEye&root-directory=web)

### Backend → AWS
- Deploy on AWS Lambda + API Gateway or ECS
- Auto-scaling configuration included
- See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

### Mobile App → App Stores
- iOS: Deploy via App Store Connect
- Android: Deploy via Google Play Console
- Built with Expo/EAS

## 🛡️ Security

- End-to-end encryption for video streams
- JWT-based authentication
- Role-based access control (RBAC)
- AWS IoT device certificates
- Audit logging for all operations

## 📊 Monitoring

- CloudWatch for AWS metrics
- Application performance monitoring
- Device health dashboards
- Alert escalation policies

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@xingaeye.com or open an issue on GitHub.

## 🗺️ Roadmap

- [ ] Multi-camera support per crossing
- [ ] AI model training pipeline
- [ ] Integration with railway scheduling systems
- [ ] Predictive maintenance for barriers
- [ ] Weather condition analysis
- [ ] Traffic pattern analytics
- [ ] Mobile offline mode
- [ ] Multi-language support
