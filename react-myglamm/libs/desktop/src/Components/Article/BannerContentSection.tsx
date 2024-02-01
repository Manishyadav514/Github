import React from "react";

import { ArticleDetailsContext } from "../../pages/learn/[slug]";

import WebContentWrapper from "../../Components/common/wrappers/WebContentWrapper";
import WebSectionWrapper from "../../Components/common/wrappers/WebSectionWrapper";

import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

const BannerContent = () => {
  const articleDetailsInfo: any = React.useContext(ArticleDetailsContext);
  const featuredMedia = articleDetailsInfo?._embedded?.["wp:featuredmedia"]?.[0];
  const IMGDATA = featuredMedia?.media_details?.sizes?.full;
  const createdAt = new Date(articleDetailsInfo?.date);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return (
    <>
      <WebSectionWrapper>
        <WebContentWrapper>
          <div className="w-full overflow-hidden relative">
            <img
              alt={articleDetailsInfo?.title?.rendered}
              title={articleDetailsInfo?.title?.rendered}
              src={IMGDATA?.source_url || featuredMedia?.source_url || DEFAULT_IMG_PATH()}
              className="w-full object-contain bg-neutral-100"
              style={{
                height: IMGDATA?.height || 213,
              }}
            />
          </div>
          <div className="pt-5 pr-8 pl-4 flex items-center justify-between">
            <h1
              className="text-base  font-bold line-clamp-2 max-w-full sm:max-w-[80%] text-ellipsis overflow-hidden m-0"
              dangerouslySetInnerHTML={{ __html: articleDetailsInfo?.title.rendered }}
            />
            <p className="text-xs font-medium text-gray-400 hidden sm:block mb-0">
              {createdAt.getDate()}&nbsp;{months[createdAt.getMonth()]}&nbsp;
              {new Date(createdAt).getFullYear()} | {articleDetailsInfo?.read_time} min Read
            </p>
          </div>
          <p className="pl-4 text-xs font-medium text-gray-400 block sm:hidden mt-2">
            {createdAt.getDate()}&nbsp;{months[createdAt.getMonth()]}&nbsp;
            {new Date(createdAt).getFullYear()} | {articleDetailsInfo?.read_time} min Read
          </p>
        </WebContentWrapper>
      </WebSectionWrapper>
    </>
  );
};

export default React.memo(BannerContent);
