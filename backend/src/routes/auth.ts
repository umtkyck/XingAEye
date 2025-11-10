import { Router, Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { logger } from '../utils/logger';
import { ValidationError } from '../middleware/errorHandler';

const router = Router();
const authService = new AuthService();

/**
 * POST /api/auth/login
 * User login
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    const result = await authService.login(email, password);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid credentials',
    });
  }
});

/**
 * POST /api/auth/register
 * Register new user
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name) {
      throw new ValidationError('Email, password, and name are required');
    }

    const result = await authService.register({
      email,
      password,
      name,
      role: role || 'operator',
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(400).json({
      success: false,
      error: 'Registration failed',
    });
  }
});

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new ValidationError('Refresh token is required');
    }

    const result = await authService.refreshToken(refreshToken);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid refresh token',
    });
  }
});

/**
 * POST /api/auth/logout
 * User logout
 */
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Logout failed',
    });
  }
});

export default router;
