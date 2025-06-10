import { Request, Response, NextFunction } from "express";
import { AppException } from "../exceptions/AppException";
import { InternalServerException } from "../exceptions/DomainExceptions";

interface ErrorResponse {
  statusCode: number;
  message: string;
  errorCode: string;
  stack?: string;
}

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log the error for debugging (you might want to use a proper logger in production)
  console.error(error);

  let response: ErrorResponse;

  if (error instanceof AppException) {
    // If it's our custom exception, use its properties
    response = error.toJSON();
  } else {
    // For unknown errors, convert to InternalServerException
    const internalError = new InternalServerException(
      error.message || "An unexpected error occurred"
    );
    response = internalError.toJSON();
  }

  // Add stack trace in development environment
  if (process.env.NODE_ENV === "development") {
    response.stack = error.stack;
  }

  res.status(response.statusCode).json(response);
}
