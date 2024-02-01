import { useRouter } from "next/router";
import React, { RefObject, useRef } from "react";

import { generateWhereForProduct, getSelectedBrands, removeEmptyObject } from "@libServices/PLP/filterHelperFunc";

import { FilterParams, PLPActions, PLPFilterRow } from "@typesLib/PLP";

import CrossIcon from "../../../public/svg/cross.svg";
import Link from "next/link";

interface TagsProps {
  filterTags: Array<any>;
  allBrandsData: PLPFilterRow;
  selectedTags: { [char: string]: Array<string> };
  activeCatData: { activeTab: number; slug: string };
  onClick: (action?: PLPActions, APIParam?: FilterParams) => Promise<void> | void;
}

/**
 * Note - filterTags is the api response we received
 *        selectedTags are the tags that are selected by the user
 */
const FilterTagsSlider = ({ filterTags, selectedTags, activeCatData, allBrandsData, onClick }: TagsProps) => {
  const router = useRouter();

  const tagRef: Array<HTMLDivElement | HTMLAnchorElement> = [];
  const tagsDivRef: RefObject<HTMLDivElement> = useRef(null);

  const { activeTab, slug } = activeCatData;
  const [activeSlug] = router.query.Slug || [];

  const SELECTED_BRANDS = getSelectedBrands(allBrandsData);
  /* If Tabs is for brands show only brands, incase of all merge brands and tags, otherwise just show the tags based on tab */
  const SLIDER_ARRAY =
    activeSlug === "brands" ? allBrandsData : activeSlug === "all" ? [...SELECTED_BRANDS, ...filterTags] : filterTags;

  const handleFilterTags = (tagName: string, isBrand: boolean) => {
    let updatedTags = selectedTags;
    const activeCategory = selectedTags[slug] || [];
    const isSelected = activeCategory.find((i: string) => i === tagName);

    let updatedBrands = allBrandsData;

    if (isBrand) {
      updatedBrands = updatedBrands.map(brand => {
        if (brand.name === tagName) {
          if (!brand.isSelected) slideLeft(updatedBrands.filter(x => x.isSelected).length);

          return { ...brand, isSelected: !brand.isSelected };
        }
        return brand;
      });
    } else if (isSelected || activeSlug === "all") {
      /* If Tag is already selected or all TAB is active */
      Object.keys(selectedTags).forEach(key => {
        updatedTags = {
          ...updatedTags,
          [key]: selectedTags[key].filter((x: string) => x !== tagName),
        };
      });
    } else {
      /* Handle Tag Selection by Sliding towards the start of Tag-Slider Section */
      slideLeft(activeCategory.length);

      /* Tag is not present in already selected tags */
      updatedTags = { [slug]: [...activeCategory, tagName] };
    }
    updatedTags = removeEmptyObject(updatedTags);

    /* Redirect To First Active Tab in case all filter tags are removed */
    if (activeSlug === "all" && !Object.keys(updatedTags).length && !SELECTED_BRANDS.length) {
      return onClick();
    }

    /* Update URL and TAGS Based On-Click */
    return onClick(
      { type: "APPLY_FILTER", payload: { updatedTags, brandsList: updatedBrands } },
      {
        where: generateWhereForProduct(updatedTags, slug, updatedBrands),
        relatedData: { index: activeTab, appliedTags: updatedTags, brandsData: updatedBrands },
      }
    );
  };

  /* Slide Left to selected tag or brand */
  const slideLeft = (sliceIndex: number) => {
    let leftDistance = 0;
    tagRef.slice(0, sliceIndex).forEach((refs: HTMLDivElement | HTMLAnchorElement) => {
      leftDistance += refs?.clientWidth;
    });
    if (tagsDivRef.current) {
      tagsDivRef.current.scrollLeft = leftDistance;
    }
  };

  return (
    <div className="flex overflow-x-scroll" ref={tagsDivRef}>
      {SLIDER_ARRAY.map((tags: any, index: number) => {
        const isSelected = selectedTags[slug]?.find((x: any) => x === tags.name) || !tags.name || tags.isSelected;

        return (
          <div
            className="flex w-full items-center"
            key={tags.id || tags.name || tags}
            ref={r => {
              if (r) {
                tagRef[index] = r;
              }
            }}
          >
            <button
              type="button"
              style={{ minWidth: "80px" }}
              onClick={e => {
                handleFilterTags(tags.name || tags, !!tags?.slug?.includes("/brand/"));
                e.preventDefault();
              }}
              className={`${
                isSelected ? "bg-color1 text-white" : "bg-color2"
              } font-semibold p-2 box-border flex text-10 h-8 rounded-md mr-2.5 uppercase outline-none truncate items-center justify-center`}
              aria-label={tags.name || tags}
            >
              {tags.name || tags}
              {isSelected && (
                <CrossIcon
                  className="ml-1 mb-1"
                  role="img"
                  aria-labelledby="remove category filter"
                  title="remove category filter"
                />
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default FilterTagsSlider;
