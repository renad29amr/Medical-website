import mongoose, { Document, Schema} from "mongoose";
export enum UserRole {
  PATIENT = "patient",
  DOCTOR = "doctor",
  ADMIN = "admin"
}

export interface User extends Document {
    fullName: string;
    email: string;
    password: string;
    role: UserRole;
}

const userSchema: Schema<User> = new Schema<User>({
    fullName: 
    {   type: String, 
        required: [true, "Full name is required"],
        trim: true,
        minlength: [3, "Full name must be at least 3 characters long"],
        maxlength: [50, "Full name must be at most 50 characters long"]
    },

    email: 
    {   type: String, 
        required: [true, "Email is required"],
        unique: true,
        trim: true
    },

    password: 
    {   type: String, 
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
        select: false
    },

    role: 
    {   type: String, 
        enum: UserRole, 
        required: [true, "Role is required"] 
    }
});

const User = mongoose.model<User>("User", userSchema);
export default User;