import { useSplit } from "@libHooks/useSplit";
import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";
import { formatPrice } from "@libUtils/format/formatPrice";
import { ValtioStore } from "@typesLib/ValtioStore";
import ShippingChargesLogo from "../../../public/svg/shipping-charges-icon.svg";
import React from "react";
import { getSessionStorageValue } from "@libUtils/sessionStorage";
import { SESSIONSTORAGE } from "@libConstants/Storage.constant";

const ShippingChargesCashback = ({ shippingChargeCashbackVariant }: { shippingChargeCashbackVariant: string }) => {
  const { t } = useTranslation();
  const cart = useSelector((store: ValtioStore) => store.cartReducer.cart);

  const shippingChargesCashback = t("shippingChargesCashback");

  const giftCardVariant = getSessionStorageValue(SESSIONSTORAGE.GIFT_CARD_VARIANT);

  if ((shippingChargeCashbackVariant === "1" || giftCardVariant === "2") && cart.shippingCharges > 0) {
    return (
      <div className="bg-green-500 flex items-center justify-center p-1">
        <div className="bg-white p-0.5 rounded-full">
          <ShippingChargesLogo />
        </div>
        <p
          className="text-white ml-2 text-xs"
          dangerouslySetInnerHTML={{
            __html: shippingChargesCashback?.shippingChargesRefund?.replace(
              "{{shippingCharges}}",
              `<span class="text-white font-bold">${formatPrice(cart?.shippingCharges, true, false)}</span>`
            ),
          }}
        />
      </div>
    );
  }

  return null;
};

export default ShippingChargesCashback;
