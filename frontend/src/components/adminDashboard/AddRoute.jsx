import React, { useContext, useState,useRef } from "react";
import "./assroute.css";
import { MyContext } from "../Context.jsx/Context";
import { toast } from "react-toastify";
import API from "./utilsapi";


import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMapEvents
} from "react-leaflet";

function RecenterMap({ lat, lng }) {
  const map = useMapEvents({});

  if (lat && lng) {
    map.setView([lat, lng], 16);
  }

  return null;
}

function LocationPicker({ index, setStop }) {

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      setStop(prev => {
        const updated = [...prev];
        updated[index].latitude = lat;
        updated[index].longitude = lng;
        return updated;
      });
    }
  });

  return null;
}

function AddRoute() {

  const { routes, fetchRoutes } = useContext(MyContext);

  const [Route, setRoute] = useState("");
  const [stops, setStop] = useState([
    { stopname: "", longitude: "", latitude: "" }
  ]);

  const handleStopChange = (index, field, value) => {
    const updated = [...stops];
    updated[index][field] = value;
    setStop(updated);
  };

  const addstop = (e) => {
    e.preventDefault();
    setStop([...stops, { stopname: "", longitude: "", latitude: "" }]);
  };

  const handleremoveStop = (index) => {
    if (!window.confirm("Remove this stop?")) return;
    setStop(prev => prev.filter((_, i) => i !== index));
  };

  const addRoutes = async () => {

    if (!Route) return toast.error("Route name required");

    const stopIds = await addStop();

    if (!stopIds.length) return;

    try {
      const res = await API.post("/createroute", {
        routename: Route,
        stops: stopIds
      });

      toast.success(res.data.message);
      fetchRoutes();

      setStop([{ stopname: "", longitude: "", latitude: "" }]);
      setRoute("");

    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const addStop = async () => {
    try {

      const stopIds = [];

      for (const stop of stops) {

        if (!stop.stopname || !stop.latitude || !stop.longitude) {
          toast.error("Please fill all fields or select location on map");
          return [];
        }

        const res = await API.post("/createstop", {
          stopname: stop.stopname,
          location: {
            type: "Point",
            coordinates: [
              parseFloat(stop.longitude),
              parseFloat(stop.latitude)
            ]
          }
        });

        stopIds.push(res.data._id);
      }

      return stopIds;

    } catch (err) {
      console.log(err);
      toast.error("Stop creation failed");
      return [];
    }
  };
const timeoutRef = useRef({});
  const searchLocation = async (name, index) => {
  try {
    if (!name || name.length < 3) return;

    const query = `${name}, India`;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
    );

    const data = await res.json();

    if (data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);

      setStop(prev => {
        const updated = [...prev];
        updated[index].latitude = lat;
        updated[index].longitude = lon;
        return updated;
      });

    } else {
      // no error spam
      console.log("Not found, user can click map");
    }

  } catch (err) {
    console.log(err);
  }
};

  return (
    <div className="container mt-5">
      <div className="row g-4">

        {/* LEFT SIDE */}
        <div className="col-md-6">
          <div className="p-4 shadow rounded-4 bg-white">

            <h4>🛣️ Create Route</h4>

            <input
              type="text"
              placeholder="Enter Route Name"
              className="form-control mb-3"
              value={Route}
              onChange={(e) => setRoute(e.target.value)}
            />

            {stops.map((stop, index) => (
              <div key={index} className="mb-4">

                <input
                  type="text"
                  placeholder="Enter Stop Name (e.g. Rastipura)"
                  className="form-control mb-2"
                  value={stop.stopname}
                  onChange={(e) => {
  const value = e.target.value;

  handleStopChange(index, "stopname", value);

  // debounce
  if (timeoutRef.current[index]) {
    clearTimeout(timeoutRef.current[index]);
  }

  timeoutRef.current[index] = setTimeout(() => {
    searchLocation(value, index);
  }, 700);
}}
                />

                {/* MAP */}
                <MapContainer
                  center={[21.307, 76.230]}
                  zoom={16}
                  style={{ height: "250px", width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                  <LocationPicker index={index} setStop={setStop} />

                  
                  {stop.latitude && stop.longitude && (
  <>
    <RecenterMap lat={stop.latitude} lng={stop.longitude} />

    <Marker position={[stop.latitude, stop.longitude]}>
      <Tooltip>{stop.stopname}</Tooltip>
      <Popup>{stop.stopname}</Popup>
    </Marker>
  </>
)}

                </MapContainer>

                <div className="d-flex gap-2 mt-2">
                  <input
                    type="text"
                    value={stop.latitude}
                    className="form-control"
                    placeholder="Latitude"
                    readOnly
                  />
                  <input
                    type="text"
                    value={stop.longitude}
                    className="form-control"
                    placeholder="Longitude"
                    readOnly
                  />
                </div>

                <button
                  className="btn btn-danger mt-2"
                  onClick={() => handleremoveStop(index)}
                >
                  Remove Stop
                </button>

              </div>
            ))}

            <button className="btn btn-secondary me-2" onClick={addstop}>
              + Add Stop
            </button>

            <button className="btn btn-success" onClick={addRoutes}>
              Create Route
            </button>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-md-6">
          <div className="p-4 shadow bg-white rounded-4">

            <h4>📍 All Routes</h4>

            {routes.length === 0 ? (
              <p>No routes available</p>
            ) : (
              routes.map(route => (
                <div key={route._id} className="border p-2 mb-2">
                  <strong>{route.routename}</strong>
                  <div>Stops: {route.stops?.length}</div>
                </div>
              ))
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

export default AddRoute; 