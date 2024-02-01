import React, { useState, useEffect } from "react";

import useTranslation from "@libHooks/useTranslation";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

import { SHOP } from "@libConstants/SHOP.constant";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import { getLocalStorageValue, removeLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";

import Checkbox from "../../../public/svg/checkbox.svg";

const WhatsappEnabeCheckbox = () => {
  const { t } = useTranslation();

  const [showCheckbox, setShowCheckbox] = useState(false);
  const [whatsAppChecked, setWhatsAppChecked] = useState(true);

  const toggleWhatsApp = () => {
    setWhatsAppChecked(!whatsAppChecked);

    if (whatsAppChecked) {
      return removeLocalStorageValue(LOCALSTORAGE.WHATSAPP_ENABLED);
    }
    return setLocalStorageValue(LOCALSTORAGE.WHATSAPP_ENABLED, "true");
  };

  useEffect(() => {
    if (checkUserLoginStatus() && !getLocalStorageValue(LOCALSTORAGE.PROFILE, true)?.communicationPreference?.whatsApp) {
      setShowCheckbox(true);
      setLocalStorageValue(LOCALSTORAGE.WHATSAPP_ENABLED, "true");
    }
  }, []);

  if (showCheckbox && SHOP.ENABLE_WHATSAPP) {
    return (
      <div role="presentation" onClick={toggleWhatsApp} className="checkWhatsapp my-4 flex items-center">
        {whatsAppChecked ? (
          <Checkbox width="20" height="20" className="w-5 my-auto mr-4" />
        ) : (
          <button
            type="button"
            aria-label="checkbox"
            className="border-2 border-darkpink rounded w-5 h-5 bg-white my-auto mr-4"
          />
        )}

        <p className="text-xs">
          {t("AcceptToReceiveWhatsappUpdates") || "I accept to receive order status updates through WhatsApp."}
        </p>
      </div>
    );
  }

  return null;
};
export default WhatsappEnabeCheckbox;
