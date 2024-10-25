// auth.route.js
import express from "express";
import {
  login,
  logout,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
  addDonation,
  getAllDonations,
  getDonationsByDonor,
  healthCareSignup,
  addBloodBankDetails,
  getBloodBankDetails,
  getAllHospitals,
  makeDonationRequest,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.token.js";
import { Donation } from "../models/donor.model.js";
import upload from "../middlewares/upload.js";
import path from "path";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);
router.post("/signup", signup);
router.post("/healthcare-signup", healthCareSignup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/donors/donations/:donorId", addDonation);
router.get("/donors/donations", getAllDonations);
router.get("/donors/:donorId/donations", getDonationsByDonor);
router.post('/hospital/:hospitalId/bloodbank', addBloodBankDetails);
router.get('/hospitals', getAllHospitals);
router.get('/:hospitalId/bloodbank', getBloodBankDetails);
router.post("/donor/:donorId/request", makeDonationRequest);
router.get("/donors/donations/filter", async (req, res) => {
  const { bloodGroup, city, donationType } = req.query;
  let filter = {};

  if (bloodGroup) {
    filter.bloodGroup = bloodGroup;
  }

  if (city) {
    filter.city = { $regex: city, $options: "i" }; // case-insensitive search
  }

  if (donationType) {
    filter.donationType = donationType;
  }

  try {
    const filteredDonations = await Donation.find(filter).exec();
    res.json(filteredDonations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error filtering donations" });
  }
});

export default router;
