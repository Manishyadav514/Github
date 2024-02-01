import React from "react";

import ArticleCardV2 from "./ArticleCardV2";

type PropTypes = {
  articleDetails: any;
  title: string;
  isSSRMobileView: boolean;
};

const getMobileSlider = (articleDetails: any) => {
  return (
    <div className="flex items-center overflow-x-auto lg:overflow-x-hidden hide-scrollbar-css">
      {articleDetails?.map((article: any, index: number) => {
        return (
          <div key={`article_card_${article.slug}`} className="">
            <ArticleCardV2
              bannerImage={article?._embedded?.["wp:featuredmedia"]?.[0]?.source_url}
              description={article?.title?.rendered}
              authorName={article?.coauthors?.[0]?.display_name}
              routePath={`/learn/${article.slug}`}
              isNextImage={index === 0 || index === 1}
              likeCount={article?.bbc_like_count}
              createdAt={article?.date}
              readTime={article?.read_time}
            />
          </div>
        );
      })}
    </div>
  );
};

const ArticleListRenderer = ({ articleDetails, title }: PropTypes) => {
  return (
    <div className="">
      <h3 className="uppercase px-6 py-2 font-bold text-lg mb-2 md:px-0" dangerouslySetInnerHTML={{ __html: title }} />
      <div className="flex items-center justify-between">{getMobileSlider(articleDetails)}</div>
    </div>
  );
};

export default ArticleListRenderer;
