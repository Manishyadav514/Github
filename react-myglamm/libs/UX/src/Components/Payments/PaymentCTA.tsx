import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";
import { formatPrice } from "@libUtils/format/formatPrice";
import { ValtioStore } from "@typesLib/ValtioStore";
import Arrow from "../../../public/svg/rightArrowWhite.svg";
import React from "react";
import { PaymentType } from "@typesLib/Payment";

const PaymentCTA = ({ handleCreateOrder }: { handleCreateOrder: (arg: PaymentType) => any }) => {
  const { t } = useTranslation();
  const cart = useSelector((store: ValtioStore) => store.cartReducer.cart);
  return (
    <div className="absolute bottom-0  inset-x-0 w-full flex justify-between bg-white p-3 rounded-t-sm">
      <div>
        <p className="">{t("shoppingBag")}</p>
        <p className="font-bold">{formatPrice(cart.payableAmount, true, false)}</p>
      </div>
      <button
        className="bg-ctaImg rounded py-2 px-4 text-white font-bold flex items-center uppercase"
        onClick={() => handleCreateOrder("cash")}
      >
        {t("placeOrder")} <Arrow className="w-4 h-4 ml-2" role="img" aria-labelledby="place order" />
      </button>
    </div>
  );
};

export default PaymentCTA;
