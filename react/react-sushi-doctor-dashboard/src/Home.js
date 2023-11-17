import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className='home'>
        
      <div className="button-container">
        <button 
          className="square-button" 
          onClick={()=> 
          navigate("/Patient")}
        >
          Daily Work Flow
        </button>
        
        <button 
          className="square-button"
          onClick={() =>
          navigate("/Managment")}
        >
            Managment
        </button>
      </div>
    </div>
  );
};

export default Home;
