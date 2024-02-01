import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/router";

import PLPAPI from "@libAPI/apis/PLPAPI";
import useFilter from "@libHooks/useFilter";
import useTranslation from "@libHooks/useTranslation";

import {
  sortTags,
  removeEmptyObject,
  generateWhereForProduct,
  mutateBrandsDataWithCount,
  sortBrandsList,
  getSelectedBrands,
  onApplyFilter,
  generateFilterAnalytics,
} from "@libServices/PLP/filterHelperFunc";
import { getBrandsData } from "@libServices/PLP/plpApiHelperFunc";

import FilterRows from "@libComponents/PLP/FilterRows";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import FilterBrandRow from "@libComponents/PLP/FilterBrandRow";
import FilterPriceBuckets from "@libComponents/PLP/FilterPriceBuckets";

import { APIActions, FilterRow, PLPActions, PLPFilterParentRow, PLPFilterRow, PLPStates, SearchPLPStates } from "@typesLib/PLP";

import PopupModal from "./PopupModal";

export interface FilterData {
  view: boolean;
  hide: () => void;
  allBrandsData?: FilterRow[];
  PLPSTATE: PLPStates | SearchPLPStates;
  apply: (plpaction: PLPActions, APIAction: APIActions) => void;
  products?: any;
  widgetPLPData?: any;
  variantSKU?: string;
}

