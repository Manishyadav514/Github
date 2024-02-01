import React, { useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";

import { CBWidgetsProps } from "@typesLib/Widgets";

import PopupModal from "./PopupModal";

import CrossIcon from "../../../public/svg/crossIconBlack.svg";
import { checkCBPopupLocally } from "@productLib/pdp/HelperFunc";
import { setLocalStorageValue } from "@libUtils/localStorage";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";

const BannerPopupModal = ({ show, hide, widget }: CBWidgetsProps) => {
  const { discountCode } = JSON.parse(widget.meta.widgetMeta || "{}");
  const { url, assetDetails } = widget.multimediaDetails?.[0] || {};

  const [showPopup, setShowPopup] = useState(false);

  console.log({ discountCode });

  const handleBannerClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (url === "noRedirect") {
      e.preventDefault();

      if (discountCode) {
        setLocalStorageValue(LOCALSTORAGE.COUPON, discountCode);
        // Router.push(`${Router.asPath}${Router.asPath.includes("?") ? `&` : `?`}discountCode=${discountCode}`);
      }
    }

    hide();
  };

  /* Hide Logic for Popup incase have seen already */
  useEffect(() => {
    setShowPopup(checkCBPopupLocally("banner"));
  }, []);

  if (showPopup) {
    return (
      <PopupModal show={show} onRequestClose={hide} type="center-modal">
        <Link href={url} className="block relative mx-6" onClick={e => handleBannerClick(e)}>
          <button onClick={hide} type="button" className="bg-white rounded-full w-max absolute -right-2 -top-2 aspect-square">
            <CrossIcon width={18} height={18} className="w-5" />
          </button>

          <img src={assetDetails?.url} className="w-full rounded-xl" alt={assetDetails?.name} />
        </Link>
      </PopupModal>
    );
  }

  return null;
};

export default BannerPopupModal;
