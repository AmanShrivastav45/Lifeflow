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
  getDonorRequests,
  updateUser,
  makeDonationRequestfromHospital,
  getHospitalRequests,
  getAllLabs,
  createAppointment,
  getAllLabRequests
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.token.js";
import { Donation } from "../models/donor.model.js";

const router = express.Router();

// Authentication
router.post("/signup", signup);
router.post("/healthcare-signup", healthCareSignup);
router.get("/check-auth", verifyToken, checkAuth);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Donor routes
router.put("/:userId/update", updateUser);


router.post("/donors/donations/:donorId", addDonation);
router.get("/donors/donations", getAllDonations);


router.get("/donors/:donorId/donations", getDonationsByDonor);


router.post('/hospital/:hospitalId/bloodbank', addBloodBankDetails);
router.get('/hospitals', getAllHospitals);
router.get('/laboratories', getAllLabs);
router.get('/laboratory/:laboratoryId/request', getAllLabRequests);
router.post('/laboratory/:laboratoryId/request', createAppointment)


router.get('/:hospitalId/bloodbank', getBloodBankDetails);
router.get('/:hospitalId/requests', getHospitalRequests )
router.post("/donor/:donorId/request", makeDonationRequest); // 
router.post("/hospital/:hospitalId/request", makeDonationRequestfromHospital);
router.get('/donors/:donorId/requests', getDonorRequests);
router.get("/donors/donations/filter", async (req, res) => {

  const { bloodGroup, city, donationType } = req.query;
  let filter = {};

  if (bloodGroup) {
    filter.bloodGroup = bloodGroup;
  }

  if (city) {
    filter.city = { $regex: city, $options: "i" };
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
