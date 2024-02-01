import LoadSpinner from "@libComponents/Common/LoadSpinner";
import React from "react";

interface surveyThankProps {
  widget: any;
  claimFreeProduct: () => void;
  CTA: string;
  loader: boolean;
}

const SurveyThankyouWeb = ({ widget, claimFreeProduct, CTA, loader }: surveyThankProps) => {
  return (
    <section className="flex justify-center items-center w-full h-full">
      <div className="flex flex-col items-center relative">
        <img alt="landing banner" className="max-w-2xl rounded-md" src={widget?.multimediaDetails[0].assetDetails.url} />

        <button
          type="submit"
          onClick={claimFreeProduct}
          className="text-white absolute bottom-8 rounded-md px-24 py-4 w-11/12 bg-color1 h-20 uppercase font-bold tracking-wider"
        >
          {loader ? <LoadSpinner className="inset-0 m-auto w-16 absolute" /> : CTA}
        </button>
      </div>
    </section>
  );
};

export default SurveyThankyouWeb;
