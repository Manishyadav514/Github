import React from "react";
import { useSelector } from "@libHooks/useValtioSelector";

import useTranslation from "@libHooks/useTranslation";
import OfferImg from "../../../public/svg/upsellPaymentOffer.svg";
import { ValtioStore } from "@typesLib/ValtioStore";
import clsx from "clsx";

const FreeShippingStrip = ({ showStripOnPayments = false }: { showStripOnPayments?: boolean }) => {
  const { t } = useTranslation();
  const { payableAmount, shippingCharges, freeShippingThreshold, totalDutyCharges } = useSelector(
    (store: ValtioStore) => store.cartReducer.cart
  );

  /* Show Strip in case there's some shipping charges removing duty */
  if (shippingCharges - (totalDutyCharges || 0) && t("shipping")?.addProductsWorth) {
    const productsWorthString = t("shipping")?.addProductsWorth?.replace(
      /\{\{(.*?)\}\}/,
      `${parseFloat((freeShippingThreshold - payableAmount + shippingCharges).toFixed(2))} `
    );

    return (
      <div
        style={{ boxShadow: !showStripOnPayments ? "rgba(0, 0, 0, 0.1) 0px -4px 4px 0px" : "" }}
        className={clsx(
          "",
          !showStripOnPayments
            ? "sticky w-full text-sm p-3 bg-color2 inset-x-0 flex justify-center items-center bottom-16 z-20"
            : "flex items-start bg-green-50 p-2 mt-2"
        )}
      >
        {/* <FireWorks /> */}

        {showStripOnPayments ? (
          <OfferImg className="w-5 h-5" />
        ) : (
          <img
            width="24"
            src={showStripOnPayments ? "" : "https://files.myglamm.com/site-images/original/fireworks.png"}
            alt="fireworks"
            className="mr-2"
          />
        )}

        <span className="ml-2" dangerouslySetInnerHTML={{ __html: productsWorthString || "" }} />
      </div>
    );
  }

  return null;
};

export default FreeShippingStrip;
