const User =
 require("../models/User");

const Portfolio =
 require("../models/Portfolio");

const bcrypt =
 require("bcryptjs");

const jwt =
 require("jsonwebtoken");

const crypto =
 require("crypto");


/*
====================================
 EMAIL VALIDATION
====================================
*/

const validateEmail =
 (email) => {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
   .test(email);

};


/*
====================================
 PASSWORD VALIDATION
====================================
*/

const validatePassword =
 (password) => {

  /*
   Minimum 8 chars
   Uppercase
   Lowercase
   Number
   Special char
  */

  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]{8,}$/
   .test(password);

};


/*
====================================
 OTP STORE (in-memory)
====================================
*/

// For production, move this to MongoDB (e.g. a passwordResets
// collection) or Redis with a TTL index — in-memory storage
// resets on server restart and won't scale across instances.
const otpStore = new Map(); // key: email, value: { otp, expiresAt, verified }

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};


/*
====================================
 SIGNUP
====================================
*/

exports.signup =
 async (req, res) => {

  try {

   let {

    name,
    email,
    password,

   } = req.body;


   /*
   ====================================
   TRIM INPUTS
   ====================================
   */

   name =
    name?.trim();

   email =
    email
     ?.trim()
     .toLowerCase();

   password =
    password?.trim();


   /*
   ====================================
   VALIDATE FIELDS
   ====================================
   */

   if (
    !name ||
    !email ||
    !password
   ) {

    return res.status(400).json({

     message:
      "All fields are required",

    });

   }


   /*
   ====================================
   EMAIL VALIDATION
   ====================================
   */

   if (
    !validateEmail(email)
   ) {

    return res.status(400).json({

     message:
      "Invalid email format",

    });

   }


   /*
   ====================================
   PASSWORD VALIDATION
   ====================================
   */

   if (
    !validatePassword(password)
   ) {

    return res.status(400).json({

     message:
      "Password must contain uppercase, lowercase, number, special character and minimum 8 characters",

    });

   }


   /*
   ====================================
   CHECK EXISTING USER
   ====================================
   */

   const existingUser =
    await User.findOne({

     email,

    });


   if (existingUser) {

    return res.status(400).json({

     message:
      "User already exists",

    });

   }


   /*
   ====================================
   HASH PASSWORD
   ====================================
   */

   const hashedPassword =
    await bcrypt.hash(
     password,
     10
    );


   /*
   ====================================
   CREATE USER
   ====================================
   */

   const user =
    await User.create({

     name,
     email,

     password:
      hashedPassword,

    });


   /*
   ====================================
   CREATE EMPTY PORTFOLIO
   ====================================
   */

   await Portfolio.create({

    user:
     user._id,

    balance: 0,

    investedAmount: 0,

    totalProfit: 0,

    holdings: [],

   });


   /*
   ====================================
   RESPONSE
   ====================================
   */

   res.status(201).json({

    message:
     "User registered successfully",

   });

  } catch (error) {

   console.log(
    "SIGNUP ERROR:"
   );

   console.log(error);


   res.status(500).json({

    message:
     "Signup failed",

   });

  }

};


/*
====================================
 LOGIN
====================================
*/

exports.login =
 async (req, res) => {

  try {

   let {

    email,
    password,

   } = req.body;


   /*
   ====================================
   TRIM INPUTS
   ====================================
   */

   email =
    email
     ?.trim()
     .toLowerCase();

   password =
    password?.trim();


   /*
   ====================================
   VALIDATE FIELDS
   ====================================
   */

   if (
    !email ||
    !password
   ) {

    return res.status(400).json({

     message:
      "Email and password are required",

    });

   }


   /*
   ====================================
   FIND USER
   ====================================
   */

   const user =
    await User.findOne({

     email,

    });


   if (!user) {

    return res.status(400).json({

     message:
      "Invalid credentials",

    });

   }


   /*
   ====================================
   COMPARE PASSWORD
   ====================================
   */

   const isMatch =
    await bcrypt.compare(

     password,
     user.password

    );


   if (!isMatch) {

    return res.status(400).json({

     message:
      "Invalid credentials",

    });

   }


   /*
   ====================================
   GENERATE TOKEN
   ====================================
   */

   const token =
    jwt.sign(

     {
      id: user._id,
     },

     process.env.JWT_SECRET,

     {
      expiresIn: "7d",
     }

    );


   /*
   ====================================
   RESPONSE
   ====================================
   */

   res.status(200).json({

    message:
     "Login successful",

    token,

    user: {

     id:
      user._id,

     name:
      user.name,

     email:
      user.email,

    },

   });

  } catch (error) {

   console.log(
    "LOGIN ERROR:"
   );

   console.log(error);


   res.status(500).json({

    message:
     "Login failed",

   });

  }

};


