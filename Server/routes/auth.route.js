import express from "express";
import {
  login, logout, signup, verifyEmail, forgotPassword, resetPassword, checkAuth,
  addDonation, getAllDonations, getDonationsByDonor, healthCareSignup,
  addBloodBankDetails, getBloodBankDetails, getAllHospitals, makeDonationRequest,
  getDonorRequests, updateUser, makeDonationRequestfromHospital,
  getHospitalRequests, getAllLabs, createAppointment, getAllLabRequests, filterDonation, uploadFile, getFiles, viewFile
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.token.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

router.post("/signup", signup);
router.post("/healthcare-signup", healthCareSignup);
router.get("/check-auth", verifyToken, checkAuth);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
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
router.get('/:hospitalId/requests', getHospitalRequests)
router.post("/donor/:donorId/request", makeDonationRequest); // 
router.post("/hospital/:hospitalId/request", makeDonationRequestfromHospital);
router.get('/donors/:donorId/requests', getDonorRequests);
router.get("/donors/donations/filter", filterDonation)
router.post("/upload", upload.single("file"), uploadFile);
router.get("/files", getFiles);
router.get("/view/:filename", viewFile);

export default router;
