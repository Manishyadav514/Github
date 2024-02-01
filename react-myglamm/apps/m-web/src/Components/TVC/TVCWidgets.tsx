import React from "react";
import dynamic from "next/dynamic";

const MultimediaCarousel5 = dynamic(() => import("@libComponents/TVC/multimedia-carousel-5-homewidget"));
const MultimediaSingleBanner = dynamic(() => import("@libComponents/TVC/multimedia-single-banner-homewidget"));
const BannerProductCarousel = dynamic(() => import("./banner-product-carousel"));
const BannerProductCarousel2 = dynamic(() => import("@libComponents/TVC/banner-product-carousel-2-homewidget"));
const MultimediaCarousel3 = dynamic(() => import("./multimedia-carousel-3"));

const ModuleCarousel10 = dynamic(() => import("./module-carousel-10"));

const MultimediaCarousel8 = dynamic(() => import("./multimedia-carousel-8"));

const MultipleBanner = dynamic(() => import("@libComponents/HomeWidgets/MultipleBanner-homewidget"));

const TVCWidgets = ({ widget, index }: any) => {
  const icid = `ShraddhaKapoorTVC_ShraddhaKapoor__${widget.customParam?.toLowerCase()}_${widget.label?.toLowerCase()}_${
    index + 1
  }`;

  switch (widget.customParam) {
    case "multiple-banner": {
      return <MultipleBanner item={widget} icid={icid} widgetIndex={index} />;
    }
    case "multimedia-single-banner": {
      return <MultimediaSingleBanner item={widget} icid={icid} index={index} />;
    }
    case "multimedia-carousel-3": {
      return <MultimediaCarousel3 item={widget} icid={icid} />;
    }
    case "multimedia-carousel-5": {
      return <MultimediaCarousel5 item={widget} />;
    }
    case "multimedia-carousel-8": {
      return <MultimediaCarousel8 item={widget} />;
    }
    case "independent-banner-product-carousel-1": {
      return <BannerProductCarousel item={widget} icid={icid} />;
    }
    case "independent-banner-product-carousel-2": {
      return <BannerProductCarousel2 item={widget} icid={icid} />;
    }
    case "module-carousel-10": {
      return <ModuleCarousel10 item={widget} icid={icid} />;
    }
    default: {
      return null;
    }
  }
};

export default TVCWidgets;
