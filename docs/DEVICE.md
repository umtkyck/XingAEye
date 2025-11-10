# Device Integration Guide

This guide explains how to integrate Jetson Orin Nano devices with the XingAEye cloud platform.

## Overview

The Jetson Orin Nano devices perform edge AI processing at railroad crossings and communicate with the cloud platform via AWS IoT Core.

## Device Architecture

```
┌─────────────────────────────────────────┐
│       Jetson Orin Nano Device           │
│                                         │
│  ┌────────────┐      ┌──────────────┐  │
│  │  Camera    │──────│  AI Model    │  │
│  │  Input     │      │  Detection   │  │
│  └────────────┘      └──────┬───────┘  │
│                             │           │
│  ┌────────────────────────┐ │          │
│  │  Local Processing      │ │          │
│  │  - Object Detection    │◄┘          │
│  │  - Alert Generation    │            │
│  │  - Video Recording     │            │
│  └────────────┬───────────┘            │
│               │                         │
│  ┌────────────▼───────────┐            │
│  │  MQTT Client           │            │
│  │  AWS IoT Core          │            │
│  └────────────┬───────────┘            │
└───────────────┼─────────────────────────┘
                │
                ▼
        AWS IoT Core Cloud

```

## Prerequisites

- Jetson Orin Nano with JetPack SDK
- Python 3.8+
- Camera module
- Internet connectivity
- AWS IoT certificates

## Setup Instructions

### 1. Install Dependencies

```bash
# Update system
sudo apt-get update
sudo apt-get upgrade

# Install Python packages
pip3 install boto3 awsiotsdk opencv-python-headless

# Install MQTT client
pip3 install paho-mqtt
```

### 2. Download AWS IoT Certificates

```bash
# Create certificates directory
mkdir -p /opt/xingaeye/certs

# Download root CA
wget -O /opt/xingaeye/certs/AmazonRootCA1.pem \
  https://www.amazontrust.com/repository/AmazonRootCA1.pem

# Copy your device certificates (obtained from AWS IoT)
cp device-001.cert.pem /opt/xingaeye/certs/
cp device-001.private.key /opt/xingaeye/certs/
chmod 600 /opt/xingaeye/certs/*.key
```

### 3. Configure Device

Create `/opt/xingaeye/config.json`:

```json
{
  "device_id": "device-001",
  "crossing_id": "crossing-main-street",
  "aws": {
    "iot_endpoint": "xxxxx.iot.us-east-1.amazonaws.com",
    "region": "us-east-1",
    "cert_path": "/opt/xingaeye/certs/device-001.cert.pem",
    "key_path": "/opt/xingaeye/certs/device-001.private.key",
    "root_ca_path": "/opt/xingaeye/certs/AmazonRootCA1.pem"
  },
  "camera": {
    "source": 0,
    "width": 1920,
    "height": 1080,
    "fps": 30
  },
  "detection": {
    "confidence_threshold": 0.7,
    "classes": ["person", "car", "train", "bicycle"]
  },
  "telemetry_interval": 60
}
```

### 4. Device Communication Protocol

#### MQTT Topics

| Topic | Direction | Purpose |
|-------|-----------|---------|
| `device/{device_id}/telemetry` | Device → Cloud | Status updates, metrics |
| `device/{device_id}/alerts` | Device → Cloud | Alert notifications |
| `device/{device_id}/command` | Cloud → Device | Remote commands |
| `device/{device_id}/config` | Cloud → Device | Configuration updates |

#### Message Formats

**Telemetry Message:**
```json
{
  "device_id": "device-001",
  "timestamp": "2024-01-15T10:30:00Z",
  "status": "online",
  "metrics": {
    "cpu_usage": 45.2,
    "memory_usage": 62.1,
    "temperature": 58.5,
    "uptime": 86400
  },
  "detections_count": 125,
  "alerts_count": 3
}
```

**Alert Message:**
```json
{
  "device_id": "device-001",
  "crossing_id": "crossing-main-street",
  "timestamp": "2024-01-15T10:30:15Z",
  "type": "obstacle_on_tracks",
  "severity": "critical",
  "detection": {
    "object_type": "car",
    "confidence": 0.95,
    "position": {"x": 450, "y": 320},
    "bounding_box": {"x": 400, "y": 280, "w": 100, "h": 80}
  },
  "video_url": "s3://xingaeye-videos/device-001/alert-12345.mp4",
  "image_url": "s3://xingaeye-videos/device-001/alert-12345.jpg"
}
```

