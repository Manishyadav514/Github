import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { BLOG_SEO } from "@libConstants/BLOGS.constant";
import { IS_DESKTOP } from "@libConstants/COMMON.constant";
import { SHOP } from "@libConstants/SHOP.constant";
import { BASE_URL } from "@libConstants/COMMON.constant";

import { getStaticUrl } from "@libUtils/getStaticUrl";

const BlogLandingHead = () => {
  const router = useRouter();

  const SEO = BLOG_SEO[SHOP.SITE_CODE as keyof typeof BLOG_SEO];

  return (
    <Head>
      {/* SEO */}
      <title>{SEO?.title || "Best Beauty Tips, Makeup Tutorials, Tips & Trends Online - MyGlamm"}</title>
      <meta
        key="description"
        name="description"
        content={
          SEO?.description ||
          "Revitalize yourself with best makeup tips, makeup tutorials alongwith tips &amp; trends related to beauty, fashion, lifestyle and much more at MyGlamm."
        }
      />
      <meta
        key="keywords"
        name="keywords"
        content={
          SEO?.keywords ||
          "makeup tips, makeup tutorials, beauty guides, makeup trends, online makeup tips, best makeup tips, best makeup tutorials, makeup articles, latest makeup trends, MyGlamm"
        }
      />
      <link key="canonical" rel="canonical" href={`${BASE_URL()}${router.asPath.split("?")[0]}`} />
      {IS_DESKTOP && <link type="text/css" rel="stylesheet" href={getStaticUrl(`/global/css/main.css`)} />}
    </Head>
  );
};

export default BlogLandingHead;
