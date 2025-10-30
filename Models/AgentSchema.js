const mongoose= require("mongoose");
const { type } = require("os");
const {Schema}= mongoose;

const AgentSchema= new Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    mobile:{
        type:Number,
        required:true
    },
    
})