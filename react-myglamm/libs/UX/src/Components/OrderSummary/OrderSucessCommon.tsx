import React, { useState, useEffect, useRef, Fragment } from "react";
import Link from "next/link";

import useTranslation from "@libHooks/useTranslation";

import OrderSummaryProducts from "@libComponents/OrderSummary/OrderSummaryProducts";

import { getStaticUrl } from "@libUtils/getStaticUrl";
import Arrow from "../../../public/svg/rightArrow.svg";
import WhiteArrow from "../../../public/svg/whiteArrow.svg";
import Widgets from "@libComponents/HomeWidgets/Widgets";
import { SLUG } from "@libConstants/Slug.constant";
import { useRouter } from "next/router";
import GoodPointsCoinIcon from "@libComponents/Common/GoodPointsCoinIcon";
import OrderAPI from "@libAPI/apis/OrderAPI";
import { formatPrice } from "@libUtils/format/formatPrice";
import { ADOBE } from "@libConstants/Analytics.constant";
import Adobe from "@libUtils/analytics/adobe";
import { SHOP } from "@libConstants/SHOP.constant";

interface orderSummaryProps {
  orderDetails: any;
  orderStatus: string;
}

const OrderSuccessCommon = ({ orderStatus, orderDetails }: orderSummaryProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [animate, setAnimate] = useState("h-screen");
  const [prodExpanded, setProdExpanded] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState<number>();

  const myRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (SHOP.ENABLE_G3_LOYALTY_PROGRAM) {
      const orderApi = new OrderAPI();
      orderApi
        .getEarnedPoints(localStorage.getItem("memberId"), orderDetails.paymentDetails.orderAmount)
        .then(({ data }: any) => setEarnedPoints(Math.floor(formatPrice(data.data.commissionEarnings) as number)));
    }

    setTimeout(() => {
      setAnimate("animateContent");
      setProdExpanded(true);
    }, 1500);

    localStorage.removeItem("enableCOD");
  }, []);

  useEffect(() => {
    if (prodExpanded && myRef?.current) {
      myRef?.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [prodExpanded]);

  const adobeClickEvent = (ctaName: string) => {
    // Adobe Analytics(108) - On Click - Wishlisht Button click on Header.
    (window as any).digitalData = {
      common: {
        linkName: `web|order checkout|payment success`,
        linkPageName: `web|order checkout|payment success`,
        newLinkPageName: "payment success",
        assetType: "payment success",
        newAssetType: "order summary",
        subSection: "order checkout step5",
        platform: ADOBE.PLATFORM,
        ctaName,
        pageLocation: "",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();
  };

  return (
    <Fragment>
      {/* Animate - Slide up */}
      <style>
        {`
          .animateContent {
            animation: slideUp 0.8s ease-in-out;
          }
          @keyframes slideUp {
            from {
              height: 100vh;
            }
            to {
              height: 40vh;
            }
          }
        `}
      </style>

      <div>
        <div className={`flex flex-col text-center pt-16 relative ${animate}`}>
          {animate === "h-screen" && (
            <img
              alt="success"
              style={{ top: "2rem" }}
              className="mx-auto z-10 absolute left-0 right-0"
              src={getStaticUrl("/images/orderSuccess-pink-bg.gif")}
            />
          )}
          <h2 className="font-bold text-xl text-white mb-2 z-20" style={{ marginTop: animate === "h-screen" ? "10.5rem" : "" }}>
            {orderStatus === "success" ? t("orderSuccessfullyPlaced") : t("awatingConfirmation")}
          </h2>

          <p className="text-white text-sm mb-8 z-20">
            {t("thanksForOrder")}
            <br />
            {animate === "animateContent" && (
              <>
                {t("yourOrderNumber")}&nbsp;
                <strong>{orderDetails.orderNumber || "0000"}</strong>
                .
                <br />
                {t("youWillReceiveEmail")} <br />
                {orderDetails.userInfo.email || "yourname@email.com"}
              </>
            )}
          </p>
        </div>

        <div style={{ minHeight: "calc(100vh - 15rem)" }} className="py-2 bg-white text-center rounded-t-2xl pt-4">
          <Widgets slugOrId={SLUG().ORDER_SUMMARY_GAMIFICATION_BANNER} />
          {earnedPoints && earnedPoints > 0 && (
            <div className="py-2 bg-white text-center rounded-t-2xl px-5">
              <a
                role="presentation"
                className="border rounded border-gray-200 flex justify-between mt-5 py-4 px-3 items-center"
                onClick={event => {
                  event.preventDefault();
                  adobeClickEvent("points earned");
                  router.push("/my-rewards");
                }}
                aria-label={t("glammpointsEarnedSubtitle")}
              >
                <GoodPointsCoinIcon className="h-7 w-7" />
                <div className="text-xs text-left tracking-tight leading-relaxed">
                  {t("earnGlammpointsOnThisOrder", [earnedPoints?.toString() || "", "Good Points"])}
                  <p className="text-xs opacity-75 paraText">{t("glammpointsEarnedSubtitle")}</p>
                </div>
                <Arrow className="w-4 h-2.5" />
              </a>
            </div>
          )}
          {/* Order Summay - Products Accordion Section */}
          <button
            type="button"
            onClick={() => setProdExpanded(!prodExpanded)}
            className="font-semibold text-sm px-5 text-left mb-3 flex items-center bg-transparent text-color1 outline-none"
          >
            {t("orderSummary")}&nbsp;
            <span
              className={`h-5 flex items-center my-auto ${prodExpanded ? "pb-3" : "pb-2"}`}
              style={{
                fontSize: "1.7rem",
                transform: prodExpanded ? "rotate(180deg)" : "",
              }}
            >
              &#x2304;
            </span>
          </button>
          {prodExpanded && (
            <div ref={myRef}>
              {[...orderDetails.products, ...orderDetails.preProduct].map((product: any) => (
                <>
                  <OrderSummaryProducts product={product} />
                  {product.freeProducts.map((freeProduct: any) => (
                    <OrderSummaryProducts product={freeProduct} free />
                  ))}
                </>
              ))}
              {orderDetails.freeProducts.map((product: any) => (
                <OrderSummaryProducts product={product} free />
              ))}
            </div>
          )}

          {animate === "animateContent" && (
            <div className="border-t border-gray-200 flex p-2 justify-between bg-white  fixed w-full bottom-0">
              <Link
                href="/my-orders"
                className="text-color1 border border-color1 px-5 py-3 font-medium flex justify-between items-center bg-white"
                aria-label={t("trackMyOrder")}
              >
                {t("trackMyOrder")}
              </Link>

              <Link
                href="/"
                className="text-white p-2 flex font-medium  justify-between items-center bg-ctaImg rounded capitalize"
                aria-label={t("continueShopping")?.toLowerCase() || "Continue Shopping"}
              >
                {t("continueShopping")?.toLowerCase() || "Continue Shopping"} <WhiteArrow className="ml-1" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default OrderSuccessCommon;
