import React from "react";
import { useRouter } from "next/router";

import { ArticleCardSectionV2Interface } from "@typesLib/articleUtilTypes";

import PrimaryBtn from "@libComponents/CommonBBC/PrimaryBtn";
import ArticleCardV2 from "@libComponents/CommonBBC/ArticleCardV2";
import AdSlots from "@libComponents/CommonBBC/ads/AdSlots";
import WidgetLabel from "@libComponents/HomeWidgets/WidgetLabel";

import decodeEntities from "@libUtils/helper";

const ArticleCardSectionV2 = ({ articleDetails, isSSR, enableAds, adSlotData }: ArticleCardSectionV2Interface) => {
  const router = useRouter();
  const getSlider = (articleData: any) => {
    const component = articleData?.map((article: any, index: number): any => {
      return (
        <div key={`article_card_${article.slug}`}>
          <ArticleCardV2
            bannerImage={article?._embedded?.["wp:featuredmedia"]?.[0]?.source_url}
            description={article?.title?.rendered}
            authorName={article?.coauthors?.[0]?.display_name}
            routePath={`/learn/${article.slug}`}
            likeCount={article?.bbc_like_count}
            isNextImage={index < 2}
            isSSR={isSSR}
            createdAt={article?.date}
            readTime={article?.read_time}
          />
        </div>
      );
    });
    return component;
  };
  return (
    <>
      {articleDetails?.map((article: any, index: number) => {
        return article?.posts?.length > 0 ? (
          <div key={`${article?.category_details?.name}-${index + 1}`}>
            {enableAds && index !== 0 && index % 8 === 0 ? (
              <AdSlots
                id={`div-gpt-ad-1648721024118-0${index}`}
                className=" my-4 mx-auto gpt-mid1 md:hidden"
                adSlotData={adSlotData?.[1]}
              />
            ) : enableAds && index !== 0 && index % 4 === 0 ? (
              <AdSlots
                id={`div-gpt-ad-1648721003195-0${index}`}
                className="my-4 mx-auto gpt-mid2 md:hidden"
                adSlotData={adSlotData?.[0]}
              />
            ) : null}
            <div
              key={`${article?.category_details?.name}-${index + 1}`}
              className={` article-section  article-section-page mb-12  `}
            >
              <div className="flex items-center justify-between mb-2">
                <WidgetLabel title={decodeEntities(article?.category_details?.name) || ""} className="truncate" />
                <PrimaryBtn
                  buttonName="View All"
                  buttonOnClick={() => {
                    router.push({
                      pathname: `/learn/category/${article?.category_details?.slug}`,
                    });
                  }}
                />
              </div>
              <div className="flex items-center overflow-x-auto lg:overflow-x-hidden hide-scrollbar-css">
                {getSlider(article.posts)}
              </div>
            </div>
          </div>
        ) : null;
      })}
    </>
  );
};

export default ArticleCardSectionV2;
