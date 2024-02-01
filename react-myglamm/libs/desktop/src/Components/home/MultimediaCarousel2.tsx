import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";

const MultimediaCarousel2 = (props: any) => {
  const { data } = props;
  const widgetMeta = data.meta.widgetMeta && JSON.parse(data.meta.widgetMeta);

  if (data.multimediaDetails?.length === 0) {
    return null;
  }

  return (
    <section
      className="w-full my-12  flex mx-auto"
      style={{
        background: widgetMeta.bgColor ? widgetMeta.bgColor : `url(${widgetMeta.bgImageUrl})`,
        maxWidth: "1120px",
      }}
    >
      <div className="relative moduleCarouselBanner-10">
        <img src={widgetMeta.bgBanner} alt="Collection" className="collectionImg w-full" style={{ height: "300px" }} />
      </div>

      <div className="m-auto multimediaCarouselDiv-2 px-12">
        <GoodGlammSlider slidesPerView={1.5} slidesToScroll={2}>
          {data.multimediaDetails?.map((imgDetail: any) => (
            <figure key={imgDetail.assetDetails.url}>
              <LazyLoadImage src={imgDetail.assetDetails.url} alt={imgDetail.headerText} />
            </figure>
          ))}
        </GoodGlammSlider>
      </div>
    </section>
  );
};

export default MultimediaCarousel2;
