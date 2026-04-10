import { Link, useNavigate } from "react-router-dom";

import {  useState } from "react";


const Navbar=()=>{
    const [dropdown,setDropdown]=useState(false);
   
    const navigate=useNavigate();

    const logout=()=>{
        localStorage.removeItem('token');
        navigate("/");
    }
    return (
        <>
<nav class="navbar navbar-expand-lg bg-white p-2">
  <div class="container-fluid my-nav">

    <div>
    <Link class="navbar-brand" to="/"><i class="fa-solid fa-bus-side text-primary"></i>    SmartBus </Link>
   </div>

    <div className="mx-2 px-2">
        <h5 role="button" onClick={()=>setDropdown(!dropdown)}></h5>
        {
            dropdown ?
            <div className="position-absolute end-0 mt-3   d-flex flex-col justify-content-center align-items-start h-30 w-[12rem] border border-gray-500 rounded-2xl">
                <h6 className="border-bottom w-100 pb-2 pt-2 px-2 mt-2">My Account</h6>
                
                <p role="button" className="border-bottom w-100 pb-2 px-2">My Profile</p>
                <p role="button" className=" w-100  px-2 pointer-cursor" onClick={logout}>Log Out</p>
            </div>
            :""
        }
    </div>
  </div>
</nav>
        </>
    )
}

export default Navbar;