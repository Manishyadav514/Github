import React, { useState } from "react";
import dynamic from "next/dynamic";

import useTranslation from "@libHooks/useTranslation";

const ExchangeOfferModal = dynamic(() => import("@libComponents/PopupModal/ExchangeOfferModal"), {
  ssr: false,
});

const ExchangeOffer = () => {
  const { t } = useTranslation();
  const [showExchangeContent, setShowExchangeContent] = useState<boolean | undefined>();

  return (
    <div className="exclusiveBenefits mt-2 bg-white">
      <div className="py-4">
        <div className=" px-4 pb-4">
          <h2 className="text-sm font-extrabold text-black uppercase">{t("exclusiveBenefits")}</h2>
        </div>
        <section className="HTMLContent px-4">
          <div className="flex">
            <img className="mr-2" src="https://files.myglamm.com/site-images/original/easy-return_1.png" alt="easy return" />
            <strong>Easy Return</strong>&nbsp; within 7 Days
            <img
              alt="info"
              role="presentation"
              className="info-icon ml-2"
              onClick={() => setShowExchangeContent(true)}
              src="https://files.myglamm.com/site-images/original/info_1.png"
            />
          </div>
        </section>
      </div>

      {typeof showExchangeContent === "boolean" && (
        <ExchangeOfferModal showExchangeContent={showExchangeContent} setShowExchangeContent={setShowExchangeContent} />
      )}
    </div>
  );
};

export default ExchangeOffer;
