import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from '../../common/entities/link.entity';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { ReorderLinksDto } from './dto/reorder-links.dto';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link)
    private linksRepository: Repository<Link>,
  ) {}

  async findAll(userId: string): Promise<Link[]> {
    return this.linksRepository.find({
      where: { user: { id: userId } },
      order: { order: 'ASC' },
    });
  }

  async findPublicLinks(userId: string): Promise<Link[]> {
    return this.linksRepository.find({
      where: { user: { id: userId }, isActive: true },
      order: { order: 'ASC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Link> {
    const link = await this.linksRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!link) {
      throw new NotFoundException(`Link with ID ${id} not found`);
    }

    return link;
  }

  async findAllPaginated(userId: string, paginationQuery: PaginationQueryDto): Promise<Link[]> {
    const { page, limit } = paginationQuery;
    const skip = (page - 1) * limit;

    return this.linksRepository.find({
      where: { user: { id: userId } },
      order: { order: 'ASC' },
      skip,
      take: limit,
    });
  }

  async create(userId: string, createLinkDto: CreateLinkDto): Promise<Link> {
    const links = await this.linksRepository.find({
      where: { user: { id: userId } },
      order: { order: 'DESC' },
      take: 1,
    });

    const order = links.length > 0 ? links[0].order + 1 : 0;

    const link = this.linksRepository.create({
      ...createLinkDto,
      order,
      user: { id: userId },
    });

    return this.linksRepository.save(link);
  }

  async update(id: string, userId: string, updateLinkDto: UpdateLinkDto): Promise<Link> {
    await this.findOne(id, userId);

    await this.linksRepository.update(
      { id, user: { id: userId } },
      updateLinkDto,
    );

    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    const link = await this.findOne(id, userId);
    await this.linksRepository.remove(link);

    const links = await this.linksRepository.find({
      where: { user: { id: userId } },
      order: { order: 'ASC' },
    });

    await Promise.all(
      links.map((link, index) => 
        this.linksRepository.update(
          { id: link.id },
          { order: index }
        )
      )
    );
  }

  async reorder(userId: string, reorderLinksDto: ReorderLinksDto): Promise<void> {
    const newLinks = reorderLinksDto.links;

    const links = await this.linksRepository.find({
      where: { user: { id: userId } },
    });

    const linkMap = new Map(links.map(link => [link.id, link]));

    for (const link of links) {
      if (!linkMap.has(link.id)) {
        throw new BadRequestException(`Link with ID ${link.id} does not exist or does not belong to the user`);
      }
    }

    await Promise.all(
      newLinks.map((link, index) => 
        this.linksRepository.update(
          { id: link.id },
          { order: index }
        )
      )
    );
  }

  async incrementClickCount(id: string): Promise<void> {
    await this.linksRepository.increment({ id }, 'clickCount', 1);
  }
} 