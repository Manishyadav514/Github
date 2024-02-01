import React, { useEffect } from "react";
import { formatPrice } from "@libUtils/format/formatPrice";
import dynamic from "next/dynamic";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import useTranslation from "@libHooks/useTranslation";
import { PDP_STATES } from "@libStore/valtio/PDP.store";
import GiftCardDetails from "@libComponents/PopupModal/GiftCardDetails";
import { viewDetaisAddOnClickEvent } from "@productLib/pdp/AnalyticsHelper";

const HomeMiniPDPModal = dynamic(
  () => import(/* webpackChunkName: "HomeMiniPDPModal" */ "@libComponents/PopupModal/HomeMiniPDP"),
  { ssr: false }
);

const PDPAddOnProduct = ({ addOnData }: { addOnData: any }) => {
  const { addOnMethod, showMiniPDPModal, addOnProduct, dsKey } = addOnData;
  const handleAddOnChecked = () => {
    if (addOnMethod !== "AddOnSelected") {
      viewDetaisAddOnClickEvent("check");
      PDP_STATES.addOnData = { ...addOnData, addOnMethod: "AddOnSelected" };
    } else {
      viewDetaisAddOnClickEvent("uncheck");
      PDP_STATES.addOnData = { ...addOnData, addOnMethod: "" };
    }
  };
  const { t } = useTranslation();
  const title = addOnProduct?.isVirtualProduct
    ? `Gift Card Worth  ${formatPrice(addOnProduct?.priceMRP, true)} for  ${formatPrice(addOnProduct?.priceOffer, true)}`
    : "Value Deal";
  const desc =
    addOnProduct?.isVirtualProduct &&
    `You have unlocked exclusive Glamm Club gift voucher worth ${formatPrice(addOnProduct?.priceMRP, true)}`;

  useEffect(() => {
    viewDetaisAddOnClickEvent(addOnMethod === "AddOnSelected" ? "check" : "unchecked");
  }, []);

  return (
    <>
      <section className={`bg-white pt-3 pb-2 px-4 flex flex-row`}>
        <div className="flex items-center align-middle">
          <div className="relative w-5 h-5 shrink-0 mr-2 mt-2">
            <div
              className={`absolute w-[18px] h-[18px] top-0 left-0 rounded shrink-0 ${
                addOnMethod === "AddOnSelected" ? "bg-color1" : "bg-slate-300"
              } `}
            >
              <input
                type="checkbox"
                className="w-full h-full absolute top-0 left-0 opacity-0 z-50"
                onClick={() => {
                  handleAddOnChecked();
                }}
              />
              <span
                className={`absolute top-1 left-1.5 after:w-1.5 after:h-2 after:border-solid after:border-white after:border-r-2 after:border-b-2 after:border-t-0 after:border-l-0 after:rotate-45 after:absolute`}
              ></span>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center align-middle h-full">
          <div className="w-20 h-20">
            <ImageComponent
              style={{ width: "80px", height: "80px" }}
              src={addOnProduct?.imageURL}
              alt={addOnProduct?.imageUrl}
            />
          </div>
        </div>
        <div className="min-w-[212px] ml-2.5 flex flex-col">
          <div className="flex flex-col justify-center mb-2">
            <h1 className="text-sm font-semibold line-clamp-1">{title}</h1>
            <h2 className="text-xs font-normal line-clamp-2">
              {desc || addOnProduct?.productName || addOnProduct?.productSubTitle}
            </h2>
          </div>
          <div className="flex w-full justify-between align-middle items-center">
            <p className="">
              <span className="text-sm font-semibold">{formatPrice(addOnProduct?.priceOffer, true)}</span>
              <del className="text-xs text-gray-400 mx-1">{formatPrice(addOnProduct?.priceMRP, true)}</del>
              <span className="text-xs font-semibold text-ratingGreen uppercase">
                {t("priceOffPercentage", [Math.round((addOnProduct?.priceOffer * 100) / addOnProduct?.priceMRP).toString()])}
              </span>
            </p>
            <p
              className="text-[10px] font-normal uppercase cursor-pointer text-color1"
              onClick={() => {
                viewDetaisAddOnClickEvent("View Details");
                PDP_STATES.addOnData = { ...addOnData, showMiniPDPModal: !showMiniPDPModal };
              }}
            >
              {t("viewDetails")}
            </p>
          </div>
        </div>

        {/* MiniPDP modal */}
        {showMiniPDPModal && (
          <>
            {addOnProduct?.isVirtualProduct ? (
              <GiftCardDetails
                show={showMiniPDPModal}
                onClose={() => (PDP_STATES.addOnData = { ...addOnData, showMiniPDPModal: !showMiniPDPModal })}
                selectedProduct={addOnProduct}
                minBillAmount={addOnProduct?.priceMRP}
                hideAddToBagCta={true}
              />
            ) : (
              <HomeMiniPDPModal
                show={showMiniPDPModal}
                onRequestClose={() => (PDP_STATES.addOnData = { ...addOnData, showMiniPDPModal: !showMiniPDPModal })}
                product={addOnProduct}
                t={t}
                themeColor={"#f88d8d"}
                addOnData={addOnData}
                widgetName={dsKey}
              />
            )}
          </>
        )}
      </section>
    </>
  );
};

export default PDPAddOnProduct;
