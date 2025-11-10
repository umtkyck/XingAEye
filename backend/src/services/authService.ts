import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AWS from 'aws-sdk';
import { config } from '../config';
import { logger } from '../utils/logger';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export interface User {
  userId: string;
  email: string;
  name: string;
  role: 'admin' | 'operator' | 'viewer';
  passwordHash?: string;
  createdAt: string;
}

export class AuthService {
  private tableName = 'xingaeye-users';
  private refreshTokenTable = 'xingaeye-refresh-tokens';

  async login(
    email: string,
    password: string
  ): Promise<{ user: Omit<User, 'passwordHash'>; token: string; refreshToken: string }> {
    try {
      // Find user by email
      const params = {
        TableName: this.tableName,
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': email,
        },
      };

      const result = await dynamodb.scan(params).promise();
      const user = result.Items?.[0] as User;

      if (!user || !user.passwordHash) {
        throw new Error('Invalid credentials');
      }

      // Verify password
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      // Generate tokens
      const token = this.generateToken(user);
      const refreshToken = this.generateRefreshToken(user);

      // Store refresh token
      await this.storeRefreshToken(user.userId, refreshToken);

      // Remove password hash from response
      const { passwordHash, ...userWithoutPassword } = user;

      logger.info(`User logged in: ${user.email}`);

      return {
        user: userWithoutPassword,
        token,
        refreshToken,
      };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
    role?: string;
  }): Promise<{ user: Omit<User, 'passwordHash'>; token: string; refreshToken: string }> {
    try {
      // Check if user exists
      const existing = await dynamodb
        .scan({
          TableName: this.tableName,
          FilterExpression: 'email = :email',
          ExpressionAttributeValues: {
            ':email': userData.email,
          },
        })
        .promise();

      if (existing.Items && existing.Items.length > 0) {
        throw new Error('User already exists');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, 10);

      // Create user
      const user: User = {
        userId: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        email: userData.email,
        name: userData.name,
        role: (userData.role as any) || 'operator',
        passwordHash,
        createdAt: new Date().toISOString(),
      };

      await dynamodb
        .put({
          TableName: this.tableName,
          Item: user,
        })
        .promise();

      // Generate tokens
      const token = this.generateToken(user);
      const refreshToken = this.generateRefreshToken(user);

      await this.storeRefreshToken(user.userId, refreshToken);

      const { passwordHash: _, ...userWithoutPassword } = user;

      logger.info(`User registered: ${user.email}`);

      return {
        user: userWithoutPassword,
        token,
        refreshToken,
      };
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.jwtSecret) as {
        userId: string;
        type: string;
      };

      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      // Check if refresh token exists in database
      const storedToken = await dynamodb
        .get({
          TableName: this.refreshTokenTable,
          Key: { userId: decoded.userId, token: refreshToken },
        })
        .promise();

      if (!storedToken.Item) {
        throw new Error('Invalid refresh token');
      }

      // Get user
      const user = await dynamodb
        .get({
          TableName: this.tableName,
          Key: { userId: decoded.userId },
        })
        .promise();

      if (!user.Item) {
        throw new Error('User not found');
      }

      // Generate new tokens
      const newToken = this.generateToken(user.Item as User);
      const newRefreshToken = this.generateRefreshToken(user.Item as User);

      // Delete old refresh token and store new one
      await dynamodb
        .delete({
          TableName: this.refreshTokenTable,
          Key: { userId: decoded.userId, token: refreshToken },
        })
        .promise();

      await this.storeRefreshToken(decoded.userId, newRefreshToken);

      return {
        token: newToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      logger.error('Token refresh error:', error);
      throw error;
    }
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      const decoded = jwt.verify(refreshToken, config.jwtSecret) as {
        userId: string;
      };

      await dynamodb
        .delete({
          TableName: this.refreshTokenTable,
          Key: { userId: decoded.userId, token: refreshToken },
        })
        .promise();

      logger.info(`User logged out: ${decoded.userId}`);
    } catch (error) {
      logger.error('Logout error:', error);
      throw error;
    }
  }

  private generateToken(user: User): string {
    return jwt.sign(
      {
        id: user.userId,
        email: user.email,
        role: user.role,
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
  }

  private generateRefreshToken(user: User): string {
    return jwt.sign(
      {
        userId: user.userId,
        type: 'refresh',
      },
      config.jwtSecret,
      { expiresIn: '30d' }
    );
  }

  private async storeRefreshToken(userId: string, token: string): Promise<void> {
    await dynamodb
      .put({
        TableName: this.refreshTokenTable,
        Item: {
          userId,
          token,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
      })
      .promise();
  }
}
