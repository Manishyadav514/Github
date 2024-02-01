import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import useTranslation from "@libHooks/useTranslation";
import useFilter from "@libHooks/useFilter";
import { APIActions, ArrayOfTABS, PLPFilterRow, sortingType } from "@typesLib/PLP";

import LoadSpinner from "@libComponents/Common/LoadSpinner";

import { callCollectionFilterAPI, callPLPFilterAPI } from "@libServices/PLP/plpApiHelperFunc";
import { generateWhereForProduct, generateWhereForProductV2 } from "@libServices/PLP/filterHelperFunc";

import PopupModal from "./PopupModal";

import Tickmark from "../../../public/svg/check-mark.svg";

interface sortModalProps {
  view: boolean;
  hide: () => void;
  onSortFilter: (type: sortingType, APIAction: APIActions) => void;
  relatedData: {
    selectedTags: { [char: string]: string[] };
    tabUrl?: string;
    allBrandsData?: PLPFilterRow;
    sorting: sortingType;
    priceRange?: Array<{ priceOffer: { between: Array<number> } }>;
    navTabs?: ArrayOfTABS;
    index?: number;
    categoryL3?: string[];
  };
  products?: any;
  widgetPLPData?: any;
  isCollection?: boolean;
  variant?: string;
}

const SortModal = ({
  view,
  hide,
  relatedData,
  onSortFilter,
  products,
  widgetPLPData,
  isCollection = false,
  variant,
}: sortModalProps) => {
  const { pathname } = useRouter();
  const { adobeEventFilterSort } = useFilter();
  const { t } = useTranslation();
  const sortList = [
    {
      text: t("priceLowHigh"),
      order: isCollection ? "offerPrice ASC" : "priceOffer ASC",
    },
    {
      text: t("priceHighLow"),
      order: isCollection ? "offerPrice DESC" : "priceOffer DESC",
    },
  ];

  if (pathname === "/search") {
    sortList.unshift({
      text: t("relevance") || "Relevance",
      order: "",
    });
  }

  const { selectedTags, tabUrl, allBrandsData, sorting, navTabs, index, categoryL3, priceRange } = relatedData;

  const [loader, setLoader] = useState(false);

  // sort click event
  useEffect(() => {
    if (view) {
      adobeEventFilterSort("sort", "click", navTabs?.[index || 0]?.label);
    }
  }, [view]);
  const handleSort = async (type: sortingType) => {
    setLoader(true);
    if (type) {
      adobeEventFilterSort("sort", "applied", navTabs?.[index || 0]?.label, [type]);
    }
    let filterData: any;
    if (isCollection) {
      const filterWhere = generateWhereForProductV2({
        slug: navTabs?.[0]?.url,
        brandsApply: allBrandsData,
        pricesApply: priceRange,
        categoriesApply: categoryL3,
        isCollection: true,
        sort: type,
      });
      filterData = await callCollectionFilterAPI({
        where: filterWhere,
        relatedData: {
          index,
          sort: type,
          priceRange: priceRange,
          appliedTags: selectedTags,
          brandsData: allBrandsData,
          categoryL3,
        },
        navTabs,
        products,
        widgetPLPData,
        variant,
      });
    } else {
      filterData = await callPLPFilterAPI({
        where: generateWhereForProduct(selectedTags, tabUrl || "", allBrandsData),
        relatedData: {
          index,
          sort: type,
          priceRange: priceRange,
          appliedTags: selectedTags,
          brandsData: allBrandsData,
          categoryL3,
        },
        products: products,
        widgetPLPData,
        navTabs,
      });
    }

    filterData && onSortFilter(type, filterData);

    setLoader(false);
  };

  return (
    <PopupModal show={view} onRequestClose={hide}>
      <div className="bg-white w-full bottom-0 left-0 rounded-t-2xl shadow-md p-0 relative overflow-hidden">
        <h1 className="text-sm font-bold px-6 py-3 border-b border-gray-100">{t("sortBy")}</h1>
        <ul>
          {sortList.map((items: any) => (
            <li
              key={items.text}
              role="presentation"
              className={`border-b border-gray-100 flex text-xs items-center p-4 ${
                sorting === items.order ? "text-color1 font-semibold" : ""
              }`}
              onClick={() => handleSort(items.order)}
            >
              <Tickmark
                className="mt-1"
                fill={`${sorting === items.order ? "var(--color1)" : "#ebebeb"}`}
                width="10"
                height="10"
                role="img"
                aria-labelledby="right tick"
              />
              <h1 className="text-xs ml-2">{items.text}</h1>
            </li>
          ))}
        </ul>

        {loader && (
          <div className="absolute inset-0 bg-white opacity-50">
            <LoadSpinner />
          </div>
        )}
      </div>
    </PopupModal>
  );
};

export default SortModal;
