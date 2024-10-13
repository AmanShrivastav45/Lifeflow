import mongoose from "mongoose";

// Enum definitions for blood groups, gender, and donation types
const bloodGroupEnum = ["A+", "A-", "AB+", "AB-", "B+", "B-", "O+", "O-"];
const genderEnum = ["Male", "Female", "Other"];
const donationTypeEnum = ["blood", "plasma"];

// Donation schema definition
const DonationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
      required: true,
    },
    donationType: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    quantity: { type: Number, required: true },
    postedBy: { type: String, required: true },
  },
  { timestamps: true }
);

export const Donation = mongoose.model("Donation", DonationSchema);

// Donor schema definition
const DonorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    lastName: {
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
    }, // Unique email
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 10,
      maxlength: 15,
    }, // Unique phone
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      maxlength: 128,
    },
    bloodGroup: { type: String, required: true, enum: bloodGroupEnum }, // Ensure blood group is valid
    gender: { type: String, required: true, enum: genderEnum }, // Ensure gender is valid
    city: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
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
    donations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Donation" }], // Array of donation references
  },
  { timestamps: true }
); // Add timestamps for createdAt and updatedAt

export const Donor = mongoose.model("Donor", DonorSchema);
