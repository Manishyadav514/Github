/**
 * Helper Functions For Manipulating Data Across the Filters
 * Note - These are Specifically created for Filters or Category Pages
 */

import { ParseJSON } from "@libUtils/widgetUtils";

import Router from "next/router";

import { formatPrice } from "@libUtils/format/formatPrice";

import { adobeClickEvent } from "@libAnalytics/PLP.Analytics";

import { FilterParams, FilterRow, PLPFilterRow, sortingType } from "@typesLib/PLP";

import { callPLPFilterAPI, getMakeupCount } from "./plpApiHelperFunc";

export function sortTags(tags: any, appliedTags = {}) {
  const regularTags: any[] = [];
  const selectedTags: any[] = [];

  tags.forEach((tag: any) => {
    if (getArrayOfTags(appliedTags).find((x: any) => x === tag.name)) {
      selectedTags.push(tag);
    } else {
      regularTags.push(tag);
    }
  });
  regularTags.unshift(...selectedTags);

  return regularTags;
}

export function generateWhereForProductV2({
  slug = "",
  tags = {},
  sort,
  brandsApply = [],
  pricesApply = [],
  categoriesApply = [],
  isCollection = false,
}: {
  slug: string | undefined;
  tags?: { [char: string]: Array<string> };
  sort?: sortingType;
  brandsApply?: FilterRow[] | string[];
  pricesApply?: Array<{ priceOffer: { between: Array<number> } }>;
  categoriesApply?: Array<string>;
  isCollection?: boolean;
}) {
  const filterWhere: any = { where: {} };

  // brand
  if (getSelectedBrands(brandsApply as FilterRow[]).length) {
    filterWhere.where["brand.name"] = getSelectedBrands(brandsApply as FilterRow[]).map(x => x.name);
  }

  // Incase of string[], provide directly add it to the filter
  if (typeof brandsApply?.[0] === "string") {
    filterWhere.where["brand.name"] = brandsApply;
  }
  // Price
  if (pricesApply?.length) {
    if (isCollection) {
      filterWhere.where.or = pricesApply.map(item => ({
        offerPrice: {
          between: item.priceOffer.between,
        },
      }));
    } else {
      filterWhere.where.or = pricesApply;
    }
  }

  // collection url for
  if (isCollection && slug) {
    filterWhere.where["urlShortner.slug"] = slug;
  }

  // Sort
  if (sort) {
    filterWhere.order = [sort];
  }
  let categoryWhere: string[] = [];

  // check categoryL3 for new filter UI and tags
  if (Object.keys(tags)?.length > 0 || categoriesApply?.length) {
    categoryWhere = [...(categoriesApply || []), ...(Object.keys(tags), [])];
  } else if (!isCollection) {
    categoryWhere = slug ? [slug] : [];
  }
  if (categoryWhere.filter(x => x !== "/buy/brands")?.length) {
    filterWhere.where["categories.slug"] = {
      inq: categoryWhere.filter(x => x !== "/buy/brands"),
    };
  }

  if (Object.keys(tags)?.length) {
    filterWhere.where["tag.name"] = {
      inq: getArrayOfTags(tags),
    };
  }
  return filterWhere;
}

export function generateFilterAnalytics({
  brandsApply = [],
  pricesApply = [],
  categoriesApply = [],
}: {
  brandsApply?: FilterRow[] | string[];
  pricesApply?: Array<{ priceOffer: { between: Array<number> } }>;
  categoriesApply?: Array<string>;
}) {
  let filterAnalytics: any = [];

  if (getSelectedBrands(brandsApply as FilterRow[]).length) {
    filterAnalytics = [...getSelectedBrands(brandsApply as FilterRow[]).map(x => x.name)];
  }
  if (typeof brandsApply?.[0] === "string") {
    filterAnalytics = [...brandsApply];
  }
  if (pricesApply?.length) {
    const priceRanges = pricesApply.map(priceObj => priceObj?.priceOffer?.between?.join("-")).filter(priceRange => priceRange);
    filterAnalytics = [...filterAnalytics, ...priceRanges];
  }

  if (categoriesApply?.length) {
    const tagsArray: string[] = categoriesApply.map(slug => {
      const parts = slug.split("/");
      return parts[parts.length - 1];
    });
    filterAnalytics = [...filterAnalytics, ...tagsArray];
  }
  return filterAnalytics;
}

