import React from "react";
import HomeWidgetLabel from "./HomeWidgetLabel";

import WebContentWrapper from "../wrappers/WebContentWrapper";
import ArticleCard from "../ArticleCard";

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
  }, [item?.meta?.article_id]);

  return (
    <WebContentWrapper className="px-3.5 py-8 mb-3 clearfix  ">
      {recommendedArticles?.length ? (
        <>
          <HomeWidgetLabel title="Related Posts" />

          <div className="clearfix ">
            {recommendedArticles?.map((data, dataIndex) => {
              return (
                <div
                  key={`recommended_article_desktop_${data.id}`}
                  className=" py-3 px-3 float-left cursor-pointer xl:w-1/3 lg:w-1/3 sm:w-1/2"
                >
                  <div className="float-left w-full">
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
                </div>
              );
            })}
          </div>
        </>
      ) : null}
    </WebContentWrapper>
  );
};

export default React.memo(RecommendedArticlesSection);
