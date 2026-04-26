import { z } from 'zod';
import { ROLES_LIST } from '../constants/roles.js';

const roleEnum = z.enum(ROLES_LIST);

const statusEnum = z.enum([
  'active',
  'inactive',
  'suspended',
  'deleted',
]);

export const UserDTO = z.object({
  id: z.string().min(1),
  name: z.string().min(2).max(80),
  email: z.string().email(),
  username: z.string().min(3).max(30).optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
  bio: z.string().max(300).optional().nullable(),
  phone: z.string().max(30).optional().nullable(),

  role: roleEnum.default('user'),
  status: statusEnum.default('active'),

  specialty: z.string().max(80).optional().nullable(),
  country: z.string().max(80).optional().nullable(),
  city: z.string().max(80).optional().nullable(),

  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const CreateUserDTO = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(120),
  username: z.string().min(3).max(30).optional(),
});

export const UpdateUserDTO = z.object({
  name: z.string().min(2).max(80).optional(),
  email: z.string().email().optional(),
  username: z.string().min(3).max(30).optional(),
  avatarUrl: z.string().url().optional().nullable(),
  bio: z.string().max(300).optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
  specialty: z.string().max(80).optional().nullable(),
  country: z.string().max(80).optional().nullable(),
  city: z.string().max(80).optional().nullable(),
  status: statusEnum.optional(),
});

export const PublicUserDTO = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
  role: roleEnum.optional(),
  reputation: z.number().optional(),
  level: z.number().optional(),
});

export const UserQueryDTO = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
});