import { useRouter } from "next/router";

import PLPAPI from "@libAPI/apis/PLPAPI";
import SearchAPI from "@libAPI/apis/SearchAPI";

import { PLPFilterRow } from "@typesLib/PLP";
import { ValtioStore } from "@typesLib/ValtioStore";

import Adobe from "@libUtils/analytics/adobe";
import { formatPrice } from "@libUtils/format/formatPrice";

import { ADOBE } from "@libConstants/Analytics.constant";

import { getArrayOfTags } from "@libServices/PLP/filterHelperFunc";
import { getMakeupCount } from "@libServices/PLP/plpApiHelperFunc";

import { CONFIG_REDUCER, ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import { useSelector } from "./useValtioSelector";

function useFilter() {
  const router = useRouter();
  const catText = "categories.id";

  const plpAPI = new PLPAPI();
  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer) || {};

  /* Setting up the Data for Filter Modal */
  async function getFilteredData(isSearch?: boolean) {
    let rootCats: any;
    let firstLevelCats: any;

    if (isSearch) {
      const searchApi = new SearchAPI();
      const { data } = await searchApi.getSearchCategoy(router.query.q as string);

      rootCats = data?.data?.data;
      firstLevelCats = rootCats.reduce((prev: any[], curr: any) => [...prev, ...(curr.categories || [])], []);
    } else {
      const commonParams = ["urlManager", "parentId"];

      /* Api Call for 1st Level Categories, PLP Tab Navigation */
      const rootCategory = await plpAPI.getCategories("0", undefined, commonParams);
      rootCats = rootCategory.data.data.data;
      const rootIds = rootCats.map((id: any) => id.id);

      /* Api Call for 2nd Level Categories */
      const firstLevel = await plpAPI.getCategories({ inq: rootIds }, undefined, commonParams);
      firstLevelCats = firstLevel.data.data.data;
    }

    /* Making Batches of Category Data Ids of 25(limitation of a query) */
    const categoryBatches = [];
    for (let i = 0; i < firstLevelCats.length; i += 25) {
      categoryBatches.push(firstLevelCats.slice(i, i + 25));
    }

    /* Calling All Categories Count data and appending it here */
    const AllCategoryCountData = await Promise.all(categoryBatches.map(cats => getMakeupCount(cats)));
    let countData: Array<any> = [];
    AllCategoryCountData.forEach(data => {
      countData = [...countData, ...data];
    });

    /* Monkey Patching API Response for first load  */
    return rootCats.map((a: any) => ({
      id: a.id,
      name: a.cms[0]?.content.name,
      isSelected: false,
      slug: a.urlManager.url,

      childCategories: (a.categories || firstLevelCats.filter((s: any) => s.parentId === a.id)).map((b: any) => ({
        id: b.id,
        name: b.cms[0]?.content.name,
        isSelected: false,
        slug: b.urlManager.url,
        meta: b.cms[0]?.metadata,
        productCount: countData[countData.findIndex((x: any) => x.where[catText] === b.id)]?.count || 0,
      })),
    }));
  }

  /* Based on Selected Category and Sub-Category push them to the top */
  function sortFilteredData(sortdata: any, tagKeys: Array<string>) {
    const filterRes = sortdata.map((parent: any) => {
      const newSubCats = parent.childCategories?.map((subCat: any) => ({
        ...subCat,
        isSelected: router.asPath.includes(subCat.slug) || !!tagKeys.find((x: string) => subCat.slug.includes(x)),
      }));
      return {
        ...parent,
        isSelected: router.asPath.includes(parent.slug) || !!newSubCats.find((x: any) => x.isSelected),
        childCategories: newSubCats,
      };
    });

    const rootFilter: any = [];
    const selectedRootFilter: any = [];
    filterRes.forEach((parent: any) => {
      if (parent.isSelected) {
        const filters: any = [];
        const selectedFilter: any = [];
        selectedRootFilter.push(parent);
        parent.childCategories.forEach((child: any) => {
          if (child.isSelected) {
            selectedFilter.push(child);
          } else {
            filters.push(child);
          }
        });
        if (selectedFilter.length) {
          filters.unshift(...selectedFilter);
          selectedRootFilter[selectedRootFilter.length - 1].childCategories = filters;
        }
      } else {
        rootFilter.push(parent);
      }
    });
    rootFilter.unshift(...selectedRootFilter);

    return rootFilter;
  }

  const handleRedirection = (
    navTabs: Array<any>,
    appliedTags = {},
    selectedBrands: PLPFilterRow = [],
    priceBucket: Array<{ priceOffer: { between: Array<number> } }> = [],
    url: string | false
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
    const isNavTab = navTabs.find((x: any) => x.url === selectedCatSlugs[0]);

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
      return redirect(`/buy/all?category=${tagUrl}`, minmaxURL, brandsURL);
    }

    /* Single Category Tags Selected and available on DOM - NAVTABS */
    if (selectedCatSlugs.length === 1 && isNavTab) {
      return redirect(`${selectedCatSlugs[0]}?category=${getArrayOfTags(appliedTags)}`, minmaxURL, brandsURL);
    }
    /* Incase of No tags selected redirect to brands tab */
    if (selectedBrands?.length === 1) {
      return redirect(`/buy/brands`, minmaxURL, brandsURL);
    }
    /* Simple Tab Redirection */
    if (url) {
      return redirect(url, minmaxURL, brandsURL);
    }
    return null;
  };

  const redirect = (url: string, minmaxURL?: string, brandURL?: string) => {
    const urlJoiner = (tempURL: string) => (tempURL.includes("?") ? "&" : "?");

    let path = url;
    if (minmaxURL) path = `${path}${urlJoiner(path)}${minmaxURL}`;
    if (brandURL) path = `${path}${urlJoiner(path)}${brandURL}`;

    router.replace(path, undefined, { shallow: true });
  };

  /**
   * Handle Analytics - Page Load and Click Event
   */
  const adobeClickEvent = (event: string, catName: string) => {
    (window as any).digitalData = {
      ...(window as any).digitalData,
      common: {
        assetType: "filters",
        ctaName: `filter ${event}`,
        linkName: `web|${catName}|filter ${event}`,
        linkPageName: `web|${catName}|filters`,
        newAssetType: "filters",
        newLinkPageName: "filters",
        pageLocation: "",
        platform: ADOBE.PLATFORM,
        subSection: "filter",
      },
      user: Adobe.getUserDetails(userProfile),
    };
    Adobe.Click();
  };

  // filter and sort analytics
  const adobeEventFilterSort = (filterOrSort: string, event: string, catName: string | undefined, filterSortSelected?: any) => {
    const commonData = {
      assetType: filterOrSort,
      ctaName: `${filterOrSort} ${event}`,
      linkName: `web|${catName || ""}|${filterOrSort} ${event}`,
      linkPageName: `web|${catName || ""}|${filterOrSort}`,
      pageName: `web|${catName || ""}`,
      newAssetType: filterOrSort,
      newLinkPageName: filterOrSort,
      pageLocation: "",
      platform: ADOBE.PLATFORM,
      subSection: `${filterOrSort} | ${catName || ""}`,
    };

    if (event === "applied") {
      ADOBE_REDUCER.adobePageLoadData = {
        common: { ...commonData, filterSortApplied: `${filterOrSort} ${event}`, filterSortSelected: filterSortSelected },
      };
    } else {
      (window as any).digitalData = {
        ...(window as any).digitalData,
        common: {
          ...commonData,
          filterSortClicked: `${filterOrSort} ${event}`,
        },
        user: Adobe.getUserDetails(userProfile),
      };
      Adobe.Click();
    }
  };

  // Adobe Analytics[2.1] - Click Page Load - Category PLP and Webengage[4.1] - Category Viewed
  const adobePageLoadEvent = (event: string, catName: string) => {
    (window as any).digitalData = {
      ...(window as any).digitalData,
      common: {
        pageName: `web|${catName}|${event}`,
        newPageName: "product listing",
        subSection: catName,
        assetType: "category",
        newAssetType: "category",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };

    ADOBE_REDUCER.adobePageLoadData = (window as any).digitalData;
  };

  return {
    redirect,
    getFilteredData,
    sortFilteredData,
    handleRedirection,
    adobeEventFilterSort,
    adobeClickEvent,
    adobePageLoadEvent,
  };
}

export default useFilter;
