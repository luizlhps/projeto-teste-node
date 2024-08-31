import type { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ErrorBase } from 'src/shared/exceptions/error-base';

export const errorHandlerMiddleware: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error occurred:', err); // Log do erro

  if (res.headersSent) {
    return next(err); // Se os headers já foram enviados, passa o erro para o próximo middleware
  }

  if (err instanceof ErrorBase) {
    res.status(err.status).json({
      error_code: err.error_code,
      error_description: err.error_description,
    });
  } else {
    res.status(500).json({
      error_code: 'INTERNAL_SERVER_ERROR',
      error_description: 'ocorreu um erro interno do servidor',
    });
  }
};
