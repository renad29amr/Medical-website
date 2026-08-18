import { Request, Response } from 'express';
import User, { UserRole } from "../models/User";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (
    userId: string, 
    role: UserRole
): string => {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) 
    {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    return jwt.sign(
        { 
            userId, 
            role 
        }, 
        secretKey, 
        { 
            expiresIn: '1h' 
        }
    );
};


// Register a new user
export const registerUser = async (
    req: Request, 
    res: Response): 
    Promise<void> => {
    try 
    {
        const 
        { 
            fullName, 
            email, 
            password, 
            role 
        } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne(
            { 
                email 
            }
        );

        if (existingUser) 
        {
            res.status(400).json(
                { 
                    message: "User with this email already exists" 
                }
            );
            return;
        }

        // patient and doctor regiser
        const userRole = role === UserRole.DOCTOR ? UserRole.DOCTOR : UserRole.PATIENT;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create(
            { 
                fullName, 
                email, 
                password: hashedPassword, 
                role: userRole 
            }
        );

        // Generate a JWT token
        const token = generateToken(
            newUser._id.toString(), 
            newUser.role
        );

        // Return response
        res.status(201).json(
            {
                success: true,
                message: "Registration successful",
                data: 
                {
                    user:
                    {
                        id: newUser._id,
                        fullName: newUser.fullName,
                        email: newUser.email,
                        role: newUser.role
                    },
                    token
                }
            }
        );
    } 

    catch (error) 
    {
        console.error("Error during user registration:", error);
        res.status(500).json(
            { 
                success: false,
                message: "Internal server error" 
            }
        );
    }
};

// Login
export const loginUser = async (
    req: Request, 
    res: Response
): Promise<void> => {
    try 
    {
        const 
        { 
            email, 
            password 
        } = req.body;

        const user = await User.findOne(
            { 
                email 
            }
        ).select("+password");

        if (!user)
        {
            res.status(401).json(
                {
                    success: false,
                    message: "Invalid email or password"
                }
            );
            return;
        }

        // Compare passwords
        const isPasswordCorrect = await bcrypt.compare(
            password, 
            user.password
        );

        if (!isPasswordCorrect)
        {
            res.status(401).json(
                {
                    success: false,
                    message: "Invalid email or password"
                }
            );
            return;
        }
                
        // Generate JWT 
            const token = generateToken(
                user._id.toString(), 
                user.role
            );

        // Return response
        res.status(200).json(
            {
                success: true,  
                message: "Login successful",
                data:
                {
                    user:
                    {
                        id: user._id,
                        fullName: user.fullName,
                        email: user.email,
                        role: user.role
                    },
                    token,
                },
                
            }
        );                
    }

    catch (error)
    {
        console.error("Login Error:", error);   
        res.status(500).json(
            {
                success: false,
                message: "Internal server error"
            }
        );
    }
};

// Get Current User
export const getCurrentUser = async (
    req: Request & { user?: { userId: string } },
    res: Response
): Promise<void> => {
    try 
    {
        const userId = req.user?.userId;

        if (!userId) 
        {
            res.status(401).json(
                { 
                    success: false,
                    message: "Unauthenticated" 
                }
            );
            return;
        }

        // Fetch authenticated user
        const user = await User.findById(userId);
        if (!user)
        {
            res.status(404).json(
                { 
                    success: false,
                    message: "User not found" 
                }
            );
            return;
        }
        //Do not return password in response
        res.status(200).json(
            {
                success: true,
                data: 
                {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role
                },
            }
        );
    }
    catch (error)
    {
        console.error("Error fetching current user:", error);
        res.status(500).json(
            { 
                success: false,
                message: "Internal server error" 
            }
        );
    }
};