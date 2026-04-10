
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../Context.jsx/Context";
import {toast} from "react-toastify";

const Login = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setroles] = useState("");
  

   
   
  const handleLogin=async(e)=>{

e.preventDefault();

try{
const res=await axios.post("http://localhost:9000/login",
  {email,password,role:roles}
);
console.log(res.data);

  toast.success(res.data.message || "Login successful!");
const role=res.data.user.role;

localStorage.setItem("token",res.data.token);
localStorage.setItem("role",role);
if(role==="admin"){
  navigate("/admin/dashboard");
}else if(role=="driver"){
  navigate("/driver/dashboard");
}else{
  navigate("/student/dashboard");
}


}catch(err){
  if (err.response) {
      toast.error(err.response.data.message || "Something went wrong!");
    } else {
      toast.error(err.message || "Network error!");
    }
  console.log(err);
}

}

  
  return (
    <div className="h-screen flex justify-center items-center bg-[#F8FAFB] p-5">

      <div className="w-[400px] h-[420px] bg-white rounded-xl flex flex-col items-center gap-2 shadow p-4">

        <h1 className="font-semibold text-2xl">
          Welcome Back
        </h1>

        <p className="text-center opacity-45 text-[15px]">
          Sign in to access your dashboard
        </p>

        <form
          onSubmit={handleLogin}
          className="w-full flex flex-col gap-3 mt-6"
        >

              <select
                value={roles}
                onChange={(e) => setroles(e.target.value)}
                className="border border-[#918f8f3b] bg-[#f3f3f8f5] focus:outline-[#3179E4] p-2 rounded-[10px]"
                required
              >
                <option value="">Select Role</option>
                <option value="student">Student</option>
                <option value="driver">Driver</option>
                <option value="admin">Admin</option>
              </select>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="border border-[#918f8f3b] bg-[#f3f3f8f5] focus:outline-[#3179E4] p-2 rounded-[10px]"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="border border-[#918f8f3b] bg-[#f3f3f8f5] focus:outline-[#3179E4] p-2 rounded-[10px]"
            required
          />

          <button
            type="submit"
            className="btn btn-primary"
            
          >
            Login
          </button>

          <div className="flex justify-center gap-2 mt-2">

            <p className="opacity-50 text-[14px]">
              Don't have an account?
            </p>

            <p
              onClick={()=>navigate("/signup")}
              className="text-[14px] text-[#2B5FD2] cursor-pointer"
            >
              Sign up
            </p>

          </div>

        </form>

      </div>

    </div>
  );
};

export default Login;
