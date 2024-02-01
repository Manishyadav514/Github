import React, { Fragment, ReactElement, useEffect, useState } from "react";
import { useSelector } from "@libHooks/useValtioSelector";

import useTranslation from "@libHooks/useTranslation";
import useAttachCountryAddressFilter from "@libHooks/useAttachCountryAddressFilter";

import BackBtn from "@libComponents/LayoutComponents/BackBtn";
import WishlistCartButton from "@libComponents/Header/WishlistCartButton";

import { ValtioStore } from "@typesLib/ValtioStore";

import { removeGiftCardProductFromCart } from "@checkoutLib/Cart/HelperFunc";

const ShoppingBagLayout = ({ children }: { children: ReactElement }) => {
  const { t } = useTranslation();
  useAttachCountryAddressFilter();
  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);
  const { productCount, products } = useSelector((store: ValtioStore) => store.cartReducer.cart);

  const [showWishlistBtn, setShowWishlistBtn] = useState(false);

  useEffect(() => {
    if (userProfile?.id) setShowWishlistBtn(true);
  }, [userProfile]);

  useEffect(() => {
    if (products?.length > 0) {
      removeGiftCardProductFromCart(products);
    }
  }, [products]);

  return (
    <Fragment>
      <header className="flex justify-between w-full items-center sticky h-12 top-0 z-50 bg-white shadow">
        <BackBtn />

        <p className="flex-1 ml-4 font-semibold">
          {t("shoppingBag")} {productCount > 0 && <span>({productCount})</span>}
        </p>

        {showWishlistBtn && <WishlistCartButton />}
      </header>

      {children}
    </Fragment>
  );
};

export default ShoppingBagLayout;
