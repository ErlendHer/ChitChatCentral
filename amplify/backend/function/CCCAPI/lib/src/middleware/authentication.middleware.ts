import { NextFunction, Request, Response } from "express";
import { err } from "../error/error";


interface Authorizer {
  claims: User,
}

export interface User {
  sub: string;
  username: string;
  displayName: string;
  email: string;
}

export type VerifiedReq = Request & { user: User, jwt: string }

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header('authorization');

    const authorizer = req.apiGateway?.event.requestContext.authorizer as Authorizer;

    if (!authorizer) {
      throw new Error("No authorizer found");
    }
    (req as VerifiedReq).user = authorizer.claims;
    (req as VerifiedReq).jwt = `${authHeader}`;

    console.log("user:", (req as VerifiedReq).user);
    console.log("jwt:", (req as VerifiedReq).jwt);
    next();
  } catch (e) {
    console.error(e);
    return next(err(new Error("Unauthorized"), 401));
  }
};