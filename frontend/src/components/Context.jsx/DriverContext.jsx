import { useEffect,createContext,useState } from "react";
import axios from "axios";

export const DriverContext=createContext();

export const DriverProvider=({children})=>{

const [dashboard,setDashboard]=useState(null);
 const [currentStopIndex, setCurrentStopIndex] = useState(0);

const fetchDashboard=async()=>{
const res=await axios.get(
"http://localhost:9000/driver/dashboard",
{
headers:{
Authorization:`Bearer ${localStorage.getItem("token")}`
}
}
)
console.log(res.data);
setDashboard(res.data);

}

const updateLocation = async ({lat, lng}) => {
  try {
    await axios.put(
      "http://localhost:9000/driver/updatelocation",
      {
        latitude: lat,
        longitude: lng,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  } catch (err) {
    console.log(err);
  }
};

useEffect(()=>{
fetchDashboard();

},[])

return(
<DriverContext.Provider value={{dashboard,updateLocation,fetchDashboard,currentStopIndex,setCurrentStopIndex}}>
{children}
</DriverContext.Provider>
)

}