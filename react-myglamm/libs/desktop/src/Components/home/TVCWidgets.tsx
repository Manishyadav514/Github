import React from "react";
import MultimediaSingleBanner from "./MultimediaSingleBanner";
import MultipleBannerCarousel from "../home/MultipleBannerCarousel";
import BannerProductCarousel1 from "./BannerProductCarousel1";
import ModuleCarousel10 from "./ModuleCarousel10";
import TVCMultimediaCarouse5 from "./TVCMultimediaCarousel5";
import MultimediaCarousel2 from "./MultimediaCarousel2";
import MultimediaCarousel8 from "./MultimediaCarousel8";

const TVCWidgets = (props: any) => {
  const { widgets } = props;
  return (
    <>
      {widgets?.map((widget, index) => {
        const { customParam, id, label } = widget;

        const icid = `ShraddhaKapoorTVC_ShraddhaKapoor__${customParam?.toLowerCase()}_${label?.toLowerCase()}_${index + 1}`;

        switch (customParam) {
          case "multimedia-carousel-1": {
            return <MultipleBannerCarousel data={widget} icid={icid} key={id} tvc />;
          }
          case "multimedia-single-banner": {
            return <MultimediaSingleBanner data={widget} key={id} index={index} icid={icid} />;
          }
          case "independent-banner-product-carousel-1": {
            return <BannerProductCarousel1 data={widget} key={id} index={index} />;
          }
          case "module-carousel-10": {
            return <ModuleCarousel10 data={widget} key={id} index={index} />;
          }
          case "multimedia-carousel-2": {
            return <MultimediaCarousel2 data={widget} key={id} index={index} />;
          }

          case "multimedia-carousel-5": {
            return <TVCMultimediaCarouse5 data={widget} key={id} index={index} />;
          }
          case "multimedia-carousel-8": {
            return <MultimediaCarousel8 item={widget} key={id} index={index} />;
          }

          default: {
            return null;
          }
        }
      })}
    </>
  );
};

export default TVCWidgets;
