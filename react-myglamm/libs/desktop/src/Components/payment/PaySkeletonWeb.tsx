import React from "react";

import { SkeletonStyle } from "@libComponents/Skeleton/SkeletonStyle";

const PaySkeletonWeb = () => {
  return (
    <div className="flex justify-between">
      <div className="w-1/5">
        <div className="h-4 rounded-full w-2/3 my-3" style={SkeletonStyle} />

        {new Array(5).fill("list").map(() => (
          <div className="h-16 rounded-md mb-2" style={SkeletonStyle} />
        ))}
      </div>

      <div className="w-4/5 pl-20">
        <div className="h-20 rounded-md mb-6" style={SkeletonStyle} />

        <div className="h-40 w-3/5 rounded-md" style={SkeletonStyle} />
      </div>
    </div>
  );
};

export default PaySkeletonWeb;
