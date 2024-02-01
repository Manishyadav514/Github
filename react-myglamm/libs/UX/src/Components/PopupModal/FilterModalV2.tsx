import React, { useState, useEffect, Fragment, useReducer } from "react";
import { useRouter } from "next/router";
import PLPAPI from "@libAPI/apis/PLPAPI";
import useFilter from "@libHooks/useFilter";
import useTranslation from "@libHooks/useTranslation";
import {
  removeEmptyObject,
  generateWhereForProductV2,
  getSelectedBrands,
  generateFilterAnalytics,
} from "@libServices/PLP/filterHelperFunc";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import { APIActions, FilterRow, PLPActions, PLPStates, SearchPLPStates, sortingType } from "@typesLib/PLP";
import PopupModal from "./PopupModal";
import { DownArrowIcon } from "@libComponents/GlammIcons";
import { callCollectionFilterAPI, callPLPFilterAPI } from "@libServices/PLP/plpApiHelperFunc";
import { CommonFilterRows, FilterRows, PriceBucket } from "@libComponents/PLP/FilterModalBuckets";
import { isArrayEqual, arePriceObjectsEqual } from "@libUtils/filterUtils";
import { handleFilterActions } from "@libServices/filter/FilterReducer";

const FilterModalV2 = ({ view, hide, apply, PLPSTATE, products, widgetPLPData, isCollection, variant }: FilterData) => {
  const [activeTab, setActiveTab] = useState<{ currActTab: string; prevActTab: string }>({
    currActTab: "prices",
    prevActTab: "",
  });
  const [activeParentID, setActiveParentID] = useState<any>("");
  const [activeChildID, setActiveChildID] = useState<any>();
  const [filterData, setFilterData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [secondLoader, setSecondLoader] = useState(true);
  const [applying, setApplying] = useState(false);
  const initalFilterStates: any = {
    tagsApplied: PLPSTATE.selectedTags || "",
    sortApplied: PLPSTATE.sorting,
    ...(PLPSTATE.appliedFilters || []),
  };
  const [filterState, dispatch] = useReducer(handleFilterActions, {
    appliedFilter: initalFilterStates,
    filterDraft: {},
  });

  const [applyFilterState, setApplyFilterState] = useState(filterState.filterDraft);
  const {
    pricesApplied: pricesApply = [],
    brandsApplied: brandsApply = [],
    categoriesApplied: categoriesApply = [],
  } = applyFilterState;

  const {
    sortApplied = "",
    tagsApplied = {},
    pricesApplied = [],
    brandsApplied = [],
    categoriesApplied = [],
  } = filterState?.appliedFilter || {};
  const [filterApplyPrev, setFilterApplyPrev] = useState<any>({
    price: pricesApply,
    brand: brandsApply,
    category: categoriesApply,
  });

  const plpAPI = new PLPAPI();
  const { t } = useTranslation();
  const { query } = useRouter();
  const { adobeEventFilterSort } = useFilter();
  const newFilterConfig = t("newFilterConfig");
  const activeNavTab = (PLPSTATE as PLPStates).navTabs?.[(PLPSTATE as PLPStates).activeTab] || {
    label: query.q as string,
    url: "",
  };

  // update filter apply
  useEffect(() => {
    setApplyFilterState(filterState.filterDraft);
  }, [filterState.filterDraft]);

  // initial states, require for plp tab change
  useEffect(() => {
    handleDispatch({ pricesApplied, brandsApplied, categoriesApplied, sortApplied, tagsApplied });
  }, [PLPSTATE.appliedFilters]);

  // reset filter applied on plp tab change
  useEffect(() => {
    const clearAndFetch = async () => {
      await clearFilter();
      dispatch({
        type: "filter_applied",
      });
    };
    clearAndFetch();
  }, [activeNavTab?.url]);

  const clearAndFetchV2 = async () => {
    await clearFilter();
    dispatch({
      type: "filter_applied",
    });
  };

  // reload filter data when tab changes on plp
  useEffect(() => {
    newFilterConfig?.["activeFilterTab"] && setActiveTab({ ...activeTab, currActTab: newFilterConfig?.["activeFilterTab"] });
    if (view) {
      setLoading(true);
      adobeEventFilterSort("filter", "click", activeNavTab?.label);
      fetchFilterData(activeNavTab?.url);
    }
  }, [view]);

  // load filter on L0 tab change only if any attr is changed
  useEffect(() => {
    setActiveParentID("");
    const brandsCheck = activeTab?.prevActTab === "brands" && !isArrayEqual(brandsApply, filterApplyPrev?.brand);
    const catCheck = activeTab?.prevActTab === "categories" && !isArrayEqual(categoriesApply, filterApplyPrev?.category);
    const priceCheck = activeTab?.prevActTab === "prices" && !arePriceObjectsEqual(pricesApply, filterApplyPrev?.price);
    console.log({ view, brandsCheck, catCheck, priceCheck, categoriesApply }, filterApplyPrev?.category);
    if (view && (brandsCheck || catCheck || priceCheck)) {
      setFilterApplyPrev({ ...setFilterApplyPrev, category: categoriesApply, price: pricesApply, brand: brandsApply });
      setLoading(true);
      fetchFilterData(activeNavTab?.url);
    }
  }, [activeTab]);

  // require filter data reload on clear
  // useEffect(() => {
  //   if (categoriesApply?.length === 0 && brandsApply?.length === 0 && pricesApply?.length === 0) {
  //     setLoading(true);
  //     fetchFilterData(activeNavTab?.url);
  //   }
  // }, [categoriesApply, brandsApply, pricesApply]);

  const clearDispatchAndFetch = async () => {
    const cleared = await clearFilter();

    console.log({ cleared, filterState, categoriesApply, brandsApply, pricesApply });
    // if (
    //   cleared &&
    //   filterState.filterDraft?.categoriesApplied?.length === 0 &&
    //   brandsApply?.length === 0 &&
    //   pricesApply?.length === 0
    // ) {
    //   setLoading(true);
    //   fetchFilterData(activeNavTab?.url);
    // }
  };

  // mutate filter filterState
  const handleDispatch = (filterData: any) => {
    dispatch({
      type: "filter_draft",
      filterDraft: filterData,
    });
  };

  // handle apply filter
  const applyFilter = async () => {
    if (isCollection) {
      applyCollectionFilter();
    } else {
      applyPLPFilter();
    }
  };

  // handle apply PLP filter
  const applyPLPFilter = async () => {
    setApplying(true);
    const updatedtags = removeEmptyObject(tagsApplied);
    const updatedCategorySlugs = categoriesApply || categoriesApplied;
    const updatedPriceRange = pricesApply || pricesApplied;
    const filterWhere = generateWhereForProductV2({
      slug: activeNavTab?.url,
      brandsApply: brandsApply,
      pricesApply: pricesApply,
      categoriesApply: categoriesApply,
    });

    const filterState = await callPLPFilterAPI(
      {
        where: filterWhere,
        relatedData: {
          index: (PLPSTATE as PLPStates).activeTab,
          sort: sortApplied,
          appliedTags: updatedtags,
          categoryL3: updatedCategorySlugs,
          priceRange: updatedPriceRange,
          brandsData: brandsApply,
        },
        navTabs: (PLPSTATE as PLPStates).navTabs,
        products,
        widgetPLPData,
      },
      "default"
    );

    if (filterState) {
      apply(
        {
          type: "APPLY_FILTER",
          payload: {
            updatedTags: updatedtags,
            categoriesSelected: updatedCategorySlugs,
            priceRange: updatedPriceRange,
            selectedBrands: brandsApply,
          },
        },
        filterState
      );
      filterAnalytics();
      dispatch({
        type: "filter_applied",
      });
    }
    setApplying(false);
  };

  // filter analytics
  const filterAnalytics = () => {
    const filterAna: string[] = generateFilterAnalytics({
      brandsApply: brandsApply,
      pricesApply: pricesApply,
      categoriesApply: categoriesApply,
    });
    adobeEventFilterSort("filter", "applied", activeNavTab?.label, filterAna);
  };

  // handle apply collection filter
  const applyCollectionFilter = async () => {
    setApplying(true);
    const updatedtags = removeEmptyObject(tagsApplied);
    const updatedCategorySlugs = categoriesApply || categoriesApplied;
    const updatedPriceRange = pricesApply || pricesApplied;
    const updatedBrands = brandsApply || brandsApplied;
    const filterWhere = generateWhereForProductV2({
      slug: activeNavTab?.url,
      brandsApply: brandsApply,
      pricesApply: pricesApply,
      categoriesApply: categoriesApply,
      isCollection: true,
    });
    const filterState = await callCollectionFilterAPI({
      where: filterWhere,
      relatedData: {
        index: (PLPSTATE as PLPStates).activeTab,
        sort: sortApplied,
        appliedTags: updatedtags,
        categoryL3: updatedCategorySlugs,
        priceRange: updatedPriceRange,
        brandsData: updatedBrands,
      },
      navTabs: (PLPSTATE as PLPStates).navTabs,
      products,
      widgetPLPData,
      variant,
    });

    if (filterState) {
      apply(
        {
          type: "APPLY_FILTER",
          payload: {
            updatedTags: updatedtags,
            categoriesSelected: updatedCategorySlugs,
            priceRange: updatedPriceRange,
            selectedBrands: brandsApply,
          },
        },
        filterState
      );
      filterAnalytics();
      dispatch({
        type: "filter_applied",
      });
    }
    setApplying(false);
  };

  /* Clear Filter State*/
  // const clearFilter = () => {
  //   setActiveChildID("");
  //   setActiveParentID("");
  //   handleDispatch({ pricesApplied: [], brandsApplied: [], categoriesApplied: [], sortApplied: "" });
  //   console.log(filterState?.filterDraft);
  //   return true;
  // };
  const clearFilter = async () => {
    setActiveChildID("");
    setActiveParentID("");
  
    // Assuming handleDispatch returns a promise
    await handleDispatch({
      pricesApplied: [],
      brandsApplied: [],
      categoriesApplied: [],
      sortApplied: "",
    });
  
    // Log the updated value after the dispatch is completed
    console.log(filterState?.filterDraft);
  
    return true;
  };
  
  const closeModal = () => {
    hide();
  };

  // load filter data
  const fetchFilterData = async (slug: string) => {
    const where = generateWhereForProductV2({
      slug: activeNavTab?.url,
      brandsApply: brandsApply,
      pricesApply: pricesApply,
      categoriesApply: categoriesApply,
      isCollection,
    });
    setSecondLoader(true);

    try {
      const filterDataResponse = isCollection
        ? await plpAPI.getCollectionFilter(where)
        : await plpAPI.getAllFilters(where, activeNavTab?.url);

      const { data } = filterDataResponse.data || {};
      setFilterData(data);

      setFilterApplyPrev({ ...setFilterApplyPrev, category: categoriesApply, price: pricesApply, brand: brandsApply });
    } catch (error) {
      console.error(error);
      hide();
    } finally {
      setSecondLoader(false);
      setLoading(false);
    }
  };

  // check if the bucket has any applied filter
  const isBucketApplied = (key: string | number) => {
    switch (key) {
      case "prices":
        const priceCheck = pricesApply?.length > 0 ? true : false;
        return priceCheck;
      case "brands":
        const brandCheck = brandsApply?.length > 0 ? true : false;
        return brandCheck;
      case "categories":
        const catCheck = categoriesApply?.length > 0 ? true : false;
        return catCheck;
      default:
        return false;
    }
  };

  /* On Category Selection - Parent  */
  const onParentCatClick = (parentCategory: any, isParentCatActive: boolean) => {
    const { id, slug } = parentCategory;
    isParentCatActive ? setActiveParentID("") : setActiveParentID(id);
  };

  /* On Select Filter Tags - SubChildren */
  const onSelectTag = (item: any) => {
    const itemSlug = item?.slug;
    let categoryL3Slugs: Array<string>;
    if (categoriesApply?.includes(itemSlug)) {
      categoryL3Slugs = categoriesApply.filter((slug: any) => slug !== itemSlug);
    } else {
      categoryL3Slugs = [...Array.from(new Set([...(categoriesApply || []), itemSlug]))];
    }
    handleDispatch({ categoriesApplied: categoryL3Slugs });
  };

  console.log(filterState);
  return (
    <PopupModal show={view} onRequestClose={closeModal}>
      <div className="bg-white w-full rounded-t-2xl h-[85vh]">
        {loading ? (
          <LoadSpinner />
        ) : (
          <Fragment>
            {/* HEADERs */}
            <div className="flex justify-between bg-white pt-4 pb-3 px-5 border-b rounded-t-2xl">
              <h1 className="text-lg font-semibold">{newFilterConfig?.["applyFilters"] || "Filters"}</h1>
              <button
                type="button"
                onClick={clearDispatchAndFetch}
                className="uppercase font-semibold ml-4 text-sm outline-none text-color1"
              >
                {t("clearAll")}
              </button>
            </div>

            {/* Attributes */}
            <div className="flex w-full h-full pb-28">
              <div className="w-2/5 overflow-y-scroll bg-[#FAFAFA]">
                {filterData &&
                  Object.keys(filterData).map((item: string) => {
                    return (
                      <>
                        {newFilterConfig?.[item] && filterData?.[item]?.length ? (
                          <button
                            key={item}
                            onClick={() => setActiveTab({ currActTab: item, prevActTab: activeTab?.currActTab })}
                            className={`border-b border-gray-200 cursor-pointer text-[13px] capitalize w-full p-4 outline-none  flex items-center text-left ${
                              activeTab?.currActTab === item && "bg-color2 font-semibold"
                            } 
                    ${isBucketApplied(item) && "after:content-['●'] after:ml-1 after:-mt-2 after:text-black after:text-[8px]"}
                    `}
                            type="button"
                          >
                            {newFilterConfig?.[item]}
                          </button>
                        ) : (
                          <></>
                        )}
                      </>
                    );
                  })}
              </div>

              {/* Parent and Child Categories distributed in Acccordian */}
              <div className={"w-3/5 bg-white border-l overflow-y-scroll "}>
                {/* Brand Buckets */}
                {activeTab?.currActTab === "brands" && (
                  <CommonFilterRows
                    data={filterData?.brands}
                    selectedFilter={brandsApply}
                    handleSelect={(brands: string[]) => handleDispatch({ brandsApplied: brands })}
                  />
                )}
                {/* Price Buckets */}
                {activeTab?.currActTab === "prices" && (
                  <PriceBucket
                    selectedPrices={pricesApply}
                    setSelectedPrices={(price: any) => handleDispatch({ pricesApplied: price })}
                    priceBuckets={filterData?.prices}
                  />
                )}
                {/* Category Buckets */}
                {activeTab?.currActTab === "categories" &&
                  filterData?.categories?.map((parentCategory: any) => {
                    let isParentCatActive = activeParentID === parentCategory.id;
                    return (
                      <Fragment key={parentCategory.id}>
                        {/* parent cat */}
                        {(isParentCatActive || activeParentID?.length === 0) && (
                          <button
                            type="button"
                            onClick={() => {
                              if (parentCategory?.children?.length) {
                                onParentCatClick(parentCategory, isParentCatActive);
                              } else {
                                onSelectTag(parentCategory);
                              }
                            }}
                            className={`cursor-pointer w-full px-3 py-4 border-b border-gray-200 flex outline-none font-semibold ${
                              isParentCatActive ? "flex-row-reverse place-content-baseline" : "justify-between"
                            }`}
                          >
                            <p
                              className={`capitalize text-[13px] text-start tracking-widest ${
                                isParentCatActive && "underline ml-3"
                              }`}
                            >
                              {parentCategory.tagName}
                            </p>
                            {parentCategory?.children?.length ? (
                              <div
                                className={`inline-flex items-center text-black ${
                                  isParentCatActive ? "mt-[5px] -ml-1" : " mt-[5px] mr-1"
                                }`}
                              >
                                <DownArrowIcon
                                  width="6px"
                                  height="10px"
                                  fill="black"
                                  transform={isParentCatActive ? "rotate(0)" : "rotate(180)"}
                                  role="img"
                                  aria-labelledby="down arrow"
                                />
                              </div>
                            ) : (
                              <div className="mr-1 inline-flex items-center">
                                <div
                                  className={
                                    " w-5 h-5 border border-solid border-slate-300 rounded relative before:w-1.5 before:h-3 before:border-2 before:border-solid before:border-white before:border-t-0 before:border-l-0 before:absolute before:top-0.5 before:left-1.5 before:block before:rotate-45" +
                                    (categoriesApply?.find((x: any) => x === parentCategory?.slug) && ` bg-black`)
                                  }
                                ></div>
                              </div>
                            )}
                          </button>
                        )}
                        {/* show child cat when parent is active */}

                        {isParentCatActive && (
                          <>
                            {secondLoader ? (
                              <div className="h-52 relative">
                                <LoadSpinner />
                              </div>
                            ) : (
                              <>
                                {parentCategory?.children?.map((childCategory: any) => {
                                  return (
                                    <Fragment key={childCategory.tagName}>
                                      <div>
                                        <FilterRows
                                          key={childCategory.id}
                                          data={childCategory}
                                          activeID={activeChildID}
                                          selectedCats={categoriesApply}
                                          handleSelect={(childCat: any) => {
                                            if (childCategory?.children.length) {
                                              activeChildID === childCat.id
                                                ? setActiveChildID("")
                                                : setActiveChildID(childCat.id);
                                            } else {
                                              onSelectTag(childCat);
                                            }
                                          }}
                                          includeCheckBox={childCategory?.children.length ? false : true}
                                        />
                                      </div>

                                      {/* sub child */}
                                      {activeChildID === childCategory.id &&
                                        childCategory?.children?.map((subChildCat: any) => {
                                          return (
                                            <div className="pl-2">
                                              <FilterRows
                                                key={subChildCat.id}
                                                selectedCats={categoriesApply}
                                                data={subChildCat}
                                                activeID={activeChildID}
                                                handleSelect={(subCat: any) => onSelectTag(subCat)}
                                                includeCheckBox={true}
                                              />
                                            </div>
                                          );
                                        })}
                                    </Fragment>
                                  );
                                })}
                              </>
                            )}
                          </>
                        )}
                      </Fragment>
                    );
                  })}
              </div>
            </div>

            {/* Submit Buttons */}
            <div
              className="py-2 pr-4 flex fixed bottom-0 w-full bg-white h-14"
              style={{ boxShadow: "0px -4px 4px 0px rgba(0,0,0,0.17)" }}
            >
              <button
                type="button"
                onClick={closeModal}
                className="w-1/2 uppercase rounded text-center text-sm h-10 object-contain"
              >
                {t("close")}
              </button>
              <button
                type="button"
                disabled={applying}
                onClick={applyFilter}
                className="uppercase rounded text-center text-sm h-10 object-contain bg-ctaImg w-1/2 text-white font-semibold relative"
              >
                {applying && <LoadSpinner className="w-8 inset-0 absolute m-auto" />}
                {t("apply")}
              </button>
            </div>
          </Fragment>
        )}
      </div>
    </PopupModal>
  );
};

export default FilterModalV2;

export interface FilterData {
  view: boolean;
  hide: () => void;
  PLPSTATE: PLPStates | SearchPLPStates;
  apply: (plpaction: PLPActions, APIAction: APIActions) => void;
  products?: any;
  widgetPLPData?: any;
  isCollection?: boolean;
  variant?: string;
}
