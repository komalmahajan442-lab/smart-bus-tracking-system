import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
type:String,
required:true,
    },
    email:{
type:String,
required:true,
unique:true,
    },
    password:{
type:String,
required:true,
min:8,
    },
    role:{
type:String,
enum:["admin","driver","student"],
required:true,
    }, 
    status:{
type:String,
enum:["approved","pending","rejected"],
default:"pending",
    },
    phoneno:{
        type:String,
        minlength:10,maxlength:10,
    },
    assignedbus:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Bus",
    },
    pickupstop:{
type:mongoose.Schema.Types.ObjectId,
ref:"Stop"
},
pickupStatus: {
  type: String,
  enum: ["pending", "picked"],
  default: "pending"
}
},{timestamps:true});

const User=mongoose.model("User",userSchema);

export default User;