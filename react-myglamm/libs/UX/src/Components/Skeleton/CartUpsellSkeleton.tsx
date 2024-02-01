import React from "react";
import { SkeletonStyle } from "./SkeletonStyle";

const CartUpsellSkeleton = ({ variants }: any) => (
  <div className={`px-2  ${variants?.glammClubUpsell === "1" ? "bg-[#E72246]" : ""}`}>
    {variants?.glammClubUpsell !== "1" ? <div style={SkeletonStyle} className="h-6 rounded-md mb-4 w-1/2" /> : null}
    <div className="flex flex-row">
      {[...Array(3)].map((_, i) => (
        <div className="h-60 mb-4 mr-6 shadow w-2/5 rounded-lg p-2 flex-sliderChild" key={i} style={SkeletonStyle} />
      ))}
    </div>
  </div>
);

export default CartUpsellSkeleton;
