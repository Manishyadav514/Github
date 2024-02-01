import Router from "next/router";

import PLPAPI from "@libAPI/apis/PLPAPI";
import SearchAPI from "@libAPI/apis/SearchAPI";
import ConstantsAPI from "@libAPI/apis/ConstantsAPI";

import { showError } from "@libUtils/showToaster";
import { APIActionTypes, FilterParams, FilterRow, PlpProductWhere } from "@typesLib/PLP";

import {
  addWidgetDataInBetween,
  extractFilterDataFromQuery,
  getSelectedBrands,
  handleRedirection,
  handleRedirectionV2,
  mutateBrandsDataWithCount,
  removeEmptyObject,
  sortBrandsList,
  sortTags,
} from "./filterHelperFunc";
import { SEARCH_STATE, TOTAL_PRODUCTS_TO_FETCH_PER_CALL } from "@libStore/valtio/SEARCH.store";
import { PLP_STATE } from "@libStore/valtio/PLP.store";

/* API CAll for getting count for any Categories */
export async function getMakeupCount(category: Array<any>, whereText = "categories.id") {
  const getWhereforCount = category.map((i: any) => ({
    index: "products",
    where: {
      [whereText]: i.id,
    },
    include: ["count", "where"],
  }));

  const plpAPI = new PLPAPI();
  const makeUpcounts = await plpAPI.getCategoryProductCount(getWhereforCount);
  return makeUpcounts.data.data;
}

/* API call to ge the list of all the brands data */
export async function getBrandsData(selectedBrands?: string[], needCountData?: boolean) {
  const plpApi = new PLPAPI();
  const { data: brands } = await plpApi.getAllBrands();
  const brandsList = brands?.data?.data;

  let countData: any[];
  if (needCountData) countData = await mutateBrandsDataWithCount(brandsList);

  return sortBrandsList(
    brands?.data?.data.map((brand: any) => ({
      id: brand.id,
      slug: brand.urlManager.url,
      name: brand.cms[0]?.content.name,
      isSelected: !!selectedBrands?.find(x => x === brand.cms[0]?.content.name),
      productCount: countData?.find(x => x.where["brand.id"] === brand.id)?.count || 0,
    }))
  );
}

// Collection Call based on filter applied
export const callCollectionFilterAPI = ({
  where,
  relatedData,
  navTabs,
  products = [],
  widgetPLPData,
  variant,
}: FilterParams) => {
  const { index, skipProd, sort, appliedTags, priceRange, brandsData, categoryL3 } = relatedData || {};
  const newTab = navTabs?.[index || 0];

  if (!skipProd) {
    handleRedirectionV2(
      navTabs || [],
      removeEmptyObject(appliedTags),
      brandsData,
      priceRange,
      newTab?.url || "",
      categoryL3,
      sort
    );
  }

  const plpAPI = new PLPAPI();
  return plpAPI
    .getCollectionV2(where.where, 0, false, variant, 10, sort)
    .then(async ({ data: res }: any) => {
      const updatedProductData = res?.data?.products?.map((prod: any) => ({
        ...prod,
        page: skipProd ? skipProd / 10 + 1 : 1,
      }));

      let updatedProductDataWithWidget = updatedProductData;
      let APIActionType: APIActionTypes = "NORMAL_STORE_DATA";
      if (skipProd) {
        APIActionType = "MORE_PRODUCTS";
        updatedProductDataWithWidget = [...products, ...updatedProductData];
      }

      /* Add widget between list of products */
      const productWithWidget = addWidgetDataInBetween(updatedProductDataWithWidget, widgetPLPData);
      return { type: APIActionType, payload: { updatedProductData: productWithWidget, skipProd, count: res.data.count } };
    })
    .catch((err: any) => {
      showError(err.response?.data?.message || err);
      console.error(err);
      return null;
    });
};

/**
 * GET CALL
 * For PLP - Based on Filters Applied
 */
export const callPLPFilterAPI = (
  { where, relatedData, navTabs, products = [], widgetPLPData }: FilterParams,
  variant?: string
) => {
  const filterWhere: any = where;
  const { index, skipProd, sort, appliedTags, priceRange, brandsData, categoryL3 } = relatedData || {};
  const newTab = navTabs?.[index || 0];

  const isSearch = Router.pathname === "/search";

  /* Sorting - Ascending or Descending */
  if (sort) filterWhere.order = [sort];

  /* Price-Range - From 0 - 10000 */
  if (priceRange?.length && filterWhere.where) filterWhere.where.or = priceRange;

  /* No Redirection on if Skip value present - simply getMoreProductsData */
  if (!skipProd) {
    PLP_STATE.newFilterVariant === "1"
      ? handleRedirectionV2(
          navTabs || [],
          removeEmptyObject(appliedTags),
          brandsData,
          priceRange,
          isSearch ? `/search?q=${Router.query.q}&tab=PRODUCTS` : index !== undefined && (newTab?.url || ""),
          categoryL3,
          sort
        )
      : handleRedirection(
          navTabs || [],
          removeEmptyObject(appliedTags),
          getSelectedBrands(brandsData),
          priceRange,
          isSearch ? `/search?q=${Router.query.q}&tab=PRODUCTS` : index !== undefined && (newTab?.url || ""),
          sort
        );
  }

  const plpAPI = new PLPAPI();
  const searchAPI = new SearchAPI();
  return (
    isSearch
      ? searchAPI.getSearchProduct(
          Router.query.q as string,
          skipProd,
          TOTAL_PRODUCTS_TO_FETCH_PER_CALL,
          false,
          SEARCH_STATE.variantName,
          filterWhere
        )
      : plpAPI.getPLPProducts(filterWhere, 10, skipProd, variant)
  )
    .then(async ({ data: res }: any) => {
      /* Storing Product Data with the Category and Pagination it belongs too */
      const updatedProductData = res.data?.data?.map((prod: any) => ({
        ...prod,
        page: skipProd ? skipProd / 10 + 1 : 1,
      }));
      let updatedProductDataWithWidget = updatedProductData;
      let APIActionType: APIActionTypes = "NORMAL_STORE_DATA";
      if (skipProd) {
        APIActionType = "MORE_PRODUCTS";
        updatedProductDataWithWidget = [...products, ...updatedProductData];
      }
      /* Add widget between list of products */
      const productWithWidget = addWidgetDataInBetween(updatedProductDataWithWidget, widgetPLPData);
      return { type: APIActionType, payload: { updatedProductData: productWithWidget, skipProd, count: res.data.count } };
    })
    .catch((err: any) => {
      showError(err.response?.data?.message || err);
      console.error(err);
      return null;
    });
};

