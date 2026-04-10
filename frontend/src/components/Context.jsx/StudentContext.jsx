import {useEffect,useState,createContext} from 'react';
import axios from 'axios';

export const StudentContext=createContext();

export const StudentProvider=({children})=>{



const [student,setStudent]=useState(null);

const fetchDashboard = async () => {
    try {
      const res = await axios.get(
        "https://smart-bus-tracking-system.onrender.com/student/dashboard",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setStudent(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(()=>{
    fetchDashboard();
  },[]);

return(
<StudentContext.Provider value={{student,setStudent,fetchDashboard}}>
{children}
</StudentContext.Provider>
)

}