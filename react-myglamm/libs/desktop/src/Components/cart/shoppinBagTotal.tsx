import React, { useEffect, useState } from "react";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";

import CartAPI from "@libAPI/apis/CartAPI";
import ProductAPI from "@libAPI/apis/ProductAPI";

import { formatPrice } from "@libUtils/format/formatPrice";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

const ShoppinBagTotal = () => {
  const { t } = useTranslation();

  const { netAmount, tax, userCouponDiscountValue } = useSelector((store: ValtioStore) => store.cartReducer.cart);

  const [glammPointsEarned, setGlammPointsEarned] = useState<number>();

  useEffect(() => {
    const getGlammPoints = async () => {
      const { memberId } = checkUserLoginStatus() || {};
      const mainEarnableAmt = netAmount * 100 - tax;

      if (memberId) {
        const cartApi = new CartAPI();
        const { data } = await cartApi.getCommission(memberId, mainEarnableAmt);
        setGlammPointsEarned(data.data.commissionEarnings);
      } else {
        const productApi = new ProductAPI();
        const { data } = await productApi.getGPOnPDP({ unitPrice: mainEarnableAmt, id: "", isGuestUser: true });
        setGlammPointsEarned(data.data.commissionEarnings);
      }
    };

    if (netAmount) {
      getGlammPoints();
    }
  }, [netAmount]);

  return (
    <div className="bg-themeGray w-full py-3">
      <div className="max-w-screen-lg mx-auto px-4 flex justify-between items-center">
        <p>
          <p>
            {!!userCouponDiscountValue && userCouponDiscountValue > 0 && (
              <span className="block">
                {t("discountAdded")} <strong>{formatPrice(userCouponDiscountValue, true, false)} </strong>
              </span>
            )}
          </p>
          <span>
            {t("youEarn")}
            <strong>
              &nbsp;{formatPrice(glammPointsEarned || 0, true)} {t("myglammPoints")}{" "}
            </strong>
            {t("cashbackOrder")}
          </span>
        </p>

        <p className="text-18">
          <span>{t("grandTotal")}</span>&nbsp;
          <strong>{formatPrice(netAmount - (userCouponDiscountValue || 0), true, false)}</strong>
        </p>
      </div>
    </div>
  );
};

export default ShoppinBagTotal;
