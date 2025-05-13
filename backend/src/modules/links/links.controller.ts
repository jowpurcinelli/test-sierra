import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  Patch, 
  Post, 
  Query, 
  UseGuards 
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { ReorderLinksDto } from './dto/reorder-links.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@ApiTags('links')
@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all links for current user' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Returns list of links' })
  async getLinks(
    @GetUser('id') userId: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    const { page, limit } = paginationQuery;
    
    if (page && limit) {
      return this.linksService.findAllPaginated(userId, paginationQuery);
    }
    
    return this.linksService.findAll(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get link by ID' })
  @ApiParam({ name: 'id', description: 'Link ID' })
  @ApiResponse({ status: 200, description: 'Returns the link' })
  @ApiResponse({ status: 404, description: 'Link not found' })
  async getLink(
    @Param('id') id: string,
    @GetUser('id') userId: string,
  ) {
    return this.linksService.findOne(id, userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new link' })
  @ApiResponse({ status: 201, description: 'Link created successfully' })
  async createLink(
    @GetUser('id') userId: string,
    @Body() createLinkDto: CreateLinkDto,
  ) {
    return this.linksService.create(userId, createLinkDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a link' })
  @ApiParam({ name: 'id', description: 'Link ID' })
  @ApiResponse({ status: 200, description: 'Link updated successfully' })
  @ApiResponse({ status: 404, description: 'Link not found' })
  async updateLink(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() updateLinkDto: UpdateLinkDto,
  ) {
    return this.linksService.update(id, userId, updateLinkDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a link' })
  @ApiParam({ name: 'id', description: 'Link ID' })
  @ApiResponse({ status: 200, description: 'Link deleted successfully' })
  @ApiResponse({ status: 404, description: 'Link not found' })
  async deleteLink(
    @Param('id') id: string,
    @GetUser('id') userId: string,
  ) {
    return this.linksService.remove(id, userId);
  }

  @Patch('reorder')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reorder links' })
  @ApiResponse({ status: 200, description: 'Links reordered successfully' })
  async reorderLinks(
    @GetUser('id') userId: string,
    @Body() reorderLinksDto: ReorderLinksDto,
  ) {
    return this.linksService.reorder(userId, reorderLinksDto);
  }

  @Get('user/:userId/public')
  @ApiOperation({ summary: 'Get public links for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Returns public links for user' })
  async getPublicLinks(
    @Param('userId') ownerId: string,
  ) {
    return this.linksService.findPublicLinks(ownerId);
  }
} 