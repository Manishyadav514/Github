import React from "react";

import useTranslation from "@libHooks/useTranslation";

import { SurveyList } from "./SurveyListing";

interface SurveyWeb extends SurveyList {
  CTA: string;
}

const SurveyListingWeb = ({ widgets, openTypeform, CTA }: SurveyWeb) => {
  const { t } = useTranslation();

  return (
    <section className="flex justify-center items-center w-full h-full py-8" style={{ minHeight: "calc(100vh - 14rem)" }}>
      <div className="flex flex-col items-center relative">
        <img alt="landing banner" className="max-w-2xl rounded-md" src={widgets[0]?.multimediaDetails[0].assetDetails.url} />
        <button
          type="submit"
          onClick={openTypeform}
          className="text-white absolute bottom-16 rounded-md px-24 py-4 w-11/12 bg-color1 font-bold tracking-widest"
        >
          {CTA || t("startSurvey")}
        </button>
        <p className="absolute text-lg text-center  bottom-0 opacity-80 italic">{t("startSuveyMsg")}</p>
      </div>
    </section>
  );
};

export default SurveyListingWeb;
