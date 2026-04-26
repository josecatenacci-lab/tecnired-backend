import { z } from 'zod';

export const ReputationEventTypeEnum = z.enum([
  'post_created',
  'comment_created',
  'reaction_received',
  'useful_mark_received',
  'contribution_validated',
  'admin_adjustment',
]);

export const ReputationDTO = z.object({
  id: z.string(),
  userId: z.string(),
  points: z.number().int(),
  level: z.number().int().min(1),
  rank: z.string().nullable().optional(),

  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const ReputationEventDTO = z.object({
  id: z.string().optional(),
  userId: z.string(),
  type: ReputationEventTypeEnum,
  points: z.number().int(),
  reason: z.string().max(250).optional().nullable(),
  metadata: z.record(z.any()).optional().nullable(),

  createdAt: z.coerce.date().optional(),
});

export const ReputationAdjustDTO = z.object({
  userId: z.string(),
  points: z.number().int(),
  reason: z.string().min(3).max(250),
});

export const ReputationQueryDTO = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  userId: z.string().optional(),
});