/* Get Call Based on Slug to retrieve Filter Tags */
export function getFilterTags(slug: string, selectedTags = {}) {
  const plpAPI = new PLPAPI();

  return plpAPI
    .getFilterTags({
      where: { "categories.slug": encodeURIComponent(slug) },
    })
    .then(({ data: tags }) => sortTags(tags.data.data, selectedTags));
}

/* Returns a object with the plp product response based on the query recieved on server */
export async function getPLPSSRResponse(ctx: any) {
  const { Slug, category, brandNames, priceRange, page, sort } = ctx.query;
  console.log({ category });
  const plpAPI = new PLPAPI();
  const constantAPI = new ConstantsAPI();

  let activeTab = 0; /* The Tab to be active or selected onLoad */
  let filterTags: Array<any> = [];
  /* This gets mutated based on the params/slug received in query */
  const where: PlpProductWhere = {};

  /* Evaluating Querys Found in the URL to create where clause for PLP Product API Call */
  const buySlug = `/buy/${Slug?.join("/")}`;
  const { tags, selectedTags, priceBucket, appliedFilters } = extractFilterDataFromQuery(ctx.query, buySlug);
  const urlTags = category?.split(",");
  let updatedTags: Array<string> = [];
  const urlBrands = brandNames?.split(",");

  /* Top Nav-Bar API Call */
  const { data: navTabData } = await constantAPI.getNavigation("category-top-nav");
  /* Adding Brands bydefault in start */
  const navTabs = [
    {
      isBrand: true,
      url: "/buy/brands",
      label: ctx.configV3?.allProductstitle || "All Products",
    },
    ...navTabData?.data?.[0]?.details,
  ];

  let brandsList: FilterRow[] = [];
  if (urlBrands) {
    where["brand.name"] = urlBrands || [];
  }

  if (buySlug === "/buy/brands") {
    brandsList = await getBrandsData(urlBrands);
  } else if (Slug && Slug[0] !== "all") {
    where["categories.slug"] = encodeURIComponent(buySlug);
    if (urlTags?.length) {
      where["tag.name"] = { inq: urlTags };
      selectedTags[buySlug] = urlTags;
    }

    /* Tags related to the Selected Category */
    filterTags = await getFilterTags(buySlug, selectedTags);
    /* Based on buySlug find the index of the active Tab - priority to exact match */
    activeTab = navTabs?.findIndex((x: any) => buySlug === x.url);

    /* An Extra check for parent category */
    if (activeTab === -1) {
      activeTab = navTabs?.findIndex((x: any) => buySlug.includes(x.url));
      if (activeTab >= 0) navTabs[activeTab].subCatURL = buySlug;
    } else {
      navTabs[activeTab].subCatURL = buySlug;
    }
  } else if (urlTags?.length) {
    /* If brands present in url then call brands data also */
    if (urlBrands) brandsList = await getBrandsData(urlBrands);

    where["categories.slug"] = { inq: Object.keys(selectedTags) };
    where["tag.name"] = { inq: tags };

    /* Show Selected Tags incase of ALL Tab Section */
    filterTags = tags;
  }

  /* Evaluating Price-Range from URL */
  if (priceRange) where.or = priceBucket;

  //if (sort) where.order = [sort];

  /* Here based on query skip is decided as such for e.g page 2 = 10, 5 = 40 skipped products */
  const pageNo = parseInt(page, 10) || 1;
  let skip = pageNo ? (pageNo - 1) * 10 : 0;

  /* FILTER PRODUCT API CALL */
  let data: any = [];
  let products: any = [];
  let productCount = 0;
  const path = ctx.asPath.split("?")[0];

  if (PLP_STATE.products?.length > 0 && path === PLP_STATE?.historyUrl) {
    products =
      PLP_STATE?.products
        ?.map((prod: any) => ({
          ...prod,
          page: pageNo,
        }))
        .filter(x => !x.customParam) || [];

    productCount = PLP_STATE?.productCount;
    skip = PLP_STATE?.products.length;
  } else {
    data = await plpAPI.getPLPProducts({ where, ...(sort && { order: [sort] }) }, 10, skip, "variant-v3");
    products =
      data?.data?.data?.data?.map((prod: any) => ({
        ...prod,
        page: pageNo,
      })) || [];
    productCount = data?.data?.data?.count;
    skip += 10;
  }

  return {
    productCount,
    navTabs,
    products,
    brandsList,
    selectedTags,
    filterTags,
    activeTab,
    priceBucket,
    skip,
    appliedFilters,
    page: pageNo,
    sort,
  };
}
