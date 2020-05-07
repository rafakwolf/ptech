import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

export function authMiddleware () {
  return (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const [schema, token] = authorization.split(' ');

    if (schema !== 'Bearer') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const secret = process.env.SECRET || 'jwt-secret';

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        (<any>req).user = decoded;
        next();
      }
      return {};
    });
    return {};
  };
}
