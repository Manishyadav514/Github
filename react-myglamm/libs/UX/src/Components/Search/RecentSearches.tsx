import useTranslation from "@libHooks/useTranslation";
import { SEARCH_STATE } from "@libStore/valtio/SEARCH.store";
import { changeURL } from "@libUtils/searchUtils";
import { useSnapshot } from "valtio";
import { SearchChipV2 } from "./SearchChip";
import SearchLabel from "./SearchLabel";
import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";
import { removeLocalStorageValue } from "@libUtils/localStorage";
import { useState } from "react";

const RecentSearches = () => {
  const { t } = useTranslation();
  const snap = useSnapshot(SEARCH_STATE);
  const [rescentSearches, setRescentSearch] = useState(snap?.recentSearches || []);
  const clearRescentSearch = () => {
    setRescentSearch([]);
    removeLocalStorageValue("searchQueries");
  };

  return (
    <section>
      <div className="p-4 pb-0 pl-0">
        {rescentSearches.length > 0 && (
          <div className="">
            <SearchLabel label={t("recentSearches")} showButton={true} handleButtonClick={clearRescentSearch} />
            <ErrorBoundary>
              <div className="w-full pl-4 overflow-x-auto flex">
                {rescentSearches.map(({ imgURL, query }: any) => (
                  <SearchChipV2
                    imgSRC={imgURL}
                    key={query}
                    query={query}
                    onClick={() => {
                      SEARCH_STATE.input.value = query;
                      SEARCH_STATE.searchType = `selection | ${t("recentSearches")}`;
                      changeURL(query);
                    }}
                  />
                ))}
              </div>
            </ErrorBoundary>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentSearches;
