import React, { useEffect, useState } from "react";

import { useSelector } from "@libHooks/useValtioSelector";

import Adobe from "@libUtils/analytics/adobe";

import { ADOBE } from "@libConstants/Analytics.constant";

import { ValtioStore } from "@typesLib/ValtioStore";

import StarEmpty from "../../../..//public/svg/star-empty.svg";
import StarFilled from "../../../../public/svg/star-filled.svg";

const ReviewStars = ({
  getSelectedStars,
  margin = "m-1",
  size,
  adobeAssetType,
  preSelectedStart = 0,
  reset,
  resetValue = 0,
  interactive = true,
}: any) => {
  const starValues = [0, 1, 2, 3, 4];
  const [newState, setNew] = useState(preSelectedStart);

  const { profile } = useSelector((store: ValtioStore) => ({
    profile: store.userReducer.userProfile,
  }));

  useEffect(() => {
    if (reset) {
      setNew(resetValue);
    }
  }, [reset]);

  const handleStars = (starSelected: number) => {
    if (interactive) {
      setNew(starSelected);
      if (getSelectedStars) {
        getSelectedStars(starSelected);
      }
      if (adobeAssetType === ADOBE.ASSET_TYPE.ORDER_SUMMARY) {
        adobeClickEvent();
      }
    }
  };

  const adobeClickEvent = () => {
    // Adobe Analytics(107) - On Click - Wishlisht Button click on Header.
    (window as any).digitalData = {
      common: {
        linkName: `web|order checkout|payment success`,
        linkPageName: `web|order checkout|payment success`,
        newLinkPageName: "payment success",
        assetType: "payment success",
        newAssetType: "order summary",
        subSection: "order checkout step5",
        platform: ADOBE.PLATFORM,
        ctaName: `rating`,
        pageLocation: "",
      },
      user: Adobe.getUserDetails(profile),
    };
    Adobe.Click();
  };

  return (
    <React.Fragment>
      {starValues.slice(0, newState).map((val: number) => (
        <StarFilled
          height={size || "3rem"}
          width={size || "3rem"}
          key={val}
          className={`${margin} inline`}
          onClick={() => handleStars(val + 1)}
          role="img"
          aria-labelledby="rating"
        />
      ))}

      {starValues.slice(newState, starValues.length + 1).map((val: number) => (
        <StarEmpty
          height={size || "3rem"}
          width={size || "3rem"}
          key={val}
          className={`${margin} inline`}
          onClick={() => handleStars(val + 1)}
          role="img"
          aria-labelledby="rating"
        />
      ))}
    </React.Fragment>
  );
};

export default ReviewStars;
