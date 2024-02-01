/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import * as React from "react";

import useTranslation from "@libHooks/useTranslation";

import PopupModal from "./PopupModal";
import { g3Config } from "@typesLib/Survey";
import { IS_POPXO } from "@libConstants/COMMON.constant";

function GlammInfoModal({ show, onRequestClose, showBtn }: any) {
  const { t } = useTranslation();

  const GuestOffer = showBtn ? t("pdpGuestOffer") : t("cartGuestOffer");
  const firstOrderAmountGP = parseInt(t("firstOrderAmountGP") || 500, 10);

  const socialGlammPoints = parseInt(t("socialGlammPoints") || 150, 10);

  const modalTextLines = (GuestOffer || []).map((v: any) => {
    let ret = v;
    if (ret.includes("{socialGlammPoints}")) {
      ret = ret.replace(/{socialGlammPoints}/g, socialGlammPoints);
    }
    if (ret.includes("{firstOrderAmountGP}")) {
      ret = ret.replace(/{firstOrderAmountGP}/g, firstOrderAmountGP);
    }
    if (ret.includes("{newline}")) {
      ret = ret.replace(/{newline}/g, "<br />");
    }
    return ret;
  });

  const G3_CONFIG: g3Config = t("g3Config");

  return (
    <PopupModal show={show} onRequestClose={onRequestClose}>
      <div className="bg-white w-full pt-10 rounded-t-md text-center relative">
        <div className="text-center justify-center flex w-16 h-16 rounded-full items-center mx-auto -mt-16 bg-white">
          <img
            alt="glammCoin"
            src={IS_POPXO() ? G3_CONFIG?.popxoCoinIcon : G3_CONFIG?.coinIcon}
            className="object-contain h-11 w-11"
          />
        </div>
        <div
          role="button"
          className="flex items-center justify-end text-2xl opacity-50 leading-none -mt-3 mr-6 font-medium"
          onClick={onRequestClose}
        >
          ×
        </div>
        <p className="text-center my-1 text-22 bg-underline inline-block px-0.5">{t("myglammPoints")}</p>
        <div className="mx-2 mb-4" style={{ padding: "0px 20px", boxSizing: "border-box" }}>
          {modalTextLines?.map((content: string) => (
            <div className="flex my-4 " key={content}>
              <img alt="star" src="https://files.myglamm.com/site-images/original/star.png" className="h-3.5 w-3.5" />
              <div
                dangerouslySetInnerHTML={{ __html: content }}
                className="text-sm px-2 ml-2 -mt-1 text-left"
                style={{ color: "#212529" }}
              />
            </div>
          ))}
        </div>
        {showBtn && (
          <div className="w-full p-3 border-t-2 border-gray-200">
            <button type="button" className="text-sm outline-none" style={{ color: "#212529" }} onClick={onRequestClose}>
              GOT IT
            </button>
          </div>
        )}
      </div>
    </PopupModal>
  );
}

export default GlammInfoModal;
