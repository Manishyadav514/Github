import React from "react";
import Link from "next/link";
import useTranslation from "@libHooks/useTranslation";

const CouponExpiredScreen = () => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center text-center bg-white h-screen z-20">
      <img src="https://files.myglamm.com/site-images/original/coupon-expired.png" alt="Coupon Expired" />

      <div className="py-3 px-6">
        <div className="flex item-center justify-center font-semibold text-2xl">You missed this promotion!</div>
        <p className="py-3 items-center text-sm text-center">
          The coupon code has expired. Please check the updated prices of products in your cart, before making the payment.
        </p>
      </div>

      <Link
        href="/shopping-bag"
        className="absolute bottom-4 w-11/12 text-sm text-center text-white font-semibold uppercase py-4 rounded bg-red-300 "
        aria-label={t("goToCatt") || `Go To Cart`}
      >
        {t("goToCatt") || `Go To Cart`}
      </Link>
    </div>
  );
};

export default CouponExpiredScreen;
