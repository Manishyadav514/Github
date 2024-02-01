import useTranslation from "@libHooks/useTranslation";
import { formatPrice } from "@libUtils/format/formatPrice";
import { subCoupon } from "@typesLib/PLP";
import React from "react";
import OfferIcon from "../../../public/svg/offersIcon.svg";

const PLPOfferAndFreeGIft = ({
  isOfferAvailable,
  isFreeProduct,
  subscription,
  variant,
}: {
  isOfferAvailable: any;
  isFreeProduct: any;
  subscription?: subCoupon;
  variant: string;
}) => {
  const { t } = useTranslation();

  if (variant === "1") {
    return (
      <div className="m-0.5">
        <p
          className={`text-xs m-0 line-clamp-1 ${
            subscription?.payableAmount || subscription?.payableAmount === 0 ? "opacity-1" : "opacity-0"
          }`}
        >
          <span className="font-bold text-green-700">
            {t("bestPrice") || "Best Price"}
            {` ${formatPrice(subscription?.payableAmount || 0, true)}`}
          </span>
          <span> {t("withCoupon") || "with coupon"}</span>
        </p>

        <p className={`text-xs text-pink-500 m-0 mt-0.5 font-bold ${isFreeProduct ? "opacity-1" : "opacity-0"}`}>
          {t("getFreeGift") || "Get FREE Gift"}*
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between text-color1 items-center py-1">
        <span className={`flex items-center ${!isOfferAvailable && "opacity-0"}`}>
          <OfferIcon className="w-4 h-4 mr-1" role="img" aria-labelledby="offer" title="offer" />
          <p style={{ fontSize: "8px" }} className="mt-0.5 font-semibold">
            {t("offerAvailable") || "Offer Available"}
          </p>
        </span>

        {isOfferAvailable && isFreeProduct && <span className="border border-gray-200 h-3 border-t-0 border-b-0 border-r-0" />}

        <span className={`flex items-center  mr-1 ${!isFreeProduct && "opacity-0"}`}>
          <div className="mr-1 -mt-0.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="22"
              viewBox="0 0 13 13"
              className="outline-none"
              role="img"
              aria-labelledby="gift"
            >
              <title>gift</title>
              <g fill="var(--color1)" fillRule="nonzero">
                <path d="M.813 6.54v4.911c0 .452.364.819.812.819h4.063V6.54H.813z"></path>
                <path d="M12.188 3.266H9.617c.184-.127.343-.253.453-.366a1.72 1.72 0 0 0 0-2.408c-.637-.646-1.747-.645-2.383 0C7.334.848 6.4 2.298 6.53 3.266h-.058C6.599 2.298 5.665.848 5.313.492c-.637-.645-1.747-.645-2.383 0a1.722 1.722 0 0 0 0 2.408c.11.113.269.24.453.366H.813A.817.817 0 0 0 0 4.085v1.227c0 .226.182.41.406.41h5.282V4.085h1.625v1.637h5.28a.408.408 0 0 0 .407-.41V4.085a.816.816 0 0 0-.813-.819zM5.64 3.24s-.035.027-.15.027c-.562 0-1.634-.588-1.984-.943a.897.897 0 0 1 0-1.254.86.86 0 0 1 1.23 0c.549.555 1.093 1.973.904 2.17zm1.87.027c-.115 0-.15-.026-.15-.027-.189-.197.355-1.615.903-2.17a.881.881 0 0 1 1.231 0 .896.896 0 0 1 0 1.254c-.35.355-1.422.943-1.984.943z"></path>
                <path d="M7.313 6.54v5.73h4.062a.816.816 0 0 0 .813-.819v-4.91H7.311z"></path>
              </g>
            </svg>
          </div>
          <p style={{ fontSize: "8px" }} className="mt-0.5 font-semibold">
            {t("getFreeGift") || "Get Free Gift"}
          </p>
        </span>
      </div>
    </>
  );
};

export default PLPOfferAndFreeGIft;
