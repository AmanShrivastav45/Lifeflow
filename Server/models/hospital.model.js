import mongoose from "mongoose";
const bloodGroupEnum = ["A+", "A-", "AB+", "AB-", "B+", "B-", "O+", "O-"];
const RequestSchema = new mongoose.Schema(
  {
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reciever", // Assuming 'User' is the collection for receivers
      required: true,
    },
    receiverName: { type: String, required: true },
    bloodGroup: { type: String, enum: bloodGroupEnum, required: true },
    contactInfo: { type: String, required: true },
    city: { type: String, required: true },
    requestedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    }, // Status of the request
  },
  { _id: false } // Exclude `_id` for each request subdocument
);

const BloodBankEntrySchema = new mongoose.Schema({
  bloodType: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], // Allowed blood types
    required: true,
  },
  quantityInLiters: {
    type: Number,
    default: 0, // Default value set to 0
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
      default: ["Emergency", "ICU", "Radiology", "Pharmacy"],
    },
    bloodBank: {
      type: [BloodBankEntrySchema], // Use the BloodBankEntrySchema as an array
      default: [], // Default to an empty array
    },
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
    requestsReceived: [RequestSchema],
  },
  { timestamps: true }
);

export const Hospital = mongoose.model("Hospital", HospitalSchema);
