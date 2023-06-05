export interface ExpressError extends Error {
  status?: number;
}

/**
 * Used to create an error object that can be passed to the next() function
 * @param error Error object
 * @param status Request status code to return to user
 * @example
 * app.get('/test', async (req, res, next) => {
 *  try {
 *   // Perform task that might throw an error
 *    await doSomethingThatMightFail();
 *  } catch (error) {
 *    next(err(error, 500));
 *  }
 *
 *  res.status(200).json('This will never be reached');
 * });
 */
export function err<T extends Error>(error: T, status?: number) {
  const err: ExpressError = error;
  err.status = status;
  return err;
}

export function isExpressError(error: unknown): error is ExpressError {
  return error instanceof Error && (error as Error).message !== undefined && (error as ExpressError).status !== undefined;
}
