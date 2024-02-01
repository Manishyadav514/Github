import React from "react";

import { SEARCH_STATE } from "@libStore/valtio/SEARCH.store";

import SearchIconGrey from "../../../public/svg/searchicon-grey.svg";
import RefineSearch from "../../../public/svg/search-this-result.svg";

const SearchSuggestion = ({ value, onClick, onClickArrowIcon, imageUrl }: any) => {
  const query = SEARCH_STATE.input.value.toLowerCase().trim();
  const startIndex = value.toLowerCase().indexOf(query);
  const endIndex = startIndex + query.length;

  // on click suggestion arrow icon
  const onClickArrow = (e: any) => {
    e.stopPropagation();
    onClickArrowIcon();
  };

  return (
    <div
      onClick={onClick}
      className="bg-white w-full h-12 flex items-center p-4 border-b px-8 pr-0 hover:bg-gray-100 cursor-pointer"
    >
      <div className="w-full flex">
        <SearchIconGrey className="pt-0.5 h-5 w-5 inline-block" role="img" aria-labelledby="search product" />
        <div className="text-sm pl-2 line-clamp-1">
          <span className="text-gray-600">{value.slice(0, startIndex)}</span>
          <span className="font-bold">{value.slice(startIndex, endIndex)}</span>
          <span className="text-gray-600">{value.slice(endIndex, value.length)}</span>
        </div>
      </div>

      {imageUrl ? (
        <div className="w-12">
          <img src={imageUrl} alt="product-img" className="h-8 w-8 border border-gray-300 border-solid -ml-1.5" />
        </div>
      ) : (
        <div className="p-4" onClick={onClickArrow}>
          <RefineSearch className="h-4 w-4" role="img" aria-labelledby="refine search" />
        </div>
      )}
    </div>
  );
};

export default SearchSuggestion;