export function generateWhereForProduct(
  tags: { [char: string]: Array<string> },
  slug: string,
  brandsList?: FilterRow[] | string[],
  sort?: sortingType,
  priceBucket?: Array<{ priceOffer: { between: Array<number> } }>
) {
  const filterWhere: any = { where: {} };

  if (getSelectedBrands(brandsList as FilterRow[]).length) {
    filterWhere.where["brand.name"] = getSelectedBrands(brandsList as FilterRow[]).map(x => x.name);
  }
  if (typeof brandsList?.[0] === "string") {
    // Incase of Array of String provide directly add it to the filter
    filterWhere.where["brand.name"] = brandsList;
  }

  if (sort) filterWhere.order = [sort];

  if (priceBucket?.length) filterWhere.where.or = priceBucket;

  /* Exception handled for brands */
  const slugs = (Object.keys(tags).length > 0 ? Object.keys(tags) : slug ? [slug] : []).filter(x => x !== "/buy/brands");
  if (slugs.length) {
    filterWhere.where["categories.slug"] = { inq: slugs };
  }

  if (Object.keys(tags)?.length) {
    filterWhere.where["tag.name"] = {
      inq: getArrayOfTags(tags),
    };
  }

  return filterWhere;
}

export function removeEmptyObject(appliedTags: any) {
  let updatedTag = {};

  if (!appliedTags) return updatedTag;

  Object.keys(appliedTags).forEach(key => {
    if (appliedTags[key].length || typeof appliedTags[key] === "boolean") {
      updatedTag = { ...updatedTag, [key]: appliedTags[key] };
    }
  });
  return updatedTag;
}

export function getArrayOfTags(appliedTags = {}): Array<string> {
  let allTags: Array<string> = [];

  if ((appliedTags as any).length === undefined) {
    Object.values(appliedTags).forEach((item: any) => {
      allTags = [...Array.from(new Set([...item, ...allTags]))];
    });
    return allTags;
  }
  /* In Case array is received directly return it */
  return appliedTags as Array<string>;
}

