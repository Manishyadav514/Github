import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import CountDownTimer from "@libComponents/CountDownTimer";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

import { formatPrice } from "@libUtils/format/formatPrice";
import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

const FlashSale = ({ item }: any) => {
  const router = useRouter();
  const [isOfferEnded, setIsOfferEnded] = useState<any>(false);
  const [widgetMeta, setWidgetMeta] = useState<any>(null);

  const { meta } = item;

  useEffect(() => {
    try {
      setWidgetMeta(meta.widgetMeta && JSON.parse(meta.widgetMeta));
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <>
      {/* {product && ( */}
      <div
        className="w-full float-left mb-5"
        style={{
          padding: "25px 10px 38px",
          background: "-webkit-linear-gradient(top,  #ffdede 0%,#fff8f8 100%)",
        }}
      >
        <div className="flex" style={{ padding: "0px 10px 18px 25px" }}>
          <div
            style={{
              marginRight: "auto!important",
            }}
            className=" mr-auto relative font-semibold text-xl"
          >
            <span
              style={{
                zIndex: 1,
              }}
              className="title relative"
            >
              {item.commonDetails.title}
            </span>
            <img
              alt="Flash product"
              src="https://files.myglamm.com/site-images/original/group-98.png"
              className="absolute"
              style={{
                left: "-35px",
                top: "-15px",
              }}
            />
          </div>
          {!isOfferEnded ? (
            <div
              style={{
                margin: "5px 0px 5px 0px",
              }}
            >
              <CountDownTimer
                expiryTimestamp={meta.endDate && new Date(meta.endDate).getTime()}
                source="home"
                setIsOfferEnded={(data: boolean) => {
                  setIsOfferEnded(data);
                }}
              />
            </div>
          ) : (
            <div
              style={{
                margin: "10px 0px 5px 85px",
                color: "#ff6767",
              }}
              className="font-semibold text-sm"
            >
              Opps ! Flash sale has ended
            </div>
          )}
        </div>
        <div
          className="w-full float-left relative"
          style={{
            border: "4px solid #fccbcb",
            borderRadius: "14px",
            zIndex: 1,
            padding: "10px",
            background: "#fff",
          }}
        >
          <ImageComponent
            alt="product"
            src={(item?.multimediaDetails.length > 0 && item?.multimediaDetails[0]?.assetDetails.url) || DEFAULT_IMG_PATH()}
          />
          <div
            className="flex item-center justify-center"
            style={{
              padding: "10px 20px",
            }}
          >
            <div style={{ marginRight: "10px", marginTop: "5px" }}>
              <img width="18" src={widgetMeta?.instantOfferImg || DEFAULT_IMG_PATH()} alt="instant" />
            </div>
            <div>
              {widgetMeta?.offerPrice && widgetMeta?.offerPrice < widgetMeta?.price ? (
                <>
                  <span className="font-semibold text-xl mr-1">{formatPrice(widgetMeta?.offerPrice, true, false)}</span>{" "}
                  <del className="text-sm" style={{ color: "#9b9b9b" }}>
                    {formatPrice(widgetMeta?.price, true, false)}
                  </del>
                </>
              ) : (
                <span className="font-semibold">{formatPrice(widgetMeta?.price, true, false)}</span>
              )}
            </div>
            {widgetMeta?.OfferText && (
              <div className="flex flex-col" style={{ marginTop: "6px" }}>
                <span className="font-semibold text-white text-xs pointer-badge">{widgetMeta?.OfferText}</span>
              </div>
            )}
          </div>
          <div className="text-base font-semibold mb-1 flex text-center item-center justify-center">
            {widgetMeta?.productName}
          </div>
          {widgetMeta?.productStockText && (
            <div
              className="text-base item-center justify-center flex"
              style={{
                bottom: "-18px",
                position: "relative",
                color: "#47483e",
              }}
            >
              {widgetMeta.productStockText}
            </div>
          )}
          <div className="flex justify-center relative" style={{ bottom: "-30px" }}>
            <button
              className="primary h-10 w-56 text-white"
              type="button"
              style={{
                backgroundImage: "linear-gradient(to left, rgb(0, 0, 0), rgb(69, 69, 69))",
                borderRadius: "2px",
                opacity: " 1",
              }}
              onClick={() => {
                if (widgetMeta?.url) router.push(widgetMeta?.url);
              }}
            >
              {widgetMeta?.ctaName}
            </button>
          </div>
        </div>
        <style jsx>
          {`
            .pointer-badge {
              position: relative;
              background: #df6063;
              padding: 2px 16px 2px 4px;
              display: inline-block;
              color: #fff;
              font-weight: 600;
              margin-left: 18px;
            }
            .pointer-badge:after {
              content: "";
              position: absolute;
              right: 0;
              bottom: 0;
              width: 0;
              height: 0;
              border-right: 10px solid white;
              border-top: 11px solid transparent;
              border-bottom: 11px solid transparent;
            }
            .title:after {
              border-bottom: 5px solid #fccbcb;
              content: "";
              height: 3px;
              width: 90px;
              position: absolute;
              left: 0;
              bottom: 1px;
            }
          `}
        </style>
      </div>
      {/* )} */}
    </>
  );
};

export default FlashSale;
