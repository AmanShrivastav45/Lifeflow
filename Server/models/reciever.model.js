import mongoose from "mongoose";
const bloodGroupEnum = ["A+", "A-", "AB+", "AB-", "B+", "B-", "O+", "O-"];
const genderEnum = ["Male", "Female", "Other"];

const RecieverSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, minlength: 3, maxlength: 50 },
    lastName: { type: String, required: true, trim: true, minlength: 3, maxlength: 50 },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    phone: { type: String, required: true, unique: true, trim: true, minlength: 10, maxlength: 15 },
    password: { type: String, required: true, trim: true, minlength: 8, maxlength: 128 },
    bloodGroup: { type: String, required: true, enum: bloodGroupEnum },
    gender: { type: String, required: true, enum: genderEnum },
    city: { type: String, required: true, trim: true, minlength: 3, maxlength: 50 },
    pincode: { type: String, required: true, trim: true, minlength: 6, maxlength: 6 },
    lastLogin: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  { timestamps: true }
);
export const Reciever = mongoose.model("Reciever", RecieverSchema);
