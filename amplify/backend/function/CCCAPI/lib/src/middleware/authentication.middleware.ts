import { NextFunction, Request, Response } from "express";
import { err } from "../error/error";

interface Authorizer {
  claims: {
    sub: string;
    "cognito:username": string;
    "custom:displayName": string;
    email: string;
  },
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

    const claims = (req.apiGateway?.event.requestContext.authorizer as Authorizer).claims;

    if (!claims) {
      throw new Error("No authorizer claims found");
    }

    (req as VerifiedReq).user = {
      sub: claims.sub,
      username: claims["cognito:username"],
      displayName: claims["custom:displayName"],
      email: claims.email,
    };
    (req as VerifiedReq).jwt = `${authHeader}`;
    next();
  } catch (e) {
    console.error(e);
    return next(err(new Error("Unauthorized"), 401));
  }
};