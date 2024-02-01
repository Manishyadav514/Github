import React from "react";
import useTranslation from "@libHooks/useTranslation";
import SearchLabel from "@libComponents/Search/SearchLabel";
import Router, { useRouter } from "next/router";
import SearchChip from "./SearchChip";
import { SEARCH_STATE } from "@libStore/valtio/SEARCH.store";

const TopSearches = ({ getData, searchQueries, isGlammStudioPage }: any) => {
  const { t } = useTranslation();
  const trendingSearches = t("trendingSearch");
  const router = useRouter();
  const handleSearchTabClick = (query: any) => {
    if (isGlammStudioPage) {
      router.replace(`?sourcepage=glammstudio&q=${query}&tab=BLOGS`);
    } else {
      router.replace(`?q=${query}&tab=PRODUCTS`);
    }

    // getData(query, true);
  };

  return (
    <section>
      <div className="search-options pt-6">
        {/* RECENT SEARCHES */}
        {searchQueries?.length > 0 && (
          <div className="search-section  pb-6">
            <SearchLabel label={t("recentSearches")} />

            <div className="search-tabs">
              {searchQueries.map((query: any) => (
                <SearchChip
                  key={query}
                  query={query}
                  onClick={() => {
                    SEARCH_STATE.searchType = `selection | ${t("recentSearches")}`;
                    handleSearchTabClick(query);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* TOP SEARCHES */}
        {trendingSearches?.length > 0 && (
          <div className="search-section pb-6">
            <SearchLabel label={t("trendingSearches") || "Trending Searches"} />

            <div className="search-tabs" style={{ height: "144px", overflow: "hidden" }}>
              {trendingSearches.map((query: string) => (
                <SearchChip
                  key={query}
                  query={query}
                  onClick={() => {
                    SEARCH_STATE.searchType = `selection | Trending Searches`;
                    handleSearchTabClick(query);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TopSearches;
