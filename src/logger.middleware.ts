import { Request, Response, NextFunction } from 'express';

export function logger(req: any, res: Response, next: NextFunction) {
  console.log('Request...', Object.keys(req));
  next();
}
