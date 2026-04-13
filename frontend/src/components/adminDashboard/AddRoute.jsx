import React, { useContext, useState, useRef } from 'react';
import "./assroute.css";
import { MyContext } from '../Context.jsx/Context';
import { toast } from 'react-toastify';
import API from './utilsapi';

function AddRoute() {

  const { routes, fetchRoutes } = useContext(MyContext);

  const [Route, setRoute] = useState("");
  const [stops, setStop] = useState([
    { stopname: "", longitude: "", latitude: "" }
  ]);

  // ✅ separate debounce for each stop
  const timeoutRef = useRef({});

  const handleStopChange = (index, field, value) => {
    const updatedStop = [...stops];
    updatedStop[index][field] = value;
    setStop(updatedStop);
  };

  const addstop = (e) => {
    e.preventDefault();
    setStop([...stops, { stopname: "", longitude: "", latitude: "" }]);
  };

  const handleremoveStop = (index) => {
    if (!window.confirm("Remove this stop?")) return;
    setStop(prev => prev.filter((_, i) => i !== index));
  };

  // ✅ SMART GEOCODING (3-level fallback)
  const getCoordinates = async (stopName, index) => {
    try {
      if (!stopName) return;

      const cleanName = stopName.trim();

      let data = [];

      // 🔹 1. Try with full context
      let query = `${cleanName}, Burhanpur, Madhya Pradesh, India`;

      let res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
      );

      data = await res.json();

      // 🔹 2. Fallback → India
      if (data.length === 0) {
        query = `${cleanName}, India`;

        res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
        );

        data = await res.json();
      }

      // 🔹 3. Fallback → only name
      if (data.length === 0) {
        res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanName)}&limit=1`
        );

        data = await res.json();
      }

      if (data.length > 0) {
        const lat = data[0].lat;
        const lon = data[0].lon;

        handleStopChange(index, "latitude", lat);
        handleStopChange(index, "longitude", lon);
      } else {
        console.log("Location not found"); // no spam error
      }

    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Debounce per stop
  const handleStopNameChange = (value, index) => {
    handleStopChange(index, "stopname", value);

    if (timeoutRef.current[index]) {
      clearTimeout(timeoutRef.current[index]);
    }

    timeoutRef.current[index] = setTimeout(() => {
      getCoordinates(value, index);
    }, 800);
  };

  // =========================

  const addRoutes = async () => {

    if (!Route) return toast.error("Route name required");

    const stopIds = await addStop();

    if (!stopIds || stopIds.length === 0) {
      return toast.error("Stops not created");
    }

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
          toast.error("Fill all stop fields");
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

  return (
    <div className="container mt-5">
      <div className="row g-4">

        {/* Add Route */}
        <div className="col-md-6">
          <div className="p-4 shadow rounded-4 bg-white">

            <h4 className="mb-3">🛣️ Create Route</h4>

            <input
              type="text"
              placeholder="Enter Route Name"
              className="form-control mb-3"
              value={Route}
              onChange={(e) => setRoute(e.target.value)}
            />

            <h6 className="mb-2">Stops</h6>

            {stops.map((stop, index) => (
              <div key={index} className="border rounded-3 p-3 mb-3">

                <input
                  type="text"
                  placeholder="Enter Stop (e.g. Itwara, Burhanpur or Railway Station)"
                  className="form-control mb-2"
                  value={stop.stopname}
                  onChange={(e) =>
                    handleStopNameChange(e.target.value, index)
                  }
                />

                <div className="d-flex gap-2">
                  <input
                    type="text"
                    placeholder="Latitude"
                    className="form-control"
                    value={stop.latitude}
                    readOnly
                  />

                  <input
                    type="text"
                    placeholder="Longitude"
                    className="form-control"
                    value={stop.longitude}
                    readOnly
                  />
                </div>

                <button
                  className="btn btn-outline-danger mt-2"
                  onClick={() => handleremoveStop(index)}
                >
                  Remove Stop
                </button>

              </div>
            ))}

            <button className="btn btn-outline-dark me-2" onClick={addstop}>
              + Add Stop
            </button>

            <button className="btn btn-dark" onClick={addRoutes}>
              Create Route
            </button>

          </div>
        </div>

        {/* Route List */}
        <div className="col-md-6">
          <div className="p-4 shadow rounded-4 bg-white">

            <h4>📍 All Routes</h4>

            <div style={{ maxHeight: "350px", overflowY: "auto" }}>
              {routes.length === 0 ? (
                <p className="text-muted">No routes available</p>
              ) : (
                routes.map((route) => (
                  <div key={route._id} className="border p-3 mb-2 rounded-3">
                    <h6>{route.routename}</h6>
                    <small className="text-muted">
                      Stops: {route.stops?.length || 0}
                    </small>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default AddRoute;