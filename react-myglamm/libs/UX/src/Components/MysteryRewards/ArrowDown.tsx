import React from "react";

const ArrowDown = ({ className, color }: any) => {
  return (
    <div className={className}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="m19 9-7 7-7-7" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
  );
};

export default ArrowDown;
