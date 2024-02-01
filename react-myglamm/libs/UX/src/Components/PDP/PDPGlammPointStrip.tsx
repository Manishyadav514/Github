import React from "react";
import GoodPointsCoinIcon from "@libComponents/Common/GoodPointsCoinIcon";

const PDPGlammPointStrip = ({ formatPrice }: any) => {
  return (
    <div className="flex justify-between items-baseline">
      <p className="flex justify-start items-center text-xs mt-2">
        Or Pay <span className="font-semibold text-sm mx-0.5">{formatPrice(17800, true)}</span> +
        <GoodPointsCoinIcon className="w-3 h-3 mx-1" />
        <span className="text-sm font-semibold mr-1">20 </span>Good Points
      </p>
      <span className="text-xxs mx-2 text-gray-400">T&C &#9432;</span>
    </div>
  );
};

export default PDPGlammPointStrip;
