
import React from 'react'
import  {Bus} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import "./LandingPage.css";

const Nav = () => {
const navigate=useNavigate();
  return (
    <div className='w-full flex justify-content-between align-items-center px-4 py-2'>
      <div className='flex align-items-center justify-content-center gap-2.5'>
        <Bus className='text-[#2B5FD2] size-7.5' />
        <h1 className='text-[20px] font-semibold'>SmartBus</h1>
      </div>
       <div className='flex items-center gap-3.5'>
      <button type='button' className='active:text-[#2B5FD2] font-medium btn btn-light'  onClick={()=>navigate("/login")}>Login</button>
      <button type='button' className='btn btn-primary' onClick={()=>navigate('/signup')}>Sign up</button>
       </div>

    </div>
  )
}

export default Nav
