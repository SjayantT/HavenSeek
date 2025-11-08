const express= require("express");
const app= express();
const port = process.env.port || 3000;
const path= require("path");
const bodyParser= require("body-parser");
const mongoose= require("mongoose");
const mongodb= require("mongodb");
const dotenv= require("dotenv").config();
const override= require("method-override");
const PDFDocument= require("pdfkit");


const engine= require("ejs-mate");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}));
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.use(express.json());
app.use(override("_method"));

// Schema
const Listing= require("./Models/ListingSchema.js");
const Review= require("./Models/ReviewSchema.js");
const User= require("./Models/UserSchema.js")
const Admin= require("./Models/AdminSchema.js");


// session
const session= require("express-session");
app.use(session({secret:"BlackDog", resave:false, saveUninitialized:true}));

//flash
const flash= require("connect-flash");
app.use(flash());

// passport
const passport= require("passport");
const localStrategy= require("passport-local");
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.currUser= req.user;
    next();
});

//router
const ListingRouter= require("./Routes/Listing.js")
// const ReviewRouter= require("./Routes/Review.js");
const UserRouter= require("./Routes/User.js");
app.use("/", ListingRouter);
// app.use("/listings", ReviewRouter);
app.use("/user", UserRouter);

const AdminRouter= require("./Routes/Admin.js");
app.use("/admin", AdminRouter);



startServer().then(()=>{
    app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
    });
}).catch((err)=>{
    console.log("Error in connectiong to db.",err);
})

async function startServer(){
    await mongoose.connect(process.env.DB_URL);
}


