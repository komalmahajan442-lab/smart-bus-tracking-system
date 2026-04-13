import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register=async(req,res)=>{
    try{
const {name,email,password,role}=req.body;

if(!name || !email || !password || !role){
    return res.status(400).json({message:"All fields are required"});
}

const user= await User.findOne({email});

if(user){
    return res.status(400).json({message:"User already registered"});
}

const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if(!emailRegex.test(email)){
    return res.status(400).json({message:"Invalid Email"});
}

const hashedPassword=await bcrypt.hash(password,10);


const newUser=new User({
name,
email,
password:hashedPassword,
role,
});

await newUser.save();

return res.json({message:"User registered sucessfully",data:newUser});
    }catch(err){
return res.status(500).json({message:err.message});
    }
};

export const login=async(req,res)=>{
    try{
const {email,password,role}=req.body;

if(!email || !password || !role){
     return res.status(400).json({message:"All fields are required"});
}


const user= await User.findOne({email});

if(!user){
    return res.status(404).json({message:"User not found"});
}

if(user.status === "pending" || user.status==="rejected"){
    return res.status(400).json({message:`user is not approved by admin`});
}

const isMatched=await bcrypt.compare(password,user.password);

if(!isMatched){
    return res.status(400).json({message:"Please check your email or password"});
}

if (user.role === "driver" && !user.assignedbus) {
  return res.status(403).json({
    message: "Driver not assigned to any bus"
  });
}

const token=jwt.sign(
    {id:user._id,role:user.role},
    process.env.JWT_SECRET,
    {expiresIn:"1d"},
)

return res.status(200).json({token,message:"Login successfull",user:user});
    }catch(err){
        return res.status(500).json({message:err.message});
    }
}

export const pendingUser=async(req,res)=>{
    try{
const userPending=await User.find({status:"pending",role:{$ne:'admin'}});
return res.json(userPending);
    }catch(err){
        return res.status(500).json({message:err.message});
    }
}

export const approveUser=async(req,res)=>{
    try{
const {id}=req.params;
const user=await User.findById(id);

if(!user){
    return res.status(404).json({message:"user not found"})
}
user.status='approved';
await user.save();
return res.status(200).json({message:"User approved successfullyawa"});
    }catch(err){
        console.log(err);
        return res.status(500).json({message:err.message})
    }
}

export const rejectUser=async(req,res)=>{
    try{
const {id}=req.params;
await User.findByIdAndUpdate(id,{status:'rejected'});
res.status(200).json({message:"User rejected sucessfully"});
    }catch(err){
return res.status(500).json({message:err.message})
    }
}

export const getUsers=async(req,res)=>{
    try{
const users=await User.find({status:'approved'});
return res.json(users);
    }catch(err){
return res.status(500).json({message:err.message})
    }
}