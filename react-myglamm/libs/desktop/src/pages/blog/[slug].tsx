import React from "react";

import WpArticleApi from "@libAPI/apis/WpArticleApi";

import CategoryPage from "./category";
import Blog from "./blog";

const limit = 3;

const BlogPages = (props: any) => {
  if (props.type === "category") {
    return <CategoryPage {...props} />;
  }

  if (props.type === "blog") {
    return <Blog {...props} />;
  }
};

BlogPages.getInitialProps = async (ctx: any) => {
  const { slug } = ctx.query;
  try {
    const wpArticleApi = new WpArticleApi();
    const categoryDetails = await wpArticleApi.getCategoryDetails(slug);

    if (categoryDetails?.data?.length) {
      // Category Screen
      const [category, blogList, categoriesList]: any = await Promise.allSettled([
        wpArticleApi.getCategoryDetails(slug),
        wpArticleApi.getPostsByCategorySlug(slug, 1, limit),
        wpArticleApi.getHomePageCategories(),
      ]);

      if (!category?.value?.data?.[0]?.id || !blogList?.value?.data?.length) {
        if (ctx.res) {
          ctx.res.statusCode = 404;
          ctx.res.write("Page Not Found");
          return ctx.res.end();
        }
      }

      return {
        slug,
        category: category.value.data[0],
        blogList: blogList?.value?.data?.length ? blogList?.value?.data : [],
        categoriesList: categoriesList?.value?.data?.taxonomy?.term,
        type: "category",
      };
      // eslint-disable-next-line no-else-return
    } else {
      // Blog Page

      const blogDetailsResponse = await wpArticleApi.getPostByPostSlug(slug);
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
