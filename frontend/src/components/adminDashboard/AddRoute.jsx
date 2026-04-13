import React, { useContext, useState, useRef, useEffect } from "react";
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
  useMap,
  useMapEvents
} from "react-leaflet";

/* ------------------ RECENTER MAP ------------------ */
function RecenterMap({ lat, lng }) {
  const map = useMap();

  useEffect(() => {
    if (lat && lng) {
      map.setView([Number(lat), Number(lng)], 17);
    }
  }, [lat, lng, map]);

  return null;
}

/* ------------------ MAP CLICK PICKER ------------------ */
function LocationPicker({ index, setStop }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      setStop(prev => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          latitude: lat,
          longitude: lng
        };
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

  const timeoutRef = useRef({});

  /* ------------------ STOP UPDATE ------------------ */
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

  /* ------------------ GEO SEARCH FIX ------------------ */
  const searchLocation = async (name, index) => {
    try {
      if (!name || name.length < 3) return;

      // ✅ stronger location bias
      const query = `${name}, Burhanpur, Madhya Pradesh, India`;

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );

      const data = await res.json();

      if (data.length > 0) {
        // ✅ best result pick
        const best = data[0];

        const lat = parseFloat(best.lat);
        const lon = parseFloat(best.lon);

        console.log("📍 Selected:", name, lat, lon);

        setStop(prev => {
          const updated = [...prev];

          updated[index] = {
            ...updated[index],
            latitude: lat,
            longitude: lon
          };

          return updated;
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* ------------------ CREATE ROUTE ------------------ */
  const addStop = async () => {
    try {
      const stopIds = [];

      for (const stop of stops) {
        if (!stop.stopname || stop.latitude === "" || stop.longitude === "") {
          toast.error("Select location for all stops");
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

  return (
    <div className="container mt-5">
      <div className="row g-4">

        {/* LEFT */}
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
                  placeholder="Enter Stop Name"
                  className="form-control mb-2"
                  value={stop.stopname}
                  onChange={(e) => {
                    const value = e.target.value;

                    handleStopChange(index, "stopname", value);

                    clearTimeout(timeoutRef.current[index]);

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

                      <Marker position={[Number(stop.latitude), Number(stop.longitude)]}>
                        <Tooltip>{stop.stopname}</Tooltip>
                        <Popup>{stop.stopname}</Popup>
                      </Marker>
                    </>
                  )}
                </MapContainer>

                <div className="d-flex gap-2 mt-2">
                  <input className="form-control" value={stop.latitude} readOnly />
                  <input className="form-control" value={stop.longitude} readOnly />
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

        {/* RIGHT */}
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