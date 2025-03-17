import mongoose from "mongoose";
import { CONSTANTS } from "../../constants.js";

const DonationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: CONSTANTS.SCHEMA.DONOR,
      required: true,
    },
    donationType: { type: String, required: true },
    bloodGroup: { type: String, required: true, enum: Object.values(CONSTANTS.BLOODGROUP) },
    address: { type: String, required: true },
    city: { type: String, required: true, enum: Object.values(CONSTANTS.CITY) },
    pincode: { type: String, required: true },
    quantity: { type: Number, required: true },
    phone: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 15,
    },
    postedBy: { type: String, required: true },
    requestedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "Receiver" }]
  },
  { timestamps: true }
);

export const Donation = mongoose.model("Donation", DonationSchema);

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
    bloodGroup: { type: String, required: true, enum: Object.values(CONSTANTS.BLOODGROUP) },
    city: { type: String, required: true, enum: Object.values(CONSTANTS.CITY) },
    donationType: { type: String, required: true },
    requestedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: Object.values(CONSTANTS.STATUS),
      default: CONSTANTS.STATUS.PENDING,
    },
  },
);
export const Requests = mongoose.model("Requests", RequestSchema);

const DonorSchema = new mongoose.Schema(
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
    bloodGroup: { type: String, required: true, enum: Object.values(CONSTANTS.BLOODGROUP) },
    gender: { type: String, required: true, enum: Object.values(CONSTANTS.GENDER) },
    city: { type: String, required: true, enum: Object.values(CONSTANTS.CITY) },
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
    isEligible: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    donations: [{ type: mongoose.Schema.Types.ObjectId, ref: CONSTANTS.SCHEMA.DONATION }],
    requestsReceived: [RequestSchema],
  },
  { timestamps: true },
  { autoIndex: false }
);

export const Donor = mongoose.model("Donor", DonorSchema);
