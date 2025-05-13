import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateSocialLinksDto } from './dto/update-social-links.dto';
import { FastifyRequest } from 'fastify';

@ApiTags('profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns the current user profile' })
  async getCurrentProfile(@GetUser('id') userId: string) {
    return this.profilesService.findOne(userId);
  }

  @Get('username/:username')
  @ApiOperation({ summary: 'Get profile by username' })
  @ApiParam({ name: 'username', description: 'Username to lookup' })
  @ApiResponse({ status: 200, description: 'Returns the profile for the username' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getProfileByUsername(@Param('username') username: string) {
    return this.profilesService.findByUsername(username);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile successfully updated' })
  async updateProfile(
    @GetUser('id') userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profilesService.update(userId, updateProfileDto);
  }

  @Post('me/avatar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload profile avatar' })
  @ApiResponse({ status: 200, description: 'Avatar successfully uploaded' })
  async uploadAvatar(
    @GetUser('id') userId: string, 
    @Req() request: FastifyRequest,
  ) {
    return this.profilesService.uploadAvatar(userId, request);
  }

  @Patch('me/social-links')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update social links' })
  @ApiResponse({ status: 200, description: 'Social links successfully updated' })
  async updateSocialLinks(
    @GetUser('id') userId: string,
    @Body() updateSocialLinksDto: UpdateSocialLinksDto,
  ) {
    return this.profilesService.updateSocialLinks(userId, updateSocialLinksDto);
  }
} 