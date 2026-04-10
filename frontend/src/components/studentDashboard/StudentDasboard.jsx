import React, { useContext, useEffect, useState } from "react";
import { StudentContext } from "../Context.jsx/StudentContext";
import StudentMap from "./StudentMap";
import { socket } from "../Context.jsx/socket";
import { getDistance } from "geolib";
import { toast } from "react-toastify";
import Navbar from './Navbar';


function StudentDashboard() {

  const { student } = useContext(StudentContext);

  const [busLocation, setBusLocation] = useState(null);
  const [eta, setEta] = useState(null);
  const [distance, setDistance] = useState(null);
  const [nextStopIndex, setNextStopIndex] = useState(0);
  const [notified, setNotified] = useState(false);

  const bus = student?.student?.assignedbus;
  const stops = bus?.route?.stops || [];
  const pickupStop = student?.student?.pickupstop;
  const busId = bus?._id;
  console.log(student);
  const driver=student?.driver

  // JOIN BUS ROOM
  useEffect(() => {

    if (!busId) return;

    socket.emit("joinBus", busId);

  }, [busId]);

  // RECEIVE LIVE BUS LOCATION
  useEffect(() => {

    socket.on("receiveLocation", ({ busId: id, lat, lng }) => {
console.log("receive location",lat,lng);
      if (id === busId) {
        setBusLocation({ lat, lng });
      }

    });

    return () => socket.off("receiveLocation");

  }, [busId]);

 useEffect(() => {

  if (!busLocation || stops.length === 0) return;

let closestIndex = 0;
let minDist = Infinity;

stops.forEach((stop, index) => {
 const [lng, lat] = stop.location.coordinates;

 const d = getDistance(
   { latitude: lat, longitude: lng },
   { latitude: busLocation.lat, longitude: busLocation.lng }
 );

 if (d < minDist) {
   minDist = d;
   closestIndex = index;
 }
});

setNextStopIndex(closestIndex);

  const nextStop = stops[closestIndex];

  const [lng, lat] = nextStop.location.coordinates;

  const dist = getDistance(
    { latitude: lat, longitude: lng },
    { latitude: busLocation.lat, longitude: busLocation.lng }
  );

  setDistance(dist);

  const speed = 30;

  const etaMinutes = ((dist / 1000) / speed) * 60;

  setEta(Math.max(1, Math.round(etaMinutes)));

}, [busLocation, stops]);

  // request notification permission
  useEffect(() => {

    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

  }, []);

 const pickupIndex = stops.findIndex(
s => s._id === pickupStop?._id
);

const stopsAway =
pickupIndex !== -1
? Math.max(0, pickupIndex - nextStopIndex)
: "-";

useEffect(() => {

  socket.on("updateNextStop", ({ nextStopIndex }) => {

    setNextStopIndex(nextStopIndex);

    // agar student ka stop pass ho gaya
    if (pickupIndex < nextStopIndex) {

      toast.info("🚌 Bus has already passed your stop");

    }

  });

  return () => socket.off("updateNextStop");

}, [pickupIndex]);

  return (
    <div>
<Navbar/>
    <div className="container mt-4">

      {pickupIndex < nextStopIndex && (

<div className="alert alert-danger text-center">

🚌 Bus has already passed your stop

</div>

)}

      {/* HEADER */}
      <div className="p-4 shadow rounded-4 bg-white mb-4 text-center">
        <h3>🎓 Student Dashboard</h3>
        <h5 className="text-muted">{student?.student?.name}</h5>
      </div>

      {/* SMART INFO CARD */}
      <div
        className="p-3 mb-4 text-white text-center rounded-4 shadow"
        style={{ background: "linear-gradient(135deg,#667eea,#764ba2)" }}
      >

        <h5>🚍 Bus: {bus?.busnumber || "Not Assigned"}</h5>

        <p>📍 Your Stop: {pickupStop?.stopname || "-"}</p>

        <p>⏱ ETA: {eta ? `${eta} min` : "Calculating..."}</p>

        <p>📏 Distance: {distance ? `${distance} m` : "..."}</p>

        <p>🚏 Stops Away: {stopsAway}</p>

      </div>

      <div className="card shadow p-3 mb-3">

<h5>👨‍✈️ Driver Details</h5>

<p><b>Name:</b> {driver?.name}</p>

<p><b>Phone:</b> {driver?.phoneno}</p>

<a href={`tel:${driver?.phoneno}`} className="btn btn-success">
📞 Call Driver
</a>

</div>

      {/* LIVE MAP */}
      <StudentMap busLocation={busLocation} />

    </div>
</div>
  );
}

export default StudentDashboard;