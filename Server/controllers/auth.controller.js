import bcryptjs from "bcryptjs";
import { Donor, Donation } from "../models/donor.model.js";
import { Reciever } from "../models/reciever.model.js";
import { Hospital } from "../models/hospital.model.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sendWelcomeEmail } from "../utils/sendWelcomeEmail.js";
import { sendOTPverificationEmail } from "../utils/sendOTPverificationEmail.js";
import { generateJWTandSetCookie } from "../utils/generateJWTandSetCookie.js";
import multer from "multer";
import { MongoClient } from "mongodb";
import { GridFSBucket } from "mongodb";
import { Lab } from "../models/lab.model.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

export const signup = async (request, response) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    selectedRole,
    bloodGroup,
    gender,
    city,
    pincode,
  } = request.body;

  console.table({
    "First Name": firstName,
    "Last Name": lastName,
    Email: email,
    Phone: phone,
    Role: selectedRole,
    "Blood Group": bloodGroup,
    Gender: gender,
    City: city,
    Pincode: pincode,
  });

  try {
    // Ensure all fields are present
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !password ||
      !selectedRole ||
      !bloodGroup ||
      !gender ||
      !city ||
      !pincode
    ) {
      throw new Error("All fields are required");
    }

    let UserModel = selectedRole === "donor" ? Donor : Reciever;

    console.log("Here1");
    const alreadyExists = await UserModel.findOne({ email });
    if (alreadyExists) {
      return response.status(400).json({
        success: false,
        message: "User  already exists!",
      });
    }

    console.log("Here2");
    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);
    const OTP = generateOTP();

    console.log("Here3");
    // Create the new user or donor
    const newUser =
      selectedRole === "donor"
        ? new Donor({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            bloodGroup,
            gender,
            city,
            pincode,
            verificationToken: OTP,
            verificationTokenExpiresAt: Date.now() + 10 * 60 * 1000,
          })
        : new Reciever({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            bloodGroup,
            gender,
            city,
            pincode,
            verificationToken: OTP,
            verificationTokenExpiresAt: Date.now() + 10 * 60 * 1000,
          });

    console.log("Here4");
    try {
      // Save the user or donor
      await newUser.save();
      console.log("Here5");
    } catch (error) {
      console.log("Error saving user:", error);
      return response
        .status(400)
        .json({ success: false, message: "Error saving user" });
    }

    // Generate JWT and set cookie
    generateJWTandSetCookie(response, newUser._id);

    console.log("Here6");
    // Send OTP verification email
    sendOTPverificationEmail(firstName, email, OTP);
    console.log("Here7");

    // Return success response
    response.status(201).json({
      success: true,
      message: "User  created successfully",
      user: {
        ...newUser._doc,
        password: undefined, // Exclude password from the response
      },
    });
  } catch (error) {
    response.status(400).json({ success: false, message: error.message });
  }
};

