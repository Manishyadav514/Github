import React, { useEffect, useState } from "react";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import { BestOffers } from "@typesLib/Payment";

/* Custom hook for fetching offers */
export const useFetchBestOffers = ({ paymentMethodType }: { paymentMethodType: string }) => {
  const [bestOffer, setBestOffer] = useState<BestOffers>();
  const [offerApplicable, setOfferApplicable] = useState<boolean>();

  const { paymentMethodOffers, payableAmount } = useSelector((store: ValtioStore) => ({
    paymentMethodOffers: store.paymentReducer.paymentMethodOffers,
    payableAmount: store.cartReducer.cart.payableAmount,
  }));

  useEffect(() => {
    const _paymentMethodOffer = paymentMethodOffers?.find(
      (paymentMethod: any) => paymentMethod.payment_method_type === paymentMethodType
    );

    const isAnyOfferApplicable = _paymentMethodOffer?.offers?.best_offer?.contains_offer;
    if (isAnyOfferApplicable) {
      setBestOffer(_paymentMethodOffer.offers.best_offer);
      setOfferApplicable(true);
    } else {
      setBestOffer(undefined);
      setOfferApplicable(false);
    }
  }, [paymentMethodOffers, payableAmount]);

  return { bestOffer, offerApplicable };
};