/*
====================================
 FORGOT PASSWORD — send OTP
====================================
*/

exports.forgotPassword =
 async (req, res) => {

  try {

   let { email } = req.body;

   email =
    email
     ?.trim()
     .toLowerCase();

   if (!email) {

    return res.status(400).json({

     message:
      "Email is required",

    });

   }

   const user =
    await User.findOne({ email });

   if (!user) {

    // Don't reveal whether the email exists,
    // to avoid account enumeration
    return res.status(200).json({

     message:
      "If this email exists, an OTP has been sent",

    });

   }

   const otp = generateOtp();

   otpStore.set(email, {

    otp,

    expiresAt:
     Date.now() + OTP_EXPIRY_MS,

    verified: false,

   });

   // TODO: send OTP via your email service
   // (nodemailer, SendGrid, etc.)
   console.log(`OTP for ${email}: ${otp}`); // remove in production

   res.status(200).json({

    message:
     "OTP sent to your email",

   });

  } catch (error) {

   console.log(
    "FORGOT PASSWORD ERROR:"
   );

   console.log(error);

   res.status(500).json({

    message:
     "Failed to send OTP",

   });

  }

};


/*
====================================
 VERIFY OTP
====================================
*/

exports.verifyOtp =
 async (req, res) => {

  try {

   let { email, otp } = req.body;

   email =
    email
     ?.trim()
     .toLowerCase();

   if (!email || !otp) {

    return res.status(400).json({

     message:
      "Email and OTP are required",

    });

   }

   const record =
    otpStore.get(email);

   if (!record) {

    return res.status(400).json({

     message:
      "No OTP request found. Please request a new one.",

    });

   }

   if (Date.now() > record.expiresAt) {

    otpStore.delete(email);

    return res.status(400).json({

     message:
      "OTP has expired. Please request a new one.",

    });

   }

   if (record.otp !== otp) {

    return res.status(400).json({

     message:
      "Invalid OTP",

    });

   }

   record.verified = true;

   otpStore.set(email, record);

   res.status(200).json({

    message:
     "OTP verified",

   });

  } catch (error) {

   console.log(
    "VERIFY OTP ERROR:"
   );

   console.log(error);

   res.status(500).json({

    message:
     "Failed to verify OTP",

   });

  }

};


/*
====================================
 RESET PASSWORD
====================================
*/

exports.resetPassword =
 async (req, res) => {

  try {

   let {
    email,
    otp,
    newPassword,
   } = req.body;

   email =
    email
     ?.trim()
     .toLowerCase();

   newPassword =
    newPassword?.trim();

   if (!email || !otp || !newPassword) {

    return res.status(400).json({

     message:
      "Email, OTP and new password are required",

    });

   }

   if (!validatePassword(newPassword)) {

    return res.status(400).json({

     message:
      "Password must contain uppercase, lowercase, number, special character and minimum 8 characters",

    });

   }

   const record =
    otpStore.get(email);

   if (!record || record.otp !== otp || !record.verified) {

    return res.status(400).json({

     message:
      "OTP verification required before resetting password",

    });

   }

   if (Date.now() > record.expiresAt) {

    otpStore.delete(email);

    return res.status(400).json({

     message:
      "OTP has expired. Please request a new one.",

    });

   }

   const user =
    await User.findOne({ email });

   if (!user) {

    return res.status(404).json({

     message:
      "User not found",

    });

   }

   user.password =
    await bcrypt.hash(newPassword, 10);

   await user.save();

   otpStore.delete(email); // OTP is single-use

   res.status(200).json({

    message:
     "Password reset successful",

   });

  } catch (error) {

   console.log(
    "RESET PASSWORD ERROR:"
   );

   console.log(error);

   res.status(500).json({

    message:
     "Failed to reset password",

   });

  }

};