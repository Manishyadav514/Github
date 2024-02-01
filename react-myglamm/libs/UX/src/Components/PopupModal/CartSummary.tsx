import React, { useEffect } from "react";
import PopupModal from "./PopupModal";
import CartProduct from "@libComponents/Cart/CartProduct";
import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import CloseIcon from "../../../public/svg/group-2.svg";
import { PAYMENT_REDUCER } from "@libStore/valtio/REDUX.store";

const CartSummary = ({ show, close }: { show: boolean; close: () => void }) => {
  const { t } = useTranslation();
  const cart = useSelector((store: ValtioStore) => store.cartReducer.cart);

  return (
    <PopupModal show={show} onRequestClose={close}>
      <div className="bg-white p-2 rounded-t-md ">
        <div className="flex items-center justify-between relative">
          <div className="font-semibold ml-3 mt-2 mb-2">{`${t("shoppingBag") || "Shopping Bag"} (${cart.productCount})`}</div>
          <div
            onClick={() => {
              PAYMENT_REDUCER.hasUserAddedProductFromUpsellPayment = undefined;
              close();
            }}
          >
            <CloseIcon className=" mr-2 w-6 h-6" />
          </div>
        </div>
        <CartProduct isOrderSummary={true} />
      </div>
    </PopupModal>
  );
};

export default CartSummary;
