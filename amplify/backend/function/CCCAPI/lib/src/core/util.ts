
import type { Request as ExpressRequest } from 'express';

import { NextFunction } from "express";
import Joi from "joi";
import { err } from "../error/error";


export async function validateSchema(req: ExpressRequest, schema: Joi.Schema, next: NextFunction) {
  const { error } = schema.validate(req.body);
  if (error) {
    next(
      err(
        new Error(`Invalid request body`),
        400
      ));
    return false;
  }

  return true;
}

