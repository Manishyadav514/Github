import { useSplit } from "@libHooks/useSplit";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import React, { useEffect, useState } from "react";
import Discount from "../../../public/svg/discount.svg";
import PaymentUpsell from "./PaymentUpsell";
import CartSummary from "@libComponents/PopupModal/CartSummary";
import useTranslation from "@libHooks/useTranslation";
import { formatPrice } from "@libUtils/format/formatPrice";

const UpsellOnPayments = () => {
  const { t } = useTranslation();

  const { payableAmount, shippingCharges, freeShippingThreshold, totalDutyCharges, hasUserAddedProductFromUpsellPayment } =
    useSelector((store: ValtioStore) => ({
      payableAmount: store.cartReducer.cart.payableAmount,
      shippingCharges: store.cartReducer.cart.shippingCharges,
      freeShippingThreshold: store.cartReducer.cart.freeShippingThreshold,
      totalDutyCharges: store.cartReducer.cart.totalDutyCharges,
      hasUserAddedProductFromUpsellPayment: store.paymentReducer.hasUserAddedProductFromUpsellPayment,
    }));

  const [showUpsellProducts, setShowUpsellProducts] = useState(false);
  const [showCartProductsSummary, setShowCartProductsSummary] = useState(false);

  const variants = useSplit({
    experimentsList: [{ id: "upsellOnPayment", condition: shippingCharges > 0 }],
    deps: [],
  });

  useEffect(() => {
    if (hasUserAddedProductFromUpsellPayment) {
      setShowCartProductsSummary(true);
      setShowUpsellProducts(false);
    }
  }, [hasUserAddedProductFromUpsellPayment]);

  if (showCartProductsSummary)
    return <CartSummary show={showCartProductsSummary} close={() => setShowCartProductsSummary(false)} />;

  if (variants?.upsellOnPayment === "1" && shippingCharges - (totalDutyCharges || 0)) {
    const productsWorthString = t("shipping")?.addProductsWorth?.replace(
      /\{\{(.*?)\}\}/,
      `${formatPrice(parseFloat((freeShippingThreshold - payableAmount + shippingCharges).toFixed(2)), true, false)} `
    );

    return (
      <React.Fragment>
        <div className="bg-color2 p-2 flex items-start justify-between">
          <div className="flex items-center">
            <Discount className="w-6 h-6 mr-3 ml-2" role="img" aria-labelledby="offer" />
            <div>
              <div className="font-bold">Get Free Shipping</div>
              <div className="text-xxs" dangerouslySetInnerHTML={{ __html: productsWorthString || "" }} />
            </div>
          </div>
          <button className="text-color1 text-sm font-semibold mt-1" onClick={() => setShowUpsellProducts(true)}>
            View Products
          </button>
        </div>

        {showUpsellProducts && <PaymentUpsell showUpsell={showUpsellProducts} setShowUpsell={setShowUpsellProducts} />}
      </React.Fragment>
    );
  }

  return null;
};

export default UpsellOnPayments;
