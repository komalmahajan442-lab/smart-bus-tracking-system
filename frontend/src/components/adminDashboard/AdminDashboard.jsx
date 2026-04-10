import React from 'react'
import Navbar from './Navbar'
import { Outlet, Route, Router, Routes } from 'react-router-dom'
import AddBus from './AddBus'
import AddRoute from './AddRoute'
import AssignBusToDriver from './AssignBusToDriver'
import AssignBusToStudent from './AssignBusToStudent'
import Section1 from './Section1'

function AdminDashboard() {
    return (
        <div style={{backgroundColor:'#f8fafc',minHeight:'100vh'}}>

        <Navbar/>
        
        <Outlet/>
           
        
        </div>
    )
}

export default AdminDashboard