export const convertToTwoDimensional = (data: Array<any>) =>
  data.reduce((rows, key, index) => (index % 2 === 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows, []);

export const getSelectedBrands = (brands?: FilterRow[]) => brands?.filter(x => x.isSelected) || [];

/* Sorting the Brands List based on isSelected key */
export const sortBrandsList = (brands?: FilterRow[]) => [
  ...getSelectedBrands(brands),
  ...(brands?.filter(x => !x.isSelected) || []),
];

export async function mutateBrandsDataWithCount(brandsList: FilterRow[], selectedBrands?: string[]) {
  let countData: any[] = [];
  /* Batching multiple calls */
  const brandBatches = [];
  for (let i = 0; i < brandsList?.length; i += 25) {
    brandBatches.push(brandsList.slice(i, i + 25));
  }

  const AllBrandsCountData = await Promise.all(brandBatches.map(brands => getMakeupCount(brands, "brand.id")));
  AllBrandsCountData.forEach(data => {
    countData = [...countData, ...data];
  });

  /* Send Mutated data with count only if selected brands is given */
  if (!selectedBrands) return countData;

  return sortBrandsList(
    brandsList.map((brand: any) => ({
      ...brand,
      productCount: countData?.find(x => x.where["brand.id"] === brand.id)?.count || 0,
    }))
  );
}

export const addWidgetDataInBetween = (data: any[], widgetData: any[], skipProduct?: number) => {
  if (!data) return [];

  /* Check if we don't get any widget data so directly return data without modifying it  */
  if (!widgetData?.length) {
    return data;
  }
  /* Filter All Widget Before From List */
  const productWithWidget = data.filter(x => !x.customParam);

  /* Loop all Widget and Add them in Between the list of Product  */
  widgetData.forEach((widget: any, index: number) => {
    /* Parse Widget-Fold number */
    const { widgetOnFold } = ParseJSON(widget.meta.widgetMeta);
    const widgetOnFoldInt = parseInt(widgetOnFold);
    const foldNoWithIndex = widgetOnFoldInt * (skipProduct || 2) + index;

    /* Check Widget-Fold number & List length should be greater than fold number */
    if (foldNoWithIndex < data.length && (widgetOnFoldInt || widgetOnFoldInt === 0)) {
      /* Append data on given widget-fold number */
      productWithWidget.splice(foldNoWithIndex, 0, { ...widget });
    } else if (data.length) {
      productWithWidget.push({ ...widget });
    }
  });
  return productWithWidget;
};

/* Function to be triggered on Apply Button inside Filters Modal */
export const onApplyFilter = ({ where, relatedData, navTabs, products, widgetPLPData }: FilterParams, variant?: string) => {
  const { index, appliedTags, priceRange, brandsData } = relatedData || {};
  const newTab = navTabs?.[index || 0];

  /* ADOBE ANALYTICS - Click Event for Apply filters */
  const adobeFilterList: Array<string> = [];
  appliedTags &&
    Object.keys(appliedTags).forEach((parent: string) => {
      const parentCats = parent.split("/");
      // @ts-ignore
      appliedTags[parent].forEach((tags: string) =>
        adobeFilterList.push(`${parentCats[2]}:${parentCats[3]}:${tags.replace(" ", "-")}`)
      );
    });
  priceRange?.forEach((range: any) => {
    adobeFilterList.push(`price_range:${formatPrice(range.priceOffer.between[0])}-${formatPrice(range.priceOffer.between[1])}`);
  });
  brandsData?.forEach(brand => adobeFilterList.push(`brand_name:${brand}`));

  (window as any).digitalData = {
    filters: {
      list: adobeFilterList.length ? adobeFilterList.join(";") : "",
      count: adobeFilterList.length,
    },
  };
  adobeClickEvent("apply", newTab?.label || "");

  return callPLPFilterAPI({ where, relatedData, navTabs, products, widgetPLPData }, variant);
};

export const handleRedirection = (
  navTabs: Array<any>,
  appliedTags = {},
  selectedBrands: PLPFilterRow = [],
  priceBucket: Array<{ priceOffer: { between: Array<number> } }> = [],
  url: string | false,
  sort?: sortingType
) => {
  /* Generating and Integrating PriceBuckets in the url based on filters */
  let minmaxURL = "";
  if (priceBucket.length) {
    const buckets: Array<string> = [];
    priceBucket.forEach((x: any) =>
      buckets.push(`${formatPrice(x.priceOffer.between[0])}-${formatPrice(x.priceOffer.between[1])}`)
    );
    minmaxURL = `priceRange=${buckets.join(",")}`;
  }

  let brandsURL = "";
  if (selectedBrands.length) {
    brandsURL = `brandNames=${selectedBrands.map(x => x.name).join(",")}`;
  }

  /* Based on Applied Tags Evaluating the Slug to be Redirected too */
  const selectedCatSlugs = Object.keys(appliedTags);
  const isNavTab = navTabs?.find((x: any) => x.url === selectedCatSlugs[0]);

  /* Multiple Category Tags Selected or Tags Selected whose Category Tab is not present in DOM or tags and brands both are there */
  if (
    selectedCatSlugs.length > 1 ||
    (!isNavTab && selectedCatSlugs.length) ||
    (selectedCatSlugs.length === 1 && selectedBrands?.length)
  ) {
    let tagUrl: Array<string> = [];
    Object.values(appliedTags).forEach((val: any, i: number) => {
      val.forEach((x: string) => {
        tagUrl = [...tagUrl, `${Object.keys(appliedTags)[i]}--${x}`];
      });
    });

    /* Exception for search page */
    if (typeof url === "string" && url.includes("/search"))
      return redirect(`${url}&category=${tagUrl}`, minmaxURL, brandsURL, sort);

    return redirect(`/buy/all?category=${tagUrl}`, minmaxURL, brandsURL, sort);
  }

  /* Single Category Tags Selected and available on DOM - NAVTABS */
  if (selectedCatSlugs.length === 1 && isNavTab) {
    return redirect(`${selectedCatSlugs[0]}?category=${getArrayOfTags(appliedTags)}`, minmaxURL, brandsURL, sort);
  }
  /* Incase of No tags selected redirect to brands tab */
  if (selectedBrands?.length === 1) {
    return redirect(`/buy/brands`, minmaxURL, brandsURL, sort);
  }
  /* Simple Tab Redirection */
  if (url) {
    return redirect(url, minmaxURL, brandsURL, sort);
  }
  return null;
};

// re-generate url by integrating applied filters
export const handleRedirectionV2 = (
  navTabs: Array<any>,
  appliedTags = {},
  selectedBrands: string[] | PLPFilterRow = [],
  priceBucket: Array<{ priceOffer: { between: Array<number> } }> = [],
  url: string | false,
  categoryL3?: Array<string>,
  sort?: sortingType
) => {
  // Integrating PriceBuckets
  let priceURL = "";
  if (priceBucket?.length) {
    const buckets: Array<string> = [];
    priceBucket.forEach((x: any) =>
      buckets.push(`${formatPrice(x.priceOffer.between[0])}-${formatPrice(x.priceOffer.between[1])}`)
    );
    priceURL = `priceRange=${buckets.join(",")}`;
  }
  // Integrating BrandsBuckets
  let brandsURL = "";
  if (selectedBrands?.length) {
    brandsURL = `brandNames=${selectedBrands.map(x => x).join(",")}`;
  }

  // categoryL3
  let categoryURL = "";
  if (categoryL3?.length) {
    categoryURL = `categoryL3=${categoryL3.map(x => x).join(",")}`;
  }

  if (url) {
    return redirect(url, priceURL, brandsURL, sort, categoryURL);
  }
  return null;
};

const redirect = (url: string, minmaxURL?: string, brandURL?: string, sort?: sortingType, categoryURL?: string) => {
  const urlJoiner = (tempURL: string) => (tempURL.includes("?") ? "&" : "?");

  let path = url;
  if (minmaxURL) path = `${path}${urlJoiner(path)}${minmaxURL}`;
  if (brandURL) path = `${path}${urlJoiner(path)}${brandURL}`;
  if (sort) path = `${path}${urlJoiner(path)}sort=${sort}`;
  if (categoryURL) path = `${path}${urlJoiner(path)}${categoryURL}`;

  Router.replace(path, undefined, { shallow: true });
};

/* Returns all the types of filer data present in the URL */
export function extractFilterDataFromQuery(query: any, slug?: string) {
  const { category, categoryL3, priceRange, brandNames } = query;

  /* Evaluating Category and Tags from URL */
  let selectedTags: { [char: string]: Array<string> } = {};
  let tags: Array<string> = [];
  if (category) {
    const urlTags = category.split(",");
    if (urlTags[0].includes("--")) {
      urlTags.forEach((a: string) => {
        const [activeKey, tagVal] = a.split("--");
        selectedTags[activeKey] = [...(selectedTags[activeKey] || []), tagVal];
        tags.push(tagVal);
      });
    } else {
      tags = urlTags;
      selectedTags[slug as string] = urlTags;
    }
  }

  /* Evaluating Price-Range from URL */
  let priceBucket: Array<{ priceOffer: { between: Array<number> } }> = [];
  if (priceRange) {
    const selPrice = priceRange.split(",");
    selPrice.forEach((range: any) => {
      const maxmin = range.split("-");
      priceBucket.push({
        priceOffer: {
          between: [parseInt(maxmin[0], 10) * 100, parseInt(maxmin[1], 10) * 100],
        },
      });
    });
  }

  /* Evaluating brandNames from URL */
  let brandsApplied: Array<FilterRow> = [];

  if (brandNames) {
    const brands = brandNames.split(",");
    brands.forEach((brand: any) => {
      brandsApplied.push({ id: brand, isSelected: true, name: brand, slug: "" });
    });
  }

  /* Evaluating categoryL3 from URL */
  let categoriesApplied: Array<string> = [];
  if (categoryL3?.length) {
    const categorySlugs = categoryL3.split(",");
    categorySlugs.forEach((slug: string) => {
      categoriesApplied.push(slug);
    });
  }

  const appliedFilters = { pricesApplied: priceBucket, brandsApplied, categoriesApplied };

  return { selectedTags, tags, priceBucket, appliedFilters };
}

export const VariantSKUGenerator = (variantValue: string) => {
  if (typeof variantValue !== "string" || variantValue === "0") return "default";
  /* Adding 1 value to variant value will help to set value as after variant 0 all value are like V2,V3  */
  return `variant-v${parseInt(variantValue) + 1}`;
};
