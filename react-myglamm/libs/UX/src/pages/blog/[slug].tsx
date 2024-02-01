import React from "react";

import WpArticleApi from "@libAPI/apis/WpArticleApi";

import { logURI } from "@libUtils/debug";

import CategoryPage from "./category";
import Blog from "./blog";

function BlogPages(props: any) {
  if (props.type === "category") {
    return <CategoryPage {...props} />;
  }

  if (props.type === "blog") {
    return <Blog {...props} />;
  }
}

BlogPages.getInitialProps = async (ctx: any) => {
  const { slug } = ctx.query;
  try {
    const wpArticleApi = new WpArticleApi();
    const categoryDetails = await wpArticleApi.getCategoryDetails(slug);

    if (categoryDetails?.data?.length) {
      // Category Screen
      const [category, blogList]: any = await Promise.allSettled([
        wpArticleApi.getCategoryDetails(slug),
        wpArticleApi.getPostsByCategorySlug(slug, 1, 5),
      ]);

      if (!category?.value?.data?.[0]?.id || !blogList?.value?.data?.length) {
        if (ctx.res) {
          ctx.res.statusCode = 404;
          ctx.res.write("Page Not Found");
          return ctx.res.end();
        }
      }

      return {
        blogList: blogList?.value?.data?.length ? blogList?.value?.data : [],
        category: category.value.data[0],
        slug,
        type: "category",
      };
    } else {
      // Blog Page
      const blogDetailsResponse: any = await wpArticleApi.getPostByPostSlug(slug);
      if (!blogDetailsResponse?.data?.length && ctx?.res) {
        ctx.res.statusCode = 404;
        return ctx.res.end("Not Found");
      }
      return {
        blogDetails: blogDetailsResponse?.data?.[0],
        type: "blog",
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

export default BlogPages;
