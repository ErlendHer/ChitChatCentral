import express from 'express';
import type { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import awsServerlessExpressMiddleware from 'aws-serverless-express/middleware';
import { corsMiddleware } from './src/middleware/cors.middleware';
import { RoomsRouter } from './src/routes/rooms.routes';

import { err, isExpressError, type ExpressError } from './src/error/error';
import { authMiddleware } from './src/middleware/authentication.middleware';


export function initializeApp(): Express {
  const app = express();
  initializeMiddleware(app);
  startServer(app);
  initializeAuthenticatedRoutes(app);
  initializeErrorHandling(app);
  return app;
}

function initializeMiddleware(app: Express) {
  app.use(bodyParser.json());
  app.use(corsMiddleware);
  app.use(awsServerlessExpressMiddleware.eventContext());
}

function initializeAuthenticatedRoutes(app: Express) {
  app.use(authMiddleware);
  app.use('/rooms', RoomsRouter)
}

/** 
 * Initialize error handling for all the requests. This will be called if we call next with an error object
 */
function initializeErrorHandling(app: Express) {
  // Our request was not handled
  app.use((req: Request, res: Response, next: NextFunction) => {
    const error: ExpressError = new Error(
      'Not found -> Endpoint does not exist. Read the endpoints docs'
    );
    error.status = 404;
    next(error);
  });

  // All unhandled errors should be passed on here using next(error)
  app.use(
    (error: unknown, req: Request, res: Response, next: NextFunction) => {
      console.error(req.url + ' failed with error: ' + error);
      const expressError = isExpressError(error) ? error : err(error as Error, 500)

      res.status(expressError.status || 500);
      res.json({
        error: {
          message: expressError.toString(),
        },
      });
    }
  );
}
function startServer(app: Express) {
  app.listen(3000, () => {
    console.log("App started");
  });
}



