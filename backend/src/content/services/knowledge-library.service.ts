import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../entities/document.entity';

@Injectable()
export class KnowledgeLibraryService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}

  async searchDocuments(query: string) {
    return this.documentRepository
      .createQueryBuilder('document')
      .where('document.title ILIKE :query', { query: `%${query}%` })
      .orWhere('document.content::text ILIKE :query', { query: `%${query}%` })
      .orderBy('document.updatedAt', 'DESC')
      .getMany();
  }

  async getDocumentsByType(type: string, userId: string) {
    return this.documentRepository.find({
      where: { type, createdBy: userId },
      order: { updatedAt: 'DESC' },
    });
  }

  async getDocumentsBySection(section: string) {
    return this.documentRepository.find({
      where: { section, isPublished: true },
      order: { updatedAt: 'DESC' },
    });
  }

  async publishDocument(id: string) {
    const document = await this.documentRepository.findOne({
      where: { id },
    });

    document.isPublished = true;
    return this.documentRepository.save(document);
  }

  async getTrendingDocuments() {
    // In a real implementation, you might want to track views/usage
    return this.documentRepository.find({
      where: { isPublished: true },
      order: { updatedAt: 'DESC' },
      take: 10,
    });
  }

  async getSimilarDocuments(id: string) {
    const document = await this.documentRepository.findOne({
      where: { id },
    });

    // This is a simple implementation - in practice, you might want to use
    // more sophisticated similarity matching
    return this.documentRepository
      .createQueryBuilder('document')
      .where('document.type = :type', { type: document.type })
      .andWhere('document.id != :id', { id })
      .andWhere('document.section = :section', { section: document.section })
      .orderBy('document.updatedAt', 'DESC')
      .take(5)
      .getMany();
  }
}