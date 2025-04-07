import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '../config/env';

// Extend Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    let token = '';
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      token = req.query.token as string;
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'No token, authorization denied'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, env.secret) as { sub: string };
    
    // Add user ID to request
    req.user = { id: decoded.sub };
    
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Token is not valid'
    });
  }
};