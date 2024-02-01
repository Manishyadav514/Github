import React from "react";
import { useRouter } from "next/router";

import { ArticleCardSectionV2Interface } from "@typesLib/articleUtilTypes";

import PrimaryBtn from "../../Components/common/PrimaryBtn";
import HomeWidgetLabel from "../../Components/home/HomeWidgetLabel";
import ArticleCardV2 from "../../Components/Article/ArticleCardV2";

import decodeEntities from "@libUtils/helper";

const ArticleCardSectionV2 = ({ articleDetails, isSSR }: ArticleCardSectionV2Interface) => {
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
            isNextImage={index < 4}
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
            <div
              key={`${article?.category_details?.name}-${index + 1}`}
              className={` article-section  article-section-page mb-12 last:mb-0  my-16 `}
            >
              <div className="flex items-center justify-between mb-7">
                <HomeWidgetLabel title={decodeEntities(article?.category_details?.name)} />
                <PrimaryBtn
                  buttonName="View All"
                  buttonOnClick={() => {
                    router.push({
                      pathname: `/learn/category/${article?.category_details?.slug}`,
                    });
                  }}
                />
              </div>
              <div className="flex items-center overflow-x-hidden hide-scrollbar-css justify-center">
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
