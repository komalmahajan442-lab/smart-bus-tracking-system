import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useContext, useEffect, useState } from "react";
import { socket } from "../Context.jsx/socket";
import { MyContext } from "../Context.jsx/Context";

function AdminMap(){

const {buses,setBuses,studentsdetail}=useContext(MyContext);

const [selectedBus,setSelectedBus]=useState(null);
const busStudents = studentsdetail?.busesWithStudents?.find(
  (b) => b._id === selectedBus?._id
);
console.log(studentsdetail);

// SOCKET RECEIVE LOCATION
useEffect(()=>{

socket.on("receiveLocation",({busId,lat,lng})=>{

console.log("Admin received:",busId,lat,lng);

setBuses(prev =>
prev.map(bus =>
bus._id === busId
? {...bus,currentlocation:{coordinates:[lng,lat]}}
: bus
)
);

});

return ()=>socket.off("receiveLocation");

},[]);


// JOIN BUS ROOMS
useEffect(()=>{

if(!buses) return;

buses.forEach(bus=>{
socket.emit("joinBus",bus._id);
});

},[buses]);

useEffect(()=>{
  console.log("All buses:", buses);
},[buses]);
return(

<div className="container-fluid">

<h2 className="text-center mt-3 mb-4">
🚌 Live Bus Tracking
</h2>


<div className="row">


{/* LEFT PANEL */}
<div className="col-md-3">

<div className="card shadow">

<div className="card-header bg-dark text-white">
Bus List
</div>

<div className="list-group">

{buses?.map(bus=>(

<button
key={bus._id}
className={`list-group-item list-group-item-action 
${selectedBus?._id===bus._id ? "active":""}`}

onClick={()=>setSelectedBus(bus)}
>

🚌 Bus {bus.busnumber}

</button>

))}

</div>

</div>

</div>


{/* MAP */}
<div className="col-md-9">

<MapContainer
center={[22.97,78.65]}
zoom={13}
style={{height:"500px",width:"100%"}}
>

<TileLayer
url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>

{buses?.map(bus=>{

if(!bus?.currentlocation?.coordinates) return null;

const [lng,lat] = bus.currentlocation.coordinates;

return(

<Marker key={bus._id} position={[lat,lng]}>

<Popup>

<b>Bus:</b> {bus.busnumber}

</Popup>

</Marker>

)

})}

</MapContainer>

</div>

</div>


{/* STUDENT STATUS */}
{selectedBus &&(

<div className="card mt-4 shadow">

<div className="card-header bg-primary text-white">

Students - Bus {selectedBus.busnumber}

</div>

<div className="card-body">

<div className="row">

{selectedBus && (

<div className="card mt-4 shadow">

<div className="card-header bg-primary text-white">
Students - Bus {selectedBus.busnumber}
</div>

<div className="card-body">

<div className="row">

{busStudents?.students?.map(stu => (

<div key={stu._id} className="col-md-4 mb-3">

<div className={`card 
${stu.pickupStatus==="picked" ? "border-success":"border-warning"}`}>

<div className="card-body">

<h5>{stu.name}</h5>

<p>📍 {stu.pickupstop?.stopname}</p>

<span className={`badge 
${stu.pickupStatus==="picked" ? "bg-success":"bg-warning"}`}>

{stu.pickupStatus==="picked" ? "Picked":"Waiting"}

</span>

</div>

</div>

</div>

))}

</div>

</div>

</div>

)}

</div>

</div>

</div>

)}

</div>

)

}

export default AdminMap;