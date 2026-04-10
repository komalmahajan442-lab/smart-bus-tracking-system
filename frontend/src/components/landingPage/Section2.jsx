import React from 'react'
import {MapPin, Bell, Users, Shield, Clock3, Bus} from 'lucide-react'

const Section2 = () => {

const CardData = [
    {
        icon: <MapPin className='text-[#2B5FD2]' />,
         title: "Real-Time Tracking",
         description:"Track bus location in real-time with GPS precision. Know exactly where your bus is at any moment."
    },
    {
        icon:<Bell className='text-green-500' />,
        title:"Smart Notifications",
        description: "Receive automated alerts for bus arrivals, departures, and delays. Stay informed every step of the way."
    },
    {
       icon:<Users className='text-[#2B5FD2]'/> ,
       title: "Multi-Role Support",
       description: "Dedicated dashboards for students, drivers, and administrators with role-specific features."
    },
    {
        icon:<Shield className='text-green-500'/> ,
        title:"Secure & Approved",
        description:"Admin approval required for all new accounts. Ensuring safety and security for everyone."
    },
    {
       icon:<Clock3 className='text-[#2B5FD2]'/> ,
       title:"Route Management",
       description:"Efficient route planning with estimated arrival times and schedule management."

    },
    {
        icon:<Bus className='text-green-500'/>,
        title:"Fleet Management",
        description:"Comprehensive tools for managing your entire fleet with maintenance tracking and analytics."
    }

]

  return (
    <div className='bg-white d-flex flex-col gap-3 w-full  md:mb-6 '>
     
         <h1 className='text-[28px] text-center font-medium m-2 p-3'>Key Features</h1>
         <div className='grid lg:grid-cols-3 md:grid-cols-2 gap-24 w-fit mx-auto mt-12'>
       {
        CardData.map((elem, index)=>{
            return(
               <div
          key={index}
          className="bg-white p-4 m-4 h-fit  text-black  mt-9 rounded-xl shadow-[0px_2px_2px_black] hover:shadow-[0px_1px_10px_black]  flex flex-col flex-wrap gap-3 align-item-center justify-center"
        >
          <div className="text-3xl ">{elem.icon}</div>

          <h3 className="text-lg font-semibold">{elem.title}</h3>

          <p className="text-gray-500 text-sm">{elem.description}</p>
        </div>
         ) })
         
       }
       </div>
    </div>
  )
}

export default Section2