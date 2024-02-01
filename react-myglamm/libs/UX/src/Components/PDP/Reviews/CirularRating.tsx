import { CircularProgressBar } from "@libStyles/TSStyles/circularProgressBar";
import React from "react";

import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";

const CircularRating = ({ title, value, text = "0.0" }: any) => (
  <div style={{ maxWidth: "80px" }}>
    {CircularProgressBar}

    <CircularProgressbarWithChildren value={value} styles={buildStyles({ pathColor: "var(--color1)" })}>
      <div className="text-xl font-bold">{text}</div>
    </CircularProgressbarWithChildren>

    {title && <p className="text-center mt-2 font-bold capitalize text-xs leading-tight text-gray-500">{title}</p>}
  </div>
);

export default CircularRating;
