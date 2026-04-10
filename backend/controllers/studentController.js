
import User from "../models/userModel.js";


export const getStudentDashboard = async (req, res) => {
  try {
    const student = await User.findById(req.user.id)
      .populate({
        path: "assignedbus",
        populate: {
          path: "route",
          populate: {
            path: "stops"   // ✅ THIS IS CRITICAL
          }
        }
      })
      .populate("pickupstop")
      
      .lean();

      const driver = await User.findOne({
  role: "driver",
  assignedbus: student.assignedbus._id
}).select("name phoneno");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({student,driver});

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export const getstudentprofile=async(req,res)=>{
try{
const student=await User.findById(req.user.id);
res.json(student);
}catch(err){
    return res.status(500).json({message:err.message});
}
}

export const UpdateStudent=async(req,res)=>{
    try{
const student=await User.findByIdAndUpdate(req.user.id,req.body,{new:true});
res.json(student);
    }catch(err){
    return res.status(500).json({message:err.message});
}
}