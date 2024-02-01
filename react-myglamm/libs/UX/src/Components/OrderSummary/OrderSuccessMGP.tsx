import React, { useState, useEffect, useRef, Fragment } from "react";
import { useSelector } from "@libHooks/useValtioSelector";
import { useRouter } from "next/router";
import Link from "next/link";

import useTranslation from "@libHooks/useTranslation";

import { ADOBE } from "@libConstants/Analytics.constant";

import OrderAPI from "@libAPI/apis/OrderAPI";

import Adobe from "@libUtils/analytics/adobe";
import { getStaticUrl } from "@libUtils/getStaticUrl";
import { formatPrice } from "@libUtils/format/formatPrice";
import { getAppStoreRedirectionUrl } from "@libUtils/getAppStoreRedirectionUrl";

import ReviewStars from "@libComponents/PDP/Reviews/ReviewStars";
import GoodPointsCoinIcon from "@libComponents/Common/GoodPointsCoinIcon";
import OrderSummaryProducts from "@libComponents/OrderSummary/OrderSummaryProducts";

import Arrow from "../../../public/svg/rightArrow.svg";
import WhiteArrow from "../../../public/svg/whiteArrow.svg";
import Widgets from "@libComponents/HomeWidgets/Widgets";
import { SLUG } from "@libConstants/Slug.constant";

interface successProps {
  orderDetails: any;
  orderStatus: string;
}

const OrderSuccessMGP = ({ orderStatus, orderDetails }: successProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  const [animate, setAnimate] = useState("h-screen");
  const [prodExpanded, setProdExpanded] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState<number>();

  const myRef = useRef<HTMLDivElement>(null);

  const insiderDashboard = "/glamm-insider";

  useEffect(() => {
    const orderApi = new OrderAPI();
    orderApi
      .getEarnedPoints(localStorage.getItem("memberId"), orderDetails.paymentDetails.orderAmount)
      .then(({ data }: any) => setEarnedPoints(Math.floor(formatPrice(data.data.commissionEarnings) as number)));

    setTimeout(() => {
      setAnimate("animateContent");
    }, 1500);

    localStorage.removeItem("enableCOD");
  }, []);

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

  useEffect(() => {
    if (prodExpanded && myRef?.current) {
      myRef?.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [prodExpanded]);

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
              height: 28vh;
            }
          }
        `}
      </style>

      <div>
        <div className={`flex flex-col text-center pt-12 relative ${animate}`}>
          {animate === "h-screen" && (
            <img
              alt="success"
              src={getStaticUrl("/images/orderSuccess.gif")}
              className="mx-auto z-10 absolute left-0 right-0 top-8"
            />
          )}
          <h2 className="font-bold text-xl text-white mb-2 z-20" style={{ marginTop: animate === "h-screen" ? "10.5rem" : "" }}>
            {orderStatus === "success" ? t("orderSuccessfullyPlaced") : t("awatingConfirmation")}
          </h2>

          <p className="text-white text-sm mb-12 z-20">
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

        <Widgets slugOrId={SLUG().ORDER_SUMMARY_GAMIFICATION_BANNER} />

        <div className="py-2 bg-white text-center rounded-t-2xl">
          <div className="px-5">
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
              <div className="text-sm text-left tracking-tight leading-relaxed">
                {t("earnGlammpointsOnThisOrder", [earnedPoints?.toString() || "", "MyglammXO Points"])}
                <p className="text-xs opacity-75 paraText">{t("glammpointsEarnedSubtitle")}</p>
              </div>
              <Arrow className="w-4 h-2.5" />
            </a>

            <a
              target="_blank"
              rel="noopener noreferrer"
              href={getAppStoreRedirectionUrl("https://myglamm.in/n3orgmB3Wab")}
              className="border rounded border-gray-200 flex justify-between mt-5 py-4 px-3 items-center"
              aria-label={t("communityItemSubtitle")}
            >
              <GoodPointsCoinIcon className="h-7 w-7" />
              <div className="text-sm text-left tracking-tight leading-relaxed w-4/5">
                {t("communityPartEarn")}
                &nbsp;{t("myglammPoints")}
                <p className="text-11 text-gray-400 paraText">{t("communityItemSubtitle")}</p>
              </div>
              <Arrow className="w-4 h-2.5" />
            </a>
          </div>

          <div className="px-10 py-10 mt-2">
            <h3 className="text-center font-semibold mb-4">{t("rateYourExperience")}</h3>
            <ReviewStars
              filledStar="starPink.svg"
              emptyStar="starGrey.svg"
              margin="mr-1"
              adobeAssetType={ADOBE.ASSET_TYPE.ORDER_SUMMARY}
            />
          </div>

          <Link href="/refer" aria-label="Refer and Earn">
            <img
              src="https://files.myglamm.com/site-images/original/orderconfirmation.jpeg"
              alt="Refer and Earn"
              className="mb-6"
            />
          </Link>

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

          <div className="border-t border-gray-200 flex font-semibold p-2 justify-between bg-white text-center sticky bottom-0">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={getAppStoreRedirectionUrl("https://myglamm.in/KSsdq1L3Wab")}
              style={{ width: "48.5%" }}
              className="border py-3 px-5"
              aria-label={t("trackMyOrder")}
            >
              {t("trackMyOrder")}
            </a>
            <Link
              href={insiderDashboard}
              className="text-white py-3 pr-2 pl-3 flex justify-between items-center bg-ctaImg w-1/2"
              aria-label={t("getFreeMakeup")}
            >
              {t("getFreeMakeup")} <WhiteArrow className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default OrderSuccessMGP;
