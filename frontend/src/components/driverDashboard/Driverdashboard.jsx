import React from 'react'
import Navbar from './Navbar'
import Header from './Header'
import Stops from './Stops'
import Map from './Map'
import Students from './Students'

function Driverdashboard() {
    return (
        <>
        <div style={{background:"#f8fafc"}}>
 <Navbar/>
        <Header/>
        <Stops/>
        <Students/>
        <Map/>
        </div>
       
        </>
    )
}

export default Driverdashboard
