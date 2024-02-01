import * as React from "react";
import Link from "next/link";
import Ripples from "@libUtils/Ripples";
import { GiForwardIco } from "@libComponents/GlammIcons";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";
// import ShareEarnModal from "@libComponents/PopupModal/ShareEarnModal";

import useTranslation from "@libHooks/useTranslation";
import WidgetLabel from "./WidgetLabel";
import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";
import { CONFIG_REDUCER, ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

function MultipleLookBookCarousel({ item, icid }: any) {
  const data = item.commonDetails.descriptionData[0]?.value;
  const relationalData = item?.commonDetails?.descriptionData[0]?.relationalData;

  const { t } = useTranslation();

  // need to change name of widget to Trending Feed from blog
  const customICID = !icid
    ? undefined
    : icid.replace(`_${item.label.toLowerCase()}_`, `_${item.commonDetails.title.toLowerCase()}_`);

  return (
    <ErrorBoundary>
      <section className="MultiLookBookWidget mt-5" role="banner">
        <WidgetLabel title={item.commonDetails.title} />

        <div
          className="MultipleLooks px-3 flex overflow-x-auto overflow-y-hidden"
          style={{
            scrollSnapType: "x mandatory",
          }}
        >
          {data?.map((lookbook: any, index: number) => {
            const onShareClick = () => {
              CONFIG_REDUCER.shareModalConfig = {
                shareUrl: lookbook?.urlShortner?.shortUrl,
                productName: lookbook?.cms[0]?.content?.name,
                slug: lookbook?.urlShortner?.slug,
                module: "lookbook",
                image: lookbook?.assets[0]?.imageUrl["200x200"] || DEFAULT_IMG_PATH(),
                overrideRouterPath: "looks",
              };
            };

            return (
              <div key={lookbook.id} className="mr-1 pr-1" style={{ width: "340px", scrollSnapAlign: "center" }}>
                <Ripples>
                  <Link
                    href={
                      !icid
                        ? `${lookbook.urlManager.url}`
                        : `${lookbook.urlManager.url}?icid=${customICID}_${lookbook?.cms[0]?.content?.name.toLowerCase()}_${
                            index + 1
                          }`
                    }
                    prefetch={false}
                    style={{ width: "340px", height: "340px" }}
                    aria-label={lookbook.assets[0]?.name}
                  >
                    <ImageComponent src={lookbook.assets[0]?.imageUrl["400x400"]} alt={lookbook.assets[0]?.name} />
                  </Link>
                </Ripples>
                <div
                  className="relative bg-white mx-6 -mt-16 rounded overflow-hidden shadow-lg "
                  style={{ padding: "18px 16px" }}
                >
                  <h2
                    style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "var(--color2)",
                      textTransform: "uppercase",
                      textAlign: "center",
                      opacity: 0.2,
                      letterSpacing: "1.85px",
                      lineHeight: "35px",
                      margin: "0 0 -14px",
                    }}
                  >
                    {relationalData?.categoryId[lookbook?.categoryId]?.cms[0]?.content.name}
                  </h2>
                  <h2
                    style={{
                      fontSize: "16px",
                      color: "#000",
                      display: "block",
                      textTransform: "capitalize",
                      textAlign: "center",
                      lineHeight: "20px",
                    }}
                  >
                    {lookbook.cms[0]?.content.name}
                  </h2>
                  <button
                    type="button"
                    onClick={onShareClick}
                    style={{
                      float: "right",
                      margin: "7px -15px 0 0",
                      width: "66px",
                      height: "33px",
                      fontSize: "10px",
                      fontWeight: 600,
                      borderLeft: "2px solid #f3eeee",
                      opacity: 0.5,
                      padding: "2px 10px 0",
                    }}
                  >
                    {t("shareAnd")}
                    <br /> <span className="mr-4">{t("earn")}</span>
                    <GiForwardIco
                      className="absolute right-0"
                      style={{ right: "7px", marginTop: "-0.90rem" }}
                      width="20"
                      height="20"
                      role="img"
                      aria-labelledby="share & earn"
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </ErrorBoundary>
  );
}

export default MultipleLookBookCarousel;
