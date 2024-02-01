import React from "react";

import ArticleCardV2 from "@libComponents/CommonBBC/ArticleCardV2";
import WidgetLabel from "@libComponents/HomeWidgets/WidgetLabel";

const ArticleCardSection = (props: any) => {
  const { articleDetails, isSSR, title } = props;
  return (
    <div className=" mb-12 last:mb-0">
      <div className="flex items-center justify-between mb-2">
        {/* <h3 className={` mb-2 uppercase font-medium text-15`} dangerouslySetInnerHTML={{ __html: title }} /> */}
        <WidgetLabel title={title || ""} />
      </div>
      <div className="flex items-center overflow-x-auto  hide-scrollbar-css">
        {articleDetails?.map((article: any, index: number) => {
          return (
            <div key={`article_card_${article.slug}`} className="">
              <ArticleCardV2
                bannerImage={article?._embedded?.["wp:featuredmedia"]?.[0]?.source_url}
                description={article?.title?.rendered}
                authorName={article?.coauthors?.[0]?.display_name}
                routePath={`/learn/${article.slug}`}
                isNextImage={index === 0 || index === 1}
                isSSR={isSSR}
                likeCount={article?.bbc_like_count}
                createdAt={article?.date}
                readTime={article?.read_time}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArticleCardSection;
