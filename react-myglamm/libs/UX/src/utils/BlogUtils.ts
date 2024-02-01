import WpArticleApi from "@libAPI/apis/WpArticleApi";

import { ADOBE } from "@libConstants/Analytics.constant";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

export const limit = 6;
export const BlogListLimitCSR = 10;
export const BlogListDesktopLimitCSR = 3;
export const DATEFORMAT = "do MMM, yyyy";

export const decodeEntities = (encodedString: string) => {
  const translateRe = /&(nbsp|amp|quot|lt|gt);/g;
  const translate: any = {
    nbsp: " ",
    amp: "&",
    quot: `"`,
    lt: "<",
    gt: ">",
  };
  return encodedString
    ?.replace(translateRe, (_: any, entity: any) => translate[entity])
    ?.replace(/&#(\d+);/gi, (_, numStr) => {
      const num = parseInt(numStr, 10);
      return String.fromCharCode(num);
    });
};

export const convertStylesStringToObject = (stringStyles: any) => {
  return typeof stringStyles === "string"
    ? stringStyles.split(";").reduce((acc, style) => {
        const colonPosition = style.indexOf(":");
        if (colonPosition === -1) {
          return acc;
        }
        const camelCaseProperty = style
            .substr(0, colonPosition)
            .trim()
            .replace(/^-ms-/, "ms-")
            .replace(/-./g, c => c.substr(1).toUpperCase()),
          value = style.substr(colonPosition + 1).trim();
        return value ? { ...acc, [camelCaseProperty]: value, height: "100%" } : acc;
      }, {})
    : {};
};

export const fetchCategoryAndPosts = async () => {
  try {
    const wpArticleApi = new WpArticleApi();
    const categoriesListResponse = await wpArticleApi.getHomePageCategories();
    const categories = categoriesListResponse?.data?.taxonomy?.term || [];
    const promiseArray = categories?.map((category: any) => {
      return wpArticleApi.getPostsByCategorySlug(category.slug);
    });
    let categoryBlogs;
    if (promiseArray?.length) {
      const response: any = await Promise.allSettled(promiseArray);
      categoryBlogs = response?.map((res: any, resIndex: number) => {
        const newData = {
          category: categories[resIndex],
          blogs: res?.value?.data || [],
        };
        return newData;
      });
    }
    return { categoryBlogs };
  } catch (error: any) {
    throw error;
  }
};

export const convertHTMLToStr = (html: string) => {
  if (!html || typeof html !== "string") {
    return "";
  }
  const parsedStr = html
    .replace(/\n/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style[^>]*>/gi, "")
    .replace(/<head[^>]*>[\s\S]*?<\/head[^>]*>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script[^>]*>/gi, "")
    .replace(/<\/\s*(?:p|div)>/gi, "\n")
    .replace(/<br[^>]*\/?>/gi, "\n")
    .replace(/<[^>]*>/gi, "")
    .replace("&nbsp;", " ")
    .replace(/[^\S\r\n][^\S\r\n]+/gi, " ");
  return decodeEntities(parsedStr);
};

export const blogLandingGetInitialProps = async (ctx: any) => {
  try {
    const { categoryBlogs } = await fetchCategoryAndPosts();
    return { categoryBlogs };
  } catch (error: any) {
    if (ctx.res) {
      ctx.res.statusCode = 500;
      return ctx.res.end("Server error");
    }
    return {
      errorCode: 500,
    };
  }
};

export const blogPageLoadAdobeCall = (platform: string) => {
  const digitalData = {
    common: {
      pageName: "web|glammstudio|glamm studio",
      newPageName: ADOBE.ASSET_TYPE.GLAMMSTUDIO,
      subSection: ADOBE.ASSET_TYPE.GLAMMSTUDIO,
      assetType: ADOBE.ASSET_TYPE.GLAMMSTUDIO,
      newAssetType: "content",
      platform,
      technology: ADOBE.TECHNOLOGY,
    },
  };
  ADOBE_REDUCER.adobePageLoadData = digitalData;
};

export const categoryPageLoadAdobeCall = (name: string, platform: string) => {
  const digitalData = {
    common: {
      pageName: `web|glammstudio|${name}`,
      newPageName: "blog category",
      subSection: `${name}`,
      assetType: "blog category",
      newAssetType: "content",
      platform,
      technology: ADOBE.TECHNOLOGY,
    },
    blog: {
      blogCategory: `${name}`,
    },
  };
  ADOBE_REDUCER.adobePageLoadData = digitalData;
};

export const blogDetailPageLoadAdobeCall = (title: string, categoryName: string, platform: string) => {
  const digitalData = {
    common: {
      pageName: `web|glammstudio|${convertHTMLToStr(title).toLowerCase()}`,
      newPageName: "blog detail",
      subSection: `${categoryName}`,
      assetType: "blog",
      newAssetType: "content",
      platform,
      technology: ADOBE.TECHNOLOGY,
    },
    blog: {
      blogName: `${convertHTMLToStr(title).toLowerCase()}`,
      blogCategory: `${categoryName}`,
    },
  };
  ADOBE_REDUCER.adobePageLoadData = digitalData;
};
