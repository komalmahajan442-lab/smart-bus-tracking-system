import jwt from "jsonwebtoken";

export const auth=async(req,res,next)=>{
const token=req.headers.authorization?.split(" ")[1];

if(!token){
    return res.status(401).json({message:"Not authorized"});
}

try{
const decode=jwt.verify(token,process.env.JWT_SECRET);
req.user=decode;
next();
}catch(err){
    return res.status(500).json({message:err.message});
}
}

export const authorizeRoles=(...roles)=>{
 return (req,res,next)=>{
    if(!roles.includes(req.user.role)){
        return res.status(403).json({message:"Access denied"});
    }
    next();
 }

}