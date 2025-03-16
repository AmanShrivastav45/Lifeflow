import mongoose from "mongoose";
import { CONSTANTS } from "../../constants.js";

const AppointmentSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
      required: true,
    },
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
    feedback: {
      type: String,
      trim: true,
      maxlength: 200,
    },
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
    category: {
      type: String,
      required: true,
    },
    timeslot: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(CONSTANTS.APPOINTMENT_STATUS), 
      default: CONSTANTS.APPOINTMENT_STATUS.PENDING,
    },
  },
  { timestamps: true } 
);

export const Appointments = mongoose.model("Appointment", AppointmentSchema);

const LaboratorySchema = new mongoose.Schema(
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
      default: ["Emergency", "ICU", "Radiology", "Pharmacy"],
    },
    city: {
      type: String,
      required: true,
      enum: Object.values(CONSTANTS.CITY),
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      maxlength: 6,
    },
    appointments: [AppointmentSchema],
    lastLogin: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  { timestamps: true }
);

export const Laboratory = mongoose.model("Laboratory", LaboratorySchema);
