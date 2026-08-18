import {Request, Response} from "express";
    import{User, UserRole} from "../models/User";

    export const registerValidator = (
        req: Request, 
        res: Response, 
        next: Function) => 
        {
            const
            {
                fullName, 
                email, 
                password, 
                role
            } = req.body;

           //Check required fields
            if(!fullName || !email || !password || !role)
            {
                return res.status(400).json(
                    {
                    success: false,
                    message: "Please fill in all required fields",
                    }
                );
                return;
            } 

            // Validate fullName
            if (typeof fullName !== "string" || fullName.trim().length < 3 || fullName.trim().length > 50)
            {
                res.status(400).json(
                    {
                        success: false,
                        message: "Full name must be a string between 3 and 50 characters long",
                    }
                );
                return;
            }

            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (typeof email !== "string" || !emailRegex.test(email))
            {
                res.status(400).json(
                    {
                        success: false,
                        message: "Please provide a valid email",
                    }
                );
                return;
            }

            // Validate password
            if (typeof password !== "string" || password.length < 6)
            {
                res.status(400).json(
                    {
                        success: false,
                        message: "Password must be at least 6 characters",
                    }
                );
                return;
            }

            // Validate role
            if (role !== UserRole.PATIENT && role !== UserRole.DOCTOR)
            {
                res.status(400).json(
                    {
                        success: false, 
                        message: "Role must be either 'patient' or 'doctor'",
                    }
                );
                return;
            }
        next();
    };

    export const loginValidator = (
        req: Request, 
        res: Response, 
        next: Function) => 
        {
            const { email, password } = req.body;   
            // Check required fields
            if(!email || !password)
            {
                return res.status(400).json(
                    {
                        success: false,
                        message: "Email and password are required",
                    }
                );
                return;
            }
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (typeof email !== "string" || !emailRegex.test(email))
            {
                res.status(400).json(   
                    {
                        success: false,
                        message: "Please provide a valid email",
                    }
                );
                return;
                
            }
        }