import React from "react";

import OfferTag from "../../../public/svg/offer-tag.svg";

const BestOffers = ({ offers, showOfferTag, styledInParagraphTag }: any) => {
  if (offers) {
    return (
      <div className="flex items-center mb-2">
        {showOfferTag && <OfferTag className="h-12" />}

        {styledInParagraphTag ? (
          <p className="text-xl ml-4" style={{ color: "#00977b" }}>
            {offers?.best_offer}
          </p>
        ) : (
          <div className="text-xxl ml-4" style={{ color: "#00977b" }}>
            {offers?.best_offer}
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default BestOffers;
