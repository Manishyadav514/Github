import React from "react";

import BannerTimer from "@libComponents/HomeWidgets/BannerTimer";
import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";

const MultmediaCarousel1 = ({ item }: any) => {
  if (item.multimediaDetails.length === 0) {
    return null;
  }

  const getCurrentDateTime = new Date().getTime();
  return (
    <section id="myglammxo-slider">
      <h3 className="uppercase text-color1 font-semibold text-center pt-7 pb-2">{item.commonDetails?.title}</h3>

      <div className="m-auto max-w-[281px]">
        <GoodGlammSlider dots="dots">
          {item.multimediaDetails.map((media: any) => {
            return (
              <div key={media.assetDetails.url} className="p-4 ">
                <div className="relative">
                  <img
                    src={media.assetDetails?.url}
                    alt={media.assetDetails?.name}
                    style={{ boxShadow: "4px 4px 4px #00000021" }}
                  />

                  <BannerTimer
                    expiryTimestamp={media?.endDate && new Date(media?.endDate).getTime()}
                    asset={media}
                    getCurrentDateTime={getCurrentDateTime}
                    startDate={media?.startDate && new Date(media.startDate).getTime()}
                  />
                </div>
              </div>
            );
          })}
        </GoodGlammSlider>
      </div>
    </section>
  );
};

export default MultmediaCarousel1;
