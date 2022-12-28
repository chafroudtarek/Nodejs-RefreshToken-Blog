import { formatError } from "../shared/formatError";
import { ApplicationError } from "../shared/applicationError";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApplicationError) {
    const code: any = err.statusCode || 500;
    return res.status(code).json(formatError(err));
  }

  return res.status(res.statusCode || 500).send({
    name: err.name,
    message: err.message,
    statusCode: res.statusCode || 500,
    code: err.stack,
  });
};
