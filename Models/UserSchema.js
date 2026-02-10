const mongoose = require("mongoose");
const { type } = require("os");
const {Schema}= mongoose;
const passportLocalMongoose= require("passport-local-mongoose");

const UserSchema= new Schema({
    name:{
        type:String,
        required: true
    },
    username:{
        type:String,
        required:true,
    },
    bio:{
        type:String,
        default:"Hey there! I am using HavenSeek."
    },
    role:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    mobile:{
        type:Number,
        required:true
    },
    aadhar:{
        type:Number,
        required:true
    },
    location:{
        type:String, 
        required: true
    },
    createdAt:{
        type:String,
        required:true
    }
});

UserSchema.plugin(passportLocalMongoose);
const User= mongoose.model("User", UserSchema);
module.exports=User;
