import React from 'react'
import { useNavigate } from 'react-router-dom'

const Section4 = () => {
  const navigate=useNavigate();
  return (
    <div className='w-full h-[300px] bg-[#3179e4] py-12 flex flex-col items-center gap-2 text-white p-4'>
     <h1 className='text-[28px] text-center font-medium'>Ready to Get Started?</h1>
     <p>Join hundreds of schools using SmartBus for safer, smarter transportation</p>
     <button className='px-4 py-3 rounded-[8px] bg-[#CCD5EE] text-black mt-5 active:scale-90' onClick={()=>navigate('/signup')}>Sign up Now</button>
    </div>
  )
}

export default Section4