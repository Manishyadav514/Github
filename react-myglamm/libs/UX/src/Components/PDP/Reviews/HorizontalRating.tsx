import React, { useState } from "react";
import ReviewStars from "./ReviewStars";
import { ADOBE } from "@libConstants/Analytics.constant";

const HorizontalRating = ({ title, handleSubRatingStarIcon, reset, size }: any) => {
  const [starsSelected, setSelected] = useState<any>(0);

  const handleStarIcon = (starSelected: any) => {
    setSelected(starSelected);
    handleSubRatingStarIcon(title, starSelected);
  };

  return (
    <>
      <div className="mt-2">
        <div className=" w-full flex items-center">
          <div className=" w-2/6 align-middle flex-none md:flex-1 capitalize" style={{ color: "#717171" }}>
            {title}
          </div>
          <span className="w-4/6 flex-none md:flex-1 text-right">
            <ReviewStars
              adobeAssetType={ADOBE.ASSET_TYPE.PDP}
              getSelectedStars={handleStarIcon}
              preSelectedStart={starsSelected}
              size={size || "2rem"}
              reset={reset}
              resetValue={0}
            />
          </span>
        </div>
      </div>
    </>
  );
};

export default HorizontalRating;
