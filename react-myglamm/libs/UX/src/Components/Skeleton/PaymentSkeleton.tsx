import React, { Fragment } from "react";

import { SkeletonStyle } from "./SkeletonStyle";

const PaymentSkeleton = () => (
  <Fragment>
    <div className="h-24 rounded-md m-2 mb-8" style={SkeletonStyle} />

    {[...Array(6)].map((_, i) => (
      <div className="h-16 rounded-md my-4 mx-2" style={SkeletonStyle} key={i} />
    ))}
  </Fragment>
);

export default PaymentSkeleton;
