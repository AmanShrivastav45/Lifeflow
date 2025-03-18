import bcryptjs from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";
import { Donor, Donation, Requests } from "../models/donor.model.js";
import File from "../models/file.model.js";
import { Reciever } from "../models/reciever.model.js";
import { Hospital } from "../models/hospital.model.js";
import { Laboratory } from "../models/lab.model.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sendWelcomeEmail } from "../utils/sendWelcomeEmail.js";
import { sendOTPverificationEmail } from "../utils/sendOTPverificationEmail.js";
import { generateJWTandSetCookie } from "../utils/generateJWTandSetCookie.js";
import mongoose from "mongoose";
import { CONSTANTS } from "../../constants.js";
import axios from 'axios';
import { randomUUID } from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appointmentFeedback = async (extractedText) => {
  try {
    const API_URL = process.env.OPEN_AI_KEY || "";
    const response = await axios.post(API_URL, {
      contents: [
        {
          parts: [
            {
              text: `Give a 1 line feedback in 15 words for the text: ${extractedText}`
            }
          ]
        }
      ]
    });
    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  } catch (error) {
    console.error("Error getting feedback from OpenAI:", error);
    throw new Error("Error getting feedback from OpenAI");
  }
};

export const uploadFile = async (req, res) => {
  try {
    let { index, status, laboratoryId, text } = req.body;
    if (!req.file && !status) {
      return res.status(400).json({ message: "Either a file or status must be provided" });
    }
    if (!status) status = CONSTANTS.APPOINTMENT_STATUS.COMPLETED;
    let newFile;
    let feedback = null;
    if (req.file) {
      newFile = new File({ filename: req.file.filename });
      await newFile.save();
    }
    if (text) {
      const feedbackResponse = await appointmentFeedback(text);
      feedback = feedbackResponse ? feedbackResponse : "";
    }
    const laboratory = await Laboratory.findById(laboratoryId);
    if (!laboratory) {
      return res.status(404).json({ message: "Laboratory not found" });
    }
    const appointment = laboratory.appointments[index];
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    const donor = await Donor.findById(appointment.donorId);
    const donorAp = donor.appointments.find(app => app.appointmentId === appointment.appointmentId);

    appointment.status = status;
    if (newFile) {
      appointment.report = newFile._id;
      appointment.filename = newFile.filename
    }
    if (feedback) {
      appointment.feedback = feedback;
    }
    if (donorAp) {
      donorAp.status = status;
      if (newFile) {
        donorAp.report = newFile._id;
        donorAp.filename = newFile.filename
      }
      if (feedback) {
        donorAp.feedback = feedback;
      }
    }

    await donor.save();
    await laboratory.save();
    const response = {
      message: "File uploaded successfully",
      filename: req.file ? req.file.filename : null,
      status,
      feedback: feedback || null,
    };
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "File upload failed" });
  }
};

export const getFiles = async (req, res) => {
  try {
    const files = await File.find();
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: "Error fetching files" });
  }
};

export const getFile = async (req, res) => {
  try {
    const { reportId } = req.body;
    const file = await File.findById(reportId);
    res.json(file);
  } catch (error) {
    res.status(500).json({ message: "Error fetching files" });
  }
};

export const viewFile = async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "../uploads", filename);
    res.sendFile(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving file" });
  }
};

