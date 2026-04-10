import React, { useContext, useState } from 'react';
import { MyContext } from '../Context.jsx/Context';
import { toast } from 'react-toastify';
import "./AssignBus.css";
import API from './utilsapi';

function AssignBusToDriver() {
  const { buses, driver, routes,assignments,getAssignments } = useContext(MyContext);

  const [busId, setBusId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [routeId, setRouteId] = useState("");
  const [loading, setLoading] = useState(false);

  

const assignBus = async () => {
  if (!busId || !driverId || !routeId) {
    return toast.warning("Fill all fields");
  }

  try {
    setLoading(true);

    const res = await API.put(`/assign-bus-driver/${driverId}`, {
      busId,
      routeId
    });

    toast.success(res.data.message);

    getAssignments(); 

  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="container mt-5">
      <div className="row g-4">

        {/* LEFT SIDE FORM */}
        <div className="col-md-6">
          <div className="card shadow-lg p-4 border-0 rounded-4">
            <h3 className="mb-2">🚌 Assign Bus</h3>
            <p className="text-muted">Link bus, driver and route easily</p>

            {/* BUS */}
            <div className="mb-3">
              <label className="form-label">Select Bus</label>
              <select
                className="form-select"
                onChange={(e) => setBusId(e.target.value)}
              >
                <option value="">Choose a bus</option>
                {buses.map((el) => (
                  <option key={el._id} value={el._id}>
                    {el.busnumber}
                  </option>
                ))}
              </select>
            </div>

            {/* DRIVER */}
            <div className="mb-3">
              <label className="form-label">Select Driver</label>
              <select
                className="form-select"
                onChange={(e) => setDriverId(e.target.value)}
              >
                <option value="">Choose a driver</option>
                {driver.map((el) => (
                  <option key={el._id} value={el._id}>
                    {el.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ROUTE */}
            <div className="mb-3">
              <label className="form-label">Select Route</label>
              <select
                className="form-select"
                onChange={(e) => setRouteId(e.target.value)}
              >
                <option value="">Choose a route</option>
                {routes.map((el) => (
                  <option key={el._id} value={el._id}>
                    {el.routename}
                  </option>
                ))}
              </select>
            </div>

            {/* BUTTON */}
            <button
              className="btn btn-primary w-100 mt-3"
              onClick={assignBus}
              disabled={loading}
            >
              {loading ? "Assigning..." : "Assign Bus"}
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-md-6">
          <div className="card shadow-lg p-4 border-0 rounded-4">
            <h3>📋 Current Assignments</h3>
            <p className="text-muted">Bus-Driver-Route assignments</p>

         
    {assignments.length === 0 ? (
      <p className="text-center text-muted">No assignments yet</p>
    ) : (
      <table className="table table-hover mt-3 overflow-auto">
        <thead>
          <tr>
            <th>Bus</th>
            <th>Driver</th>
            <th>Route</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((item) => (
    <tr key={item._id}>
      <td>{item.assignedbus?.busnumber}</td>
      <td>{item.name}</td>
      <td>{item.assignedbus?.route?.routename}</td>
    </tr>
  ))}
        </tbody>
      </table>
    )}
  </div>
</div>
          </div>
        </div>

     
  );
}

export default AssignBusToDriver;