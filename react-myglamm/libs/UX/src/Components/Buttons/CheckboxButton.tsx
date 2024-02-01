import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import useTranslation from "@libHooks/useTranslation";
import { setLocalStorageValue } from "@libUtils/localStorage";
import React, { useEffect, useState } from "react";

const CheckboxButton = () => {
  const { t } = useTranslation();
  const [isWhatsAppEnable, setIsWhatsAppEnable] = useState(true);

  useEffect(() => {
    setLocalStorageValue(LOCALSTORAGE.ENABLE_WHATSAPP_OTP, isWhatsAppEnable, true);
  }, [isWhatsAppEnable]);

  return (
    <div className="flex items-center justify-center mt-5">
      <input type="checkbox" checked={isWhatsAppEnable} onChange={() => setIsWhatsAppEnable(!isWhatsAppEnable)} />
      <p className="text-xxs ml-3">{t("removeUpdatesWhatsApp") || "Receive updates on WhatsApp"}</p>
    </div>
  );
};

export default CheckboxButton;
