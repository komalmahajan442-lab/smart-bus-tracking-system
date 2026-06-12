import React, { useContext, useState } from "react";
import { MyContext } from "../Context.jsx/Context";
import API from "./utilsapi";
import { toast } from "react-toastify";

function AddBus() {
  const { buses = [], fetchBuses, setBuses } = useContext(MyContext);

  const [busNumber, setBusNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddBus = async (e) => {
    e.preventDefault();

    if (!busNumber.trim() || Number(capacity) <= 0) {
      return toast.error("Please enter valid bus details");
    }

    try {
      setLoading(true);

      const res = await API.post("/createbus", {
        busnumber: busNumber,
        capacity: Number(capacity),
      });

      console.log("API Response:", res.data);

      toast.success(res.data.message || "Bus added successfully");

      // Sirf tab add karo jab bus object mile
      if (res.data.bus) {
        setBuses((prev = []) => [...prev, res.data.bus]);
      }

      // Latest data fetch kar lo
      await fetchBuses();

      setBusNumber("");
      setCapacity("");
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to create bus"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          {/* Add Bus Card */}
          <div className="card shadow-lg rounded-4">
            <div className="card-header bg-primary text-white text-center">
              <h4>🚌 Add New Bus</h4>
            </div>

            <div className="card-body">
              <form onSubmit={handleAddBus}>
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

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={loading}
                  >
                    {loading ? "Creating Bus..." : "Add Bus"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Bus List */}
          <div className="card mt-4 shadow-sm">
            <div className="card-header bg-dark text-white">
              Existing Buses
            </div>

            <div className="card-body">
              {!buses || buses.length === 0 ? (
                <p className="text-muted">No buses added yet</p>
              ) : (
                buses
                  .filter((bus) => bus) // undefined values remove
                  .map((bus) => (
                    <div
                      key={bus._id}
                      className="d-flex justify-content-between border-bottom py-2"
                    >
                      <span>🚌 {bus.busnumber || "N/A"}</span>

                      <span className="text-muted">
                        Capacity: {bus.capacity || 0}
                      </span>
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

export default AddBus;