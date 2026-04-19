import express from 'express';
import http from 'http';

import { corsMiddleware } from './security/cors.js';
import { helmetMiddleware } from './security/helmet.js';
import { rateLimiter } from './security/rateLimiter.js';
import { sanitizeMiddleware } from './security/sanitize.js';

import { errorMiddleware } from './middleware/error.middleware.js';

import routes from './routes/index.js';

import { initSockets } from './sockets/index.js';

// =========================
// APP CORE (EXPRESS INSTANCE)
// =========================

const app = express();
const server = http.createServer(app);

// =========================
// SECURITY MIDDLEWARES
// =========================
app.use(corsMiddleware);
app.use(helmetMiddleware);
app.use(rateLimiter);

// =========================
// BODY PARSER
// =========================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// =========================
// SANITIZATION LAYER
// =========================
sanitizeMiddleware(app);

// =========================
// STATIC FILES (UPLOADS)
// =========================
app.use('/uploads', express.static('uploads'));

// =========================
// ROUTES
// =========================
app.use('/api', routes);

// =========================
// ERROR HANDLER (SIEMPRE AL FINAL)
// =========================
app.use(errorMiddleware);

// =========================
// SOCKETS INIT
// =========================
const io = initSockets(server);

// =========================
// EXPORTS
// =========================
export { app, server, io };