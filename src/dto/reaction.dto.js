import { z } from 'zod';

export const ReactionTypeEnum = z.enum([
  'like',
  'dislike',
  'fire',
  'heart',
  'useful',
]);

export const CreateReactionDTO = z.object({
  postId: z.string().min(1),
  type: ReactionTypeEnum,
});

export const UpdateReactionDTO = z.object({
  type: ReactionTypeEnum,
});

export const ReactionDTO = z.object({
  id: z.string().optional(),
  userId: z.string(),
  postId: z.string(),
  type: ReactionTypeEnum,
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const ReactionQueryDTO = z.object({
  postId: z.string().optional(),
  userId: z.string().optional(),
});