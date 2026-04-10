import Bus from "../models/busModel.js";
import Route, { Stop } from "../models/routeModel.js";
import User from "../models/userModel.js";

export const createRoute=async(req,res)=>{
try{
    const {routename,stops}=req.body;
    console.log(req.body);

    if(!stops|| !routename || stops.length===0){
        return res.json({message:"Some fields are missing"})
    }
    const newRoute=new Route({
        routename,
        stops
    });
    await newRoute.save();
    return res.status(201).json({route:newRoute._id,message:"Route created"});
}catch(err){
    console.log(err);
    return res.status(500).json({message:err.message});
}
}

export const getRoutes=async(req,res)=>{
    try{
const routes=await Route.find({}).populate("stops","stopname");
res.json(routes);
    }catch(err){
         return res.status(500).json({message:err.message});
    }
}

export const createBus=async(req,res)=>{
try{
    console.log(req.body);
const {busnumber,capacity}=req.body;
if (!busnumber || !capacity || capacity <= 0) {
  return res.status(400).json({ message: "Invalid bus data" });
}

const existingBus = await Bus.findOne({ busnumber });

if (existingBus) {
  return res.status(400).json({ message: "Bus already exists" });
}
const bus=new Bus({
    busnumber,
   // route,
    capacity
});

await bus.save();

return res.status(201).json({message:"Bus created successfully"});
}catch(err){
    console.log(err);
         return res.status(500).json({message:err.message});
    }
}

export const getBus=async(req,res)=>{
    try{
const bus=await Bus.find({}).populate("route","routename");//.populate("driver","name email")
 const busesWithStudents = await Promise.all(
      bus.map(async (bus) => {

        const students = await User.find({
          role: "student",
          assignedbus: bus._id
        }).populate("pickupstop","stopname");

        return {
          ...bus.toObject(),
          students
        };
      })
    );
res.json({bus,busesWithStudents});
    }catch(err){
         return res.status(500).json({message:err.message});
    }
    
}


export const deleteBus=async(req,res)=>{
    try{
const bus = await Bus.findById(req.params.id);

if (!bus) {
  return res.status(404).json({ message: "Bus not found" });
}

await bus.deleteOne();

return res.json({ message: "Bus Deleted" });

    }catch(err){
        return res.status(500).json({message:err.message});
    }
}

export const createStop = async (req, res) => {
  try {
    const { stopname, location } = req.body;

    const [longitude, latitude] = location.coordinates;

    if (
      latitude < -90 || latitude > 90 ||
      longitude < -180 || longitude > 180
    ) {
      return res.status(400).json({ message: "Invalid coordinates" });
    }

    const stops = new Stop({
      stopname,
      location
    });

    await stops.save();

    return res.status(201).json({
      _id: stops._id,
      message: "Stop Created"
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteStop=async(req,res)=>{
    try{
await Stop.findByIdAndDelete(req.params.id);
return res.json({message:"Stop deleted"});
    }catch(err){
    return res.status(500).json({message:err.message});
}
}

export const getAdminDashboard=async(req,res)=>{
try{
const students = await User.find({role:"student"}).lean();
const drivers=await User.find({role:"driver"}).lean();
      const buses = await Bus.find().lean();
      const routes = await Route.find().lean();

      
      res.status(200).json({
         totalStudents: students.length,
         totalDrivers: drivers.length,
         totalBuses: buses.length,
         totalRoutes: routes.length,
         students,
         drivers,
         buses,
         routes
      });
}catch(err){
    return res.status(500).json({message:err.message});
}
}

export const updateRoute=async(req,res)=>{
    try{
const route=await Route.findByIdAndUpdate(
    req.params.id,
req.body,
{new:true}
)
return res.json(route);
    }catch(err){
return res.status(500).json({message:err.message});
    }
}

export const deleteRoute=async(req,res)=>{
    try{
await Route.findByIdAndDelete(req.params.id);
res.json({message:"Route deleted"});
    }catch(err){
        return res.status(500).json({message:err.message});
    }
}

export const assignedBusToDriver = async (req, res) => {
  try {
    const { busId, routeId } = req.body;
    const { driverId } = req.params;

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    const driver = await User.findById(driverId);
    if (!driver || driver.role !== "driver") {
      return res.status(404).json({ message: "Driver not found" });
    }

    if (driver.assignedbus) {
      return res.status(400).json({
        message: "Driver already has a bus assigned"
      });
    }

    // ✅ OPTIONAL: prevent same bus assigned twice
    const alreadyAssigned = await User.findOne({
      role: "driver",
      assignedbus: busId
    });

    if (alreadyAssigned) {
      return res.status(400).json({
        message: "Bus already assigned to another driver"
      });
    }

    driver.assignedbus = busId;
    await driver.save();

    bus.route = routeId;
    await bus.save();

    return res.json({
      message: "Bus assigned to driver successfully"
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const assignedBusToStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { busId, pickupstop } = req.body;

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    // ✅ Check driver assigned
    const driverAssigned = await User.findOne({
      role: "driver",
      assignedbus: busId
    });

    if (!driverAssigned) {
      return res.status(400).json({
        message: "Assign driver to this bus first"
      });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    if (student.assignedbus) {
      return res.status(400).json({
        message: "Student already assigned to bus"
      });
    }

    // ✅ COUNT CURRENT STUDENTS IN THIS BUS
    const totalStudents = await User.countDocuments({
      role: "student",
      assignedbus: busId
    });

    // ✅ CHECK CAPACITY
    if (totalStudents >= bus.capacity) {
      return res.status(400).json({
        message: "Bus is full"
      });
    }

    // ✅ ASSIGN
    student.assignedbus = bus._id;
    student.pickupstop = pickupstop;

    await student.save();

    return res.status(200).json({
      message: "Student assigned successfully",
      seatsLeft: bus.capacity - (totalStudents + 1)
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getdriver=async(req,res)=>{
try{
const driver=await User.find({role:"driver"});

return res.json(driver);
}catch(err){
    console.log(err);
    res.status(500).json({message:err.message});
}
}

export const getStudent=async(req,res)=>{
    try{
const student=await User.find({role:"student"});
return res.json(student);
    }catch(err){
        console.log(err.message);
        return res.status(500).json({message:err.message});
    }
}

export const getAssignments = async (req, res) => {
  try {
    const drivers = await User.find({
      role: "driver",
      assignedbus: { $ne: null }
    }).populate({
      path: "assignedbus",
      populate: {
        path: "route"
      }
    });

    res.json(drivers);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching assignments" });
  }
};



export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, phoneno } = req.body;

    // ✅ validation
    if (!role || !phoneno) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ update only allowed fields
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        role,
        phoneno
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user: updatedUser
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleBusStatus = async (req, res) => {
  const bus = await Bus.findById(req.params.id);

  bus.isActive = !bus.isActive;
  await bus.save();

  res.json({ message: "Status updated", bus });
};

export const getStudentAssignments = async (req, res) => {
  try {
    const students = await User.find({
      role: "student",
      assignedbus: { $ne: null }
    })
      .populate("assignedbus", "busnumber")
      .populate("pickupstop", "stopname");

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};