import mongoose from "mongoose";

export const busSchema=new mongoose.Schema({
    busnumber:{
        type:String,
        required:true,
    },
    capacity:{
        type:Number,
    },
    
    route:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Route",
    },
    currentlocation:{
        type:{
        type:String,
        default:"Point",
    },
    coordinates:{
        type:[Number],
        default:[0,0],
    }},
    starttrip:{
type:String,
enum:["not_started","started","ended"],
default:"not_started",
    },
    tripstarttime:Date,
    tripendtime:Date,
    isActive:{
        type:Boolean,
        default:true,
    }
},{timestamps:true});

busSchema.index({currentlocation:"2dsphere"});

const Bus=mongoose.model("Bus",busSchema);

export default Bus;