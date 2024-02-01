import React from "react";

import useTranslation from "@libHooks/useTranslation";

import VisaIcon from "../../../public/svg/visa.svg";
import MadaIcon from "../../../public/svg/mada.svg";
import MastercardIcon from "../../../public/svg/mastercard.svg";

const SRNFooterME = () => {
  const { t } = useTranslation();

  return (
    <div className="px-4 pt-8" style={{ backgroundColor: "#f6f6f6" }}>
      <div className="flex flex-wrap justify-start items-center">
        <strong className="text-sm">{t("email")}:</strong>
        <a href={`mailto:${t("supportEmailId")}`} className="ml-3 text-sm font-normal" aria-label={t("supportEmailId")}>
          {t("supportEmailId")}
        </a>
      </div>

      <p className="text-xs font-medium pt-6">{t("weAccept") || "We Accept"}</p>
      <div className="flex flex-wrap justify-start items-center pt-2 pb-6">
        <VisaIcon className="w-11 rounded-lg" id="noRotate" />
        <MastercardIcon className="w-11 mx-1 rounded-lg" id="noRotate" />
        <MadaIcon className="w-11 mx-1 rounded-lg" id="noRotate" />
      </div>
      <p className="text-xs text-left font-medium pb-5">
        © {new Date().getFullYear()} {t("companyName") || "Sanghvi Beauty Cosmetics Trading LLC"}
      </p>
    </div>
  );
};

export default SRNFooterME;
