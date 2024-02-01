import React, { useState } from "react";
import useTranslation from "@libHooks/useTranslation";
import { formatPrice } from "@libUtils/format/formatPrice";
import { ValtioStore } from "@typesLib/ValtioStore";
import { useSelector } from "@libHooks/useValtioSelector";
import ShippingChargesLogo from "../../../public/svg/shipping-charges-icon.svg";
import PopupModal from "@libComponents/PopupModal/PopupModal";
import { GiCloseIco } from "@libComponents/GlammIcons";
import { getLocalStorageValue } from "@libUtils/localStorage";
import { LOCALSTORAGE, SESSIONSTORAGE } from "@libConstants/Storage.constant";
import { getSessionStorageValue } from "@libUtils/sessionStorage";

import OfferAppliedIcon from "../../../public/svg/green-tick.svg";
import InfoIcon from "../../../public/svg/info-ico.svg";
import { useSplit } from "@libHooks/useSplit";

const PaymentSummary = ({ shippingChargeCashbackVariant }: { shippingChargeCashbackVariant: string }) => {
  const { t } = useTranslation();

  const { cart } = useSelector((store: ValtioStore) => ({
    cart: store.cartReducer.cart,
  }));

  const variants = useSplit({
    experimentsList: [{ id: "totalSavings", condition: !!(cart.totalSaving && cart.totalSaving > 0) }],
    deps: [],
  });

  const totalSavingText = t("totalSavingText");

  const [showShippingInfo, setShowShippingInfo] = useState(false);

  const shippingChargesCashback = t("shippingChargesCashback");

  const isGiftCardAddedFromPayment = getLocalStorageValue(LOCALSTORAGE.IS_GIFT_CARD_ADDED_FROM_PAYMENT, true);

  const getGiftCardAmount = () => {
    const price =
      cart.products.find(product => product.productMeta.isVirtualProduct && product.productMeta.giftCardSku)?.offerPrice ?? 0;
    return price / 100;
  };

  const getShoppingBagValue = () => {
    if (isGiftCardAddedFromPayment) {
      return formatPrice(
        cart.payableAmount + (cart.appliedGlammPoints || 0) - cart.shippingCharges - getGiftCardAmount(),
        true,
        false
      );
    }
    return formatPrice(cart.payableAmount + (cart.appliedGlammPoints || 0) - cart.shippingCharges, true, false);
  };

  const shippingCharges = getLocalStorageValue(LOCALSTORAGE.SHIPPING_CHARGES, true);

  const giftCardVariant = getSessionStorageValue(SESSIONSTORAGE.GIFT_CARD_VARIANT);

  return (
    <div
      className="bg-white"
      style={{
        margin: "0 0 9px",
        boxShadow: "0 0 3px 0 rgba(0,0,0,.19)",
      }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <p className="font-bold text-sm">{t("orderSummary")}</p>
          <p className="font-bold text-sm">{formatPrice(cart.payableAmount, true, false)}</p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <p className=" text-sm">{t("shoppingBagValue") || "Shopping Bag Value"}</p>
          <p className="font-bold text-sm">{getShoppingBagValue()}</p>
        </div>

        {isGiftCardAddedFromPayment && cart.shippingCharges === 0 && getGiftCardAmount() !== 0 && (
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm">{t("giftCardChargesText") || `Gift Card For Shipping Charges`}</p>
            <p className="text-sm font-bold">{formatPrice(getGiftCardAmount(), true, false)}</p>
          </div>
        )}

        {cart.hasCartGcDiscount ? (
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <p className=" text-sm">{t("exclusiveGc") || "Exclusive GlammClub Gift Card"}</p>
            </div>
          </div>
        ) : null}

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <p className=" text-sm">{t("shippingCharges")}</p>
            {shippingChargeCashbackVariant && shippingChargeCashbackVariant === "1" && (
              <InfoIcon className="ml-2" onClick={() => setShowShippingInfo(true)} />
            )}
          </div>

          {cart.shippingCharges === 0 ? (
            <div className="flex">
              <del className="text-gray-400 mr-2 h-min">
                {isGiftCardAddedFromPayment
                  ? formatPrice(shippingCharges, true, false)
                  : formatPrice(cart.shippings?.[0]?.shippingCharges, true, false)}
              </del>

              <span className="uppercase text-green-600">{t("free")}</span>
            </div>
          ) : (
            <p className="font-bold text-sm">{formatPrice(cart.shippingCharges, true, false)}</p>
          )}
        </div>

        {cart?.shippingCharges &&
        ((shippingChargeCashbackVariant && shippingChargeCashbackVariant === "1") || giftCardVariant === "2") ? (
          <p
            className="text-green-600 text-xs mt-1"
            dangerouslySetInnerHTML={{
              __html: shippingChargesCashback?.shippingCashbackOnNextOrder?.replace(
                "{{shippingCharges}}",
                `${formatPrice(cart?.shippingCharges, true, false)}`
              ),
            }}
          />
        ) : null}

        {cart.appliedGlammPoints && cart.appliedGlammPoints > 0 ? (
          <div className="flex items-center justify-between mt-2">
            <p className=" text-sm">{t("glammCash") || "Glamm Coins"}</p>
            <p className="font-bold text-sm text-green-600">- {formatPrice(cart.appliedGlammPoints, true, false)}</p>
          </div>
        ) : null}
      </div>

      {cart.hasCartGcDiscount ? (
        <div className="bg-green-100 p-2 flex items-center">
          <OfferAppliedIcon className="w-4 h-4 ml-2" />
          <p className=" text-xs ml-2">
            {t("phase2OrderSummaryMsg") || `Horray! You have unlocked Exclusive GlammClub Gift Card`}{" "}
          </p>
        </div>
      ) : null}

      {!cart.hasCartGcDiscount && variants?.totalSavings === "1" && cart.totalSaving && cart.totalSaving > 0 && (
        <div className="bg-green-100 p-2 flex items-center">
          <OfferAppliedIcon className="w-4 h-4 ml-2" />
          <p
            className=" text-xs ml-2"
            dangerouslySetInnerHTML={{
              __html: totalSavingText.replace(
                "{{totalSavings}}",
                `<span class="font-bold">${formatPrice(cart.totalSaving, true, false)}</span>`
              ),
            }}
          />
        </div>
      )}

      {showShippingInfo && (
        <PopupModal show={showShippingInfo} onRequestClose={() => setShowShippingInfo(false)}>
          <div className="bg-white p-3 rounded-t-lg">
            <div className="flex justify-end " onClick={() => setShowShippingInfo(false)}>
              <GiCloseIco name="close-ico" height="28" width="28" fill="#9b9b9b" className="" />
            </div>
            <div className="  flex items-start">
              <ShippingChargesLogo className="w-24 h-12" />
              <p
                className="text-sm ml-2"
                dangerouslySetInnerHTML={{
                  __html: shippingChargesCashback?.shippingChargesCashbackInfo?.replace(
                    "{{shippingCharges}}",
                    `<span class="font-bold">${formatPrice(cart.shippingCharges, true, false)}</span>`
                  ),
                }}
              ></p>
            </div>
          </div>
        </PopupModal>
      )}
    </div>
  );
};

export default PaymentSummary;
