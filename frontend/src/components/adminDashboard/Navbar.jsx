import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";


const Navbar=()=>{
  const navigate=useNavigate();

  const logOut=()=>{
    localStorage.removeItem('token');
    localStorage.clear();
navigate("/");
  }
    return (
        <>
<nav class="navbar navbar-expand-lg  px-5 py-3" style={{backgroundColor:'white'}}>
  <div class="container-fluid my-nav d-flex justify-between gap-50">

    <div>
    <Link class="navbar-brand" to="/"><i class="fa-solid fa-bus-side"></i> SmartBus </Link>
   </div>

    <div class="navbar-collapse" id="navbarSupportedContent" >
      <ul class="navbar-nav mb-2 mb-lg-0 d-flex gap-2">
        <li class="nav-item">
          <Link class="nav-link active" aria-current="page" to="/admin/dashboard/addbus">Add Bus</Link>
        </li>
        <li class="nav-item">
          <Link class="nav-link" to="/admin/dashboard/addroute">Add Route and Stops</Link>
        </li>

        <li class="nav-item">
          <Link class="nav-link" to="/admin/dashboard/assignment-to-driver">Driver Assignments</Link>
        </li>

        <li class="nav-item">
          <Link class="nav-link" to="/admin/dashboard/assignment-to-student">Student Assignments</Link>
        </li>

        <Link className="nav-link" to="/admin/dashboard/live-tracking">
  Live Tracking
</Link>

        <button type="btn" className="btn btn-primary" onClick={logOut}>Log Out</button>
        </ul>

    </div>

  </div>
</nav>
        </>
    )
}

export default Navbar;