import ImageComponent from "@libComponents/Common/LazyLoadImage";
import useTranslation from "@libHooks/useTranslation";
import { useAmp } from "next/amp";
import React from "react";

const FooterAppUrl = ({ androidUrl, iosUrl }: any) => {
  const isAmp = useAmp();
  const { t } = useTranslation();

  return (
    <>
      <div className="flex justify-center pb-6">
        <h2 className="text-white tex-center pt-3">{t("downloadAppText")}</h2>
      </div>
      <div className="flex justify-center mb-4" role="list">
        <a
          href={androidUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-end w-1/2 h-12 pl-2 pr-1 i-amphtml-sizer-intrinsic"
          role="listitem"
          aria-label="google play"
        >
          <ImageComponent
            delay={6000}
            className="h-10 w-auto"
            src="https://files.myglamm.com/site-images/original/ico-google-app.png"
            alt="Google Play"
            forceLoad={isAmp}
          />
        </a>
        <a
          href={iosUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-1/2 h-12 pl-2 pr-1 i-amphtml-sizer-intrinsic"
          role="listitem"
          aria-label="play store"
        >
          <ImageComponent
            delay={6000}
            alt="Appstore"
            className="h-10 w-auto"
            src="https://files.myglamm.com/site-images/original/ico-appstore.png"
            forceLoad={isAmp}
          />
        </a>
      </div>
    </>
  );
};

export default FooterAppUrl;
