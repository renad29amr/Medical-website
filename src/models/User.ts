import mongoose, { Document, Schema } from "mongoose";

export enum UserRole {
  PATIENT = "patient",
  DOCTOR = "doctor",
  ADMIN = "admin",
}

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}

const userSchema: Schema<IUser> = new Schema<IUser>({
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
    minlength: [3, "Full name must be at least 3 characters long"],
    maxlength: [50, "Full name must be at most 50 characters long"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
    select: false,
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    required: [true, "Role is required"],
    default: UserRole.PATIENT,
  },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
