import React, { useContext, useState, useEffect } from "react";
import { DriverContext } from "../Context.jsx/DriverContext";
import { speak } from "./speak";
import { socket } from "../Context.jsx/socket";
import { toast } from "react-toastify";

function Students() {

  const { dashboard ,currentStopIndex,setCurrentStopIndex} = useContext(DriverContext);

  const students = dashboard?.student || [];
  const stops = dashboard?.driver?.assignedbus?.route?.stops || [];

 

  // ✅ Pickup status store
  const [pickedStudents, setPickedStudents] = useState({});

  // Students ko stop order me sort
  const sortedStudents = students.slice().sort((a, b) => {
    const indexA = stops.findIndex(s => s._id === a.pickupstop?._id);
    const indexB = stops.findIndex(s => s._id === b.pickupstop?._id);
    return indexA - indexB;
  });

  const handlePicked = (student) => {

    const tripStatus = dashboard?.driver?.assignedbus?.starttrip;

  if (tripStatus !== "started") {

    toast.warning("⚠ Please start the trip first");

    speak("Phale trip start kare");

    return;
  }

  if (pickedStudents[student._id]) return;

  setPickedStudents(prev => ({
    ...prev,
    [student._id]: true
  }));

  const stopIndex = stops.findIndex(
    s => s._id === student.pickupstop?._id
  );

  if (stopIndex !== -1) {

    const nextIndex = stopIndex + 1;

    setCurrentStopIndex(nextIndex);

    speak(`${student.name} picked`);

    
    socket.emit("nextStopUpdate", {
  busId: dashboard?.driver?.assignedbus?._id,
  nextStopIndex: stopIndex + 1
});

  }
};
  useEffect(() => {
    if (stops[currentStopIndex]) {
      speak(`Next stop ${stops[currentStopIndex].stopname}`);
    }
  }, [currentStopIndex]);

  return (

    <div className="p-3">

      <h3 className="text-center mb-3">📍 Next Pickups</h3>

      {sortedStudents.length === 0 ? (
        <p className="text-center text-muted">No Students</p>
      ) : (

        sortedStudents.map((s) => {

          const isNext =
            stops[currentStopIndex]?._id === s.pickupstop?._id;

          const isPicked = pickedStudents[s._id];

          return (
            <div
              key={s._id}
              className={`p-4 mb-3 rounded-4 shadow d-flex justify-content-between align-items-center
              ${isPicked ? "bg-secondary text-white" :
                isNext ? "bg-success text-white" : "bg-light"}`}
            >

              <div>
                <h5>{s.name}</h5>
                <p>📍 {s?.pickupstop?.stopname || "No Stop"}</p>
              </div>

              {isPicked ? (

                <span className="badge bg-dark fs-6">
                  ✔ Picked
                </span>

              ) : (

                <button
                  className={`btn ${isNext ? "btn-light fs-5 px-4" : "btn-secondary"}`}
                  disabled={!isNext}
                  onClick={() => handlePicked(s)}
                >
                  ✔ PICK
                </button>

              )}

            </div>
          );

        })

      )}

    </div>

  );
}

export default Students;