import React from "react";
import Link from "next/link";

import Ripples from "@libUtils/Ripples";
import LazyHydrate from "react-lazy-hydration";
import { ErrorBoundary } from "react-error-boundary";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";
import ErrorFallback from "@libComponents/ErrorBoundary/ErrorFallBack";

import useTranslation from "@libHooks/useTranslation";

import { SHOP } from "@libConstants/SHOP.constant";
import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

import { getGlammStudioInitialProps } from "@libUtils/glammStudioUtils";

import ErrorComponent from "./_error";
import GlammStudioHead from "@libComponents/Blogs/GlammStudioHead";

const GlammStudioPage = ({ widgets, errorCode, SEO }: any) => {
  const categoryBreadcrumbs = widgets.filter((wid: any) => wid.customParam !== "multiple-banner");
  const banner = widgets?.filter((w: any) => w.label === "Mobile-banner");
  const { t } = useTranslation();

  if (errorCode) {
    return <ErrorComponent statusCode={errorCode} />;
  }

  return (
    <React.Fragment>
      <GlammStudioHead />

      <main>
        {/* Menu of Categories */}

        <div className="w-full sticky flex pl-3 py-3 overflow-x-auto flex-no-wrap z-20 bg-themeGray top-12">
          {Array.isArray(categoryBreadcrumbs)
            ? categoryBreadcrumbs.map((categories: any) => {
                const name = categories.label || {};
                const slug = categories.commonDetails?.title?.toLowerCase().replaceAll(" ", "-");
                return (
                  <Link href={`/${SHOP.SITE_CODE === "mgp" ? "glammstudio" : "blog"}/${slug}`} key={name}>
                    <button
                      type="button"
                      className={`flex-sliderChild px-4 text-s mr-3 rounded-full h-8 text-center border border-color1 overflow-hidden bg-white text-color1 capitalize`}
                      aria-label={name.toLowerCase()}
                    >
                      {name.toLowerCase()}
                    </button>
                  </Link>
                );
              })
            : null}
        </div>

        {/* HeadBanner */}
        {banner && banner[0]?.multimediaDetails.length > 0 && (
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <GoodGlammSlider dots="dots">
              {banner[0]?.multimediaDetails?.map((data: any, index: any) => {
                const image =
                  data?.assetDetails?.type === "image" && data?.assetDetails?.url
                    ? data?.assetDetails?.url
                    : DEFAULT_IMG_PATH();
                return (
                  <div key={index}>
                    <div
                      className="relative demo"
                      style={{
                        backgroundImage: `url(${image})`,
                        backgroundSize: "100% auto",
                        backgroundColor: "#FCEEEE",
                        backgroundRepeat: "no-repeat",
                        boxSizing: "border-box",
                        maxWidth: "100%",
                        height: "390px",
                        width: "100%",
                      }}
                    >
                      <div
                        className="relative z-10"
                        style={{
                          top: "70%",
                        }}
                      >
                        <h2 className="text-xl font-semibold text-center uppercase tracking-widest text-white">
                          {data?.headerText || data.targetLink?.split("/")[2].split(".")[0]}
                        </h2>

                        <div className="flex justify-center">
                          <Link
                            href={data?.targetLink}
                            className="text-base text-center text-white font-semibold tracking-wider border-b border-white py-1 w-1/4"
                            aria-label={t("readMore")}
                          >
                            {t("readMore")}
                          </Link>
                        </div>
                      </div>
                      <div className="absolute bg-black right-0 top-0 bottom-0 left-0 opacity-50" />
                    </div>
                  </div>
                );
              })}
            </GoodGlammSlider>
          </ErrorBoundary>
        )}

        {/* Blog Slider */}
        <LazyHydrate whenVisible>
          {widgets?.map((widget: any) => {
            if (widget.type === "text") {
              const widgetDetail = widget.commonDetails;
              const slug = widget?.label?.toLowerCase();

              const SliderTiles = widgetDetail.descriptionData[0]?.value;
              return (
                <ErrorBoundary key={widget.id} FallbackComponent={ErrorFallback}>
                  <div className="bg-white">
                    <div className="flex mt-1 pt-4 justify-between items-center border-b border-gray-400 pb-1">
                      <h2 className="text-lg font-semibold uppercase px-2 left-0">{widgetDetail.title}</h2>
                      <Ripples>
                        <Link
                          href={`${SHOP.IS_MYGLAMM ? "glammstudio" : "blog"}/${slug}`}
                          className="text-sm font-semibold uppercase px-2 right-0"
                          aria-label={t("viewAll")?.toUpperCase()}
                        >
                          {t("viewAll")?.toUpperCase()}
                        </Link>
                      </Ripples>
                    </div>

                    {Array.isArray(SliderTiles) && SliderTiles.length > 0 && (
                      <GoodGlammSlider slidesPerView={1.3}>
                        {widgetDetail.descriptionData[0]?.value.map((content: any) => {
                          const image = content.assets.filter((a: any) => a.type === "image");
                          const video = content.assets.filter((a: any) => a.type === "video");
                          return (
                            <div key={content.id}>
                              <Ripples>
                                <Link href={content?.urlManager?.url} aria-label={content.cms[0]?.content.name}>
                                  <div className="py-2 pl-2 -pr-1">
                                    {image.length > 0 ? (
                                      <ImageComponent
                                        className="relative border bg-gray-200 border-gray-200 p-1 h-40 w-full"
                                        src={image[0]?.imageUrl["768x432"]}
                                        alt={image[0]?.name}
                                      />
                                    ) : (
                                      <ImageComponent
                                        className="relative border bg-gray-200 border-gray-200 p-1 h-40 w-full "
                                        src={video[0]?.properties?.thumbnailUrl}
                                        alt={video[0]?.properties?.imageAltTag}
                                      />
                                    )}
                                    {video.length > 0 && (
                                      <ImageComponent
                                        className="h-8 w-8 absolute z-40 ml-32"
                                        style={{ top: "30%" }}
                                        src="https://files.myglamm.com/images/static/video-youtube-icon.png"
                                        alt="youtube-icon"
                                      />
                                    )}
                                  </div>
                                  <p className="pl-2 pr-1 my-1 mb-3">{content.cms[0]?.content.name}</p>
                                </Link>
                              </Ripples>
                            </div>
                          );
                        })}
                      </GoodGlammSlider>
                    )}
                  </div>
                </ErrorBoundary>
              );
            }
            return null;
          })}
        </LazyHydrate>
      </main>
    </React.Fragment>
  );
};

GlammStudioPage.getInitialProps = getGlammStudioInitialProps;

export default GlammStudioPage;
