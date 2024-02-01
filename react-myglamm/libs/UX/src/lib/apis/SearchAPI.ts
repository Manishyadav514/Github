import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import MyGlammAPI from "@libAPI/MyGlammAPI";

class SearchAPI extends MyGlammAPI {
  /**
   * Search Global Products
   * @param {String} searchterm - Search Value
   * @returns {Array[{}]} Search Result
   */
  async searchItems(searchTerm: string, pageNumber: number, searchType?: string) {
    const searchDetails = this.myGlammV2.get(
      `/search-ms/searchSuggestions?searchText=${searchTerm}&page=${pageNumber}${
        searchType ? `&searchIndex=${searchType}` : ""
      }`,
      { headers: { apikey: true } }
    );

    const [searchRes] = await Promise.all([searchDetails]);

    return {
      PRODUCTS: searchRes.data.data.search.products,
      LOOKS: searchRes.data.data.search.lookbook,
      BLOGS: searchRes.data.data.search.pages,
    };
  }

  public getSearchProduct(searchTerm: string, skip = 0, limit = 10, isAutoSuggest = false, variantName?: string, where?: any) {
    const filter = { ...(where || {}), limit, skip };

    if (filter.where && !Object.keys(filter.where).length) delete filter.where;

    return this.myGlammV2.get(
      `search-ms/search/products?searchText=${encodeURIComponent(searchTerm)}&filter=${JSON.stringify(
        filter
      )}&isAutoSuggest=${isAutoSuggest}${variantName ? `&variant=${variantName}` : ""}`,
      { headers: { ...(!checkUserLoginStatus() && { apikey: true }) } }
    );
  }

  public getSearchCategoy(searchTerm: string) {
    return this.myGlammV2.get(`/search-ms/productCategorySearch?searchText=${searchTerm}`);
  }

  public searchAutocomplete(searchTerm: string) {
    return this.myGlammV2.get(`/search-ms/search/suggestion?text=${searchTerm}`, { headers: { apikey: true } });
  }

  /* Old Search API only used for desktop */
  public async oldSearchItems(searchTerm: string, limit: number, offset?: number) {
    const searchConfig: any = {
      where: {
        country: MyGlammAPI.Filter.CountryFilter,
        or: [
          {
            "cms.content.name": {
              autocomplete: searchTerm,
            },
          },
          {
            "cms.content.subtitle": {
              autocomplete: searchTerm,
            },
          },
          {
            "cms.metadata.title": {
              autocomplete: searchTerm,
            },
          },
          {
            "cms.metadata.keywords": {
              autocomplete: searchTerm,
            },
          },
        ],
      },
      order: ["createdAt DESC"],
      limit,
      skip: offset || 0,
    };

    if (limit === 5) searchConfig.include = ["cms", "urlManager", "id"];

    const filter = {
      ...searchConfig,
      where: {
        "productMeta.displaySiteWide": true,
        ...searchConfig.where,
      },
    };

    let promiseArray = [this.myGlammV2.get(`/search-ms/indices/search/products?filter=${JSON.stringify(filter)}`)];

    if (!offset) {
      promiseArray = [
        ...promiseArray,
        this.myGlammV2.post(`/search-ms/indices/search/lookbook`, searchConfig),
        this.myGlammV2.get(`/search-ms/indices/search/pages?filter=${JSON.stringify(searchConfig)}`),
      ];
    }

    const [productsRes, looksRes, blogsRes] = await Promise.all(promiseArray);

    /**
     * Restucture Search Data to return
     * Array of Objects(Search Data)
     */
    return {
      PRODUCTS: productsRes.data.data,
      LOOKS: looksRes?.data?.data,
      BLOGS: blogsRes?.data?.data,
    };
  }
}

export default SearchAPI;
