import React from "react";
import WidgetLabel from "./WidgetLabel";

import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";

// import ArticleCard from "../../../../../apps/baby-chakra/src/Components/Common/ArticleCard";
import ArticleCard from "@libComponents/BBCArticle/ArticleCard";

type ArticleCardType = {
  id: number;
  date: Date;
  modified: Date;
  slug: string;
  status: string;
  title: {
    rendered: string;
  };
  link: string;
  app_link: string;
  _embedded: any;
  coauthors: any;
  bbc_like_count: number;
  bbc_share_count: number;
  read_time: number;
};

interface PropTypes {
  item: any;
}
const RecommendedArticlesSection = (props: PropTypes) => {
  const { item } = props;

  const [recommendedArticles, setRecommendedArticles] = React.useState<[] | ArticleCardType[]>(item?.dsData?.posts || []);

  const getRecommendedArticlesResponse = async () => {
    const metaData = item?.meta?.widgetMeta;
    if (metaData) {
      const parsedData = JSON.parse(metaData);
      let { url } = parsedData;

      url = url?.replace("{{article_id}}", item?.meta?.article_id);
      parsedData.url = url;
      if (!url) {
        return [];
      }
      fetch(url)
        .then(async response => {
          const data = await response.json();
          setRecommendedArticles(data || []);
        })
        .catch(() => {
          setRecommendedArticles([]);
        });
    }
  };

  React.useEffect(() => {
    if (item?.meta?.article_id) {
      getRecommendedArticlesResponse();
    }
  }, [item]);

  return (
    <ErrorBoundary>
      <div className="px-3.5 py-8 mb-3 clearfix clear-both">
        {recommendedArticles?.length ? (
          <>
            <WidgetLabel title="Related Posts" />

            <div className="flex items-center space-x-6 overflow-x-auto lg:overflow-x-hidden hide-scrollbar-css">
              {recommendedArticles?.map((data, dataIndex) => {
                return (
                  <div className=" min-w-[300px] max-w-[300px] " key={`recommended_Article_mobile_${data.id}`}>
                    <ArticleCard
                      bannerImage={data?._embedded?.["wp:featuredmedia"]?.[0]?.source_url}
                      description={data?.title?.rendered}
                      authorName={data?.coauthors?.[0]?.display_name || ""}
                      routePath={`/learn/${data.slug}`}
                      likeCount={data?.bbc_like_count}
                      index={dataIndex}
                      createdAt={data?.date}
                      readTime={data?.read_time}
                    />
                  </div>
                );
              })}
            </div>
          </>
        ) : null}
      </div>
    </ErrorBoundary>
  );
};

export default React.memo(RecommendedArticlesSection);
