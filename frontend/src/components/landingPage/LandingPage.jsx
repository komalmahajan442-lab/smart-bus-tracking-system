import React from 'react'
import Nav from './Nav'
import Section1 from './Section1'
import Section2 from './Section2'
import Section3 from './Section3'
import Section4 from './Section4'
import { Outlet } from 'react-router-dom'

const LandingPage= () => {
  return (
    <>
    <div className='h-screen w-full h-full'>
   <div className='pt-3.5 px-4.5'>
       <Nav />
       <Section1 />
        <Section2 />
        <Section3 />
        <Section4 />
   </div>

    </div>
    <Outlet/>
    </>
  )
}

export default LandingPage;