const FilterModal = ({ view, hide, apply, PLPSTATE, allBrandsData, products, widgetPLPData, variantSKU }: FilterData) => {
  const plpAPI = new PLPAPI();
  const { t } = useTranslation();

  const { query, pathname } = useRouter();

  const { getFilteredData, sortFilteredData, adobeClickEvent, adobePageLoadEvent } = useFilter();

  const [activeTab, setActiveTab] = useState<string | number>(1);
  const [activeCat, setActiveCat] = useState<any>();
  const [filterTags, setFilterTags] = useState<Array<any>>([]);
  const [filteredData, setFilteredData] = useState<PLPFilterParentRow>([]);

  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const { adobeEventFilterSort } = useFilter();
  const [priceRange, setPriceRange] = useState<Array<{ priceOffer: { between: Array<number> } }>>(PLPSTATE.priceBucket);
  const [appliedTags, setAppliedTags] = useState<{ [char: string]: string[] }>(PLPSTATE.selectedTags);
  const activeNavTab = (PLPSTATE as PLPStates).navTabs?.[(PLPSTATE as PLPStates).activeTab] || {
    label: query.q as string,
    url: "",
  };

  const [brandsList, setBrandsList] = useState<PLPFilterRow>(allBrandsData || []);

  /* Filters Data - Setting up the Filtermodal */
  useEffect(() => {
    setLoading(true);

    /* InCase brand data is already avilable onmount just mutate it with count otherwise get all */
    if (pathname !== "/search") {
      const selectedBrands = (query?.brands as string)?.split(",") || [];
      if (!allBrandsData?.length) {
        getBrandsData(selectedBrands, true).then((brands: any) => setBrandsList(brands));
      } else {
        mutateBrandsDataWithCount(allBrandsData, selectedBrands).then(brands => setBrandsList(brands));
      }
    }

    getFilteredData(pathname === "/search").then((res: any) => {
      updateModal(res, PLPSTATE.selectedTags);
    });
  }, []);

  /* Sorting Filter Data - Based on the Tags Selected */
  useEffect(() => {
    if (view) {
      adobeEventFilterSort("filter", "click", "search", activeNavTab?.label);

      if (filteredData.length) {
        setLoading(true);
        setPriceRange(PLPSTATE.priceBucket);
        setAppliedTags(PLPSTATE.selectedTags);
        setBrandsList(sortBrandsList(allBrandsData));
        updateModal(filteredData, PLPSTATE.selectedTags);
      }
    }
  }, [view]);

  /* Update Filter Modal on every Render */
  const updateModal = async (updatedData: any, newTags: any) => {
    const sortedData = sortFilteredData(updatedData, Object.keys(newTags));
    setFilteredData(sortedData);
    await getFilterTags(sortedData[0]?.childCategories[0]);
    setActiveTab(sortedData.find((x: any) => x.isSelected || x.slug === "/buy/makeup")?.id);
    setLoading(false);
  };

  const getFilterTags = (cat: any) =>
    plpAPI.getFilterTags({ where: { "categories.id": cat?.id } }).then(({ data: tag }: any) => {
      const tagsData = sortTags(tag.data.data, appliedTags[cat?.slug]);
      setFilterTags(tagsData);
      setActiveCat(cat);
      return tagsData;
    });

  /* Handle Selection of Filter Rows - Parent Categories and Tags */
  const onSelectParent = (category: any, all: any) => {
    getFilterTags(category).then((res: any) => {
      if (all === true) {
        const multipleTags = res.map((tag: any) => tag.name);
        if (multipleTags.length === appliedTags[category.slug]?.length) {
          setAppliedTags({ ...appliedTags, [category.slug]: [] });
        } else {
          setAppliedTags({ ...appliedTags, [category.slug]: multipleTags });
        }
      }
    });
  };

  /* On Select Filter Tags - Children */
  const onSelectTag = (category: any, parent: any) => {
    const isSelected = appliedTags[parent]?.find((x: any) => x === category.name);
    if (isSelected) {
      setAppliedTags({
        ...appliedTags,
        [parent]: appliedTags[parent].filter((x: any) => x !== category.name),
      });
    } else {
      const isCatAlreadyAdded = appliedTags[parent] || [];
      setAppliedTags({
        ...appliedTags,
        [parent]: [...isCatAlreadyAdded, category.name],
      });
    }
  };

  /* On Click of Brands Mutating Brands List based on selection */
  const onSelectBrand = (brand: FilterRow) => {
    setBrandsList(
      brandsList?.map(x => {
        if (x.id === brand.id) return { ...x, isSelected: !x.isSelected };

        return x;
      })
    );
  };

  const applyFilter = async () => {
    setApplying(true);
    const updatedtags = removeEmptyObject(appliedTags);
    const updatedPriceRange = priceRange || PLPSTATE.priceBucket;

    const filterData = await onApplyFilter(
      {
        where: generateWhereForProduct(updatedtags, activeNavTab?.url, brandsList),
        relatedData: {
          index: (PLPSTATE as PLPStates).activeTab,
          sort: PLPSTATE.sorting,
          appliedTags: updatedtags,
          priceRange: updatedPriceRange,
          brandsData: brandsList,
        },
        navTabs: (PLPSTATE as PLPStates).navTabs,
        products,
        widgetPLPData,
      },
      variantSKU
    );
    const filterAna: string[] = generateFilterAnalytics({
      brandsApply: brandsList,
      pricesApply: updatedPriceRange,
      categoriesApply: [activeNavTab?.url],
    });
    if (filterData) {
      adobeEventFilterSort("filter", "applied", activeNavTab?.url, filterAna);

      apply(
        { type: "APPLY_FILTER", payload: { updatedTags: updatedtags, priceRange: updatedPriceRange, brandsList } },
        filterData
      );
    }

    setApplying(false);
  };

  /* Clear Filter - Setting Tags and Price to Initial State */
  const clearFilter = () => {
    setPriceRange([]);
    setAppliedTags({});
    setBrandsList(brandsList.map(x => ({ ...x, isSelected: false })));
    adobeClickEvent("clear", activeNavTab?.label);
  };

  const closeModal = () => {
    hide();
  };

  return (
    <PopupModal show={view} onRequestClose={closeModal}>
      <div className="bg-white w-full rounded-t-2xl h-[85vh]">
        {loading ? (
          <LoadSpinner />
        ) : (
          <Fragment>
            {/* HEADERs */}
            <div className="flex justify-between bg-white pt-4 pb-3 px-5 border-b border-color2 rounded-t-2xl">
              <h1 className="text-sm font-semibold">{t("applyFilters")}</h1>
              <button
                type="button"
                onClick={clearFilter}
                className="uppercase font-semibold ml-4 text-10 outline-none text-color1"
              >
                {t("clearAll")}
              </button>
            </div>

            {/* Content */}
            <div className="flex w-full h-full pb-28">
              <div className="w-2/5 bg-color2 overflow-y-scroll">
                {filteredData.map(item => {
                  let noOfTagsSelected = 0;
                  item.childCategories.forEach(x => {
                    noOfTagsSelected += appliedTags[x.slug]?.length || 0;
                  });

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`${
                        activeTab === item.id ? "bg-white" : "bg-color2"
                      } w-full px-6 uppercase font-semibold outline-none text-10 border-b border-gray-100 h-12 flex items-center text-left`}
                      type="button"
                    >
                      {item.name}
                      {noOfTagsSelected > 0 && (
                        <span className="h-4 text-center flex justify-between px-1.5 items-center rounded font-bold ml-2 text-white bg-red-400">
                          {noOfTagsSelected}
                        </span>
                      )}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setActiveTab(3)}
                  className={`${
                    activeTab === 3 ? "bg-white" : "bg-color2"
                  } flex w-full px-6 h-12 items-center uppercase font-semibold outline-none text-10 border-b border-gray-100`}
                >
                  {t("price")}
                  {priceRange?.length > 0 && (
                    <span className="h-4 text-center flex justify-between px-1.5 items-center rounded font-bold ml-2 text-white bg-red-400">
                      {priceRange.length}
                    </span>
                  )}
                </button>

                {pathname !== "/search" && (
                  <button
                    type="button"
                    onClick={() => setActiveTab(4)}
                    className={`${
                      activeTab === 4 ? "bg-white" : "bg-color2"
                    } flex w-full px-6 h-12 items-center uppercase font-semibold outline-none text-10 border-b border-gray-100`}
                  >
                    {t("brands") || "brands"}
                    {getSelectedBrands(brandsList)?.length > 0 && (
                      <span className="h-4 text-center flex justify-between px-1.5 items-center rounded font-bold ml-2 text-white bg-red-400">
                        {getSelectedBrands(brandsList).length}
                      </span>
                    )}
                  </button>
                )}
              </div>

              {/* Parent and Child Categories distributed in Acccordian */}
              <div className="w-3/5 bg-white overflow-y-scroll">
                {filteredData?.map(rootCategory => {
                  if (activeTab === rootCategory.id) {
                    return (
                      <Fragment key={rootCategory.id}>
                        {rootCategory.childCategories.map((categories: any) => {
                          const { slug, id } = categories;
                          const selectedParent = filterTags.length === appliedTags[slug]?.length;
                          return (
                            <Fragment key={id}>
                              <div className="border-b border-gray-100">
                                <FilterRows
                                  type={1}
                                  key={id}
                                  selectedCats={Object.keys(appliedTags)}
                                  fill={selectedParent}
                                  category={categories}
                                  activeCat={activeCat}
                                  handleSelect={onSelectParent}
                                />
                              </div>
                              {id === activeCat?.id && (
                                <div className="border-b border-gray-100">
                                  {filterTags.map((tags: any) => {
                                    const selectedTag = appliedTags[slug]?.find((x: any) => x === tags.name);
                                    return (
                                      <FilterRows
                                        type={2}
                                        key={tags.name}
                                        category={tags}
                                        fill={!!selectedTag}
                                        activeCat={activeCat}
                                        handleSelect={onSelectTag}
                                      />
                                    );
                                  })}
                                </div>
                              )}
                            </Fragment>
                          );
                        })}
                      </Fragment>
                    );
                  }
                  return null;
                })}

                {/* Price Buckets - Static Section in Filter Modal */}
                {activeTab === 3 && <FilterPriceBuckets priceRange={priceRange} setPriceRange={(x: any) => setPriceRange(x)} />}

                {activeTab === 4 &&
                  brandsList?.map((brand, index) => (
                    <FilterBrandRow key={brand.id} brand={brand} handleSelect={onSelectBrand} />
                  ))}
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

export default FilterModal;
