import React, { useContext, useState } from "react";
import { MyContext } from "../Context.jsx/Context";
import API from "./utilsapi";
import { toast } from "react-toastify";

function AddBus() {

  const { buses, fetchBuses } = useContext(MyContext);

  const [busNumber, setBusNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddBus = async (e) => {

    e.preventDefault();

    if (!busNumber.trim() || capacity <= 0) {
      return toast.error("Please enter valid bus details");
    }

    try {

      setLoading(true);

      const res = await API.post("/createbus", {
        busnumber: busNumber,
        capacity
      });

      toast.success(res.data.message);

      fetchBuses();

      setBusNumber("");
      setCapacity("");

    } catch (err) {

      toast.error(err.response?.data?.message || err.message);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-6">

          {/* CARD */}
          <div className="card shadow-lg rounded-4">

            <div className="card-header bg-primary text-white text-center">

              <h4>🚌 Add New Bus</h4>

            </div>

            <div className="card-body">

              <form onSubmit={handleAddBus}>

                {/* BUS NUMBER */}
                <div className="mb-3">

                  <label className="form-label">Bus Number</label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter bus number"
                    value={busNumber}
                    onChange={(e) => setBusNumber(e.target.value)}
                  />

                </div>

                {/* CAPACITY */}
                <div className="mb-3">

                  <label className="form-label">Capacity</label>

                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter bus capacity"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                  />

                </div>

                {/* BUTTON */}
                <div className="d-grid">

                  <button
                    className="btn btn-success"
                    disabled={loading}
                  >

                    {loading ? "Creating Bus..." : "Add Bus"}

                  </button>

                </div>

              </form>

            </div>

          </div>

          {/* BUS LIST */}
          <div className="card mt-4 shadow-sm">

            <div className="card-header bg-dark text-white">

              Existing Buses

            </div>

            <div className="card-body">

              {buses.length === 0 && (
                <p className="text-muted">No buses added yet</p>
              )}

              {buses.map(b => (

                <div
                  key={b._id}
                  className="d-flex justify-content-between border-bottom py-2"
                >

                  <span>🚌 {b.busnumber}</span>

                  <span className="text-muted">
                    Capacity: {b.capacity}
                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default AddBus;