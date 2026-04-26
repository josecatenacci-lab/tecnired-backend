import express from 'express';
import http from 'http';
import compression from 'compression';
import morgan from 'morgan';

import { env } from './config/env.js';

import { corsMiddleware } from './security/cors.js';
import { helmetMiddleware } from './security/helmet.js';
import { rateLimiter } from './security/rateLimiter.js';
import { sanitizeMiddleware } from './security/sanitize.js';

import routes from './routes/index.js';

import { errorMiddleware } from './middleware/error.middleware.js';
import { notFoundHandler } from './utils/response.js';

const app = express();
const server = http.createServer(app);

app.set('trust proxy', env.TRUST_PROXY);

app.disable('x-powered-by');

app.use(corsMiddleware);
app.use(helmetMiddleware);
app.use(rateLimiter);
app.use(compression());

if (env.ENABLE_REQUEST_LOGS) {
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

app.use(
  express.json({
    limit: env.MAX_PAYLOAD_SIZE,
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: env.MAX_PAYLOAD_SIZE,
  }),
);

app.use(sanitizeMiddleware);

app.use('/uploads', express.static(env.UPLOAD_DIR));

app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    name: env.APP_NAME,
    environment: env.NODE_ENV,
    version: 'v1',
  });
});

app.use(env.API_PREFIX, routes);

app.use(notFoundHandler);

app.use(errorMiddleware);

export { app, server };