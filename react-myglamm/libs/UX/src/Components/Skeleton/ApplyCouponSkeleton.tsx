import React from "react";

import { SkeletonStyle } from "./SkeletonStyle";

const ApplyCouponSkeleton = () => (
  <div className="px-3">
    <div style={SkeletonStyle} className="h-6 rounded-md mb-4 w-1/2" />

    {[...Array(3)].map((_, i) => (
      <div className="h-28 mb-4 rounded-md" key={i} style={SkeletonStyle} />
    ))}
  </div>
);

export default ApplyCouponSkeleton;
