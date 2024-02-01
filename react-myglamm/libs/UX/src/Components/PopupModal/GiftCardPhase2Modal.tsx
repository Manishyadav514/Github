import React, { useEffect, useState } from "react";
import Image from "next/image";

import PopupModal from "./PopupModal";

import { useSelector } from "@libHooks/useValtioSelector";
import useTranslation from "@libHooks/useTranslation";

import { formatPrice } from "@libUtils/format/formatPrice";

import { ValtioStore } from "@typesLib/ValtioStore";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import { ADOBE } from "@libConstants/Analytics.constant";

import { adobeCloseGCModal } from "@checkoutLib/Payment/Payment.Analytics";

import Checkbox from "../../../public/svg/checkbox.svg";

const giftCardPhase2Modal = {
  title: "You have unlocked Exclusive GlammClub Gift Card",
  subtitle: `You can redeem this on your next order`,
};

const GiftCardPhase2Modal = ({
  onClose,
  show,
  giftCard,
  setShowGiftCardTermsAndConditions,
  handleAddToBag,
  upsellData,
}: {
  onClose: () => void;
  show: boolean;
  giftCard: any;
  setShowGiftCardTermsAndConditions: (_: boolean) => void;
  setShowGiftCardModal: (_: boolean) => void;
  handleAddToBag: (product: any, upsellData: any, ctaName: string) => void;
  upsellData: any;
}) => {
  const { cart } = useSelector((store: ValtioStore) => ({
    cart: store.cartReducer.cart,
  }));
  const { t } = useTranslation();
  const [isChecked, setIsChecked] = useState(true);

  const shoppingBagValue = formatPrice(
    Number(formatPrice(cart.payableAmount + (cart.appliedGlammPoints || 0) - cart.shippingCharges, false, false)) -
      Number(formatPrice(giftCard.priceOffer)),
    true,
    false
  );

  giftCardPhase2Modal.subtitle = (t("phase2GcBsSubtitle") || giftCardPhase2Modal.subtitle)?.replace(
    "{{shoppingBagValue}}",
    `${shoppingBagValue}`
  );

  useEffect(() => {
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: "web|GC payment|Add GC",
        newPageName: "ADD GC",
        assetType: "payment",
        newAssetType: "payment",
        platform: ADOBE.PLATFORM,
        pageLocation: "payment",
        technology: ADOBE.TECHNOLOGY,
      },
    };
  }, []);
  return (
    <PopupModal show={show} onRequestClose={onClose}>
      <div className="bg-white p-3 rounded-t-lg">
        <h1 className="font-bold">{t("phase2GcBsHeader") || giftCardPhase2Modal.title}</h1>
        <div
          className="text-xs mt-2"
          dangerouslySetInnerHTML={{
            __html: (t("phase2GcBsSubtitle") || giftCardPhase2Modal.subtitle)?.replace(
              "{{giftcardWorth}}",
              `<span class="font-bold">${formatPrice(giftCard?.priceOffer / 100, true, false)}</span>`
            ),
          }}
        />
        <div className="flex w-full">
          {isChecked ? (
            <Checkbox
              width="20"
              height="20"
              className="w-5 my-auto mr-2"
              onClick={() => {
                setIsChecked(false);
              }}
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsChecked(true)}
              aria-label="checkbox"
              className="border-2 border-darkpink rounded w-5 h-5 bg-white my-auto mr-2"
            />
          )}

          <div className="flex items-center justify-between grow">
            <div className="flex items-center ">
              <Image height={56} width={56} alt={giftCard?.productName} src={giftCard?.imageURL} />
              <div className="ml-2">
                <div className="font-bold text-sm">{giftCard?.productName}</div>
                <div className="text-11 text-gray-600 ">{t("gcValidFor") || "Valid for 3 months"}</div>
                {cart.shippingCharges > 0 && giftCard?.priceOffer < giftCard?.priceMRP ? (
                  <div className="flex items-center ">
                    <span className="text-11 font-bold">{formatPrice(giftCard.priceOffer, true)}</span>
                    <del className="text-left text-gray-600 opacity-60 text-sm ml-1">
                      {formatPrice(giftCard.priceMRP, true)}
                    </del>
                    <span className="text-sm font-bold text-green-600 ml-2">
                      {t("priceOffPercentage", [
                        Math.round(((giftCard.priceMRP - giftCard.priceOffer) / giftCard.priceMRP) * 100).toString(),
                      ])}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
            <div
              className="text-sm text-color1 mr-2"
              onClick={() => {
                setShowGiftCardTermsAndConditions(true);
              }}
            >
              {t("viewDetails")}
            </div>
          </div>
        </div>
        <button
          onClick={e => {
            e.currentTarget.disabled = true;
            if (isChecked && giftCard) {
              handleAddToBag(giftCard, upsellData, "Continue GC");
            } else {
              adobeCloseGCModal(giftCard);
              onClose();
            }
          }}
          className="mt-4 bg-color1 w-full rounded-sm py-1.5 text-white text-sm font-bold"
        >
          {t("claimThisOffer") || "CLAIM THIS OFFER"}
        </button>
      </div>
    </PopupModal>
  );
};

export default GiftCardPhase2Modal;
