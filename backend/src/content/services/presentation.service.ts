import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document, DocumentType } from '../entities/document.entity';
import { Configuration, OpenAIApi } from 'openai';

@Injectable()
export class PresentationService {
  private openai: OpenAIApi;

  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {
    this.openai = new OpenAIApi(
      new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      })
    );
  }

  async updatePresentation(id: string, content: any) {
    const presentation = await this.documentRepository.findOne({
      where: { id, type: DocumentType.PRESENTATION },
    });

    presentation.content.slides = content.slides;
    return this.documentRepository.save(presentation);
  }

  async generateImage(prompt: string) {
    const response = await this.openai.createImage({
      prompt,
      n: 1,
      size: '512x512',
    });

    return response.data.data[0].url;
  }

  async suggestLayout(slideContent: string) {
    const response = await this.openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Suggest a presentation layout for this content:\n${slideContent}`,
      max_tokens: 200,
      temperature: 0.7,
    });

    return response.data.choices[0].text.trim();
  }

  async enhanceSlideContent(slideContent: string) {
    const response = await this.openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Enhance this presentation slide content with better wording and structure:\n${slideContent}`,
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.data.choices[0].text.trim();
  }
}