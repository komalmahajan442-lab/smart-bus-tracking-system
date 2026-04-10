
import './App.css'

import Driverdashboard from './components/driverDashboard/Driverdashboard'
import LandingPage from './components/landingPage/LandingPage'
import Login from './components/landingPage/Pages/Login'
import {Routes,Route, Router} from "react-router-dom";
import Signup from './components/landingPage/Pages/Signup'
import ProtectedRoute from './components/landingPage/ProtectedRoute'
import AdminDashboard from './components/adminDashboard/AdminDashboard'
import StudentDasboard from './components/studentDashboard/StudentDasboard'
import  Section1  from './components/adminDashboard/Section1';
import AddBus from './components/adminDashboard/AddBus';
import AddRoute from './components/adminDashboard/AddRoute';
import AssignBusToDriver from './components/adminDashboard/AssignBusToDriver';
import AssignBusToStudent from './components/adminDashboard/AssignBusToStudent';
import { MyProvider } from './components/Context.jsx/Context';
import { DriverProvider } from './components/Context.jsx/DriverContext';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StudentProvider } from './components/Context.jsx/StudentContext';
import LiveTracking from './components/adminDashboard/LiveTracking';

function App() {
 
  return (
    <>
   
    <ToastContainer position="top-right" autoClose={3000} />

<Routes>

      <Route path='/' element={<LandingPage/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/admin/dashboard/*' element={<ProtectedRoute allowedRole={"admin"}> <MyProvider><AdminDashboard/></MyProvider></ProtectedRoute>}>
     
   <Route index element={<Section1/>}/>         
 <Route path='addbus' element={<AddBus/>}></Route>
  <Route path='addroute' element={<AddRoute/>}/> 
  <Route path='assignment-to-driver' element={<AssignBusToDriver/>} /> 
  <Route path='assignment-to-student' element={<AssignBusToStudent/>} />    
       <Route path="live-tracking" element={<LiveTracking />} />
      </Route>
     
<Route path='/driver/dashboard' element={<ProtectedRoute allowedRole={"driver"}> <DriverProvider><Driverdashboard/></DriverProvider></ProtectedRoute>}/>
    
      
      <Route path='/student/dashboard' element={<ProtectedRoute allowedRole={"student"}><StudentProvider><StudentDasboard/></StudentProvider></ProtectedRoute>}/>

    </Routes>
  
    
    
    
    </>
  )
}

export default App
