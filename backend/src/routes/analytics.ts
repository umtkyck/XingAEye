import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AnalyticsService } from '../services/analyticsService';
import { logger } from '../utils/logger';

const router = Router();
const analyticsService = new AnalyticsService();

/**
 * GET /api/analytics/dashboard
 * Get dashboard overview statistics
 */
router.get('/dashboard', async (req: AuthRequest, res: Response) => {
  try {
    const dashboard = await analyticsService.getDashboardStats();

    res.json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    logger.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics',
    });
  }
});

/**
 * GET /api/analytics/incidents
 * Get incident analytics
 */
router.get('/incidents', async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    const incidents = await analyticsService.getIncidentAnalytics({
      startDate: startDate as string,
      endDate: endDate as string,
      groupBy: groupBy as 'hour' | 'day' | 'week' | 'month',
    });

    res.json({
      success: true,
      data: incidents,
    });
  } catch (error) {
    logger.error('Error fetching incident analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch incident analytics',
    });
  }
});

/**
 * GET /api/analytics/heatmap
 * Get heatmap data for all crossings
 */
router.get('/heatmap', async (req: AuthRequest, res: Response) => {
  try {
    const { metric = 'incidents', startDate, endDate } = req.query;

    const heatmap = await analyticsService.getHeatmapData({
      metric: metric as 'incidents' | 'alerts' | 'traffic',
      startDate: startDate as string,
      endDate: endDate as string,
    });

    res.json({
      success: true,
      data: heatmap,
    });
  } catch (error) {
    logger.error('Error fetching heatmap data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch heatmap data',
    });
  }
});

/**
 * GET /api/analytics/performance
 * Get system performance metrics
 */
router.get('/performance', async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const performance = await analyticsService.getPerformanceMetrics({
      startDate: startDate as string,
      endDate: endDate as string,
    });

    res.json({
      success: true,
      data: performance,
    });
  } catch (error) {
    logger.error('Error fetching performance metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch performance metrics',
    });
  }
});

/**
 * GET /api/analytics/reports/:reportType
 * Generate specific report
 */
router.get('/reports/:reportType', async (req: AuthRequest, res: Response) => {
  try {
    const { reportType } = req.params;
    const { startDate, endDate, format = 'json' } = req.query;

    const report = await analyticsService.generateReport({
      reportType: reportType as string,
      startDate: startDate as string,
      endDate: endDate as string,
      format: format as 'json' | 'csv' | 'pdf',
    });

    if (format === 'json') {
      res.json({
        success: true,
        data: report,
      });
    } else {
      // For CSV/PDF, send as download
      res.setHeader('Content-Type', format === 'csv' ? 'text/csv' : 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=report-${reportType}-${Date.now()}.${format}`);
      res.send(report);
    }
  } catch (error) {
    logger.error('Error generating report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate report',
    });
  }
});

export default router;
