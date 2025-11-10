import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AlertService } from '../services/alertService';
import { logger } from '../utils/logger';

const router = Router();
const alertService = new AlertService();

/**
 * GET /api/alerts
 * Get all alerts with filtering
 */
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const {
      status,
      severity,
      crossingId,
      startDate,
      endDate,
      limit = '50',
      offset = '0',
    } = req.query;

    const alerts = await alertService.getAlerts({
      status: status as string,
      severity: severity as string,
      crossingId: crossingId as string,
      startDate: startDate as string,
      endDate: endDate as string,
      limit: parseInt(limit as string, 10),
      offset: parseInt(offset as string, 10),
    });

    res.json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    logger.error('Error fetching alerts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch alerts',
    });
  }
});

/**
 * GET /api/alerts/:alertId
 * Get specific alert details
 */
router.get('/:alertId', async (req: AuthRequest, res: Response) => {
  try {
    const { alertId } = req.params;
    const alert = await alertService.getAlertById(alertId);

    if (!alert) {
      res.status(404).json({
        success: false,
        error: 'Alert not found',
      });
      return;
    }

    res.json({
      success: true,
      data: alert,
    });
  } catch (error) {
    logger.error('Error fetching alert:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch alert',
    });
  }
});

/**
 * POST /api/alerts
 * Create new alert (usually triggered by device)
 */
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const alertData = req.body;
    const alert = await alertService.createAlert(alertData);

    res.status(201).json({
      success: true,
      data: alert,
    });
  } catch (error) {
    logger.error('Error creating alert:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create alert',
    });
  }
});

/**
 * PUT /api/alerts/:alertId/acknowledge
 * Acknowledge an alert
 */
router.put('/:alertId/acknowledge', async (req: AuthRequest, res: Response) => {
  try {
    const { alertId } = req.params;
    const { acknowledgedBy, notes } = req.body;

    const alert = await alertService.acknowledgeAlert(alertId, {
      acknowledgedBy: acknowledgedBy || req.user?.id,
      notes,
    });

    res.json({
      success: true,
      data: alert,
    });
  } catch (error) {
    logger.error('Error acknowledging alert:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to acknowledge alert',
    });
  }
});

/**
 * PUT /api/alerts/:alertId/resolve
 * Resolve an alert
 */
router.put('/:alertId/resolve', async (req: AuthRequest, res: Response) => {
  try {
    const { alertId } = req.params;
    const { resolution, notes } = req.body;

    const alert = await alertService.resolveAlert(alertId, {
      resolvedBy: req.user?.id,
      resolution,
      notes,
    });

    res.json({
      success: true,
      data: alert,
    });
  } catch (error) {
    logger.error('Error resolving alert:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to resolve alert',
    });
  }
});

/**
 * GET /api/alerts/active/count
 * Get count of active alerts by severity
 */
router.get('/active/count', async (req: AuthRequest, res: Response) => {
  try {
    const counts = await alertService.getActiveAlertCounts();

    res.json({
      success: true,
      data: counts,
    });
  } catch (error) {
    logger.error('Error fetching alert counts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch alert counts',
    });
  }
});

export default router;
