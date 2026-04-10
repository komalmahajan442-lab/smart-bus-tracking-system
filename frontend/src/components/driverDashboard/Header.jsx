import React, { useState } from 'react';
import axios from 'axios';

import { useContext } from 'react';
import { DriverContext } from '../Context.jsx/DriverContext';
import { toast } from 'react-toastify';

function Header() {
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [tripStarted, setTripStarted] = useState(false);
  const { dashboard ,fetchDashboard} = useContext(DriverContext);

  const startTrip = async () => {
    try {
      const res = await axios.put(
        "http://localhost:9000/driver/start-trip",
        { busId: dashboard?.driver?.assignedbus?._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      toast.success("Trip Started 🚀");
      setTripStarted(true);
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const endTrip = async () => {
    try {
      const res = await axios.put(
        "http://localhost:9000/driver/end-trip",
        { busId: dashboard?.driver?.assignedbus?._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      toast.success("Trip Ended 🛑");
      setTripStarted(false);
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    

  <div className="container mt-3">

  {/* 🚍 BUS CARD */}
  <div className="bg-primary text-white text-center p-4 rounded-4 shadow">

    <h1>🚍 {dashboard?.driver?.assignedbus?.busnumber || "No Bus"}</h1>

    <h5>
      📍 {dashboard?.driver?.assignedbus?.route?.routename || "No Route"}
    </h5>

    <h4>
      {tripStarted ? "🟢 Running" : "🔴 Stopped"}
    </h4>

  </div>

  {/* GPS */}
  <div className="bg-white p-3 rounded-4 mt-3 shadow text-center">

    <h5>📍 GPS</h5>

    <button
      className={`btn ${gpsEnabled ? "btn-success" : "btn-secondary"} w-100`}
      onClick={() => setGpsEnabled(!gpsEnabled)}
    >
      {gpsEnabled ? "🟢 ON" : "🔴 OFF"}
    </button>

  </div>

  {/* START / STOP */}
  <div className="mt-3">

    {!tripStarted ? (
      <button
        className="btn btn-success w-100 py-5 fs-1 rounded-4 shadow"
        disabled={!gpsEnabled}
        onClick={startTrip}
      >
        ▶️ START
      </button>
    ) : (
      <button
        className="btn btn-danger w-100 py-5 fs-1 rounded-4 shadow"
        onClick={endTrip}
      >
        ⛔ STOP
      </button>
    )}

  </div>

</div>


  );
}

export default Header
