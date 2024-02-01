import { formatPrice } from "@libUtils/format/formatPrice";

const cartSummaryDetailData = (cartData: any, cart: any) => {
  const orderSummaryDetail: any = {};
  const { userSpecificDiscount } = cartData;

  orderSummaryDetail.couponCode = userSpecificDiscount?.couponCode ? userSpecificDiscount?.couponCode : null;
  orderSummaryDetail.couponAmount = formatPrice(userSpecificDiscount?.userDiscount ? userSpecificDiscount?.userDiscount : 0);
  orderSummaryDetail.payableAmount = cartData.netAmount;
  orderSummaryDetail.maxApplicableGlammpoints = cartData.glammPoints?.applicable;
  orderSummaryDetail.usersGlammpoints = cartData.glammPoints?.current;
  orderSummaryDetail.netAmount = cartData.netAmount;
  orderSummaryDetail.glammpointApplied = cartData.glammPoints?.applied;
  if (cart.appliedGlammPoints > 0) {
    orderSummaryDetail.glammpointApplied = cartData.glammPoints?.applied;
    orderSummaryDetail.usersGlammpoints -= orderSummaryDetail.glammpointApplied;
  }
  const discountWithGlammpoint = orderSummaryDetail.couponAmount + orderSummaryDetail.glammpointApplied;
  if (discountWithGlammpoint > orderSummaryDetail.payableAmount) {
    orderSummaryDetail.payableAmount = discountWithGlammpoint - orderSummaryDetail.netAmount;
  } else {
    orderSummaryDetail.payableAmount = orderSummaryDetail.netAmount - discountWithGlammpoint;
  }
  if (cartData.shippingCharges > 0) {
    orderSummaryDetail.shippingCharges = formatPrice(cartData.shippingCharges);
    orderSummaryDetail.payableAmount += formatPrice(cartData.shippingCharges);
  }
  return orderSummaryDetail;
};

export default cartSummaryDetailData;
