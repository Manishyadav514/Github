import * as React from "react";
import Ripples from "@libUtils/Ripples";
import Link from "next/link";
import { GiForwardIco } from "@libComponents/GlammIcons";
import format from "date-fns/format";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";
import useTranslation from "@libHooks/useTranslation";
import WidgetLabel from "./WidgetLabel";
import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";
import { CONFIG_REDUCER, ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

const SingleBlog = ({ item, icid }: any) => {
  const relationalData =
    item.commonDetails.descriptionData[0].relationalData.categoryId[item.commonDetails.descriptionData[0].value[0].categoryId];
  const blog = item.commonDetails.descriptionData[0].value[0];
  const { t } = useTranslation();

  const onShareClick = () => {
    CONFIG_REDUCER.shareModalConfig = {
      shareUrl: blog?.urlShortner?.shortUrl,
      productName: blog?.cms[0]?.content?.name,
      slug: blog?.urlShortner?.slug,
      module: "page",
      image: blog?.assets[0]?.url || DEFAULT_IMG_PATH(),

      overrideRouterPath: "glammstudio",
    };
  };

  const date = format(new Date(blog.publishDate.split("T")[0]), "MMM, dd yyyy");

  return (
    <ErrorBoundary>
      <section className="SingleBlogWidget mt-5 mb-3" role="banner">
        <WidgetLabel title={item.commonDetails.title} />
        <p className="text-sm -mt-3 px-3" style={{ color: "#9b9b9b" }}>
          {item.commonDetails.shortDescription}
        </p>
        <div className="px-3 py-2" style={{ outline: "none", minHeight: "280px", maxWidth: "420px" }}>
          <Ripples>
            <Link
              href={
                !icid
                  ? `${blog.urlManager.url}`
                  : `${blog.urlManager.url}?icid=${icid}_${blog.cms[0]?.content.name.toLowerCase()}_1`
              }
              prefetch={false}
              className="flex justify-center"
              aria-label={blog.assets[0]?.name}
            >
              <ImageComponent
                className="rounded-md"
                style={{ height: "200px", width: "400px" }}
                src={blog.assets[0]?.url}
                alt={blog.assets[0]?.name}
              />
            </Link>
          </Ripples>

          <div className="relative bg-white mx-6 -mt-16 rounded overflow-hidden shadow-lg" style={{ padding: "18px 16px" }}>
            <h1
              style={{
                fontSize: "30px",
                fontWeight: 700,
                letterSpacing: "5px",
                color: "var(--color1)",
                textAlign: "center",
                opacity: 0.2,
                textTransform: "uppercase",
                lineHeight: "39px",
                margin: "0 0 -14px",
              }}
            >
              {relationalData?.cms[0]?.content?.name}
            </h1>
            <h1
              style={{
                fontSize: "16px",
                color: "#000",
                display: "block",
                textAlign: "center",
                lineHeight: "20px",
                textTransform: "capitalize",
              }}
            >
              {blog.cms[0]?.content.name}
            </h1>
            <div className="flex w-full">
              <div
                className="flex items-center text-xs justify-center pl-10font-thin w-4/5 opacity-75"
                style={{ color: "#888888" }}
              >
                {date}
              </div>
              <div
                aria-hidden
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
                <br /> {t("earn")}
                <GiForwardIco
                  className="absolute right-0"
                  style={{ right: "7px", marginTop: "-0.90rem" }}
                  width="20"
                  height="20"
                  role="img"
                  aria-labelledby="share & earn"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default SingleBlog;
