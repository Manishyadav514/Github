export const clearLocalStorage = () => {
  localStorage.removeItem("coupon");
  localStorage.removeItem("discountProductIdRemoved");
  localStorage.removeItem("discountTagProductId");
  localStorage.removeItem("discountTagProductIdNoThanks");
  localStorage.removeItem("gp");
};
