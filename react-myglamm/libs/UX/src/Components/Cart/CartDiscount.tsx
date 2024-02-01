import React, { useEffect, useState } from "react";
import { useSelector } from "@libHooks/useValtioSelector";

import useTranslation from "@libHooks/useTranslation";

import { ValtioStore } from "@typesLib/ValtioStore";

import { FPData, FPOtherData, freeProductData } from "@typesLib/Cart";

import { getProductData } from "@checkoutLib/Cart/HelperFunc";

import WhiteArrow from "../../../public/svg/white-arrow.svg";
import WhiteGiftWrap from "../../../public/svg/white-giftwrap.svg";

interface CartDiscountProd {
  showFPModal: (
    productParms: freeProductData,
    otherData: FPOtherData,
    productAlreadyFetched?: boolean,
    productResponse?: any
  ) => void;
}

const CartDiscount = ({ showFPModal }: CartDiscountProd) => {
  const { t } = useTranslation();
  const [showFreeGiftCardSection, setFreeGiftCardSection] = useState(false);
  const [freeProductResponse, setFreeProductResponse] = useState<FPData>();
  const { discounts, gwpProducts } = useSelector((store: ValtioStore) => store.cartReducer.cart);
  const { description, id, ids, type } = discounts;

  /* Getting Free Product Data (PWP/GWP/Coupon Free Product) and Opening Modal */
  const getFreeGift = (prodParams: freeProductData, otherData?: FPOtherData) => {
    getProductData(prodParams, otherData).then((res: FPData | undefined) => {
      if (res && res?.shades?.some(product => product?.inStock === true)) {
        // Check if any of the product is in stock
        setFreeGiftCardSection(true);
        setFreeProductResponse({ ...res, freeProductData: prodParams, otherData });
      } else {
        setFreeGiftCardSection(false);
      }
    });
  };

  useEffect(() => {
    if (description && id && ids && type && !gwpProducts.find(x => x.productId === id)) {
      getFreeGift({ id, ids, type }, { cartType: 8 });
    }
  }, [discounts, gwpProducts]);

  /* Show Only When Free Product Id is present and it's not already present in user's cart */
  if (description && id && ids && type && showFreeGiftCardSection && !gwpProducts.find(x => x.productId === id)) {
    return (
      <button
        type="button"
        onClick={() => showFPModal({ id, ids, type }, { cartType: 8 }, true, freeProductResponse)}
        className="w-full p-2 text-white flex mb-2 relative leading-tight rounded"
        style={{
          background: "linear-gradient(99deg,var(--color1) 90%,var(--color1) 100%)",
        }}
      >
        <WhiteGiftWrap height="24" width="24" className="my-auto ml-1 mr-4 animate-bounce" role="img" aria-labelledby="gift" />

        <div className="w-3/5 text-left border-r border-white/50 pr-2">
          <strong>{t("congratulations")}</strong> <br />
          <p className="leading-tight text-sm" dangerouslySetInnerHTML={{ __html: description }} />
        </div>

        <p className="w-1/6 flex-grow text-center px-4 text-xs my-auto font-semibold leading-none mr-2.5">
          {t("selectHere")}&nbsp;&nbsp;
        </p>
        <WhiteArrow
          height="16"
          width="16"
          className="absolute right-2 inset-y-0 my-auto"
          role="img"
          aria-labelledby="right arrow"
        />
      </button>
    );
  }

  return null;
};

export default CartDiscount;
