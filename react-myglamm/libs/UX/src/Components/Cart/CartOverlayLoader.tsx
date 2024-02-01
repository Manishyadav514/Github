import React from "react";
import LoadSpinner from "@libComponents/Common/LoadSpinner";

const CartOverlayLoader = ({ show }: { show?: boolean }) => {
  if (show) {
    return (
      <div className="w-screen h-screen fixed z-50 inset-0 bg-[#00000063]">
        <LoadSpinner className="w-16 m-auto inset-0 absolute" />
      </div>
    );
  }

  return null;
};

export default CartOverlayLoader;
