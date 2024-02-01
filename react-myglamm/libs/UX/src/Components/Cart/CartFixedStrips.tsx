import React from "react";
import dynamic from "next/dynamic";

const FreeShippingStrip = dynamic(() => import("./FreeShippingStrip"), { ssr: false });

const CartFixedStrips = () => {
  //FIXED ADD PRODUCTS WORTH STRIP - SHOWN CONDITIONALY WHEN SHIPPING CHARGES APPLICABLE
  return <FreeShippingStrip />;
};

export default CartFixedStrips;
