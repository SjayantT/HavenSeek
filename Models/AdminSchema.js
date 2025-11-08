const mongoose = require("mongoose");
const { type } = require("os");
const {Schema}= mongoose;
const passportLocalMongoose= require("passport-local-mongoose");

const AdminSchema= new Schema({
    username:{
        type:String,
        required:true,
    }
});
AdminSchema.plugin(passportLocalMongoose);
const Admin= mongoose.model("Admin", AdminSchema);
module.exports=Admin;