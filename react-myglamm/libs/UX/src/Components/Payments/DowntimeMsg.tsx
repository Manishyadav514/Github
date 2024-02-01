import React from "react";

interface downtimeProps {
  downtimeMsg?: string;
  className?: string;
}

const DowntimeMsg = ({ downtimeMsg, className = "text-xs" }: downtimeProps) => {
  if (typeof downtimeMsg === "string" && downtimeMsg.trim()) {
    return (
      <div className="flex items-center p-2 mb-6 rounded" style={{ backgroundColor: "#FDEED7" }}>
        <img src="https://files.myglamm.com/site-images/original/downtime-warning.png" alt="Downtime" />
        <p className={`ml-2 ${className}`}>{downtimeMsg}</p>
      </div>
    );
  }

  return null;
};

export default DowntimeMsg;
