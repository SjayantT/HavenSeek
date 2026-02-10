const express= require("express");
const router= express.Router();
const UserController= require("../Controller/UserController.js");
const User= require("../Models/UserSchema.js");
const Listing = require("./Listing.js");
const passport = require("passport");
const strategy= require("passport-local")
const otpController= require("../Controller/OtpController.js");

// const nodemailer = require('nodemailer');
// const crypto = require('crypto');
// const otpController= require("../Controller/OtpController.js");



router.get("/signup", UserController.signupForm);

router.post("/signup", UserController.signup);

router.get("/login", UserController.loginForm);

router.post("/login", passport.authenticate("local",{failureRedirect:"/login", failureFlash:true}), UserController.login);

router.get("/logout", UserController.logout);


router.post("/admin/assign-agent", UserController.assignAgentToListing);

router.get("/:id/profile", UserController.userProfile);

router.get("/:id/agent", UserController.agentDashboard);

router.put("/:id/update/user-profile", UserController.updateProfile);

router.post("/:id/update/user-password", UserController.updatePassword);



// // Configure Nodemailer (Gmail example)
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'havenseekpvt@gmail.com', // Your email
//         pass: process.env.MAIL_PASSWORD     // Your app password
//     }
// });

// // Store OTPs temporarily (use Redis in production)
// const otpStore = {};

router.post("/send-otp", otpController.sendOtp);
router.post("/verify-otp", otpController.verifyOtp);

module.exports= router;