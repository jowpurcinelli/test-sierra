import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { User } from '../../common/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByUsername(username);
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (isPasswordValid) {
        const { password, refreshToken, ...result } = user;
        return result;
      }
      
      return null;
    } catch (error) {
      this.logger.error(`User validation failed: ${error.message}`, error.stack);
      return null;
    }
  }

  async login(user: any) {
    try {
      const payload = { username: user.username, sub: user.id };
      
      const [accessToken, refreshToken] = await Promise.all([
        this.generateAccessToken(payload),
        this.generateRefreshToken(payload),
      ]);

      await this.usersService.updateRefreshToken(user.id, refreshToken);

      this.logger.log(`User ${user.username} logged in successfully`);
      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  async logout(userId: string) {
    try {
      await this.usersService.updateRefreshToken(userId, null);
      this.logger.log(`User with ID ${userId} logged out successfully`);
    } catch (error) {
      this.logger.error(`Logout failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  async refreshTokens(userId: string, refreshToken: string) {
    try {
      const user = await this.usersService.findById(userId);
      
      if (!user || !user.refreshToken) {
        this.logger.warn(`Invalid refresh token attempt for user ${userId}`);
        throw new UnauthorizedException('Invalid refresh token');
      }
      
      const refreshTokenMatches = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );
      
      if (!refreshTokenMatches) {
        this.logger.warn(`Token validation failed for user ${userId}`);
        throw new UnauthorizedException('Invalid refresh token');
      }
      
      const payload = { username: user.username, sub: user.id };
      const [accessToken, newRefreshToken] = await Promise.all([
        this.generateAccessToken(payload),
        this.generateRefreshToken(payload),
      ]);
      
      await this.usersService.updateRefreshToken(user.id, newRefreshToken);
      
      this.logger.log(`Tokens refreshed for user ${user.username}`);
      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (!(error instanceof UnauthorizedException)) {
        this.logger.error(`Token refresh failed: ${error.message}`, error.stack);
      }
      throw error;
    }
  }

  private async generateAccessToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION', '15m'),
    });
  }

  private async generateRefreshToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d'),
    });
  }
} 