**Command Message (Cloud → Device):**
```json
{
  "command": "update_config",
  "params": {
    "detection_threshold": 0.8,
    "telemetry_interval": 30
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 5. Sample Device Code

Create `/opt/xingaeye/device_client.py`:

```python
import json
import time
import logging
from awscrt import io, mqtt
from awsiot import mqtt_connection_builder
import cv2

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class XingAEyeDevice:
    def __init__(self, config_path='/opt/xingaeye/config.json'):
        with open(config_path) as f:
            self.config = json.load(f)

        self.device_id = self.config['device_id']
        self.crossing_id = self.config['crossing_id']
        self.mqtt_connection = None

    def connect(self):
        """Connect to AWS IoT Core"""
        event_loop_group = io.EventLoopGroup(1)
        host_resolver = io.DefaultHostResolver(event_loop_group)
        client_bootstrap = io.ClientBootstrap(event_loop_group, host_resolver)

        self.mqtt_connection = mqtt_connection_builder.mtls_from_path(
            endpoint=self.config['aws']['iot_endpoint'],
            cert_filepath=self.config['aws']['cert_path'],
            pri_key_filepath=self.config['aws']['key_path'],
            client_bootstrap=client_bootstrap,
            ca_filepath=self.config['aws']['root_ca_path'],
            client_id=self.device_id,
            clean_session=False,
            keep_alive_secs=30
        )

        logger.info(f"Connecting to {self.config['aws']['iot_endpoint']}")
        connect_future = self.mqtt_connection.connect()
        connect_future.result()
        logger.info("Connected!")

        # Subscribe to command topic
        self.subscribe_to_commands()

    def subscribe_to_commands(self):
        """Subscribe to command topic"""
        topic = f"device/{self.device_id}/command"

        def on_message_received(topic, payload, **kwargs):
            logger.info(f"Received message on {topic}: {payload}")
            message = json.loads(payload)
            self.handle_command(message)

        subscribe_future, packet_id = self.mqtt_connection.subscribe(
            topic=topic,
            qos=mqtt.QoS.AT_LEAST_ONCE,
            callback=on_message_received
        )
        subscribe_future.result()
        logger.info(f"Subscribed to {topic}")

    def handle_command(self, message):
        """Handle incoming commands"""
        command = message.get('command')
        params = message.get('params', {})

        if command == 'update_config':
            # Update configuration
            logger.info(f"Updating config: {params}")
            self.config.update(params)
        elif command == 'restart':
            logger.info("Restart command received")
            # Implement restart logic
        elif command == 'capture_snapshot':
            logger.info("Capturing snapshot")
            # Capture and upload image

    def publish_telemetry(self):
        """Publish device telemetry"""
        topic = f"device/{self.device_id}/telemetry"

        message = {
            "device_id": self.device_id,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "status": "online",
            "metrics": {
                "cpu_usage": 45.2,  # Get actual CPU usage
                "memory_usage": 62.1,  # Get actual memory usage
                "temperature": 58.5,  # Get actual temperature
                "uptime": 86400
            }
        }

        self.mqtt_connection.publish(
            topic=topic,
            payload=json.dumps(message),
            qos=mqtt.QoS.AT_LEAST_ONCE
        )
        logger.info(f"Published telemetry to {topic}")

    def publish_alert(self, alert_type, severity, detection_data):
        """Publish alert to cloud"""
        topic = f"device/{self.device_id}/alerts"

        message = {
            "device_id": self.device_id,
            "crossing_id": self.crossing_id,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "type": alert_type,
            "severity": severity,
            "detection": detection_data
        }

        self.mqtt_connection.publish(
            topic=topic,
            payload=json.dumps(message),
            qos=mqtt.QoS.AT_LEAST_ONCE
        )
        logger.info(f"Published alert: {alert_type}")

    def run(self):
        """Main device loop"""
        try:
            self.connect()

            # Main loop
            while True:
                # Publish telemetry
                self.publish_telemetry()

                # Sleep for interval
                time.sleep(self.config.get('telemetry_interval', 60))

        except KeyboardInterrupt:
            logger.info("Shutting down...")
        finally:
            if self.mqtt_connection:
                disconnect_future = self.mqtt_connection.disconnect()
                disconnect_future.result()

if __name__ == "__main__":
    device = XingAEyeDevice()
    device.run()
```

### 6. Run Device Client

```bash
# Start device client
python3 /opt/xingaeye/device_client.py

# Or run as systemd service
sudo systemctl start xingaeye-device
sudo systemctl enable xingaeye-device
```

### 7. Systemd Service

Create `/etc/systemd/system/xingaeye-device.service`:

```ini
[Unit]
Description=XingAEye Device Client
After=network.target

[Service]
Type=simple
User=xingaeye
WorkingDirectory=/opt/xingaeye
ExecStart=/usr/bin/python3 /opt/xingaeye/device_client.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

## Troubleshooting

### Connection Issues

```bash
# Test MQTT connection
mosquitto_pub -h YOUR_IOT_ENDPOINT -p 8883 \
  --cafile AmazonRootCA1.pem \
  --cert device-001.cert.pem \
  --key device-001.private.key \
  -t "device/device-001/test" \
  -m "test message"
```

### View Logs

```bash
# View device logs
journalctl -u xingaeye-device -f

# View system logs
tail -f /var/log/xingaeye/device.log
```

### Check Device Shadow

```bash
aws iot-data get-thing-shadow \
  --thing-name device-001 \
  --output text \
  --query 'payload' | jq
```

## Best Practices

1. **Security**:
   - Keep certificates secure (600 permissions)
   - Rotate certificates regularly
   - Use VPN for remote access

2. **Performance**:
   - Process video locally on device
   - Only upload alerts and incidents
   - Compress video before upload

3. **Reliability**:
   - Implement offline queuing
   - Retry failed uploads
   - Monitor device health

4. **Maintenance**:
   - Regular software updates
   - Monitor disk space
   - Clean old video files

## Support

For device integration support:
- Email: devices@xingaeye.com
- Documentation: https://docs.xingaeye.com
