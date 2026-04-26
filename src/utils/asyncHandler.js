// =========================
// ASYNC HANDLER
// Wrapper para controladores async Express
// Evita try/catch repetitivos
// =========================

export const asyncHandler =
  (handler) =>
  (req, res, next) => {
    Promise.resolve(
      handler(
        req,
        res,
        next,
      ),
    ).catch(next);
  };

// =========================
// MULTI HANDLER
// Permite encadenar handlers async
// =========================

export const asyncHandlers =
  (...handlers) =>
  handlers.map(
    (handler) =>
      asyncHandler(
        handler,
      ),
  );

// =========================
// DELAY UTIL (TEST / JOBS)
// =========================

export const sleep = (
  ms = 1000,
) =>
  new Promise(
    (resolve) =>
      setTimeout(
        resolve,
        ms,
      ),
  );

// =========================
// RETRY UTIL
// =========================

export const retryAsync =
  async (
    fn,
    {
      retries = 3,
      delay = 500,
    } = {},
  ) => {
    let lastError;

    for (
      let attempt = 1;
      attempt <= retries;
      attempt++
    ) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        if (
          attempt <
          retries
        ) {
          await sleep(
            delay,
          );
        }
      }
    }

    throw lastError;
  };