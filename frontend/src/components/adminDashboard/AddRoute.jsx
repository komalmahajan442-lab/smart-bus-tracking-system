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

  // ✅ FIXED GEOCODING FUNCTION
  const getCoordinates = async (stopName, index) => {
    try {
      if (!stopName) return;

      const cleanName = stopName.trim();

      // format check
      if (!cleanName.includes(",")) {
        return; // no error spam while typing
      }

      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanName)}&addressdetails=1&countrycodes=in`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.length > 0) {

        // ✅ filter Burhanpur only
        const validLocation = data.find(item =>
          item.display_name.toLowerCase().includes("burhanpur")
        );

        if (validLocation) {
          handleStopChange(index, "latitude", validLocation.lat);
          handleStopChange(index, "longitude", validLocation.lon);
        } else {
          toast.error("Location not in Burhanpur");
        }

      } else {
        toast.error("Location not found");
      }

    } catch (error) {
      console.log(error);
      toast.error("Error fetching location");
    }
  };

  // ✅ debounce
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
                  placeholder="Enter Stop, City (e.g. Lalbagh, Burhanpur)"
                  className="form-control mb-2"
                  value={stop.stopname}
                  onChange={(e) =>
                    handleStopNameChange(e.target.value, index)
                  }
                />

                <div className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control"
                    value={stop.latitude}
                    placeholder="Latitude"
                    readOnly
                  />

                  <input
                    type="text"
                    className="form-control"
                    value={stop.longitude}
                    placeholder="Longitude"
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