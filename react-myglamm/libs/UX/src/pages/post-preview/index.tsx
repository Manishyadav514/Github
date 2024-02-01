import React from "react";

import WpArticleApi from "@libAPI/apis/WpArticleApi";

import DesktopBlog from "@libDesktop/pages/blog/blog";
import MwebBlog from "@libPages/blog/blog";

import {  IS_DESKTOP } from "@libConstants/COMMON.constant";

import ErrorComponent from "@libPages/_error";

const BlogPreview = (props: any) => {
  const { blog, error } = props;

  if (blog && IS_DESKTOP) {
    return <DesktopBlog blogDetails={blog} />;
  }
  if (blog && !IS_DESKTOP) {
    return <MwebBlog blogDetails={blog} />;
  }
  if (error === 401) {
    return <div className="text-center my-6">Session Expired. Try Again!</div>;
  }

  return <ErrorComponent />;
};

BlogPreview.getInitialProps = async (ctx: any) => {
  const { p, token } = ctx.query;

  try {
    const articlesAPI = new WpArticleApi();
    const response: any = await articlesAPI.getPostPreview(p, token);
    return {
      blog: response?.data,
      error: null,
    };
  } catch (err: any) {
    return {
      blog: null,
      error: err?.response?.status || 400,
    };
  }
};

export default BlogPreview;
