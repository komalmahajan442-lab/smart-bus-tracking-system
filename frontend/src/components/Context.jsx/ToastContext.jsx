import { createContext, useState } from "react";

export const ToastContext=createContext();

export const ToastProvider=({children})=>{

     const [toast,setToast]=useState({open:false,
    message:null,
    severity:null})

    const showToast=(message,severity)=>{
setToast({open:true,message,severity});
    }
<ToastContext.ToastProvider value={{toast,setToast,showToast}}>
{children}
</ToastContext.ToastProvider>
    }
