const Listing = require("../Models/ListingSchema.js");
const User= require("../Models/UserSchema.js")
const Admin= require("../Models/AdminSchema.js");

module.exports.adminForm= async(req,res,next)=>{
    res.render("./Users/adminLogin.ejs");
}

module.exports.adminDashboard= async(req, res, next)=>{
    const agents= await User.find({role:"Agent"});
    const listings= await Listing.find({}).populate("owner").populate("agent");
    const soldListings= await Listing.find({currStatus:"sold"}).populate("owner").populate("agent");
    res.render("./Users/admin.ejs",{agents, listings, soldListings});
}