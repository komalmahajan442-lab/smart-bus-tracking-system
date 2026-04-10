import React, { useContext, useState } from 'react';
import { MyContext } from '../Context.jsx/Context';
import axios from 'axios';
import { toast } from 'react-toastify';
import "./AssignStudent.css";

function AssignBusToStudent() {
  const { student, buses, routes,studentAssignments } = useContext(MyContext);

  const [studentId, setStudentId] = useState("");
  const [busId, setBusId] = useState("");
  const [pickupstop, setPickStop] = useState("");
  const [loading, setLoading] = useState(false);

  const assignStudent = async () => {
    if (!studentId || !busId || !pickupstop) {
      return toast.warning("Please fill all fields!");
    }

    try {
      setLoading(true);

      const res = await axios.put(
        `https://smart-bus-tracking-system.onrender.com/assign-bus-student/${studentId}`,
        { studentId, busId, pickupstop },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      toast.success(res.data.message);

      setStudentId("");
      setPickStop("");
      setBusId("");

    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSeatsLeft = (busId, capacity) => {
  const assignedCount = studentAssignments.filter(
    (s) => s.assignedbus?._id === busId
  ).length;

  return capacity - assignedCount;
};

const selectedBus = buses.find(b => b._id === busId);

if (selectedBus) {
  const seatsLeft = getSeatsLeft(busId, selectedBus.capacity);

  if (seatsLeft === 0) {
    return toast.error("Bus is full");
  }
}
  return (
    <div className="container mt-5">
      <div className="row g-4">

        {/* LEFT SIDE FORM */}
        <div className="col-md-6">
          <div className="card shadow-lg border-0 rounded-4 p-4">
            <h3>🎓 Assign Student</h3>
            <p className="text-muted">Assign bus and pickup stop</p>

            {/* STUDENT */}
            <div className="mb-3">
              <label className="form-label">Select Student</label>
              <select
                className="form-select"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              >
                <option value="">Choose a student</option>
                {student.map((el) => (
                  <option key={el._id} value={el._id}>
                    {el.name}
                  </option>
                ))}
              </select>
            </div>

            {/* BUS */}
            <div className="mb-3">
              <label className="form-label">Select Bus</label>
              <select
                className="form-select"
                value={busId}
                onChange={(e) => setBusId(e.target.value)}
              >
                <option value="">Choose a bus</option>
               {buses.map((el) => {
  const seatsLeft = getSeatsLeft(el._id, el.capacity);

  return (
    <option
      key={el._id}
      value={el._id}
      disabled={seatsLeft === 0}
    >
      {el.busnumber} ({seatsLeft} seats left)
    </option>
  );
})}
              </select>
            </div>

            {/* STOP */}
            <div className="mb-3">
              <label className="form-label">Select Pickup Stop</label>
              <select
                className="form-select"
                value={pickupstop}
                onChange={(e) => setPickStop(e.target.value)}
              >
                <option value="">Choose a stop</option>

                {routes.map((route) => (
                  <optgroup key={route._id} label={route.routename}>
                    {route.stops?.map((stop) => (
                      <option key={stop._id} value={stop._id}>
                        {stop.stopname}
                      </option>
                    ))}
                  </optgroup>
                ))}

              </select>
            </div>

            {/* BUTTON */}
            <button
              className="btn btn-success w-100 mt-3"
              onClick={assignStudent}
              disabled={loading}
            >
              {loading ? "Assigning..." : "Assign Student"}
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-md-6">
          <div className="card shadow-lg border-0 rounded-4 p-4">
            <h3>📋 Student Assignments</h3>
            <p className="text-muted">Students assigned to buses</p>

           {studentAssignments.length === 0 ? (
  <p className="text-center text-muted">No assignments yet</p>
) : (
  <table className="table table-hover mt-3">
    <thead>
      <tr>
        <th>Student</th>
        <th>Bus</th>
        <th>Pickup Stop</th>
      </tr>
    </thead>
    <tbody>
      {studentAssignments.map((item) => (
        <tr key={item._id}>
          <td>{item.name}</td>
          <td>{item.assignedbus?.busnumber}</td>
          <td>{item.pickupstop?.stopname}</td>
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

export default AssignBusToStudent;