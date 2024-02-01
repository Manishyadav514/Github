import * as React from "react";
import Link from "next/link";

import useTranslation from "@libHooks/useTranslation";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";

import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

import WidgetLabel from "./WidgetLabel";
import ShareIcon from "../../../public/svg/new_share_icon.svg";
import { CONFIG_REDUCER, ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

const BlogCard = ({ item, relationalData, productPosition, icid }: any) => {
  const { t } = useTranslation();

  const onShareClick = () => {
    CONFIG_REDUCER.shareModalConfig = {
      shareUrl: item?.urlShortner?.shortUrl,
      productName: item?.cms[0]?.content?.name,
      slug: item?.urlShortner?.slug,
      module: "page",
      image: item?.assets[0]?.imageUrl["768x432"] || DEFAULT_IMG_PATH(),
      overrideRouterPath: "glammstudio",
    };
  };

  const style3 = {
    justifyContent: "space-between",
    display: "flex",
    alignItems: "center",
    position: "relative",
  } as React.CSSProperties;

  return (
    <div
      className="px-1 py-2"
      style={{
        outline: "none",
        maxHeight: "280px",
        maxWidth: "420px",
        scrollSnapAlign: "center",
      }}
    >
      <Link
        href={
          !icid
            ? `${item.urlManager.url}`
            : `${item.urlManager.url}?icid=${icid}_${item.cms[0]?.content.name.toLowerCase()}_${productPosition}`
        }
        prefetch={false}
        legacyBehavior
      >
        <div>
          <a className="flex justify-center outline-none" style={{ width: "320px" }} aria-label={item.assets[0]?.name}>
            <ImageComponent
              className="rounded-md"
              style={{ height: "150px", width: "400px" }}
              src={item.assets[0]?.imageUrl["768x432"]}
              alt={item.assets[0]?.name}
            />
          </a>
        </div>
      </Link>

      <div
        className="relative bg-white mx-6 rounded overflow-hidden shadow-lg"
        style={{ padding: "10px 8px", height: "auto", marginTop: "-12px" }}
      >
        <h2
          style={{
            fontSize: "16px",
            color: "#000",
            display: "block",
            textAlign: "center",
            lineHeight: "20px",
            textTransform: "capitalize",
            opacity: "75%",
          }}
        >
          {item.cms[0]?.content.name}
        </h2>

        <div
          className="flex items-center text-xsfont-thin opacity-75"
          style={{ color: "#888888", justifyContent: "space-between" }}
        >
          <p
            style={{
              color: "var(--color1)",
              textTransform: "uppercase",
              fontWeight: 700,
              letterSpacing: "3px",
              fontSize: "11px",
            }}
          >
            {relationalData?.cms[0]?.content?.name || "Blog"}
          </p>
          <div style={style3} className="share-and-earn" onClick={onShareClick}>
            <ShareIcon style={{ right: 0, width: "40px", margin: "0 -8px 0 0" }} />
            <span
              className="font-bold"
              style={{
                fontWeight: 1000,
                fontSize: "9px",
              }}
            >
              {t("shareAnd") || "\u00A0"} <br />
              {t("earn")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

function MultipleBlogCarousel({ item, icid }: any) {
  // need to change name of widget to Trending Feed from blog
  const customICID = !icid
    ? undefined
    : icid.replace(`_${item.label.toLowerCase()}_`, `_${item.commonDetails.title.toLowerCase()}_`);
  return (
    <ErrorBoundary>
      <section className="MultiBlogWidget mt-5 mb-3" role="banner">
        <WidgetLabel title={item.commonDetails.title} />
        <div
          dir="ltr"
          className="overflow-x-auto flex px-3"
          style={{
            scrollSnapType: "x mandatory",
          }}
        >
          {item.commonDetails.descriptionData[0].value.map((lookblog: any, index: number) => (
            <BlogCard
              key={lookblog.id}
              item={lookblog}
              relationalData={item?.commonDetails?.descriptionData[0]?.relationalData?.categoryId[lookblog.categoryId]}
              icid={customICID}
              productPosition={index + 1}
            />
          ))}
        </div>
      </section>
    </ErrorBoundary>
  );
}

export default MultipleBlogCarousel;
