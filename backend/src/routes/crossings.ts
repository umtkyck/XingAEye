import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { CrossingService } from '../services/crossingService';
import { logger } from '../utils/logger';

const router = Router();
const crossingService = new CrossingService();

/**
 * GET /api/crossings
 * Get all railroad crossings with their devices
 */
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { status, region } = req.query;
    const crossings = await crossingService.getAllCrossings({
      status: status as string,
      region: region as string,
    });

    res.json({
      success: true,
      data: crossings,
    });
  } catch (error) {
    logger.error('Error fetching crossings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch crossings',
    });
  }
});

/**
 * GET /api/crossings/:crossingId
 * Get specific crossing details
 */
router.get('/:crossingId', async (req: AuthRequest, res: Response) => {
  try {
    const { crossingId } = req.params;
    const crossing = await crossingService.getCrossingById(crossingId);

    if (!crossing) {
      res.status(404).json({
        success: false,
        error: 'Crossing not found',
      });
      return;
    }

    res.json({
      success: true,
      data: crossing,
    });
  } catch (error) {
    logger.error('Error fetching crossing:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch crossing',
    });
  }
});

/**
 * POST /api/crossings
 * Create new railroad crossing
 */
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const crossingData = req.body;
    const crossing = await crossingService.createCrossing(crossingData);

    res.status(201).json({
      success: true,
      data: crossing,
    });
  } catch (error) {
    logger.error('Error creating crossing:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create crossing',
    });
  }
});

/**
 * PUT /api/crossings/:crossingId
 * Update crossing information
 */
router.put('/:crossingId', async (req: AuthRequest, res: Response) => {
  try {
    const { crossingId } = req.params;
    const updates = req.body;
    const crossing = await crossingService.updateCrossing(crossingId, updates);

    res.json({
      success: true,
      data: crossing,
    });
  } catch (error) {
    logger.error('Error updating crossing:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update crossing',
    });
  }
});

/**
 * GET /api/crossings/:crossingId/live
 * Get live status of crossing (cameras, barriers, detections)
 */
router.get('/:crossingId/live', async (req: AuthRequest, res: Response) => {
  try {
    const { crossingId } = req.params;
    const liveStatus = await crossingService.getLiveStatus(crossingId);

    res.json({
      success: true,
      data: liveStatus,
    });
  } catch (error) {
    logger.error('Error fetching live status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch live status',
    });
  }
});

/**
 * GET /api/crossings/:crossingId/statistics
 * Get crossing statistics (incidents, traffic flow, etc.)
 */
router.get('/:crossingId/statistics', async (req: AuthRequest, res: Response) => {
  try {
    const { crossingId } = req.params;
    const { startDate, endDate } = req.query;

    const statistics = await crossingService.getStatistics(crossingId, {
      startDate: startDate as string,
      endDate: endDate as string,
    });

    res.json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    logger.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
    });
  }
});

export default router;
