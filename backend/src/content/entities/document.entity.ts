import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum DocumentType {
  DOCUMENT = 'document',
  PRESENTATION = 'presentation',
  ASSESSMENT = 'assessment'
}

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: DocumentType
  })
  type: DocumentType;

  @Column({ type: 'jsonb' })
  content: {
    originalText?: string;
    summary?: string;
    keyPoints?: string[];
    slides?: any[];
    questions?: any[];
  };

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    fileType?: string;
    fileSize?: number;
    pageCount?: number;
    tags?: string[];
  };

  @Column()
  createdBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  creator: User;

  @Column({ nullable: true })
  section: string;

  @Column({ default: false })
  isPublished: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}