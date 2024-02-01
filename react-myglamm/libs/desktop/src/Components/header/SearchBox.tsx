import React, { useState, useEffect } from "react";
import { disableBodyScroll, enableBodyScroll } from "@libUtils/bodyScroll";
import { useRouter } from "next/router";
import Link from "next/link";

import debounce from "lodash.debounce";

import useTranslation from "@libHooks/useTranslation";

import { SHOP } from "@libConstants/SHOP.constant";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import { getSearchData } from "@libUtils/homeUtils";

import SearchIcon from "../../../public/svg/search.svg";
const useOutsideClick = (ref: any, callback: any) => {
  const handleClick = e => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
};

const SearchBox = ({ themed }: { themed?: boolean }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const ref = React.useRef(null);

  const [searchVal, setSearchVal] = useState("");
  const [searchData, setSearchData] = useState<any>(null);
  const [showSearch, setShowSearch] = useState(false);
  const searchCats = ["PRODUCTS", "LOOKS", "BLOGS"];

  useOutsideClick(ref, () => {
    setShowSearch(false);
  });

  useEffect(() => {
    const getSearch = debounce(async () => {
      const data = await getSearchData(searchVal);

      setSearchData(data);
      searchSuggestionAdobeEvents(data);
    }, 500);

    if (searchVal?.length > 2) {
      setShowSearch(true);
      getSearch();
    }
  }, [searchVal]);

  const searchSuggestionAdobeEvents = (data: any) => {
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: `web|search|search suggestion`,
        newPageName: "search suggestion",
        subSection: `search`,
        assetType: "",
        newAssetType: "search",
        platform: "desktop website",
        pageLocation: "",
        technology: "react",
      },
      Search: {
        searchTerm: searchVal,
        noOfProducts: data?.PRODUCTS?.count,
        noOfLooks: data?.LOOKS?.count,
        noOfBlogs: data?.BLOGS?.count,
        searchType: `manual`,
      },
    };
  };

  const handleSearch = (event: any) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      setShowSearch(false);
      if (searchVal !== "" && searchVal !== undefined) {
        router.push(`/search?q=${searchVal}`);
      }
    }
  };

  //  Adobe Analytics [32] Page Load - SEARCH INITIATED
  const prepareDatalayer = async () => {
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: "web|search|search initiated",
        newPageName: "search initiated",
        subSection: "search",
        assetType: "search",
        newAssetType: "search",
        platform: "desktop website",
        pageLocation: "",
        technology: "react",
      },
    };
  };

  const PLACE_HOLDER = {
    mgp: "Find Lipstick, Eyeliner, Makeup Tutorial, etc",
    bbc: "Search for Services, Experts, Article, Products and more...",
  };

  const showSearchList =
    searchData &&
    (searchData.PRODUCTS?.count || searchData.LOOKS?.count || searchData.BLOGS?.count) > 0 &&
    searchVal?.length > 2 &&
    showSearch;

  useEffect(() => {
    if (showSearchList) {
      disableBodyScroll();
    } else {
      enableBodyScroll();
    }
    console.log({ showSearchList });
  }, [showSearchList]);

  return (
    <div
      ref={ref}
      style={{ maxWidth: "75%" }}
      className={`w-[800px] head-search-box mt-2.5 ${themed ? "pl-6" : "pl-12"} float-left	relative overflow-visible`}
    >
      <form className="relative">
        <SearchIcon className="search-ico text-2xl absolute left-5 my-auto inset-y-0" />
        <input
          type="text"
          placeholder={PLACE_HOLDER[SHOP.SITE_CODE as keyof typeof PLACE_HOLDER] || ""}
          className=" ui-autocomplete-input w-full py-2.5 pr-3 pl-14 font-light rounded bg-neutral-50 border border-solid shadow-inner outline-0 text-sm text-current"
          autoComplete="off"
          onChange={event => setSearchVal(event.target.value)}
          onFocus={() => {
            setShowSearch(true);
          }}
          onClick={() => {
            prepareDatalayer();
          }}
          onKeyDown={handleSearch}
          value={searchVal}
        />

        {showSearchList && (
          <ul
            id="ui-id-1"
            style={{ zIndex: "51" }}
            className="bg-white max-h-[600px] border overflow-scroll absolute top-10 pt-2 rounded shadow-2xl w-[800px] no-scrollbar"
          >
            {searchCats.map(category =>
              searchData[category]?.data?.map((data: any) => {
                let cat;
                const slug = data?.urlManager?.url?.split("/");
                if (slug[1] === "product") {
                  cat = t("product")?.toLowerCase() || "product";
                } else if (slug[1] === "looks") {
                  cat = t("lookBook");
                } else {
                  cat = t("page");
                }

                return (
                  <Link
                    href={data.urlManager?.url}
                    className="ui-menu-item-wrapper hover:cursor-pointer"
                    onClick={() => setSearchVal("")}
                  >
                    <li className="list-none p-2 hover:cursor-pointer hover:underline hover:bg-gray-100" key={data.id}>
                      <span className="search-text capitalize">
                        {(data?.cms?.length > 0 && data?.cms?.[0]?.content?.name) ||
                          slug[slug.length - 1]?.split(".")?.[0].replace(/-/g, " ")}
                      </span>
                      &nbsp;
                      <div className="float-right">
                        <span className="font-bold text-gray-400">{cat}</span>
                      </div>
                    </li>
                  </Link>
                );
              })
            )}
          </ul>
        )}
      </form>
    </div>
  );
};

export default SearchBox;
