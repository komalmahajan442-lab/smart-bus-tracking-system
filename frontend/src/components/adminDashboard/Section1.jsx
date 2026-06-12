import React, { useContext, useState } from 'react';
import { MyContext } from '../Context.jsx/Context';
import API from './utilsapi';
import { toast } from 'react-toastify';

function Section1() {
  const { buses, driver, student, users=[], userpending=[], setUsers, setUserpending ,fetchDashboard} = useContext(MyContext);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("dashboard");

  // 🔍 FILTER
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) &&
u.role !=="admin"
  );

  // ✅ APPROVE
  const handleAccept = async (id) => {
    await API.put(`/approveuser/${id}`);
    toast.success("User Approved");

    const approved = userpending.find(u => u._id === id);
    setUsers(prev => [...prev, { ...approved, status: "active" }]);
    setUserpending(prev => prev.filter(u => u._id !== id));
  };

  const deleteUser = async (id) => {
  if (!window.confirm("Are you sure you want to delete this user?")) return;

  await API.delete(`/deleteuser/${id}`);
  setUsers(prev => prev.filter(user => user._id !== id));
  fetchDashboard();
  toast.success("user deleted successfully");
};


  return (
    <div className="container mt-4">

      {/* 🔥 HEADER */}
      <div className="p-4 rounded-4 mb-4 text-white"
        style={{ background: "linear-gradient(135deg,#4e73df,#224abe)" }}>
        <h2>🚍 SmartBus Admin Dashboard</h2>
        <p>Manage buses, routes, drivers and students efficiently</p>
      </div>

      {/* 📊 STATS */}
      <div className="row text-center mb-4">
        {[
  { title: "Buses", value: buses.length, icon: "🚌", tab: "buses" },
  { title: "Drivers", value: driver.length, icon: "👨‍✈️", tab: "drivers" },
  { title: "Students", value: student.length, icon: "🎓", tab: "students" },
  { title: "Pending", value: userpending.length, icon: "⏳", tab: "pending" }
].map((item, i) => (
  <div className="col-md-3" key={i}>
    <div
      className="card shadow border-0 p-3 rounded-4"
      style={{ cursor: "pointer" }}
      onClick={() => setTab(item.tab)}
    >
      <h3>{item.icon}</h3>
      <h5>{item.title}</h5>
      <h4>{item.value}</h4>
    </div>
  </div>
))}
      </div>

      {/* 🔘 TABS */}
      <div className="d-flex gap-2 mb-3">
        {["dashboard", "users", "drivers", "students", "buses", "pending"].map(t => (
          <button
            key={t}
            className={`btn ${tab === t ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => setTab(t)}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* 🔍 SEARCH */}
      {tab === "users" && (
        <input
          className="form-control mb-3"
          placeholder="Search users..."
          onChange={(e) => setSearch(e.target.value)}
        />
      )}

      {/* 👥 USERS */}
      {tab === "users" && (
        <table className="table table-hover shadow rounded">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`badge ${u.status === "active" ? "bg-success" : "bg-warning"}`}>
                    {u.status}
                  </span>
                </td>

                 <td>
    <button className="btn btn-danger btn-sm me-2" onClick={() => deleteUser(u._id)}>
      Delete
    </button>
    <button className="btn btn-warning btn-sm">
      Deactivate
    </button>
  </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === "drivers" && (
  <table className="table table-hover">
    <thead className="table-dark">
      <tr>
        <th>Name</th>
        <th>Email</th>
      </tr>
    </thead>
    <tbody>
      {driver.map(d => (
        <tr key={d._id}>
          <td>{d.name}</td>
          <td>{d.email}</td>
        </tr>
      ))}
    </tbody>
  </table>
)}

{tab === "students" && (
  <table className="table table-hover">
    <thead className="table-dark">
      <tr>
        <th>Name</th>
        <th>Email</th>
      </tr>
    </thead>
    <tbody>
      {student.map(s => (
        <tr key={s._id}>
          <td>{s.name}</td>
          <td>{s.email}</td>
        </tr>
      ))}
    </tbody>
  </table>
)}
{tab === "buses" && (
  <table className="table table-hover">
    <thead className="table-dark">
      <tr>
        <th>Bus Number</th>
        <th>Capacity</th>
      </tr>
    </thead>
    <tbody>
      {buses.map(bus => (
        <tr key={bus._id}>
          <td>{bus.busnumber}</td>
          <td>{bus.capacity}</td>
        </tr>
      ))}
    </tbody>
  </table>
)}

      {/* ⏳ PENDING */}
      {tab === "pending" && (
        <div className="row">
          {userpending.map(u => (
            <div className="col-md-4" key={u._id}>
              <div className="card p-3 shadow rounded-4">
                <h5>{u.name}</h5>
                <p>{u.email}</p>
                <button className="btn btn-success btn-sm"
                  onClick={() => handleAccept(u._id)}>
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Section1;