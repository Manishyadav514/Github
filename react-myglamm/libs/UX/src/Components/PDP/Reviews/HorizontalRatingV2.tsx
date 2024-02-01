import React, { useState } from "react";
import ReviewStars from "./ReviewStars";
import { ADOBE } from "@libConstants/Analytics.constant";
import ReviewStarsV2 from "./ReviewStarsV2";

const HorizontalRatingV2 = ({ title, handleSubRatingStarIcon, reset, size }: any) => {
  const [starsSelected, setSelected] = useState<any>(0);

  const handleStarIcon = (starSelected: any) => {
    setSelected(starSelected);
    handleSubRatingStarIcon(title, starSelected);
  };

  return (
    <>
      <div className="mt-2">
        <div className=" w-full flex items-center">
          <p className=" w-3/6 align-middle flex-none md:flex-1 capitalize text-sm ">{title}</p>
          <span className="w-3/6 flex-none md:flex-1 text-right">
            <ReviewStarsV2
              adobeAssetType={ADOBE.ASSET_TYPE.PDP}
              getSelectedStars={handleStarIcon}
              preSelectedStart={starsSelected}
              size={size || "2rem"}
              reset={reset}
              resetValue={5}
            />
          </span>
        </div>
      </div>
    </>
  );
};

export default HorizontalRatingV2;
