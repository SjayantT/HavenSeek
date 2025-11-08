const express= require("express");
const router= express.Router({mergeParams:true});
const ListingContoller= require("../Controller/ListingController.js");
const Listing = require("../Models/ListingSchema.js");
const multer=require("multer");
const {storage}= require("../CloudConfig.js");
const upload = multer({storage});

const isAuthenticated=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error", "You must be logged-in for further process.");
        return res.redirect("/user/login");
    }
    next();
}

router.get("/", ListingContoller.homePage);

router.get("/listings", isAuthenticated ,ListingContoller.ListingPage);

router.get("/listings/new", isAuthenticated ,ListingContoller.newListingForm);

router.get("/listings/filter/:id", isAuthenticated, ListingContoller.filterByCategory);

router.post("/listings/new", isAuthenticated , upload.single("image") ,ListingContoller.saveNewListing);

router.post("/listings/filter", isAuthenticated, ListingContoller.filterListings);

router.get("/listings/:id", isAuthenticated, ListingContoller.showListing);

// router.get("/listings/:id/edit", isAuthenticated, ListingContoller.editListingForm);

router.post("/listings/:id/update-status", isAuthenticated, ListingContoller.updateStatus);

router.get("/listings/:id/delete", isAuthenticated, ListingContoller.deleteListing);

router.get("/listings/filter/:id", isAuthenticated, ListingContoller.filterByCategory);

router.get("/terms&condition", ListingContoller.termsCondition);

router.get("/listings/:id/download-pdf", isAuthenticated, ListingContoller.downloadPDF);



module.exports= router;