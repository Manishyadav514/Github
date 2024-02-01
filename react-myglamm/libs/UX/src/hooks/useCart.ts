import { formatPrice } from "@libUtils/format/formatPrice";
import { useState, useEffect } from "react";

/**
 * useCart Hook returns modified cart reponse structure and cart summary
 * object
 * @param cart - Cart Response from get cart API call
 */
function useCart(cart: any) {
  const [data, setData] = useState<any>();
  const [orderSummary, setOrderSummary] = useState<any>();

  useEffect(() => {
    if (data && cart) {
      const orderSummaryDetail: any = {};

      const { userSpecificDiscount } = data;

      orderSummaryDetail.couponCode = userSpecificDiscount?.couponCode ? userSpecificDiscount?.couponCode : null;
      orderSummaryDetail.couponAmount = formatPrice(
        userSpecificDiscount?.userDiscount ? userSpecificDiscount?.userDiscount : 0
      );

      orderSummaryDetail.payableAmount = data.netAmount;
      orderSummaryDetail.maxApplicableGlammpoints = data.glammPoints?.applicable;
      orderSummaryDetail.usersGlammpoints = data.glammPoints?.current;
      orderSummaryDetail.netAmount = data.netAmount;
      orderSummaryDetail.glammpointApplied = data.glammPoints?.applied;

      if (cart.appliedGlammPoints > 0) {
        orderSummaryDetail.glammpointApplied = data.glammPoints?.applied;
        orderSummaryDetail.usersGlammpoints -= orderSummaryDetail.glammpointApplied;
      }

      const discountWithGlammpoint = orderSummaryDetail.couponAmount + orderSummaryDetail.glammpointApplied;
      if (discountWithGlammpoint > orderSummaryDetail.payableAmount) {
        orderSummaryDetail.payableAmount = discountWithGlammpoint - orderSummaryDetail.netAmount;
      } else {
        orderSummaryDetail.payableAmount = orderSummaryDetail.netAmount - discountWithGlammpoint;
      }
      if (data.shippingCharges > 0) {
        orderSummaryDetail.shippingCharges = formatPrice(data.shippingCharges);
        orderSummaryDetail.payableAmount += formatPrice(data.shippingCharges);
      }
      setOrderSummary(orderSummaryDetail);
    }
  }, [data]);

  async function getData() {
    const {
      appliedGlammPoints,
      applicableGlammPoints,
      usersGlamPoints,
      missingProductFreeProductsDiscounts,
      discounts,
      userSpecificDiscount,
      shippingCharges,
      cart: { netAmount, products, preOrderProducts: preorders, freeProducts: _cartFreeProducts },
    } = cart;

    const missedGifts = missingProductFreeProductsDiscounts
      ?.map((missingProductFreeProduct: any) => ({
        parentProductId: missingProductFreeProduct.systemRules.productId,
        freeProduct: missingProductFreeProduct,
      }))
      .flat();

    const freeGifts = products
      .map((parentProduct: any) =>
        parentProduct.freeProducts.map((freeProduct: any) => ({
          parentProduct,
          freeProduct,
          isProductFreeProduct: true,
        }))
      )
      .flat();

    const cartFreeGifts = _cartFreeProducts.map((freeProduct: any) => ({
      freeProduct,
      isCartFreeProduct: true,
    }));

    setData({
      isEmpty: !(products.length > 0 || preorders.length > 0),
      netAmount: formatPrice(netAmount),
      glammPoints: {
        applied: appliedGlammPoints,
        applicable: applicableGlammPoints,
        current: usersGlamPoints,
      },
      cart: {
        products,
        preorders,
        missedGifts,
        freeGifts,
        cartFreeGifts,
      },
      discounts,
      userSpecificDiscount,
      shippingCharges,
    });
  }

  useEffect(() => {
    if (cart) {
      getData();
    } else {
      setData({
        isEmpty: true, // in case cart didn't load
      });
    }
  }, [cart]);

  return { data, orderSummary };
}

export default useCart;
