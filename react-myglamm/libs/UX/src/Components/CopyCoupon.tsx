import React, { useState } from "react";
import { useRouter } from "next/router";

import "@libStyles/css/shopBtn.module.css";

import Copy from "../../public/svg/copy-icon.svg";

const CopyCouponCode = ({
  index,
  couponCode,
  apiShowMiniPDPFlag,
  id,
  webURL,
  productTag,
  adobeEvent,
  showMiniPDP,
  t,
  isReminderWidget,
}: any) => {
  const RefArray: any = [];
  const [showCopied, setShowCopied] = useState<string | null>();
  const router = useRouter();
  /* Copy Coupon To Clipboard in case a Coupon Code is Present with Offer */
  const copyCoupon = (i: any, offerId: string) => {
    const coupon = RefArray[i];
    const textArea = document.createElement("textarea");
    textArea.value = coupon.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("Copy");
    textArea.remove();
    setShowCopied(offerId);
    if (adobeEvent) {
      adobeEvent("Copy Code", coupon.textContent.toUpperCase());
    }
  };

  return (
    <div>
      {showCopied === id || !couponCode || couponCode?.trim() === "" ? (
        <React.Fragment>
          {showCopied === id && !isReminderWidget && <span className="text-xs pr-2">{t("couponCopied")}</span>}
          <button
            aria-hidden
            type="button"
            className={`${showCopied === id ? "shopBtn" : ""}   ${
              !isReminderWidget ? "w-32" : "w-full"
            }  text-white text-center px-4 py-1.5 bg-color1 text-xxs font-semibold rounded-sm uppercase`}
            onClick={() => {
              if (adobeEvent) {
                adobeEvent("Shop Now");
              }
              if (productTag && apiShowMiniPDPFlag) {
                showMiniPDP({ productTag });
              } else if (webURL?.includes("/product/") && apiShowMiniPDPFlag) {
                showMiniPDP({ webURL });
              } else {
                router.push(webURL || `/buy/skincare`);
              }
            }}
          >
            {t("shopNow")}
          </button>
        </React.Fragment>
      ) : (
        <div
          style={{ padding: "5px 45px 5px 10px" }}
          className={`${
            !isReminderWidget ? "w-32" : ""
          } text-xs text-center border border-dotted mx-auto border-color1 relative rounded-r-md overflow-hidden`}
          ref={r => {
            RefArray[index] = r;
          }}
          contentEditable="false"
          suppressContentEditableWarning
        >
          <span className="line-clamp-1">{couponCode}</span>
          <span
            role="presentation"
            onClick={() => copyCoupon(index, id)}
            className="absolute flex items-center justify-center bg-color1 right-0 top-0 bottom-0 w-7 rounded-r"
          >
            <Copy role="img" aria-labelledby="copy offer code" />
          </span>
        </div>
      )}
    </div>
  );
};

export default CopyCouponCode;
