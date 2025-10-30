
const Listing= require("../Models/ListingSchema.js");

module.exports.homePage= async(req,res)=>{
    const listing= await Listing.find();
    res.render("./Listings/index.ejs", {listing});
};

module.exports.ListingPage= async(req,res)=>{
    let user= null;
    if(req.user){
        user=req.user;
    }
    const data= await Listing.find();
    res.render("./Listings/listingHome.ejs", {listings:data, user});
}

module.exports.newListingForm= async(req,res)=>{
    res.render("./Listings/listingForm.ejs");
}

module.exports.saveNewListing= async(req,res)=>{
    const {title, description, type, size, purpose, price, area, city, state, pincode,}=req.body;
    let url= req.file.path;
    let filename= req.file.filename;
    const newListing= new Listing({
        title:title,
        description:description,
        type:type,
        size:size,
        purpose:purpose,
        price:price,
        area:area,
        city:city,
        state:state,
        pincode:pincode
    });
    newListing.image.filename=filename;
    newListing.image.url=url;
    newListing.owner=req.user;
    const savedListing=await newListing.save();
    req.flash("success", "Property was listed successfully");
    res.redirect("/listings")
}

module.exports.showListing= async(req,res)=>{
    const id= req.params.id;
    const listing= await Listing.findById(id).populate("owner");
    if(!listing){
        req.flash("error", "Property not found!");
        return res.redirect("/listings");
    }
    res.render("./Listings/show.ejs",{listing});
}

module.exports.termsCondition= async(req,res)=>{
    res.render("./Listings/terms&conditions.ejs");
}

module.exports.filterListings= async(req,res)=>{
    const {city, state, min_price, max_price}= req.body;
    const filter={};
    if(city && city.trim() !== ""){
        filter.city=city;
    }
    if(state && state.trim() !== ""){
        filter.state=state;
    }
    filter.price={
        $gte: min_price ? Number(min_price) : 0,
        $lte: max_price ? Number(max_price) : Number.MAX_SAFE_INTEGER
    }
    const listings= await Listing.find(filter);
    if(listings.length==0){
        req.flash("error", "No properties found.");
        return res.redirect("/listings")
    }
    res.render("./Listings/listingHome.ejs", {listings});
}

