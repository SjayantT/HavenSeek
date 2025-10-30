const mongoose= require("mongoose");
const { describe } = require("node:test");
const { ref } = require("process");
const {Schema}= mongoose;

const ReviewSchema= new Schema({
    rating:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

const Review= mongoose.model("Review", ReviewSchema);
module.exports= Review;