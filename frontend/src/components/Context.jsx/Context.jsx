import { createContext, useEffect, useState } from "react";
import API from "../adminDashboard/utilsapi";
import { toast } from "react-toastify";

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [driver, setDriver] = useState([]);
  const [student, setStudent] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [users, setUsers] = useState([]);
  const [userpending, setUserpending] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [studentsdetail,setStudentsdetail]=useState([]);


  const [studentAssignments, setStudentAssignments] = useState([]);

const fetchStudentAssignments = async () => {
  try {
    const res = await API.get("/student-assignments");
    setStudentAssignments(res.data);
    toast.success(res.data.message);


  } catch (err) {
    console.log(err);
  }
};

  // ✅ FETCH DASHBOARD (MAIN API)
  const fetchDashboard = async () => {
    try {
      const res = await API.get("/admin");

      setBuses(res.data.buses || []);
      setDriver(res.data.drivers || []);
      setStudent(res.data.students || []);
      setDashboard(res.data);

      console.log("Dashboard Data:", res.data); // ✅ correct

    } catch (err) {
      console.log(err.message);
    }
  };

  // ✅ OTHER APIs
  const fetchRoutes = async () => {
    try {
      const res = await API.get("/getroute");
      setRoutes(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const getAssignments = async () => {
    try {
      const res = await API.get("/assignments");
      setAssignments(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/getusers");
      setUsers(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchPendingUsers = async () => {
    try {
      const res = await API.get("/getpendinguser");
      setUserpending(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

 const fetchBuses=async ()=>{
  try{
const res=await API.get("/getbus");
setStudentsdetail(res.data);
  }catch (err) {
      console.log(err.message);
    }
 }
  
  // ✅ INITIAL LOAD
  useEffect(() => {
    fetchDashboard(); // 🔥 main data
    fetchRoutes();
    getAssignments();
    fetchUsers();
    fetchPendingUsers();
    fetchStudentAssignments();
    fetchBuses();
  }, []);

  return (
    <MyContext.Provider
      value={{
        buses,
        routes,
        driver,
        student,
        assignments,
        users,
        userpending,
        dashboard,

        setBuses,
        setUsers,
        setUserpending,
fetchBuses,
        fetchDashboard,
        fetchRoutes,
        getAssignments,
        fetchUsers,
        fetchPendingUsers,
        fetchStudentAssignments,studentAssignments,setStudentAssignments,studentsdetail,setStudentsdetail
      }}
    >
      {children}
    </MyContext.Provider>
  );
};