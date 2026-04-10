
import Bus from "../models/busModel.js";

import User from "../models/userModel.js";

export const getDriverDashboard=async(req,res)=>{
try{
const driver=await User.findById(req.user.id)
.populate({
    path:"assignedbus",
    populate:{
        path:"route",
        populate:{path:"stops"}
    }
})
.lean();

if(!driver){
return res.status(404).json({message:"Driver not found"});
}

const student=await User.find({assignedbus:driver.assignedbus?._id,role:"student"}).
populate({path:"assignedbus",
   }).populate({path:'pickupstop'})
   
.lean();

return res.status(200).json({driver,student});
}catch(err){
    console.log(err);
    return res.status(500).json({message:err.message});
}
}


export const updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: "Invalid coordinates"
      });
    }

    const driver = await User.findById(req.user.id);

    if (!driver || !driver.assignedbus) {
      return res.status(400).json({
        message: "Driver or bus not found"
      });
    }

    const bus = await Bus.findByIdAndUpdate(
      driver.assignedbus,
      {
        currentlocation: {
          type: "Point",
          coordinates: [longitude, latitude] // ✅ correct
        }
      },
      { new: true }
    );
console.log("Saving:", longitude, latitude);
    res.json({ message: "Location updated", bus });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};


export const startTrip = async (req,res)=>{
try{

const {busId} = req.body;

const bus = await Bus.findById(busId);

if(!bus){
return res.status(404).json({message:"Bus not found"});
}

bus.starttrip = "started";
bus.tripstarttime = new Date();

await bus.save();

res.json({
message:"Trip started",
bus
});

}catch(err){
res.status(500).json({message:err.message});
}
}

export const endTrip = async (req,res)=>{
   
try{

const {busId} = req.body;

const bus = await Bus.findById(busId);

if(!bus){
return res.status(404).json({message:"Bus not found"});
}

bus.starttrip = "ended";
bus.tripendtime = new Date();

await bus.save();

res.json({
message:"Trip ended",
bus
});

}catch(err){
res.status(500).json({message:err.message});
}
}

export const pickupStatus=async (req, res) => {
  try {

    const student = await Student.findByIdAndUpdate(
      req.params.studentId,
      { pickupStatus: "picked" },
      { new: true }
    );

    res.json(student);

  } catch (err) {
    res.status(500).json(err);
  }
};