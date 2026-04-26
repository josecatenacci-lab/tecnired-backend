import { logger } from '../../utils/logger.js';

let admin = null;
let app = null;

// =========================
// DYNAMIC IMPORT
// =========================

const loadFirebaseAdmin =
  async () => {
    if (admin) {
      return admin;
    }

    try {
      admin = await import(
        'firebase-admin'
      );

      return admin;
    } catch (error) {
      logger.warn(
        'firebase-admin package not installed',
      );
      return null;
    }
  };

// =========================
// PRIVATE KEY FIX
// =========================

const normalizePrivateKey =
  (key) => {
    if (!key) return null;

    return key.replace(
      /\\n/g,
      '\n',
    );
  };

// =========================
// INIT APP
// =========================

export const initFirebase =
  async () => {
    const sdk =
      await loadFirebaseAdmin();

    if (!sdk) {
      return null;
    }

    if (app) {
      return app;
    }

    const {
      FIREBASE_PROJECT_ID,
      FIREBASE_CLIENT_EMAIL,
      FIREBASE_PRIVATE_KEY,
      FIREBASE_STORAGE_BUCKET,
    } = process.env;

    if (
      !FIREBASE_PROJECT_ID ||
      !FIREBASE_CLIENT_EMAIL ||
      !FIREBASE_PRIVATE_KEY
    ) {
      logger.warn(
        'Firebase env vars missing',
      );
      return null;
    }

    try {
      app =
        sdk.default.apps
          ?.length
          ? sdk.default.app()
          : sdk.default.initializeApp({
              credential:
                sdk.default.credential.cert(
                  {
                    projectId:
                      FIREBASE_PROJECT_ID,
                    clientEmail:
                      FIREBASE_CLIENT_EMAIL,
                    privateKey:
                      normalizePrivateKey(
                        FIREBASE_PRIVATE_KEY,
                      ),
                  },
                ),
              storageBucket:
                FIREBASE_STORAGE_BUCKET ||
                undefined,
            });

      logger.info(
        'Firebase initialized',
      );

      return app;
    } catch (error) {
      logger.error(
        'Firebase init error',
        error,
      );
      return null;
    }
  };

// =========================
// MESSAGING
// =========================

export const getMessaging =
  async () => {
    const sdk =
      await loadFirebaseAdmin();

    const firebaseApp =
      await initFirebase();

    if (!sdk || !firebaseApp) {
      return null;
    }

    return sdk.default.messaging();
  };

// =========================
// STORAGE
// =========================

export const getStorage =
  async () => {
    const sdk =
      await loadFirebaseAdmin();

    const firebaseApp =
      await initFirebase();

    if (!sdk || !firebaseApp) {
      return null;
    }

    return sdk.default.storage();
  };

// =========================
// FIREBASE SERVICE
// =========================

export const firebaseService =
  {
    init: initFirebase,
    getMessaging,
    getStorage,

    async sendPush(
      token,
      payload,
    ) {
      try {
        const messaging =
          await getMessaging();

        if (!messaging) {
          return null;
        }

        return await messaging.send(
          {
            token,
            ...payload,
          },
        );
      } catch (error) {
        logger.error(
          'Firebase push error',
          error,
        );
        return null;
      }
    },
  };