export const healthCareSignup = async (request, response) => {
  const { name, email, phone, password, address, city, pincode, selectedRole } =
    request.body;

  console.table({
    Name: name,
    Email: email,
    Phone: phone,
    Address: address,
    City: city,
    Role: selectedRole,
    Pincode: pincode,
  });

  try {
    // Ensure all fields are present
    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !selectedRole ||
      !address ||
      !city ||
      !pincode
    ) {
      throw new Error("All fields are required");
    }
    console.log("Here1");
    let UserModel = selectedRole === "Hospital" ? Hospital : Lab;
    const alreadyExists = await UserModel.findOne({ email });
    console.log("Here2");
    if (alreadyExists) {
      return response.status(400).json({
        success: false,
        message: "User  already exists!",
      });
    }
    console.log("Here3");
    const hashedPassword = await bcryptjs.hash(password, 10);
    const OTP = generateOTP();
    // Create the new hospital
    const newHealthcare =
      selectedRole === "Hospital"
        ? new Hospital({
            name,
            email,
            phone,
            password: hashedPassword,
            address,
            city,
            pincode,
            verificationToken: OTP,
            verificationTokenExpiresAt: Date.now() + 10 * 60 * 1000,
          })
        : new Lab({
            name,
            email,
            phone,
            password: hashedPassword,
            address,
            city,
            pincode,
            verificationToken: OTP,
            verificationTokenExpiresAt: Date.now() + 10 * 60 * 1000,
          });

    try {
      await newHealthcare.save();
    } catch (error) {
      console.log("Error saving hospital:", error);
      return response
        .status(400)
        .json({ success: false, message: "Error saving hospital" });
    }

    generateJWTandSetCookie(response, newHealthcare._id);
    sendOTPverificationEmail(name, email, OTP);

    response.status(201).json({
      success: true,
      message: "Hospital created successfully",
      hospital: {
        ...newHealthcare._doc,
        password: undefined, // Exclude password from the response
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
    if (role === "donor") {
      UserModel = Donor;
    } else if (role === "reciever") {
      UserModel = Reciever;
    } else if (role === "Hospital") {
      UserModel = Hospital;
    } else if (role === "Laboratory") {
      UserModel = Lab;
    }

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
    const userName = user.firstName;
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
  const { email, password, role } = request.body;
  console.log(email, password, role);
  try {
    let UserModel;
    if (role === "donor") {
      UserModel = Donor;
    } else if (role === "reciever") {
      UserModel = Reciever;
    } else if (role === "Hospital" || role === "hospital") {
      UserModel = Hospital;
    } else if (role === "Laboratory" || role === "laboratory") {
      UserModel = Lab;
    }
    const user = await UserModel.findOne({ email });
    if (!user)
      return response
        .status(400)
        .json({ success: false, message: "User doesn't exist!" });

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid)
      return response
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

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
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

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
    // console.log("Error in checkAuth ", error);
    response.status(400).json({ success: false, message: error.message });
  }
};

export const addDonation = async (req, res) => {
  const {
    donorId,
    donationType,
    city,
    address,
    pincode,
    bloodGroup,
    quantity,
  } = req.body;

  console.log("Request Body:", req.body); // Debugging log for request data

  try {
    // Find the donor by ID
    const donor = await Donor.findById(donorId);
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    console.log("Donor found:", donor); // Debugging log for donor found

    const donation = new Donation({
      donorId,
      donationType,
      address,
      city,
      pincode,
      bloodGroup,
      quantity,
      postedBy: donor.firstName,
    });

    await donation.save();
    donor.donations.push(donation._id);
    await donor.save();

    res.status(201).json({ message: "Donation added successfully", donation });
  } catch (error) {
    console.error("Error adding donation:", error); // Detailed error logging
    res
      .status(500)
      .json({ message: "Error adding donation", error: error.message });
  }
};

export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find({}).lean(); // Fetch all donations
    res.status(200).json(donations); // Return all donations
  } catch (error) {
    res.status(500).json({ message: "Error fetching donations", error });
  }
};

export const getDonationsByDonor = async (req, res) => {
  const { donorId } = req.params; // Get donorId from request parameters

  try {
    // Fetch donations for the specified donor
    const donations = await Donation.find({ donorId }).lean();

    // Check if donations exist
    if (donations.length === 0) {
      return res
        .status(404)
        .json({ message: "No donations found for this donor" });
    }

    res.status(200).json(donations); // Return donations
  } catch (error) {
    res.status(500).json({ message: "Error fetching donations", error });
  }
};

