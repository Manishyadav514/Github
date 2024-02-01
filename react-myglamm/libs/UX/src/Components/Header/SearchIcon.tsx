import React from "react";
import { SHOP } from "@libConstants/SHOP.constant";
import { SEARCH_STATE } from "@libStore/valtio/SEARCH.store";
import Link from "next/link";
import { useRouter } from "next/router";
import SearchIcon from "../../../public/svg/searchicon.svg";

const SearchIconBtn = ({ children }: { children?: any }) => {
  const router = useRouter();

  const clearSearchStateInputValue = () => {
    SEARCH_STATE.products = [];
    SEARCH_STATE.input.value = "";
  };

  if (SHOP.ENABLE_SEARCH && router.pathname !== "/") {
    return (
      <Link
        href={router.asPath.includes("/glammstudio") ? "/search?sourcepage=glammstudio" : "/search"}
        prefetch={false}
        id="searchIco"
        aria-hidden="true"
        className="p-2 flex-end outline-none text-gray-700 cursor-pointer text-2xl text-center"
        onClick={clearSearchStateInputValue}
        aria-label="search"
        tabIndex={-1}
      >
        {children || <SearchIcon role="img" aria-labelledby="search" title="search" />}
      </Link>
    );
  }

  return null;
};

export default SearchIconBtn;
