import { Request, Response, NextFunction } from 'express';


export type UserRole = 'Doctor' | 'Patient' | 'Admin';

export interface AuthUser {
  id: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}


export const protect = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
  next();
};

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user?.role ?? 'unknown'}' is not authorized for this action`,
      });
    }
    next();
  };
};
