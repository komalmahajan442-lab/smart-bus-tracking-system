import React from 'react'
import { useNavigate } from 'react-router-dom'

const Section1 = () => {
  const navigate=useNavigate();
  return (
    <div className='bg-[#f8fafc] py-5' >
<div className='p-3 m-5 d-flex flex-col gap-4 justify-center align-items-center'>
    <h1 className='text-center fs-30'>Smart Bus Tracking for Modern <br></br>Schools And Colleges</h1>
    <h5 className='text-center text-secondary'>Real-time tracking, automated notification and seamless coordination <br />between students, drivers and administrators.</h5>
    <div className=''>
        <button type='button' className='btn  btn-primary p-2 m-2' onClick={()=>navigate('/signup')}>Get Started</button>
        <button type='button' className='btn btn-light p-2 m-2' onClick={()=>navigate('/login')}>Sign in</button>
    </div>
</div>
    </div>
  )
}

export default Section1