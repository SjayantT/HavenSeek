const mongoose= require("mongoose");
const { type } = require("os");
const {Schema}= mongoose;

const ListingSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    size:{
        type: String,
        required:true
    },
    purpose:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
    },
    area:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    pincode:{
        type:Number,
        required:true
    },
    image:{
        filename:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews:[{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
});

const Listing= mongoose.model("Listing", ListingSchema);
module.exports= Listing;