import React from "react";

import ConfigText from "@libComponents/Common/ConfigText";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

import { onAdobeChangeShade } from "@productLib/pdp/AnalyticsHelper";

import PDPShade from "./PDPShade";

import Router from "next/router";

import useTranslation from "@libHooks/useTranslation";

const PDPKitShadeSelectionV3 = ({
  comboShadesV3,
  comboShades,
  selectProductShade,
  showShadesHeader = true,
  setOpenGiftCardTermsModal,
  setMinimumGiftCardBillAmount,
}: any) => {
  const { t } = useTranslation();
  return (
    <>
      <svg width="10" height="10" viewBox="0 0 10 10" className="absolute">
        <clipPath id="squircleClip" clipPathUnits="objectBoundingBox">
          <path
            fill="red"
            stroke="none"
            d="M0.046,0.172 C0.062,0.11,0.11,0.062,0.172,0.045 C0.253,0.024,0.374,0,0.499,0 C0.623,0,0.747,0.024,0.831,0.045 C0.898,0.061,0.948,0.113,0.963,0.181 C0.98,0.262,1,0.381,1,0.502 C1,0.62,0.981,0.739,0.964,0.822 C0.949,0.894,0.894,0.949,0.822,0.963 C0.738,0.981,0.618,1,0.501,1 C0.382,1,0.264,0.98,0.182,0.963 C0.114,0.948,0.061,0.897,0.044,0.83 C0.024,0.746,0,0.623,0,0.502 C0,0.378,0.025,0.255,0.046,0.172"
          />
        </clipPath>
      </svg>
      <section className=" bg-white mt-2 mb-3 pb-2" id="scrollToShadeSelection">
        {showShadesHeader && (
          <p className="font-bold text-sm p-2.5 border-b border-gray-200">Pick Variety of your Combo Products</p>
        )}

        <div className="px-2.5">
          {comboShadesV3.map((products: any, index: number) => {
            const { shadeLabel } = products?.cms?.[0]?.attributes || {};
            const prodImg = products?.assets?.find((x: any) => x.type === "image") || {} ;

            /* find whether the child products have a gift card or not */
            const isGiftCardPresent = products?.productMeta?.isGiftCard;

            if (products?.productMeta?.minBillAmount && setMinimumGiftCardBillAmount) {
              setMinimumGiftCardBillAmount(products?.productMeta?.minBillAmount);
            }
            
            if (products?.productTag?.toLowerCase().includes("shipping") || !products) {
              return <></>;
            }
            return (
              <div className="w-full py-3 flex border-b border-dashed border-gray-300" key={index}>
                <div className="w-1/5">
                  <ImageComponent alt={prodImg?.name} style={{ width: "64px" }} src={prodImg?.imageUrl?.["200x200"]} />
                </div>
                <div className="w-4/5 ml-2">
                  <p className="text-sm font-bold truncate">{products?.productTag}</p>
                  <p className="text-gray-500 text-10 flex justify-between">
                    <span>{shadeLabel ?? " "}</span>
                    {products?.inStock === false && (
                      <p className="uppercase font-semibold pr-2 text-gray-400 text-xs text-right mt-1">
                        <ConfigText configKey="outOfStock" />
                      </p>
                    )}
                  </p>
                  {isGiftCardPresent && ["/shopping-bag", "/payment"].includes(Router.pathname) ? (
                    <div className="flex justify-end">
                      <button
                        className="text-color1 text-sm border-b-2 border-color1"
                        onClick={() => setOpenGiftCardTermsModal(true)}
                      >
                        {t("viewDetails")}
                      </button>
                    </div>
                  ) : (
                    <div className="flex overflow-auto pt-1">
                      {comboShades?.[index]?.productDetails?.length &&
                        comboShades?.[index]?.productDetails?.map((prod: any, i: number) => {
                          const { shadeImage } = prod?.cms?.[0]?.attributes || {};
                          return shadeImage ? (
                            <PDPShade
                              onClick={() => {
                                selectProductShade(prod, index);
                                onAdobeChangeShade(prod);
                              }}
                              shadeImage={shadeImage}
                              id={products.id}
                              key={prod.id}
                              shade={{ id: prod.id, urlManager: prod?.urlManager, inStock: prod.inStock }}
                              comboShades={true}
                            />
                          ) : (
                            <></>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default PDPKitShadeSelectionV3;
