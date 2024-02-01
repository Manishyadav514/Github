import * as React from "react";
import useTranslation from "@libHooks/useTranslation";
import { SEARCH_STATE } from "@libStore/valtio/SEARCH.store";
import { changeURL } from "@libUtils/searchUtils";
import { SearchChipV2 } from "./SearchChip";
import SearchLabel from "./SearchLabel";
import WidgetAPI from "@libAPI/apis/WidgetAPI";
import { useEffect, useState } from "react";
import TrendingSearchSimmer from "@libComponents/Common/TrendingSearchShimmer";

const TrendingSearches = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [trendingSearches, setTrendingSearches] = useState<any>([]);

  const fetchTrendingSearches = async () => {
    const widgetApi = new WidgetAPI();
    try {
      const { data } = await widgetApi.getWidgets({ where: { slugOrId: "mobile-site-top-selling-search-widgets" } });
      setLoading(false);
      return data?.data?.data?.widget;
    } catch (error) {
      console.error("Widget Load Error : ", error);
      setLoading(false);
      return [];
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchTrendingSearches()
      .then(data => {
        const trendingSearchData = data?.find((item: any) => item.trackingParam === "trendingsearches");
        setTrendingSearches(trendingSearchData);
      })
      .catch(error => console.log(error));
  }, []);

  useEffect(() => {}, [loading]);

  return (
    <section>
      {loading ? (
        <TrendingSearchSimmer />
      ) : (
        <div className="p-4 pb-0 pl-0">
          {(trendingSearches?.length > 0 || trendingSearches?.multimediaDetails?.length > 0) && (
            <div className="">
              <SearchLabel label={trendingSearches?.label || t("trendingSearches") || "Trending Searches"} />
              <div className="overflow-hidden pl-3 grid item-center grid-cols-5">
                {trendingSearches?.multimediaDetails?.map((item: any) => (
                  <SearchChipV2
                    key={item.sliderText}
                    imgSRC={item.assetDetails.url}
                    query={item.sliderText}
                    onClick={() => {
                      SEARCH_STATE.input.value = item.sliderText;
                      SEARCH_STATE.searchType = `selection | Trending Searches`;
                      changeURL(item.sliderText);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default TrendingSearches;
