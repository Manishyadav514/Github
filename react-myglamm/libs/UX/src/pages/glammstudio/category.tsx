import React, { useState, useEffect } from "react";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";

import Ripples from "@libUtils/Ripples";

import ImageComponent from "@libComponents/Common/LazyLoadImage";

import PageAPI from "@libAPI/apis/PageAPI";

import useTranslation from "@libHooks/useTranslation";

import ErrorComponent from "../_error";

import { NextImage } from "@libComponents/NextImage";
import { check_webp_feature } from "@libUtils/webp";
import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

import BlogCategoryHead from "@libComponents/Blogs/BlogCategoryHead";

const GlammStudio = ({ blog, errorCode, header, metaData }: any) => {
  const [data, setData] = useState(blog?.data);
  const [skip, setskip] = useState(10);
  const [disableImageComponent, setDisableImageComponent] = useState(false);

  const { t } = useTranslation();
  const pageApi = new PageAPI();

  const onPageChange = () => {
    const where = {
      categoryId: data[0].categoryId,
    };

    pageApi
      .getPage(skip, where)
      .then(res => {
        setData(data.concat(res.data.data.data));
      })
      .catch(error => error);
    setskip(skip + 10);
  };

  useEffect(() => {
    check_webp_feature("lossy", (_: any, result: boolean) => {
      if (!result) {
        // only change set if webp is not supported to prevent component re-render
        setDisableImageComponent(true);
      }
    });
  }, []);

  if (errorCode) {
    return <ErrorComponent statusCode={errorCode} />;
  }

  return (
    <React.Fragment>
      <BlogCategoryHead header={header} metaData={metaData} />

      <main className="min-h-screen">
        <div className="flex justify-center items-center px-2 py-4">
          <h1 className="text-2xl uppercase leading-tight">{header}</h1>
        </div>
        <InfiniteScroll dataLength={data?.length || 0} next={onPageChange} hasMore loader>
          {data.map((pageContent: any) => {
            const pageMedia = pageContent?.cms[0]?.content;
            const Image = pageContent?.assets.find((a: any) => a.type === "image");
            const imagePath = Image?.imageUrl["768x432"];
            const Video = pageContent?.assets.find((a: any) => a.type === "video");
            const vidId = Video?.properties?.videoId || "TvDYp3dwsFs";
            return (
              <div className="bg-white p-4" key={pageContent.id}>
                {pageContent?.assets[0]?.type === "image" ? (
                  <Ripples>
                    <Link
                      href={pageContent.urlManager.url}
                      legacyBehavior
                      aria-label={pageMedia?.title || pageContent.urlManager.url.split("/")[3].replace(/-/g, " ")}
                    >
                      <div>
                        {!disableImageComponent ? (
                          <NextImage priority width={768} height={432} src={imagePath} alt={Image?.name} />
                        ) : (
                          <ImageComponent src={imagePath} alt={Image?.name} />
                        )}
                        <h1 className="text-lg font-semibold px-2 mt-5 leading-tight capitalize">
                          {pageMedia?.title || pageContent.urlManager.url.split("/")[3].replace(/-/g, " ")}
                        </h1>
                        <p className="text-base px-2 my-3" style={{ color: "#8a8a8a" }}>
                          {pageMedia?.shortDescription}
                        </p>
                        <a
                          className="flex justify-end items-center px-2 my-6"
                          style={{ color: "#bf9b30" }}
                          aria-label={t("readMore")}
                        >
                          {t("readMore")}
                        </a>
                      </div>
                    </Link>
                  </Ripples>
                ) : (
                  <div>
                    <iframe
                      title="YoutubevideoId"
                      width="343"
                      height="175"
                      src={`https://www.youtube.com/embed/${vidId}` || DEFAULT_IMG_PATH()}
                      frameBorder="0"
                    />
                    <h1 className="text-lg font-semibold px-2 mt-5 leading-tight">
                      {pageMedia?.title || pageContent.urlManager.url.split("/")[3].replace(/-/g, " ")}
                    </h1>
                    <p className="text-base px-2 my-3" style={{ color: "#8a8a8a" }}>
                      {pageMedia?.shortDescription}
                    </p>
                    <div className="flex justify-end items-center px-2" style={{ color: "#bf9b30" }}>
                      <a href={pageContent.urlManager.url} aria-label={t("readMore")}>
                        {" "}
                        {t("readMore")}{" "}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </InfiniteScroll>
      </main>
    </React.Fragment>
  );
};

export default GlammStudio;
