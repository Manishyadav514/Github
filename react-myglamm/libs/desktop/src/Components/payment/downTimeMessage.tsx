import React from "react";

const DownTimeMessage = ({ downtimeMsg, className = "text-xxs" }: { downtimeMsg?: string; className?: string }) => {
  if (typeof downtimeMsg === "string" && downtimeMsg.trim()) {
    return (
      <div className="flex items-center p-4 mb-6 rounded" style={{ backgroundColor: "#FDEED7" }}>
        <img src="https://files.myglamm.com/site-images/original/downtime-warning.png" alt="Downtime" />
        <p className={`m-0 ml-5 ${className}`}>{downtimeMsg}</p>
      </div>
    );
  }

  return null;
};

export default DownTimeMessage;
