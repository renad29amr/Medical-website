import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/User";
import { env } from "../config/env";

export type UserRole = "patient" | "doctor" | "admin";

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

const getJwtSecret = () => process.env.JWT_SECRET || process.env.JWT_SECRET_KEY;

const normalizeRole = (role: unknown): UserRole | null => {
  if (role === "patient" || role === "doctor" || role === "admin") return role;
  if (role === "Patient") return "patient";
  if (role === "Doctor") return "doctor";
  if (role === "Admin") return "admin";
  return null;
};

interface AppJwtPayload extends JwtPayload {
  userId?: string;
  role?: string;
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const secret = getJwtSecret();
    if (!secret) {
      res.status(500).json({ success: false, message: "JWT secret is not configured" });
      return;
    }

    const decoded = jwt.verify(token, secret) as AppJwtPayload;
    const userId = decoded.userId;
    const role = normalizeRole(decoded.role);

    if (!userId || !role) {
      res.status(401).json({ success: false, message: "Invalid token payload" });
      return;
    }

    req.user = { id: userId, role };
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Not authorized, no token" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized for this action`,
      });
      return;
    }

    next();
  };
};

export const adminOnly = authorizeRoles("admin");
export const protect = authenticate;
export const authorize = authorizeRoles;

// Guards admin registration:
// - If no admin exists yet, allow bootstrapping the first one using a
//   shared secret (ADMIN_SETUP_KEY) instead of a token, since there is no
//   admin available to authenticate as.
// - Once at least one admin exists, fall back to normal authenticate +
//   adminOnly so only an existing admin can create further admins.
export const adminRegistrationGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const adminCount = await User.countDocuments({ role: "admin" });

    if (adminCount === 0) {
      if (!env.adminSetupKey) {
        res.status(500).json({ success: false, message: "Admin setup key is not configured" });
        return;
      }

      const providedKey = req.headers["x-admin-setup-key"];
      if (!providedKey || providedKey !== env.adminSetupKey) {
        res.status(401).json({ success: false, message: "Invalid or missing admin setup key" });
        return;
      }

      next();
      return;
    }

    authenticate(req, res, () => adminOnly(req, res, next));
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
