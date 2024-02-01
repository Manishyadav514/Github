import dynamic from "next/dynamic";

import PageAPI from "@libAPI/apis/PageAPI";
import WidgetAPI from "@libAPI/apis/WidgetAPI";
import ProductAPI from "@libAPI/apis/ProductAPI";

import { logURI } from "@libUtils/debug";
import { isClient } from "@libUtils/isClient";

import { SHOP } from "@libConstants/SHOP.constant";
import { SLUG } from "@libConstants/Slug.constant";
import { IS_DESKTOP } from "@libConstants/COMMON.constant";

const BlogPages = dynamic(() => import(/* webpackChunkName: "BlogsGlammStuido" */ "./blogs"));
const CategoryPage = dynamic(() => import(/* webpackChunkName: "BlogsCategory" */ "./category"));
const BlogCategoryListing = dynamic(
  () => import(/* webpackChunkName: "BlogsCategoryWeb" */ "@libDesktop/pages/Glammstudio/BlogCategoryListing")
);
const BlogPage = dynamic(() => import(/* webpackChunkName: "BlogsWeb" */ "@libDesktop/pages/Glammstudio/BlogPage"));

const CategoryOrBlog = (props: any) => {
  if (props.type === "pageCategory") {
    if (IS_DESKTOP) return <BlogCategoryListing {...props} />;

    return <CategoryPage {...props} />;
  }

  if (props.type === "blog") {
    if (IS_DESKTOP) return <BlogPage {...props} />;

    return <BlogPages {...props} />;
  }
};

CategoryOrBlog.getInitialProps = async (ctx: any) => {
  if (!isClient()) {
    if (ctx.req.method !== "HEAD" && process.env.NEXT_PUBLIC_ENABLE_HIT_LOGS === "true") {
      console.error("HIT:", ctx.req.method, ctx.req.url);
    }
  }
  const { category } = ctx.query;
  const where = {
    categoryId: `/${SHOP.IS_MYGLAMM ? "glammstudio" : "blog"}/${category}`,
  };

  try {
    const pageApi = new PageAPI();
    const { data } = await pageApi.getPage(0, where);

    if (data?.data?.data.length === 0) {
      logURI(ctx.asPath);
      if (ctx.res) {
        ctx.res.statusCode = 404;
        return ctx.res.end("Not Found");
      }

      return {
        errorCode: 404,
      };
    }

    /* pageType || type define if it is blog page or category  */
    if (data.data.data[0]?.pageType === "pageCategory" || data.data.data[0]?.type === "pageCategory") {
      const { categoryId } = data.data.data[0];

      const header = data.data.relationalData?.categoryId[categoryId]?.cms[0]?.content?.name;

      const metaData = data.data.relationalData?.categoryId[categoryId]?.cms[0]?.metadata;

      return { blog: data.data, header, metaData, type: data.data.data[0]?.pageType || data.data.data[0]?.type };
    }
    if (data.data.data[0]?.pageType === "blog" || data.data.data[0]?.type === "blog") {
      let blog = data?.data;
      const widgetApi = new WidgetAPI();
      const productApi = new ProductAPI();

      /* Extracting Parent Category Name(Blog) */
      const { categoryId } = blog.data[0];
      const categoryName = blog.relationalData?.categoryId[categoryId].cms[0]?.content.name.toLowerCase();

      /* Actual Blog Data at first position that needs to be fetched */
      [blog] = blog.data;

      const promiseArray = [];

      /* Right now only shown for Mobile */
      if (!IS_DESKTOP) {
        promiseArray.push(
          widgetApi.getWidgets({
            where: {
              slugOrId: SLUG().RELATED_BLOGS,
              name: "customPage",
              items: `${SHOP.IS_MYGLAMM ? "glammstudio" : "blog"}/${encodeURIComponent(categoryName)}`,
            },
          })
        );
      } else promiseArray.push(Promise.resolve()); // necessary so that the position is maintained

      if (blog?.products) {
        promiseArray.push(productApi.getProduct({ id: { inq: blog.products } }));
      }

      /* Related Blogs(Widget) and Products Call if Any available */
      const [relatedBlogs, relatedProducts]: any = await Promise.allSettled(promiseArray);

      const relatedBlogWidget = relatedBlogs?.value?.data?.data?.data?.widget;
      const products = relatedProducts?.value?.data?.data;

      /* Get Type of Related Widget Blogs */
      const getWidgetByType = (type: string) =>
        relatedBlogWidget?.find((x: any) => JSON.parse(x.meta.widgetMeta || "{}").type === type);

      return {
        query: ctx.query,
        content: blog,
        products: products?.data,
        productRelationalData: products?.relationalData,
        header: categoryName,
        mostPopular: getWidgetByType("popular"),
        latestArticles: getWidgetByType("latest"),
        recommendedListing: getWidgetByType("recommended"),
        type: data.data.data[0]?.pageType || data.data.data[0]?.type,
        categorySlug: blog?.navigation?.[1]?.slug.split("/")[2] || categoryName,
      };
    }
  } catch (error: any) {
    logURI(ctx.asPath);
    if (ctx.res) {
      console.log(error);
      ctx.res.statusCode = 500;
      return ctx.res.end("Server Error");
    }
    return {
      errorCode: 404,
    };
  }
};

export default CategoryOrBlog;
