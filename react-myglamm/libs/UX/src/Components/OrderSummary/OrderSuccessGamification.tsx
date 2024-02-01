import React, { useEffect } from "react";
import useTranslation from "@libHooks/useTranslation";
import GamificationAppInstall from "@libComponents/Gamification/GamificationAppInstall";
import { getLocalStorageValue, removeLocalStorageValue } from "@libUtils/localStorage";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { formatPrice } from "@libUtils/format/formatPrice";
import { SLUG } from "@libConstants/Slug.constant";
import Widgets from "@libComponents/HomeWidgets/Widgets";
import { SHOP } from "@libConstants/SHOP.constant";
import InviteFriends from "./InviteFriends";
import BountyReward from "./BountyReward";
import OrderSuccessGamificationV2 from "./OrderSuccessGamificationV2";
import { useRouter } from "next/router";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import GiftCardsList from "./GiftCardsList";
import CouponByApp from "@libComponents/Cart/CouponByApp";
import { GLAMMCLUB_CONFIG } from "@libUtils/glammClubUtils";

interface summaryProps {
  orderDetails: any;
  orderStatus: string | undefined;
  isPaymentPending?: boolean;
  variant: string;
  unlockCouponByAppExp?: string;
}

const OrderSuccessGamification = ({
  orderDetails,
  isPaymentPending,
  variant,
  orderStatus,
  unlockCouponByAppExp,
}: summaryProps) => {
  const { t } = useTranslation();
  const glammClubConfig = GLAMMCLUB_CONFIG() || {};

  const orderSuccessObj = t("orderSuccessGamificationObj");
  const orderSuccessGamificationV2 = t("orderSuccessGamificationV2");

  const isShippingChargeCashBack = getLocalStorageValue(LOCALSTORAGE.IS_SHIPPING_CHARGE_CASHBACK, true);

  /* For subscpription frquency text & my plan redirect */
  const router = useRouter();
  const DELIVERY_FREQUENCY: any = { QUARTERLY: "once in 3 months", MONTHLY: "once every month", ONE_TIME: "once" };

  useEffect(() => {
    setTimeout(() => {
      removeLocalStorageValue(LOCALSTORAGE.IS_SHIPPING_CHARGE_CASHBACK);
    }, 5000);
  }, []);

  const displayPaymentPending = (
    <React.Fragment>
      <p className="text-xs pt-4">Order Number: {orderDetails?.orderNumber}</p>
      <p className=" text-xs text-center mt-2">{"Your order has been placed but your payment is pending"}</p>
      <p className="text-xs px-16 text-center pt-2 pb-4">
        Please check the <span className="font-bold">My Orders</span> section for the updated order status
      </p>
    </React.Fragment>
  );

  const displayBackgroundImage = () => {
    if (variant === "1") return orderSuccessObj?.bountyBgImage;

    if (variant === "2") return orderSuccessGamificationV2?.backgroundImage;

    return orderSuccessObj?.bgImage;
  };

  const displayHowItWorkImage = () => {
    if (variant === "1") return orderSuccessObj?.HowItWorksBountyImg;

    if (variant === "2") return orderSuccessGamificationV2?.howItWorks;

    return orderSuccessObj?.howItWorksImg;
  };

  const displayRewardType: any = {
    "0": <InviteFriends variant={variant} />,
    "1": <BountyReward variant={variant} />,
    "2": <OrderSuccessGamificationV2 />,
  };

  return (
    <div className="bg-themeGray text-center">
      <div
        className="bg-cover bg-no-repeat"
        style={unlockCouponByAppExp === "1" ? { background: "white" } : { backgroundImage: `url(${displayBackgroundImage()})` }}
      >
        <p className="text-12 text-center uppercase font-bold tracking-normal pt-4">{t("orderSuccess")}</p>
        <img src={orderSuccessObj?.successImg} alt="order successfull" className="mx-auto" width={250} />

        {/* order is placed but payment is pending */}
        {isPaymentPending ? (
          displayPaymentPending
        ) : (
          <div
            dangerouslySetInnerHTML={{
              __html: orderSuccessObj?.orderPlacedMsg?.replace("{{orderNumber}}", orderDetails?.orderNumber || "0000"),
            }}
          />
        )}

        {orderDetails.shippingCharges !== 0 && isShippingChargeCashBack && (
          <div className="mb-3 mt-2">
            <div className="text-xs mb-1">
              Shipping charges {formatPrice(orderDetails.shippingCharges, true)} will be instantly
            </div>
            <div className="text-xs">
              credited as <span className="font-bold">MyGlammXO Points</span>
            </div>
          </div>
        )}

        {unlockCouponByAppExp === "1" ? (
          <div className="pt-10">
            <CouponByApp />
          </div>
        ) : (
          <>{variant !== "no-variant" ? displayRewardType[variant] : <InviteFriends />}</>
        )}
      </div>
      {/* GAMIFICATION INTIATION STEPS */}
      {unlockCouponByAppExp !== "1" && <img alt="mgxo how it works" className="w-full mx-auto" src={displayHowItWorkImage()} />}

      {/* Glamm club  */}
      {glammClubConfig?.active && glammClubConfig.orderSuccessImgSrc && (
        <img
          src={glammClubConfig?.orderSuccessImgSrc}
          alt="glamm club"
          onClick={() => router.push(`${glammClubConfig?.slug}`)}
          className="pt-3"
        />
      )}

      <GiftCardsList orderDetails={orderDetails} orderStatus={orderStatus} />

      {/* Show recurring subscription product summary */}
      {[...orderDetails?.products].map(
        (product: any) =>
          product?.productMeta?.isSubscriptionProduct && (
            <div className="flex py-4 pl-4 pr-4 border-b border-gray-200 bg-color2 m-4" key={product.productId}>
              <ImageComponent src={product.imageUrl} alt={product.name} className="w-20 h-20 rounded" />
              <div className="text-sm w-3/4 pr-1 pl-3 text-left">
                <div
                  className={`${
                    product?.productMeta?.decoyPricingDetails?.statusId === 1 ? "bg-[#50AD8C]" : "bg-gray-400"
                  }  rounded-full max-w-fit px-2 py-0.5 text-xs text-white font-medium`}
                >
                  {product?.productMeta?.decoyPricingDetails?.statusId === 1 ? "ACTIVE" : "CANCELLED"}
                </div>
                <p className="font-medium truncate text-xs mt-1">{product.name}</p>
                <p className="truncate" style={{ fontSize: "11px", opacity: ".7" }}>
                  {product.subtitle}
                </p>
                <div className="text-10 text-gray-400 font-medium">
                  PACK OF {product?.productMeta?.decoyPricingDetails?.quantity} • Delivered{" "}
                  {DELIVERY_FREQUENCY[product?.productMeta?.recurringSubscriptionDetails?.frequency]}
                </div>
                <p
                  className="uppercase font-semibold text-10 text-color1 mt-2"
                  onClick={e => {
                    e.preventDefault();
                    router.push("/my-plan");
                  }}
                >
                  View Plan Detail
                </p>
              </div>
            </div>
          )
      )}

      {SHOP.IS_MYGLAMM && orderSuccessObj?.leaderboardRedirectUrl && orderSuccessObj?.leaderboardImage && (
        <a className="no-underline" href={orderSuccessObj?.leaderboardRedirectUrl} aria-label="Gamification Leaderboard">
          <img
            alt="Gamification Leaderboard"
            className="w-full px-3.5 pt-3.5 rounded"
            src={orderSuccessObj?.leaderboardImage}
          />
        </a>
      )}
      {/* APP INSTALL REDIRECTION */}
      {orderSuccessObj?.installApp && (
        <GamificationAppInstall background="white" branchURL={orderSuccessObj?.myRewardsBrnachUrl} />
      )}
      <Widgets slugOrId={SLUG().ORDER_SUMMARY_GAMIFICATION_BANNER} />
    </div>
  );
};

export default OrderSuccessGamification;
