import mongoose from "mongoose";
import { CONSTANTS } from "../../constants.js";

const RecieverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 10,
      maxlength: 15,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: Object.values(CONSTANTS.BLOODGROUP),
    },
    gender: {
      type: String,
      required: true,
      enum: Object.values(CONSTANTS.GENDER),
    },
    city: { type: String, required: true, enum: Object.values(CONSTANTS.CITY) },
    requests: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Requests' },
    ],
    pincode: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      maxlength: 6,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      maxlength: 128,
    },
    lastLogin: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  { timestamps: true }
);
export const Reciever = mongoose.model("Receiver", RecieverSchema);
