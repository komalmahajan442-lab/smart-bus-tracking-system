import mongoose from "mongoose";

const stopSchema=new mongoose.Schema({
    stopname:{
        type:String,
        required:true,
    },

    location:{
      type:  {
type:String,
enum:["Point"],
default:"Point",
    },
    coordinates:{
        
        type:[Number],
required:true,
    
}
    }
});

export const Stop=mongoose.model("Stop",stopSchema);

const routeSchema=mongoose.Schema({
    routename:{
        type:String,
        required:true,
    },
    stops:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Stop",
    }]
},{timestamps:true})

const Route=new mongoose.model("Route",routeSchema);

export default Route;