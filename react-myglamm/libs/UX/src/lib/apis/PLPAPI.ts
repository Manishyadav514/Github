import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import MyGlammAPI from "@libAPI/MyGlammAPI";
import { sortingType } from "@typesLib/PLP";

class PLPAPI extends MyGlammAPI {
  /**
   * URL: /buy/[category] - CATEGORY PAGES
   */
  public getCategories(id?: string | { inq: string[] }, slug?: string | { inq: string[] }, include: Array<string> = []) {
    const filter = {
      where: { parentId: id, "urlShortner.slug": slug },
      limit: 100,
      include: ["cms", "meta", ...include],
    };
    return this.myGlammV2.get(`/search-ms/indices/search/product-category?filter=${JSON.stringify(filter)}`, {
      headers: { apikey: true },
    });
  }

  public getCategoryProductCount = (filterArray: any) =>
    this.myGlammV2.get(`/search-ms/indices/multiple-search?filter={"filterArray":${JSON.stringify(filterArray)}}`, {
      headers: { apikey: true },
    });

  public getPLPProducts = (where: any, limit = 10, skip = 0, variant = "variant-v3") => {
    const filter = { ...where, limit, skip };
    return this.myGlammV2.get(`/search-ms/plp?filter=${JSON.stringify(filter)}&variant=${variant}`, {
      headers: { ...(!checkUserLoginStatus() && { apikey: true }) },
    });
  };

  public getFilterTags = (where: any) => {
    const filter = { ...where, limit: 50, skip: 0 };
    return this.myGlammV2.get(`/search-ms/plp/tags?filter=${JSON.stringify(filter)}`, { headers: { apikey: true } });
  };

  /**
   *
   * @returns All the Brands possible for the current vendor
   */
  public getAllBrands() {
    return this.myGlammV2.get(`/search-ms/brandList?filter={"limit":50,"skip":0}`);
  }

  /**
   * URL: /collection/[collectionName] - COLLECTION PAGES
   */
  public getCollection(collection: string) {
    const filter = {
      where: { "urlShortner.slug": `/collection/${collection}` },
      include: ["cms", "assets", "urlManager", "products", "meta"],
    };
    return this.myGlammV2.get(`/search-ms/indices/search/collection?filter=${JSON.stringify(filter)}`, {
      headers: { apikey: true },
    });
  }

  // NEW COLLECTION API WHICH COMBINES THE PREVIOUS TWO API CALL IN ONE.
  public getCollectionV2(
    collectionData: any,
    skip = 0,
    getCollectionData: boolean = false,
    variant: undefined | string = "",
    limit = 10,
    order?: sortingType | undefined
  ) {
    const filter = {
      where: {
        ...collectionData,
      },
      order,
      skip,
      limit,
      include: ["offerPrice", "cms", "price", "urlManager", "productMeta", "productTag", "type", "inStock", "sku", "assets"],
    };
    let plpProdRankingVariant = variant && `&variant=${variant}`;
    return this.myGlammV2.get(
      `/search-ms/search/collection?filter=${JSON.stringify(
        filter
      )}&getCollectionData=${getCollectionData}${plpProdRankingVariant}`,
      {
        headers: { apikey: true },
      }
    );
  }

  public getCollectionProduct(collectionWhere: any, skip = 0) {
    const filter = {
      where: {
        ...collectionWhere,
      },
      skip,
      limit: 10,
      include: ["offerPrice", "cms", "price", "urlManager", "productMeta", "productTag", "type", "inStock", "sku", "assets"],
    };

    return this.myGlammV2.get(
      `/search-ms/collection/products?getRelationalData=false&getDeepNestedRelations=false&relationalFields=false&shades=true&filter=${JSON.stringify(
        filter
      )}`,
      { headers: { apikey: true } }
    );
  }

  public getCollectionCategories(collectionWhere: any) {
    const filter = {
      where: {
        ...collectionWhere,
      },
      skip: 0,
      limit: 100,
      include: ["cms", "meta", "urlManager", "parentId"],
    };
    return this.myGlammV2.get(`/search-ms/indices/search/product-category?filter=${JSON.stringify(filter)}`, {
      headers: { apikey: true },
    });
  }

  // New Filter API Endpoints
  public getAllFilters = (where: any, parentCats: string) => {
    const filter = { ...where };
    return this.myGlammV2.get(`/search-ms/v3/plp/filter?filter=${JSON.stringify(filter)}&parentCategorySlug=${parentCats}`, {
      headers: { apikey: true },
    });
  };

  public getCollectionFilter = (where: any) => {
    const filter = { ...where };
    return this.myGlammV2.get(`/search-ms/v3/collection/filter?filter=${JSON.stringify(filter)}`, {
      headers: { apikey: true },
    });
  };

  /* Get DS Products For Collection */
  public getDsCollection(service: string, key?: string | undefined, identifier?: string | undefined) {
    return this.myGlammV2.get(`${service}${key ? `?key=${key}&` : "?"}identifier=${identifier || "default"}`, {
      headers: { apikey: true },
    });
  }
}

export default PLPAPI;
