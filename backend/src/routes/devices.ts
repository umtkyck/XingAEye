import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { DeviceService } from '../services/deviceService';
import { logger } from '../utils/logger';

const router = Router();
const deviceService = new DeviceService();

/**
 * GET /api/devices
 * Get all devices (Jetson Orin Nano units)
 */
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const devices = await deviceService.getAllDevices();
    res.json({
      success: true,
      data: devices,
    });
  } catch (error) {
    logger.error('Error fetching devices:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch devices',
    });
  }
});

/**
 * GET /api/devices/:deviceId
 * Get specific device details
 */
router.get('/:deviceId', async (req: AuthRequest, res: Response) => {
  try {
    const { deviceId } = req.params;
    const device = await deviceService.getDeviceById(deviceId);

    if (!device) {
      res.status(404).json({
        success: false,
        error: 'Device not found',
      });
      return;
    }

    res.json({
      success: true,
      data: device,
    });
  } catch (error) {
    logger.error('Error fetching device:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch device',
    });
  }
});

/**
 * GET /api/devices/:deviceId/status
 * Get real-time device status
 */
router.get('/:deviceId/status', async (req: AuthRequest, res: Response) => {
  try {
    const { deviceId } = req.params;
    const status = await deviceService.getDeviceStatus(deviceId);

    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    logger.error('Error fetching device status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch device status',
    });
  }
});

/**
 * POST /api/devices/:deviceId/command
 * Send command to device
 */
router.post('/:deviceId/command', async (req: AuthRequest, res: Response) => {
  try {
    const { deviceId } = req.params;
    const { command, params } = req.body;

    const result = await deviceService.sendCommand(deviceId, command, params);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('Error sending command to device:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send command',
    });
  }
});

/**
 * PUT /api/devices/:deviceId/config
 * Update device configuration
 */
router.put('/:deviceId/config', async (req: AuthRequest, res: Response) => {
  try {
    const { deviceId } = req.params;
    const config = req.body;

    const result = await deviceService.updateDeviceConfig(deviceId, config);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('Error updating device config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update device configuration',
    });
  }
});

/**
 * POST /api/devices/register
 * Register new device
 */
router.post('/register', async (req: AuthRequest, res: Response) => {
  try {
    const { deviceId, name, location, crossingId } = req.body;

    const result = await deviceService.registerDevice({
      deviceId,
      name,
      location,
      crossingId,
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('Error registering device:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register device',
    });
  }
});

export default router;
