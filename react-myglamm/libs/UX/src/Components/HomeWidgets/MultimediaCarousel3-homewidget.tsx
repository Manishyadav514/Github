import React, { Fragment } from "react";
import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";
import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";
import WidgetLabel from "./WidgetLabel";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

function MultimediaCarousel3({ item, icid, widgetIndex }: any) {
  const widgetMeta = item?.meta?.widgetMeta && JSON.parse(item.meta.widgetMeta);
  const ParentNDoctors = () => {
    return (
      <ErrorBoundary>
        <section
          className="py-4"
          aria-roledescription="carousel"
          aria-label={item?.commonDetails?.title || item?.commonDetails?.subTitle}
        >
          <WidgetLabel title={item.commonDetails.title} className="uppercase" />
          <GoodGlammSlider autoPlay autoPlayDelay={8000} dots="dots">
            {widgetMeta?.data?.map((data: any, index: number) => {
              return (
                <div
                  key={index}
                  className="flex justify-center text-center px-2 py-4 mx-auto bg-white"
                  id={`carousel-item-${index + 1}`}
                  role="tabpanel"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${widgetMeta?.data?.length}`}
                >
                  <div className="relative w-[80%] h-[480px] shadow-md">
                    <div className="absolute bottom-4 right-4">
                      <ImageComponent src="https://www.babychakra.com/bbc-assets/images/down-quote.svg" />
                    </div>
                    <ImageComponent
                      src="https://www.babychakra.com/bbc-assets/images/up-quote.svg"
                      alt="quote"
                      className="absolute top-0 left-2 w-40 h-40"
                    />
                    <div className="flex flex-col justify-center items-center text-center">
                      <ImageComponent className="w-28 h-32 mt-6" src={data.image} alt={data.name} />
                      <p className="font-bold text-lg mt-4">{data.name}</p>
                      <p className="my-8 mx-2">{data.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </GoodGlammSlider>
        </section>
      </ErrorBoundary>
    );
  };

  const ParentingEasier = () => {
    return (
      <ErrorBoundary>
        <section
          className="bg-pink-100 py-4"
          role="banner"
          aria-roledescription="carousel"
          aria-label={item?.commonDetails?.title || item?.commonDetails?.subTitle}
        >
          <WidgetLabel title={item.commonDetails.title} className="uppercase" />
          <GoodGlammSlider autoPlay autoPlayDelay={8000} dots="dots">
            {widgetMeta?.data?.map((data: any, index: number) => {
              return (
                <div
                  key={index}
                  className="flex justify-center text-center py-4 mx-auto bg-pink-100"
                  id={`carousel-item-${index + 1}`}
                  role="tabpanel"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${widgetMeta?.data?.length}`}
                >
                  <div className="relative w-[80%] h-[380px] shadow-md bg-white rounded-lg">
                    <ImageComponent
                      src={data.image}
                      className={`absolute top-0 w-36 h-40 ${index === 1 ? "right-0" : "left-0"}`}
                    />
                    <div
                      dangerouslySetInnerHTML={{ __html: data.title }}
                      className={`absolute top-5 w-28 h-40 ${index === 1 ? "left-5" : "right-3"}`}
                    ></div>
                    <p className="mt-[12rem] mx-3 text-left">{data.description}</p>
                  </div>
                </div>
              );
            })}
          </GoodGlammSlider>
        </section>
      </ErrorBoundary>
    );
  };

  if (!widgetMeta?.type) return null;

  return (
    <Fragment>
      {widgetMeta?.type === "parentsNDoctors" && <ParentNDoctors />}
      {widgetMeta?.type === "parentingEasier" && (
        <div className="py-4">
          <ParentingEasier />
        </div>
      )}
    </Fragment>
  );
}

export default MultimediaCarousel3;
