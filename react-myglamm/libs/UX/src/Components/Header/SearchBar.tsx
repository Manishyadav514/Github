import React from "react";
import Router from "next/router";
import useTranslation from "@libHooks/useTranslation";
import { SEARCH_STATE } from "@libStore/valtio/SEARCH.store";
import ArrowRight from "../../../public/svg/arrow-right.svg";

const SearchBar = () => {
  const { t } = useTranslation();
  const trendingSearches = t("trendingSearch");
  const handleSearchTabClick = (q: any) => {
    SEARCH_STATE.products = [];
    SEARCH_STATE.input.value = q;
    SEARCH_STATE.searchType = `selection | Home Page Tags`;
    Router.push(
      {
        pathname: "/search",
        query: {
          q,
        },
      },
      undefined,
      { shallow: false }
    );
  };

  if (trendingSearches?.length) {
    return (
      <div className="w-full px-1 py-3 overflow-x-auto flex">
        {trendingSearches?.slice(0, 5)?.map((query: string, i: number) => (
          <span
            role="presentation"
            className="flex-sliderChild mr-4 h-6 rounded-md bg-color2  flex justify-center items-center relative after:absolute after:content-[''] after:w-0 after:h-0  after:t-0 after:-right-5 after:border-[10px] after:z-50 after:border-solid after:border-transparent after:border-l-color2"
            onClick={() => handleSearchTabClick(query)}
            key={`${query}-index`}
          >
            <p className="flex flex-row text-gray-600 justify-center items-center font-bold ml-2 text-xxs uppercase ">
              <span>{query}</span>
              <ArrowRight className="block ml-1 h-2 " />
            </p>
          </span>
        ))}
      </div>
    );
  }

  return null;
};

export default SearchBar;
