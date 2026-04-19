import { Router } from 'express';

// modules
import authRoutes from '../modules/auth/auth.routes.js';
import userRoutes from '../modules/users/user.routes.js';
import postRoutes from '../modules/posts/posts.routes.js';
import chatRoutes from '../modules/chat/chat.routes.js';
import commentRoutes from '../modules/comments/comments.routes.js';

const router = Router();

// =========================
// API ROUTES
// =========================

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/chat', chatRoutes);
router.use('/comments', commentRoutes);

export default router;