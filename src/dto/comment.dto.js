import { z } from 'zod';

export const CreateCommentDTO = z.object({
  postId: z.string().min(1),
  content: z.string().min(1).max(3000),
});

export const UpdateCommentDTO = z.object({
  content: z.string().min(1).max(3000),
});

export const CommentDTO = z.object({
  id: z.string(),
  postId: z.string(),
  userId: z.string(),
  content: z.string(),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
});

export const CommentQueryDTO = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  postId: z.string().optional(),
});