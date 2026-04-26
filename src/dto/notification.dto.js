import { z } from 'zod';

export const NotificationTypeEnum = z.enum([
  'info',
  'chat',
  'post',
  'comment',
  'reaction',
  'reputation',
  'system',
]);

export const NotificationStatusEnum = z.enum([
  'unread',
  'read',
  'archived',
]);

export const CreateNotificationDTO = z.object({
  userId: z.string(),
  type: NotificationTypeEnum,
  title: z.string().min(1).max(120),
  message: z.string().min(1).max(500),
  metadata: z.record(z.any()).optional().nullable(),
});

export const UpdateNotificationDTO = z.object({
  status: NotificationStatusEnum.optional(),
});

export const NotificationDTO = z.object({
  id: z.string(),
  userId: z.string(),
  type: NotificationTypeEnum,
  status: NotificationStatusEnum,

  title: z.string(),
  message: z.string(),

  metadata: z.record(z.any()).optional().nullable(),

  readAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
});

export const NotificationQueryDTO = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: NotificationStatusEnum.optional(),
});