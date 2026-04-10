import React, { useContext, useState } from 'react';
import { DriverContext } from '../Context.jsx/DriverContext';

function Students() {
  const { dashboard } = useContext(DriverContext);

  const students = dashboard?.student || [];
  const stops = dashboard?.driver?.assignedbus?.route?.stops || [];

  const [currentStopIndex, setCurrentStopIndex] = useState(0);

  // ✅ Sort students based on route stop order
  const sortedStudents = students.slice().sort((a, b) => {
    const indexA = stops.findIndex(
      (stop) => stop._id === a.pickupstop?._id
    );

    const indexB = stops.findIndex(
      (stop) => stop._id === b.pickupstop?._id
    );

    return indexA - indexB;
  });

  // ✅ Handle picked student
  const handlePicked = (student) => {
    const stopIndex = stops.findIndex(
      (stop) => stop._id === student.pickupstop?._id
    );

    if (stopIndex !== -1) {
      setCurrentStopIndex(stopIndex + 1);
    }
  };

  return (
    <div className='p-3 border rounded-3 m-3 bg-white'>
      <h2 className="fw-bold">Student List</h2>
      <p className="text-muted">Students in your route</p>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Stop</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {sortedStudents.length > 0 ? (
            sortedStudents.map((s) => {
              const isNextStop =
                stops[currentStopIndex]?._id === s.pickupstop?._id;

              return (
                <tr
                  key={s._id}
                  className={isNextStop ? "table-success" : ""}
                >
                  <td>{s.name}</td>

                  <td>
                    {s?.pickupstop?.stopname || "Not Assigned"}
                  </td>

                  <td>{s.status}</td>

                  <td>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handlePicked(s)}
                      disabled={!isNextStop} // only next stop clickable
                    >
                      Picked
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No students found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Students;