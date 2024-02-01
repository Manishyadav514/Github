import { PDP_VARIANTS } from "@libStore/valtio/PDP.store";
import React, { Fragment } from "react";

import StarEmpty from "../../../../public/svg/star-empty.svg";
import StarFilled from "../../../../public/svg/star-filled.svg";
import StarEmptyGreen from "../../../../public/svg/star-empty-green.svg";
import StarFilledGreen from "../../../../public/svg/star-filled-green.svg";

const RatingStar = ({ star, width = 20, height = 20 }: { star: number; width?: number; height?: number }) => {
  const TotalStars = 5;
  const {newPDPRevamp} = PDP_VARIANTS
  
  if(newPDPRevamp === "1"){
    return <>
      {[...Array(star).keys()].map((i: number, index: number) => (
        <StarFilledGreen key={index} width={width} height={height} className="mr-1 mb-1" role="img" aria-labelledby="ratings" />
      ))}
      {[...Array(TotalStars - star).keys()].map((i: number, index: number) => (
        <StarEmptyGreen key={index} width={width} height={height} className="mr-1 mb-1" role="img" aria-labelledby="ratings" />
      ))}
    </>
  }

  return (
    <Fragment>
      {[...Array(star).keys()].map((i: number, index: number) => (
        <StarFilled key={index} width={width} height={height} className="mr-1 mb-1" role="img" aria-labelledby="ratings" />
      ))}
      {[...Array(TotalStars - star).keys()].map((i: number, index: number) => (
        <StarEmpty key={index} width={width} height={height} className="mr-1 mb-1" role="img" aria-labelledby="ratings" />
      ))}
    </Fragment>
  );
};
export default RatingStar;
