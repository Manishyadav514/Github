import React from "react";

interface headerProps {
  title: string;
  underlineColor?: string;
}

const MiniPDPHeader = ({ title, underlineColor = "var(--color2)" }: headerProps) => (
  <h3
    className="text-18 font-semibold inline pr-1 bg-no-repeat"
    style={{
      backgroundImage: `linear-gradient(transparent 74%, ${underlineColor} 0px)`,
      backgroundSize: "100% 85%",
    }}
  >
    {title}
  </h3>
);

export default MiniPDPHeader;
