import React from 'react';
import './Patient.css';

import { useNavigate } from 'react-router-dom';

const Patient = () => {
  const navigate = useNavigate();

  return (
    <div className='patient'>
      <div className="button-container">
        <button 
          className="square-button"
          onClick={()=>
          navigate('/Outpatients')} 
        >
          Out Patients
        </button>

        <button 
          className="square-button"
          onClick={()=> 
            navigate("/Inpatients")}
        >  
          Inpatients
        </button>
        <button className="square-button">Follow Up Patients</button>
        <button className="square-button">Referrals</button>
        <button className="square-button">Communication</button>
        <button className="square-button">Tele Medicine</button>
        <button className="square-button">Speciality Specific Updates</button>
        <button className="square-button">Health Statistics</button>
      </div>
    </div>
  );
};

export default Patient;
