import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import CountDownTimer from "./CountDownTimer";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import clsx from "clsx";
import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

const FlashSaleTicker = ({ item, source }: any) => {
  const [offerEnded, setIsOfferEnded] = useState<any>(false);
  const [widgetMeta, setWidgetMeta] = useState<any>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const { meta } = item;
  const router = useRouter();

  useEffect(() => {
    try {
      setWidgetMeta(meta.widgetMeta && JSON.parse(meta.widgetMeta));
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleNavigation = () => {
    setIsNavigating(true);
    if (widgetMeta.targetLink) {
      router.push(widgetMeta.targetLink);
    }
  };

  return (
    <>
      {!offerEnded && meta && meta.endDate && (
        <div
          //className="flex bg-white"
          className={clsx("flex relative w-full bg-white", source === "PLP" ? "fixed z-[10000] bottom-0" : "")}
          onClick={() => {
            handleNavigation();
          }}
          aria-hidden="true"
          style={{
            boxShadow: "0px -2px 15px -5px rgba(0,0,0,0.75)",
            borderTop: "solid 1px #ffefef",
            borderBottom: "solid 1px #ffefef",
          }}
        >
          {isNavigating && source !== "product" && (
            <LoadSpinner className="absolute w-full z-20 bg-white bg-opacity-50 h-full right-0 top-0 left-0 bottom-0 m-auto" />
          )}
          <div
            className="tag tag1 w-32 h-10 relative z-10 inline-block flex pl-8 items-center"
            style={{
              background: "#ff8484",
              color: "#fff",
              textDecoration: "none",
            }}
          >
            <img
              alt="No Ticker"
              width="15"
              src={widgetMeta?.instantOfferImg || DEFAULT_IMG_PATH()}
              className="absolute m-auto top-0 bottom-0"
              style={{
                left: "8px",
              }}
            />
            <div className="flex flex-col">
              <span
                className="uppercase font-semibold block"
                style={{
                  fontSize: "8px",
                  lineHeight: "8px",
                }}
              >
                {item.commonDetails.title}
              </span>
              <span
                className="font-semibold block uppercase"
                style={{
                  fontSize: "14px",
                  lineHeight: "14px",
                }}
              >
                {item.commonDetails.subTitle}
              </span>
            </div>
          </div>
          {item.commonDetails.shortDescription && (
            <div
              className="tag tag2 w-36 pr-2 pl-4 relative flex items-center"
              style={{
                background: "#ffefef",
                color: "#ff6666",
                textDecoration: "none",
                height: "40px",
                marginLeft: "-5px",
              }}
            >
              <div>
                <span
                  className="font-semibold block"
                  style={{
                    fontSize: "10px",
                    lineHeight: "11px",
                  }}
                >
                  {item.commonDetails.shortDescription}
                </span>
              </div>
            </div>
          )}
          <CountDownTimer
            expiryTimestamp={meta.endDate && new Date(meta.endDate).getTime()}
            source={source}
            setIsOfferEnded={(data: any) => {
              setIsOfferEnded(data);
            }}
          />
          <style jsx>
            {`
              .tag::after {
                background: #fff;
                border-bottom: 20px solid transparent;
                border-left: 14px solid #ff8484;
                border-top: 20px solid transparent;
                content: "";
                position: absolute;
                right: 0;
                top: 0;
                bottom: 0;
              }
              .tag.tag1:after {
                background: ${source === "product" ? "#fff" : "#ffefef"};
              }
              .tag.tag2:after {
                border-left: 14px solid #ffefef;
              }
            `}
          </style>
        </div>
      )}
    </>
  );
};

export default FlashSaleTicker;
