import mongoose from "mongoose";

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
      Aplus: {
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
      },
      Aminus: {
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
      },
      Bplus: {
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
      },
      Bminus: {
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
      },
      ABplus: {
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
      },
      ABminus: {
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
      },
      Oplus: {
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
      },
      Ominus: {
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
      },
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
  },
  { timestamps: true }
);

export const Hospital = mongoose.model("Hospital", HospitalSchema);
