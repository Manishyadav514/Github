import React from "react";

import HomeWidgetLabel from "./HomeWidgetLabel";
import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";

const MultimediaCarousel9 = (props: any) => {
  const { item } = props;
  const widgetMeta = item?.meta?.widgetMeta ? JSON.parse(item?.meta?.widgetMeta) : "";

  if (!widgetMeta?.type) return null;

  return (
    <section className="max-w-screen-xl my-14 mx-auto w-full homeWidget">
      <HomeWidgetLabel title={item.commonDetails.title} />
      {widgetMeta?.type === "parentsNDoctors" && (
        <section className="py-4">
          <GoodGlammSlider slidesPerView={4} arrowClass={{ left: "-left-9", right: "-right-9" }}>
            {widgetMeta?.data?.map((data: any, index: number) => {
              return (
                <div key={index} className="flex justify-center text-center px-2 py-4 mx-auto">
                  <div className="relative w-[100%] h-[520px] shadow-md bg-white">
                    <div className="absolute bottom-4 right-4">
                      <img src="https://www.babychakra.com/bbc-assets/images/down-quote.svg" alt="quote" />
                    </div>
                    <img
                      src="https://www.babychakra.com/bbc-assets/images/up-quote.svg"
                      alt="quote"
                      className="absolute top-0 left-2 w-40 h-40"
                    />
                    <div className="flex flex-col justify-center items-center text-center">
                      <img className="w-28 h-32 mt-6" src={data.image} alt={data?.name} />
                      <p className="font-bold text-lg mt-4">{data?.name}</p>
                      <p className="my-8 mx-2">{data.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </GoodGlammSlider>
        </section>
      )}
      {widgetMeta?.type === "parentingEasier" && (
        <section className="bg-pink-100 py-4">
          <GoodGlammSlider slidesPerView={4} arrowClass={{ left: "-left-9", right: "-right-9" }}>
            {widgetMeta?.data?.map((data: any, index: number) => {
              return (
                <div key={index} className="flex justify-center text-center py-4 mx-auto bg-pink-100">
                  <div className="relative w-[100%] h-[410px] shadow-md bg-white rounded-lg">
                    <img
                      src={data.image}
                      alt={data.description}
                      className={`absolute top-0 w-36 h-40 ${index === 1 ? "right-0" : "left-0"}`}
                    />
                    <div
                      dangerouslySetInnerHTML={{ __html: data.title }}
                      className={`absolute top-5 w-28 h-40 ${index === 1 ? "left-5" : "right-3"}`}
                    />
                    <p className="mt-[11rem] mx-3 text-left">{data.description}</p>
                  </div>
                </div>
              );
            })}
          </GoodGlammSlider>
        </section>
      )}
      {widgetMeta?.type === "babychakraInNews" && (
        <section className="py-4">
          <GoodGlammSlider slidesPerView={8} arrowClass={{ left: "-left-9", right: "-right-9" }}>
            {widgetMeta?.data?.map((data: any, index: number) => {
              return (
                <div key={index} className="flex justify-center text-center py-4 mx-auto">
                  <div className="shadow-md bg-white">
                    <a href={data.link} target="_blank" rel="noreferrer">
                      <img src={data.image} alt={data.link} className="w-32 h-20" />
                    </a>
                  </div>
                </div>
              );
            })}
          </GoodGlammSlider>
        </section>
      )}
    </section>
  );
};

export default MultimediaCarousel9;