export const signup = async (request, response) => {
  const {
    role,
    name,
    email,
    phone,
    bloodGroup,
    gender,
    city,
    pincode,
    password,
  } = request.body;
  try {
    if (
      !role ||
      !name ||
      !email ||
      !phone ||
      !bloodGroup ||
      !gender ||
      !city ||
      !pincode ||
      !password
    ) {
      throw new Error("All fields are required");
    }
    console.log(
      role,
      name,
      email,
      phone,
      bloodGroup,
      gender,
      city,
      pincode,
      password
    );

    let UserModel = role === CONSTANTS.ROLES.DONOR ? Donor : Reciever;
    const alreadyExists = await UserModel.findOne({ email });

    if (alreadyExists) {
      return response.status(400).json({
        success: false,
        message: "User  already exists!",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const OTP = generateOTP();

    const newUser =
      role === CONSTANTS.ROLES.DONOR
        ? new Donor({
          name,
          email,
          phone,
          bloodGroup,
          gender,
          city,
          pincode,
          password: hashedPassword,
          verificationToken: OTP,
          verificationTokenExpiresAt: Date.now() + 10 * 60 * 1000,
        })
        : new Reciever({
          name,
          email,
          phone,
          bloodGroup,
          gender,
          city,
          pincode,
          password: hashedPassword,
          verificationToken: OTP,
          verificationTokenExpiresAt: Date.now() + 10 * 60 * 1000,
        });

    try {
      await newUser.save();
    } catch (error) {
      console.error("Error saving user:", error);
      return w
        .status(400)
        .json({ success: false, message: "Error saving user" });
    }

    generateJWTandSetCookie(response, newUser._id);
    sendOTPverificationEmail(name, email, OTP);

    response.status(201).json({
      success: true,
      message: "User  created successfully",
      user: {
        ...newUser._doc,
        password: undefined,
      },
    });
  } catch (error) {
    response.status(400).json({ success: false, message: error.message });
  }
};

export const healthCareSignup = async (request, response) => {
  const { role, name, email, phone, address, city, pincode, password } =
    request.body;
  try {
    console.log(role, name, email, phone, address, city, pincode, password);
    if (
      !role ||
      !name ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !pincode ||
      !password
    ) {
      throw new Error("All fields are required");
    }

    let UserModel = role === CONSTANTS.ROLES.HOSPITAL ? Hospital : Laboratory;
    const alreadyExists = await UserModel.findOne({ email });

    if (alreadyExists) {
      return response.status(400).json({
        success: false,
        message: "User  already exists!",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const OTP = generateOTP();

    const newUser =
      role === CONSTANTS.ROLES.HOSPITAL
        ? new Hospital({
          name,
          email,
          phone,
          address,
          city,
          pincode,
          password: hashedPassword,
          verificationToken: OTP,
          verificationTokenExpiresAt: Date.now() + 10 * 60 * 1000,
        })
        : new Laboratory({
          name,
          email,
          phone,
          address,
          city,
          pincode,
          password: hashedPassword,
          verificationToken: OTP,
          verificationTokenExpiresAt: Date.now() + 10 * 60 * 1000,
        });

    try {
      await newUser.save();
    } catch (error) {
      console.error("Error saving user:", error);
      return response
        .status(400)
        .json({ success: false, message: "Error saving user" });
    }

    generateJWTandSetCookie(response, newUser._id);
    sendOTPverificationEmail(name, email, OTP);

    response.status(201).json({
      success: true,
      message: "User  created successfully",
      user: {
        ...newUser._doc,
        password: undefined,
      },
    });
  } catch (error) {
    response.status(400).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (request, response) => {
  const { OTP, role } = request.body;

  try {
    let UserModel;
    if (role === CONSTANTS.ROLES.DONOR) {
      UserModel = Donor;
    } else if (role === CONSTANTS.ROLES.RECEIVER) {
      UserModel = Reciever;
    } else if (role === CONSTANTS.ROLES.HOSPITAL) {
      UserModel = Hospital;
    } else if (role === CONSTANTS.ROLES.LABORATORY) {
      UserModel = Laboratory;
    }

    console.log(UserModel);
    const user = await UserModel.findOne({
      verificationToken: OTP,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return response.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    const userName = user.name;
    await sendWelcomeEmail(userName, user.email);

    response.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in verifyEmail: ", error);
    response.status(500).json({ success: false, message: "Server error" });
  }
};

export const login = async (request, response) => {
  const { role, email, password } = request.body;
  try {
    let UserModel;

    if (role === CONSTANTS.ROLES.DONOR) {
      UserModel = Donor;
    } else if (role === CONSTANTS.ROLES.RECEIVER) {
      UserModel = Reciever;
    } else if (role === CONSTANTS.ROLES.HOSPITAL) {
      UserModel = Hospital;
    } else if (role === CONSTANTS.ROLES.LABORATORY) {
      UserModel = Laboratory;
    }

    const user = await UserModel.findOne({ email });
    if (!user)
      return response
        .status(400)
        .json({ success: false, message: "User doesn't exist!" });

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return response
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    generateJWTandSetCookie(response, user._id);
    user.lastLogin = new Date();
    await user.save();

    response.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in login ", error);
    response.status(400).json({ success: false, message: error.message });
  }
};

export const logout = async (request, response) => {
  response.clearCookie("token");
  response
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (request, response) => {
  const { email } = request.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return response
        .status(400)
        .json({ success: false, message: "User not found" });

    const resetToken = generateOTP();
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );
    response.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log("Error in forgotPassword ", error);
    response.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (request, response) => {
  try {
    const { token } = request.params;
    const { password } = request.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user)
      return response
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });

    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();
    response
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword ", error);
    response.status(400).json({ success: false, message: error.message });
  }
};

export const checkAuth = async (request, response, role) => {
  try {
    let UserModel = role === "user" ? User : Mentor;
    const user = await UserModel.findById(request.userId).select("-password");
    if (!user)
      return response
        .status(400)
        .json({ success: false, message: "User not found" });
    response.status(200).json({ success: true, user });
  } catch (error) {

    response.status(400).json({ success: false, message: error.message });
  }
};

export const addDonation = async (req, res) => {
  const {
    donorId,
    donationType,
    city,
    phone,
    address,
    pincode,
    bloodGroup,
    quantity,
  } = req.body;

  console.log("Request Body:", req.body);

  try {
    const donor = await Donor.findById(donorId);
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    console.log("Donor found:", donor);

    const donation = new Donation({
      donorId,
      donationType,
      address,
      city,
      pincode,
      bloodGroup,
      quantity,
      phone: phone,
      postedBy: donor.name,
    });

    await donation.save();
    donor.donations.push(donation._id);
    await donor.save();

    res.status(201).json({ message: "Donation added successfully", donation });
  } catch (error) {
    console.error("Error adding donation:", error);
    res
      .status(500)
      .json({ message: "Error adding donation", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { _id, role, ...updateFields } = req.body;
    console.log(req.body);

    let updatedUser;

    if (role === CONSTANTS.SCHEMA.RECEIVER) {
      updatedUser = await Reciever.findByIdAndUpdate(_id, updateFields, {
        new: true,
        runValidators: true,
      });
    } else if (role === CONSTANTS.SCHEMA.DONOR) {
      updatedUser = await Donor.findByIdAndUpdate(_id, updateFields, {
        new: true,
        runValidators: true,
      });
    } else if (role === CONSTANTS.SCHEMA.HOSPITAL) {
      updatedUser = await Hospital.findByIdAndUpdate(_id, updateFields, {
        new: true,
        runValidators: true,
      });
    } else if (role === CONSTANTS.SCHEMA.LABORATORY) {
      updatedUser = await Laboratory.findByIdAndUpdate(_id, updateFields, {
        new: true,
        runValidators: true,
      });
    }

    console.log("updated: ", updatedUser);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find({}).lean();
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donations", error });
  }
};

export const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find({}).lean();

    if (!hospitals.length) {
      return res.status(200).json({ message: "No hospitals found." });
    }

    res.status(200).json(hospitals);
  } catch (error) {
    console.error("Error fetching hospitals:", error);
    res
      .status(404)
      .json({ message: "Error fetching hospitals", error: error.message });
  }
};

export const getAllLabs = async (req, res) => {
  try {
    const labs = await Laboratory.find({}).lean();

    if (!labs.length) {
      return res.status(200).json({ message: "No Labs found." });
    }

    res.status(200).json(labs);
  } catch (error) {
    console.error("Error fetching Laboratories:", error);
    res
      .status(404)
      .json({ message: "Error fetching labs", error: error.message });
  }
};

export const getAllLabRequests = async (req, res) => {
  try {
    const { laboratoryId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(laboratoryId)) {
      return res.status(400).json({ message: "Invalid Laboratory ID format." });
    }
    const lab = await Laboratory.findOne({
      _id: new mongoose.Types.ObjectId(laboratoryId),
    });

    if (!lab) {
      return res.status(404).json({ message: "Lab not found." });
    }

    res.status(200).json({ appointments: lab.appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res
      .status(500)
      .json({ message: "Error fetching appointments", error: error.message });
  }
};

export const getDonationsByDonor = async (req, res) => {
  const { donorId } = req.params;

  try {
    const donations = await Donation.find({ donorId }).lean();

    if (donations.length === 0) {
      return res
        .status(404)
        .json({ message: "No donations found for this donor" });
    }

    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donations", error });
  }
};

export const getDonorAppointments = async (req, res) => {
  const { donorId } = req.params;

  try {
    const donor = await Donor.findById(donorId);
    const DonorAppointments = donor.appointments;

    if (DonorAppointments.length === 0) {
      return res
        .status(404)
        .json({ message: "No Appointments found" });
    }

    res.status(200).json(DonorAppointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donations", error });
  }
};

export const getDonationsByBloodGroup = async (req, res) => {
  const { bloodGroup } = req.params;

  try {
    const donations = await Donor.find(
      { "donations.bloodGroup": bloodGroup },
      { donations: 1, _id: 0 }
    ).lean();
    const matchingDonations = donations
      .map((donor) => donor.donations)
      .flat()
      .filter((donation) => donation.bloodGroup === bloodGroup);
    res.status(200).json(matchingDonations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donations", error });
  }
};

export const addBloodBankDetails = async (req, res) => {
  const { hospitalId } = req.params;
  const { bloodType, quantityInLiters } = req.body;

  try {
    const hospital = await Hospital.findById(hospitalId);

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }


    const existingBloodGroupIndex = hospital.bloodBank.findIndex(
      (entry) => entry.bloodType === bloodType
    );

    if (existingBloodGroupIndex !== -1) {
      if (quantityInLiters <= 0) {

        hospital.bloodBank.splice(existingBloodGroupIndex, 1);
      } else {

        hospital.bloodBank[existingBloodGroupIndex].quantityInLiters =
          quantityInLiters;
        hospital.bloodBank[existingBloodGroupIndex].lastUpdated = Date.now();
      }
    } else if (quantityInLiters > 0) {

      hospital.bloodBank.push({
        bloodType,
        quantityInLiters,
        lastUpdated: Date.now(),
      });
    }

    await hospital.save();

    res
      .status(200)
      .json({ message: "Blood bank details updated successfully" });
  } catch (error) {
    console.error("Error adding blood bank details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBloodBankDetails = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const hospital = await Hospital.findById(hospitalId).select("bloodBank");

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    console.log(hospital.bloodBank);
    res.status(200).json({
      bloodBank: hospital.bloodBank,
    });
  } catch (error) {
    console.error("Error fetching blood bank details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getHospitalRequests = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const hospital = await Hospital.findById(hospitalId).select(
      "requestsReceived"
    );

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    console.log(hospital.requestsReceived);
    res.status(200).json({
      requestsReceived: hospital.requestsReceived,
    });
  } catch (error) {
    console.error("Error fetching requests", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const makeDonationRequest = async (req, res) => {
  try {
    const { receiverId, donorId, donationId } = req.body;

    const receiver = await Reciever.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    const donor = await Donor.findById(donorId);
    if (!donor) {
      return res.status(404).json({ message: "Donor not found." });
    }

    const donation = await Donation.findById(donationId);
    if (!donor) {
      return res.status(404).json({ message: "Donotion not found." });
    }
    console.log(receiver, donor, donation);

    const newRequest = {
      receiverId,
      donorId,
      donationId,
      name: receiver.name,
      email: receiver.email,
      phone: receiver.phone,
      bloodGroup: donation.bloodGroup,
      city: receiver.city,
      donationType: donation.donationType,
      requestedAt: new Date(),
      status: CONSTANTS.STATUS.PENDING,
    };

    try {
      donor.requestsReceived.push(newRequest);
      await donor.save();
    } catch (error) {
      console.error("Error saving user:", error);
      return res
        .status(400)
        .json({ success: false, message: "Error saving user" });
    }

    receiver.requests.push(newRequest._id);
    await receiver.save();

    res
      .status(201)
      .json({ message: "Donation request sent successfully.", receiver });
  } catch (error) {
    console.error("Error sending donation request:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const makeDonationRequestfromHospital = async (req, res) => {
  try {
    const { receiverId, receiverName, bloodGroup, contactInfo } = req.body;
    const { hospitalId } = req.params;
    console.log(receiverId, receiverName, bloodGroup, hospitalId);

    const receiver = await Reciever.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found." });
    }

    console.log("Here");
    const newRequest = {
      receiverId,
      receiverName,
      bloodGroup,
      contactInfo,
      requestedAt: new Date(),
      status: CONSTANTS.STATUS.PENDING,
    };
    console.log("Her2");

    try {
      hospital.requestsReceived.push(newRequest);
      await hospital.save();
    } catch (error) {
      console.error("Error saving user:", error);
      return res
        .status(400)
        .json({ success: false, message: "Error saving user" });
    }
    res
      .status(201)
      .json({ message: "Donation request sent successfully.", receiver });
  } catch (error) {
    console.error("Error sending donation request:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const { laboratoryId } = req.params;
    const { donorId, category, date, timeslot, phone } = req.body;
    console.log("LabId:", laboratoryId);
    console.log("FormData:", donorId, category, date, timeslot, phone);

    const donor = await Donor.findById(donorId);
    if (!donor) {
      return res.status(404).json({ message: "Donor not found." });
    }

    const laboratory = await Laboratory.findById(laboratoryId);
    if (!laboratory) {
      return res.status(404).json({ message: "Laboratory not found." });
    }

    const appointmentNumber = randomUUID();
    const newAppointment = {
      donorId,
      category,
      date,
      timeslot,
      name: donor.name,
      email: donor.email,
      phone,
      appointmentId: appointmentNumber,
      labname: laboratory.name,
      labemail: laboratory.email,
      labphone : laboratory.phone,
    };

    try {
      laboratory.appointments.push(newAppointment);
      await laboratory.save();
      donor.appointments.push(newAppointment);
      await donor.save();
    } catch (error) {
      console.error("Error", error);
      return res
        .status(400)
        .json({ success: false, message: "Error saving user" });
    }
    res
      .status(201)
      .json({ message: "Donation request sent successfully.", laboratory });
  } catch (error) {
    console.error("Error sending donation request:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getDonorRequests = async (req, res) => {
  try {
    const { donorId } = req.params;

    const donor = await Donor.findById(donorId);

    if (!donor) {
      return res
        .status(404)
        .json({ success: false, message: "Donor not found" });
    }

    res.status(200).json({ success: true, data: donor.requestsReceived || [] });
  } catch (error) {
    console.error("Error fetching donor requests:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const makeDonationRequesttoHospital = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const { receiverId, receiverName, bloodGroup, contactInfo, city } =
      req.body;

    if (!mongoose.Types.ObjectId.isValid(hospitalId)) {
      return res.status(400).json({ message: "Invalid Hospital ID." });
    }

    const hospital = await Donor.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found." });
    }

    const newRequest = {
      receiverId,
      receiverName,
      bloodGroup,
      contactInfo,
      city,
      requestedAt: new Date(),
      status: "pending",
    };


    hospital.requestsReceived.push(newRequest);

    await hospital.save();

    res.status(201).json({ message: "Donation request sent successfully." });
  } catch (error) {
    console.error("Error sending donation request:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const filterDonation = async (req, res) => {

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
};
