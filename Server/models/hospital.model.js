import mongoose from "mongoose";
import { CONSTANTS } from "../../constants.js";

const HospitalRequestSchema = new mongoose.Schema(
  {
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: CONSTANTS.SCHEMA.RECEIVER, 
      required: true,
    },
    receiverName: { type: String, required: true },
    bloodGroup: { type: String, enum: Object.values(CONSTANTS.BLOODGROUP), required: true },
    contactInfo: { type: String, required: true },
    requestedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: Object.values(CONSTANTS.STATUS),
      default: CONSTANTS.STATUS.PENDING,
    },
  },
  { _id: false }
);

const BloodBankEntrySchema = new mongoose.Schema({
  bloodType: {
    type: String,
    enum: Object.values(CONSTANTS.BLOODGROUP),
    required: true,
  },
  quantityInLiters: {
    type: Number,
    default: 0,
    required: true,
    min: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const HospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
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
      trim: true,
      maxlength: 15,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      maxlength: 128,
    },
    facilities: {
      type: [String],
      default: ["Blood", "X-Ray", "Thyroid", "Sonography"],
    },
    bloodBank: {
      type: [BloodBankEntrySchema], 
      default: [],
    },
    city: { type: String, required: true, enum: Object.values(CONSTANTS.CITY) },
    pincode: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      maxlength: 6,
    },
    lastLogin: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    requestsReceived: [HospitalRequestSchema],
  },
  { timestamps: true }
);

export const Hospital = mongoose.model("Hospital", HospitalSchema);
