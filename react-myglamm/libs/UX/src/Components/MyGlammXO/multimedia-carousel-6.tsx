import React, { useState } from "react";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import useTranslation from "@libHooks/useTranslation";

const MultimediaCarousel6 = ({ data, type }: any) => {
  const { asPath } = useRouter();

  const [unOptimizedImg, setUnOptimizedImg] = useState(false);

  const { headerText, assetDetails, targetLink, url } = data.multimediaDetails?.[0] || {};

  const { url: imgSrc, properties } = assetDetails;
  const { t } = useTranslation();

  /* Constant Img HTML Render for All Cases */
  const ImgRender = () => (
    <Image
      priority
      width={properties?.width || 375}
      height={properties?.height || 667}
      src={imgSrc}
      alt={headerText}
      layout="responsive"
      unoptimized={unOptimizedImg}
      quality={t("surveyBannerQuality") || 75}
      onLoadingComplete={e => {
        if (e.naturalWidth === 0) setUnOptimizedImg(true);
      }}
    />
  );

  /**
   * Render Cases for Images
   */
  /* Survey Specific Next Gen Served Img */
  if (type === "survey" && imgSrc) {
    return (
      <Image
        priority
        width={properties?.width || 375}
        height={properties?.height || 667}
        src={imgSrc}
        alt={headerText}
        quality={t("surveyBannerQuality") || 75}
        layout="responsive"
        unoptimized={unOptimizedImg}
        onLoadingComplete={e => {
          if (e.naturalWidth === 0) setUnOptimizedImg(true);
        }}
      />
    );
  }

  /* Simple Banner With no Redirection */
  if (url === "NoRedirection") {
    return <ImgRender />;
  }

  /* Banner With Redirection */
  return (
    <a href={targetLink}>
      <ImgRender />
    </a>
  );
};

export default MultimediaCarousel6;
