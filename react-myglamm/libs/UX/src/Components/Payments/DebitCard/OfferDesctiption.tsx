import React from "react";

import { IS_DESKTOP } from "@libConstants/COMMON.constant";

import OfferTag from "../../../../public/svg/offer-tag.svg";

const OfferDescription = ({ offerDescription }: { offerDescription?: string }) => {
  if (offerDescription) {
    if (IS_DESKTOP) {
      return (
        <div className="flex items-center  mb-2 mr-5">
          <OfferTag />

          <div className="text-xxl ml-4" style={{ color: "#00977b" }}>
            {offerDescription}
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center mb-2">
        <OfferTag />
        <p className="text-xs ml-2" style={{ color: "#00977b" }}>
          {offerDescription}
        </p>
      </div>
    );
  }

  return null;
};

export default OfferDescription;
