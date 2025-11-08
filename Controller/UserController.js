const User= require("../Models/UserSchema.js");
const Listing = require("../Models/ListingSchema.js");
const Admin= require("../Models/AdminSchema.js");
const bcrypt = require('bcrypt');

module.exports.signupForm= (req,res,next)=>{
    res.render("./Users/signup.ejs");
}

module.exports.signup= async(req,res)=>{
    const {name, username, email, mobile,aadhar,role, password}= req.body;
    const createdAt = new Date().toISOString();
    let newUser= new User({name, username, email, mobile, aadhar,role, createdAt});
    const savedUser= await User.register(newUser, password);
    req.login(newUser, (err)=>{
        if(err){
            return req.flash("error", "Login falied!");
        }
        req.flash("success", `Welcome ${name}.`);
        res.redirect("/");
    });
}

module.exports.loginForm= (req, res, next)=>{
    res.render("./Users/login.ejs");
}

module.exports.login= async(req,res,next)=>{
    req.flash("success", `Welcome ${req.body.username}`);
    res.redirect("/");
}

module.exports.logout= async(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return req.flash("error", "Logout failed!");
        }
        req.flash("success", "Logout successfully.")
        res.redirect("/");
    })
}

module.exports.userProfile= async(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error", "You must be logged in first!");
        return res.redirect("/user/login");
    }
    const {id} = req.params;
    const user= await User.findById(id);
    if(!user){
        req.flash("error", "Something went wrong!");
        return res.redirect("/");
    }
    const listings = await Listing.find({owner: id});
    if(!listings){
        req.flash("error", "Something went wrong!");
    }
    res.render("./Users/UserProfile.ejs", {user, listings});
}

module.exports.updateProfile= async(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error", "You must be logged in first!");
        return res.redirect("/user/login");
    }
    const {name, username, mobile, bio} = req.body;
    const id= req.params.id;
    const user= await User.findByIdAndUpdate(id, {name, username, bio, mobile});
    if(!user){
        req.flash("error", "Something went wrong!");
        res.redirect(`/listings`)
        return;
    }
    res.redirect(`/user/${id}/profile`);
}

module.exports.updatePassword= async(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error", "You must be logged in first!");
        return res.redirect("/user/login");
    }
    const {password, newPassword, confirmPassword}= req.body;
    const {id}= req.params;
    const user= await User.findById(id);
    if(!user){
        req.flash("error", "something went wrong!")
        return res.redirect(`user/${id}/profile`);
    }
    if(newPassword !== confirmPassword){
        req.flash("error", "New password and confirm password didn't match!");
        return res.redirect(`user/${id}/profile`);
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if(!isMatched){
        req.flash("error", "Current password is incorrect!");
        return res.redirect(`user/${id}/profile`);
    }
    const salt= await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(newPassword, salt);
    user.password= hashedPassword;
    await user.save();
    req.flash("success", "Password updated Successfully.")
}



module.exports.assignAgentToListing= async(req,res,next)=>{
    const { propertyId, agentId }= req.body;
    const listing= Listing.findById(propertyId);
    if(!listing){
        req.flash("error", "Listing not found!");
        return res.redirect("/user/admin");
    }
    await listing.updateOne({agent: agentId});
    console.log("saved");
     res.json({
      success: success,
      message: "Agent assigned successfully"
    });
}

module.exports.agentDashboard= async(req, res, next)=>{
    if(!req.isAuthenticated()){
        req.flash("error", "You must be logged in as an agent profile!");
        return res.redirect("/user/login");
    }
    const id= req.params.id;
    const listings = await Listing.find({agent: id});
    res.render("./Users/propertyManagement.ejs", {listings});
}

