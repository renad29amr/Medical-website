import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {UserRole, User } from '../models/User';

interface JwtPayload
{
    userId: string;
    role: UserRole;
}


//*************************************************************
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: UserRole;
            };
        }
    }
}
//**************************************************************

export const authenticate =(
    req: Request,
    res: Response,
    next: NextFunction
): void => 
{
    try
    {
        const authHeader = req.headers.authorization;

        // Check if the Authorization header is present
        if (!authHeader)
        {
            res.status(401).json(
                {
                    success: false,
                    message: "Authentication required",
                }
            );
            return;
        }

        // Check token format
        if (!authHeader.startsWith("Bearer "))
        {
            res.status(401).json(
                {
                    success: false,
                    message: "Invalid token format",
                }
            );
            return;
        }

        const token = authHeader.split(" ")[1];

        if (!token)
        {
            res.status(401).json(
                {
                    success: false,
                    message: "Authentication required",
                }
            );
            return;
        }
        const secretKey = process.env.JWT_SECRET_KEY;
        if (!secretKey)
        {
            res.status(500).json(
                {
                    success: false,
                    message: "Internal server error: JWT secret key is not configured",
                }
            );
            return;
        }

        // Verify JWT token
        const decoded = jwt.verify(token, secretKey) as JwtPayload;

        //Store authenticated user info
        req.user =
        {
            id: decoded.userId,
            role: decoded.role
        };
        next();
    }
    catch (error)
    {
        res.status(401).json(
        {
            success: false,
            message: "Invalid or expired token",
        }
        );
        return;
    }
}