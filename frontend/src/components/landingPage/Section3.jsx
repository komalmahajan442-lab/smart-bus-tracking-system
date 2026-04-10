import React from 'react'

const Section3 = () => {

    const works = [
        {
            id:1,
            title:"Sign Up",
            details:"Create your account as a student or driver, Quick and easy registration process."
        },
        {
          id:2,
            title:"Get Approved",
            details:"wait for admin approval to acytivate your account. We verify all users for safety."
        },
        {
               id:3,
            title:"Start Tracking",
            details:"Access your dashboard and start tracking buses in real-time with all features unlocked."
        }
    ]


  return (
    <div className='bg-[#F8FAFB] w-full  py-5 px-5'>
     
        <h1 className='text-[28px] text-center font-medium p-2'>How it Works</h1>
      
  
    <div className="flex flex-col items-center lg:flex-row gap-18 lg:gap-12 justify-center mt-18">
      {works.map((work) => (
        <div
          key={work.id}
          className="hover:bg-white p-4 shadow-lg rounded-xl  w-64 text-center hover:shadow-2xl transition-shadow h-fit"
         
        >
            <h1   className={`flex items-center justify-center mx-auto mb-4 text-white w-fit px-5 py-3 font-bold rounded-full  ${
      work.id === 1
        ? "bg-blue-500"
        : work.id === 2
        ? "bg-blue-500"
        : "bg-green-500"
    }`}>{work.id}</h1>
          <h3 className="text-xl font-semibold mb-3">{work.title}</h3>
          <p className="text-gray-600">{work.details}</p>
        </div>
      ))}
    </div>

</div>
 
  )
}

export default Section3