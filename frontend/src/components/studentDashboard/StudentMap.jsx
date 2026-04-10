import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { useContext, useEffect, useState } from "react";
import { socket } from "../Context.jsx/socket";
import { StudentContext } from "../Context.jsx/StudentContext";

function Recenter({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location?.lat && location?.lng) {
      map.flyTo([location.lat, location.lng], 16);
    }
  }, [location]);

  return null;
}

function StudentMap() {

  const { student } = useContext(StudentContext);

  const [busLocation,setBusLocation] = useState(null);

  const busId = student?.student?.assignedbus?._id;

  const stops = student?.student?.assignedbus?.route?.stops || [];

  const routeCoordinates = stops.map(stop=>{
    const [lng,lat] = stop.location.coordinates;
    return [lat,lng];
  });

  useEffect(()=>{

    if(!busId) return;

    console.log("Student joining bus:",busId);

    socket.emit("joinBus",busId);

    socket.on("receiveLocation",({busId:incomingBus,lat,lng})=>{

      console.log("Student received:",incomingBus,lat,lng);

      if(incomingBus === busId){
        setBusLocation({lat,lng});
      }

    });

    return ()=>socket.off("receiveLocation");

  },[busId]);

  return(

<div>

<h4 className="text-center mb-3">
🚌 Your Bus Live Location
</h4>

<MapContainer
center={busLocation ? [busLocation.lat,busLocation.lng] : [21.3072,76.2303]}
zoom={14}
style={{height:"500px",width:"100%"}}
>

<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

<Recenter location={busLocation}/>

{busLocation &&(
<Marker position={[busLocation.lat,busLocation.lng]}>
<Popup>🚍 Your Bus</Popup>
</Marker>
)}

{stops.map((stop,i)=>{

const [lng,lat] = stop.location.coordinates;

return(
<Marker key={i} position={[lat,lng]}>
<Popup>📍 {stop.stopname}</Popup>
</Marker>
)

})}

{routeCoordinates.length>1 &&(
<Polyline positions={routeCoordinates} color="blue"/>
)}

</MapContainer>

</div>

)

}

export default StudentMap;