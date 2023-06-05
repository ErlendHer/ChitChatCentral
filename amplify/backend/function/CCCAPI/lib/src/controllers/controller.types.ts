import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "lib/shared/response";
import { ExpressError, isExpressError } from "../error/error";

export type Controller<T> = (req: Request, res?: Response) => Promise<ApiResponse<T> | ExpressError>;

export const build = <T>(controller: Controller<T>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await controller(req, res);
      if (isExpressError(result)) {
        return next(result);
      }
      res.json(result);
    } catch (e) {
      console.error(e);
      return next(e);
    }
  }
}