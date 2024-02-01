import useTranslation from "@libHooks/useTranslation";
import { Router, useRouter } from "next/router";
import React from "react";

const PDPContactUs = () => {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <div className="px-4 pt-6 pb-4 bg-white">
      <p className="text-sm pb-4">{t("haveQueryOrConcerns") || "Have queries or concerns?"}</p>
      <button
        onClick={() => {
          router.push("/chat-with-us?flow=Customer-Support");
        }}
        className="text-color1 text-sm font-bold border border-color1 h-10 w-full rounded-3"
      >
        {t("contactUs") || "Contact Us"}
      </button>
    </div>
  );
};

export default PDPContactUs;
