import axios, { AxiosRequestConfig, AxiosInstance, Axios } from "axios";
import WordPressAPI from "@libAPI/WordPressAPI";
class WpArticleApi extends WordPressAPI {
  public getArticleListBySlug = (data: { slug: string }) =>
    this.wordPressV1.get(`wp-json/wp/v2/posts?category_slug=${data?.slug}&per_page=10&page=1&_embed`);

  public getArticlesByCategoryApi = (slug: string, perPage: number, pageNo: number) =>
    this.wordPressV1.get(`/wp-json/wp/v2/posts?category_slug=${slug}&per_page=${perPage}&page=${pageNo}&_embed`);

  public getLatestArticleByCategoryApi = (slug: string) =>
    this.wordPressV1.get(`/wp-json/wp/v2/posts?_embed&orderby=date&order=desc&page=1&per_page=1&category_slug=${slug}`);

  public getCategoryDetailsApi = (slug: string) => this.wordPressV1.get(`/wp-json/wp/v2/categories?slug=${slug}`);

  public getArticleDetails = (slug: string) => this.wordPressV1.get(`/wp-json/wp/v2/posts/?slug=${slug}&_embed`);

  public getArticleListingApi = (lifestageSlug: string, language: string = "en", pageNo: number) =>
    this.wordPressV1.get(
      `/wp-json/bc/v2/category-posts?language=${language}&lifestage=${lifestageSlug}&per_category=${4}&page=${pageNo}&per_page=${10}`
    );

  public getTrendingReads = (filter: { slug: string; language: string; per_page?: number }) => {
    if (filter?.slug === "all") {
      return this.wordPressV1.get(
        `/wp-json/bc/v1/trending-reads?per_page=${filter.per_page ? filter.per_page : 4}&page=1&language=${filter.language}`
      );
    }
    return this.wordPressV1.get(
      `/wp-json/bc/v1/trending-reads?per_page=${filter.per_page ? filter.per_page : 4}&page=1&lifestage=${
        filter.slug
      }&language=${filter.language}`
    );
  };

  public getFreshReads = (filter: any) => {
    if (filter?.slug === "all") {
      this.wordPressV1.get(
        `/wp-json/wp/v2/posts?languages_slug=${filter.language}&orderby=date&order=desc&per_page=4&_fields=slug,date,read_time,link,title,id,coauthors,bbc_save_count,bbc_like_count,_links,_embeded&_embed`
      );
    }
    return this.wordPressV1.get(
      `/wp-json/wp/v2/posts?languages_slug=${filter.language}&lifestages_slug=${filter.slug}&orderby=date&order=desc&per_page=4&_fields=slug,date,read_time,link,title,id,coauthors,bbc_save_count,bbc_like_count,_links,_embeded&_embed`
    );
  };

  public getArticleListByPostSlug = (data: { slug: string }) => {
    return this.wordPressV1.get(
      `/wp-json/wp/v2/posts?post_tag_slug=${data?.slug}&per_page=10&page=1&_embed&orderby=date&order=desc`
    );
  };

  public getBabyNamesData = (data: object) =>
    axios.get(`${process.env.NEXT_PUBLIC_APIV2_URL}/crud-ms/operation/babynames?filter=${JSON.stringify(data)}`);

  public getPostByPostSlug = (slug: string) =>
    this.wordPressV1.get(
      `/wp-json/wp/v2/posts/?slug=${slug}&_fields=title,slug,date,modified,content,excerpt,id,seo_tags,short_link,_links,_embedded&_embed`
    );
  public getPostsByCategorySlug(SLUG: string, pageNo = 1, limit = 5) {
    return this.wordPressV1.get(
      `/wp-json/wp/v2/posts?taxonomy=category&term_slug=${SLUG}&per_page=${limit}&page=${pageNo}&_fields=title,slug,content,excerpt,id,_links,_embedded&_embed`
    );
  }
  public getCategoryDetails = (slug: string) =>
    this.wordPressV1.get(`/wp-json/wp/v2/categories?slug=${slug}&_fields=id,name,slug,seo_tags,short_link`);
  public getCategoriesList(pageNo = 1, limit = 2) {
    return this.wordPressV1.get(`/wp-json/wp/v2/categories?per_page=${limit}&page=${pageNo}&_fields=id,name,slug`);
  }
  public getHomePageCategories() {
    return this.wordPressV1.get(`/wp-json/g3-custom/v1/carousels/home-page-categories/taxonomies`);
  }
  public getLatestArticles() {
    return this.wordPressV1.get(`/wp-json/wp/v2/posts?_fields=title,slug,_links,_embedded&_embed`);
  }

  public getPostPreview(postId: string, tokenId: string) {
    return this.wordPressV1.get(`/wp-json/wp/v2/post-preview?p=${postId}&token=${tokenId}&_embed`);
  }
}

export default WpArticleApi;
