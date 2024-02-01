import React from "react";
import { BestOffers } from "@typesLib/Payment";
import OfferTag from "../../../public/svg/offer-tag.svg";

const BestOffersForPaymentMethod = ({ bestOffer }: { bestOffer?: BestOffers }) => {
  if (!bestOffer) {
    return null;
  }

  return (
    <div className="flex items-center mb-4 mt-2">
      <OfferTag />
      <p className="text-xs ml-2" style={{ color: "#00977b" }}>
        {bestOffer.best_offer}
      </p>
    </div>
  );
};

export default BestOffersForPaymentMethod;
