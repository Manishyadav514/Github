import React from "react";
import clsx from "clsx";

import StarFilled from "../../../public/svg/star-filled.svg";
import StarFilledGreen from "../../../public/svg/star-filled-green.svg";
import { nFormatter } from "@productLib/pdp/HelperFunc";

const PDPAvgRating = ({
  avgRating,
  totalCount,
  size,
  PDP = false,
  isNewDesign = false,
  source,
}: {
  avgRating?: number | string;
  totalCount?: number;
  size?: number;
  PDP?: boolean;
  isNewDesign?: boolean;
  className?: string;
  source?: string;
}) => {
  if (avgRating) {
    return (
      <div
        className={clsx(
          "flex justify-between items-center rounded-2xl border  bg-white",
          PDP ? "h-7" : isNewDesign ? "h-4" : "h-5",
          isNewDesign ? "border-ratingGreen max-w-fit relative" : "border-gray-100",
          source === "trial-catalogue" ? "" : "relative"
        )}
      >
        <span
          className={clsx(
            " flex  font-semibold  h-full items-center justify-center",
            PDP ? "text-15 px-3" : isNewDesign ? "text-10 px-1.5" : "text-xs px-1",
            isNewDesign ? "text-ratingGreen " : "border-r border-gray-100"
          )}
        >
          <p className="pl-0.5"> {avgRating}</p>
          {isNewDesign ? (
            <StarFilledGreen
              height={size || 13}
              width={size || 13}
              className=" ml-1"
              role="img"
              aria-labelledby="product rating"
              title="product rating"
            />
          ) : (
            <StarFilled
              height={size || 13}
              width={size || 13}
              className=" ml-1"
              role="img"
              aria-labelledby="product rating"
              title="product rating"
            />
          )}
        </span>
        {!isNewDesign && (
          <p className={`text-gray-600 ${PDP ? "text-15 px-3" : "text-xs pl-1 pr-1.5"}`}>{nFormatter(totalCount, 1)}</p>
        )}
      </div>
    );
  }

  return <div hidden />;
};

export default PDPAvgRating;
