import React, { useState } from "react";
import Image from "next/legacy/image";
import { useRouter } from "next/router";

const MultimediaCarousel6 = ({ data, type }: any) => {
  const { asPath } = useRouter();

  const [unOptimizedImg, setUnOptimizedImg] = useState(false);

  const { headerText, assetDetails, targetLink, url } = data.multimediaDetails?.[0] || {};

  const imgSrc = assetDetails?.url;

  /* Constant Img HTML Render for All Cases */
  const imgRender = () => <img src={imgSrc} alt={headerText} className={`w-full ${asPath === "/events" ? "mb-8" : "mb-4"}`} />;

  /**
   * Render Cases for Images
   */
  /* Survey Specific Next Gen Served Img */
  if (type === "survey" && imgSrc) {
    return (
      <Image
        priority
        width={375}
        height={667}
        src={imgSrc}
        alt={headerText}
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
    return imgRender();
  }

  /* Banner With Redirection */
  return <a href={targetLink}>{imgRender()}</a>;
};

export default MultimediaCarousel6;
