import React from 'react';
import './Managment.css';

const Managment = () => {
  return (
    <div className='managment'>
      <div className="button-container">
        <button className="square-button">Personal Management</button>
        <button className="square-button">Setting</button>
        <button className="square-button">Clinic Managment</button>
        <button className="square-button">Templates</button>
      </div>
    </div>
  );
};

export default Managment;