// Get donations by blood group
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
  const { hospitalId } = req.params; // Assuming hospitalId is passed as a parameter
  const { bloodGroup, quantityInLiters } = req.body;

  try {
    const hospital = await Hospital.findById(hospitalId);

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    // Check if blood group already exists in bloodBank.bloodGroups
    const existingBloodGroupIndex = hospital.bloodBank.bloodGroups.findIndex(
      (bg) => bg.bloodGroup === bloodGroup
    );

    if (existingBloodGroupIndex !== -1) {
      // Update existing entry
      hospital.bloodBank.bloodGroups[existingBloodGroupIndex].quantityInLiters = quantityInLiters;
      hospital.bloodBank.bloodGroups[existingBloodGroupIndex].lastUpdated = Date.now();
    } else {
      // Add new entry
      hospital.bloodBank.bloodGroups.push({
        bloodGroup,
        quantityInLiters,
        lastUpdated: Date.now(),
      });
    }

    await hospital.save();

    res.status(200).json({ message: 'Blood bank details updated successfully' });
  } catch (error) {
    console.error('Error adding blood bank details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateBloodBankQuantities = async (req, res) => {
  console.log('Received request to update blood bank quantities');
  console.log('Request body:', req.body);

  const { hospitalId } = req.params;
  const { bloodGroupQuantities } = req.body;

  if (!bloodGroupQuantities) {
    console.log('Invalid request body: missing bloodGroupQuantities property');
    return res.status(400).json({ message: 'Invalid request body: missing bloodGroupQuantities property' });
  }

  // Validate bloodGroupQuantities object
  const requiredProperties = ['Aplus', 'Aminus', 'Bplus', 'Bminus', 'ABplus', 'ABminus', 'Oplus', 'Ominus'];
  if (!requiredProperties.every(property => Object.prototype.hasOwnProperty.call(bloodGroupQuantities, property))) {
    console.log('Invalid request body: missing required properties');
    return res.status(400).json({ message: 'Invalid request body: missing required properties' });
  }

  if (!Object.values(bloodGroupQuantities).every(value => typeof value === 'number' && value >= 0)) {
    console.log('Invalid request body: invalid values');
    return res.status(400).json({ message: 'Invalid request body: invalid values' });
  }

  try {
    console.log('Finding hospital by ID:', hospitalId);
    const hospital = await Hospital.findById(hospitalId);

    if (!hospital) {
      console.log('Hospital not found');
      return res.status(404).json({ message: 'Hospital not found' });
    }

    console.log('Updating blood bank quantities');

    // Initialize bloodBank object with default values if not already initialized
    if (!hospital.bloodBank) {
      hospital.bloodBank = {
        Aplus: { quantityInLiters: 0, lastUpdated: Date.now },
        Aminus: { quantityInLiters: 0, lastUpdated: Date.now },
        Bplus: { quantityInLiters: 0, lastUpdated: Date.now },
        Bminus: { quantityInLiters: 0, lastUpdated: Date.now },
        ABplus: { quantityInLiters: 0, lastUpdated: Date.now },
        ABminus: { quantityInLiters: 0, lastUpdated: Date.now },
        Oplus: { quantityInLiters: 0, lastUpdated: Date.now },
        Ominus: { quantityInLiters: 0, lastUpdated: Date.now },
      };
    }

    hospital.bloodBank.Aplus.quantityInLiters = bloodGroupQuantities.Aplus;
    hospital.bloodBank.Aplus.lastUpdated = Date.now();

    hospital.bloodBank.Aminus.quantityInLiters = bloodGroupQuantities.Aminus;
    hospital.bloodBank.Aminus.lastUpdated = Date.now();

    hospital.bloodBank.Bplus.quantityInLiters = bloodGroupQuantities.Bplus;
    hospital.bloodBank.Bplus.lastUpdated = Date.now();

    hospital.bloodBank.Bminus.quantityInLiters = bloodGroupQuantities.Bminus;
    hospital.bloodBank.Bminus.lastUpdated = Date.now();

    hospital.bloodBank.ABplus.quantityInLiters = bloodGroupQuantities.ABplus;
    hospital.bloodBank.ABplus.lastUpdated = Date.now();

    hospital.bloodBank.ABminus.quantityInLiters = bloodGroupQuantities.ABminus;
    hospital.bloodBank.ABminus.lastUpdated = Date.now();

    hospital.bloodBank.Oplus.quantityInLiters = bloodGroupQuantities.Oplus;
    hospital.bloodBank.Oplus.lastUpdated = Date.now();

    hospital.bloodBank.Ominus.quantityInLiters = bloodGroupQuantities.Ominus;
    hospital.bloodBank.Ominus.lastUpdated = Date.now();

    console.log('Saving hospital document');
    await hospital.save();

    console.log('Returning success response');
    res.status(200).json({ message: 'Blood bank quantities updated successfully' });
  } catch (error) {
    console.error('Error updating blood bank quantities:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBloodBankDetails = async (req, res) => {
  try {
    const { hospitalId } = req.params;

    // Find the hospital by ID and select the bloodBank data
    const hospital = await Hospital.findById(hospitalId).select('bloodBank');

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    // Send the blood bank details in the response
    res.status(200).json({
      bloodBank: hospital.bloodBank,
    });
  } catch (error) {
    console.error('Error fetching blood bank details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

