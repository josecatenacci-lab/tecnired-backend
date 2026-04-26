import { z } from 'zod';
import { POST_TYPES_LIST } from '../constants/postTypes.js';

const postTypeEnum = z.enum(POST_TYPES_LIST);

export const CreatePostDTO = z.object({
  title: z.string().min(3).max(120),
  content: z.string().min(1).max(10000),
  type: postTypeEnum,

  brand: z.string().max(80).optional().nullable(),
  model: z.string().max(80).optional().nullable(),
  year: z.coerce.number().int().min(1950).max(2100).optional().nullable(),
  tags: z.array(z.string().min(1).max(30)).max(15).default([]),

  metadata: z.record(z.any()).optional().nullable(),
});

export const UpdatePostDTO = z.object({
  title: z.string().min(3).max(120).optional(),
  content: z.string().min(1).max(10000).optional(),
  type: postTypeEnum.optional(),

  brand: z.string().max(80).optional().nullable(),
  model: z.string().max(80).optional().nullable(),
  year: z.coerce.number().int().min(1950).max(2100).optional().nullable(),
  tags: z.array(z.string().min(1).max(30)).max(15).optional(),

  metadata: z.record(z.any()).optional().nullable(),
  isPublished: z.boolean().optional(),
  isValidated: z.boolean().optional(),
});

export const PostDTO = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  type: postTypeEnum,
  userId: z.string(),

  brand: z.string().nullable().optional(),
  model: z.string().nullable().optional(),
  year: z.number().nullable().optional(),
  tags: z.array(z.string()).optional(),

  isPublished: z.boolean().optional(),
  isValidated: z.boolean().optional(),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
});

export const FeedQueryDTO = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  cursor: z.string().optional(),
  type: postTypeEnum.optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.coerce.number().int().min(1950).max(2100).optional(),
  search: z.string().max(120).optional(),
  onlyValidated: z.coerce.boolean().optional(),
});