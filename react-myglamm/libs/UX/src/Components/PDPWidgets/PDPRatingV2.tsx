import React from "react";
import StarFilledGreen from "../../../public/svg/star-filled-green.svg";

const PDPRatingV2 = ({ avgRating, fontSize = 12, svgSize = 10 }: { avgRating: any; fontSize?: number; svgSize?: number }) => {
  const avgRatingWithPreFix = avgRating % 1 != 0 ? avgRating?.toFixed(1) : avgRating + ".0";
  if (avgRating) {
    return (
      <div className="flex justify-between items-center rounded-2xl border  bg-white border-ratingGreen max-w-fit relative">
        <span className="flex font-semibold h-full px-1.5 text-ratingGreen py-0.5">
          <p className="self-center" style={{ fontSize: `${fontSize}px`, lineHeight: `${fontSize}px` }}>
            {avgRatingWithPreFix}
          </p>
          <span>
            <StarFilledGreen
              height={svgSize}
              width={svgSize}
              className="ml-1"
              role="img"
              aria-labelledby="product rating"
              title="product rating"
            />
          </span>
        </span>
      </div>
    );
  }

  return null;
};

export default PDPRatingV2;
