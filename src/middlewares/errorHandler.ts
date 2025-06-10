import { NextFunction, Request, Response } from "express";
import { CustomError, InternalServerError } from "../errors";

interface ErrorLogInfo {
  timestamp: string;
  path: string;
  method: string;
  error: string;
  stack?: string;
  requestBody?: unknown;
  requestQuery?: unknown;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error information
  const errorInfo: ErrorLogInfo = {
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
    error: err.message,
  };

  // In development, include more details
  if (process.env.NODE_ENV === "development") {
    errorInfo.stack = err.stack;
    errorInfo.requestBody = req.body;
    errorInfo.requestQuery = req.query;
  }

  // Log the error (you might want to use a proper logger in production)
  console.error(JSON.stringify(errorInfo, null, 2));

  // Handle different types of errors
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  // For unknown errors, convert to InternalServerError
  const internalError = new InternalServerError(
    err.message || "An unexpected error occurred"
  );

  return res.status(internalError.statusCode).json(internalError.toJSON());
};
