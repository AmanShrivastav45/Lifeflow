import mongoose from "mongoose";
import { CONSTANTS } from "../../constants.js";

const RequestSchema = new mongoose.Schema(
  {
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: CONSTANTS.SCHEMA.RECEIVER,
      required: false,
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: CONSTANTS.SCHEMA.DONOR,
      required: false,
    },
    donationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
      required: false,
    },
    //receiver details
    name: {
      type: String,
      required: false,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: false,
      unique: true,
      trim: true,
      minlength: 10,
      maxlength: 15,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: Object.values(CONSTANTS.BLOODGROUP)
    },
    city: {
      type: String,
      required: true,
      enum: Object.values(CONSTANTS.CITY)
    },
    // donor
    donor_name: {
      type: String,
      required: false,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    donor_email: {
      type: String,
      required: false,
      unique: true,
      trim: true,
      lowercase: true,
    },
    donor_phone: {
      type: String,
      required: false,
      unique: true,
      trim: true,
      minlength: 10,
      maxlength: 15,
    },
    donor_city: {
      type: String,
      required: false,
    },
    donor_pincode: {
      type: String,
      required: false,
    },
    donor_address: {
      type: String,
      required: false,
    },
    donationType: {
      type: String,
      required: true
    },
    requestedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: Object.values(CONSTANTS.STATUS),
      default: CONSTANTS.STATUS.PENDING,
    },
  },
);

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
    requests: [RequestSchema],
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
