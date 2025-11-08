const express= require("express");
const router= express.Router();
const AdminController= require("../Controller/AdminController.js");
const Admin= require("../Models/AdminSchema.js");
const Listing = require("./Listing.js");
const passport = require("passport");
const strategy= require("passport-local");

router.get("/", AdminController.adminForm);

router.post("/", passport.authenticate("local",{failureRedirect:"/admin", failureFlash:true}), AdminController.adminDashboard);




module.exports= router;