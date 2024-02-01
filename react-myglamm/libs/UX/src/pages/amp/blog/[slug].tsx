import React, { ReactElement } from "react";
import Link from "next/link";
import parse from "html-react-parser";
import format from "date-fns/format";

import { logURI } from "@libUtils/debug";
import { DATEFORMAT } from "@libUtils/BlogUtils";

import { SHOP } from "@libConstants/SHOP.constant";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

import WpArticleApi from "@libAPI/apis/WpArticleApi";

import Footer from "@libComponents/Footer/Footer";
import STBFooter from "@libComponents/Footer/STBFooter";
import BlogDetailHead from "@libComponents/BlogsWP/Head/BlogDetailHead";
import BlogSchema from "@libComponents/BlogsWP/Schema/BlogSchema";
import BreadcrumbSchema from "@libComponents/BlogsWP/Schema/BreadcrumbSchema";
import BlogStyles from "@libComponents/BlogsWP/BlogStyles/BlogMwebStyles";
import handleStoryHTML from "@libComponents/BlogsWP/BlogBody";

import AMPLayout from "@libLayouts/AMPLayout";

export const config = { amp: true };

const BlogPages = ({ blogDetails }: any) => {
  const isAmp = true;
  const category = blogDetails?._embedded?.["wp:term"]?.flat()?.filter((d: any) => d.taxonomy === "category")?.[0];
  const featuredMedia = blogDetails?._embedded?.["wp:featuredmedia"]?.[0];
  const IMGDATA = featuredMedia?.media_details?.sizes?.medium_large || featuredMedia?.media_details?.sizes?.full;

  const imgData = {
    width: IMGDATA?.width || 768,
    height: IMGDATA?.height || 432,
    src: IMGDATA?.source_url || "",
    alt: featuredMedia?.alt_text,
    title: featuredMedia?.title?.rendered,
  };

  const subdomain = GBC_ENV.NEXT_PUBLIC_AMP_ANALYTICS_SUBDOMAIN;
  const canonicalURL = `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}${blogDetails.short_link}`;
  const iframeMessage = `https://${subdomain}/amp-adobe.html?pageURL=${encodeURIComponent(canonicalURL)}`;

  return (
    <React.Fragment>
      <BlogDetailHead seoTags={blogDetails?.seo_tags} slug={blogDetails?.slug} isAmp={true} />
      <BlogSchema blogDetails={blogDetails} />
      <BreadcrumbSchema slug={blogDetails.slug} />
      <amp-analytics type="adobeanalytics_nativeConfig">
        <script
          type="application/json"
          dangerouslySetInnerHTML={{
            __html: `
                    {
                      "requests": {
                      "iframeMessage": "${iframeMessage}"
                    },
                    "extraUrlParams": {
                        "pageLocation": "article ampstory page",
                        "pageName": "mobile website|article ampstory|detail page",
                        "newPageName": "article ampstory page",
                        "newAssetType": "article ampstory page",
                        "assetType": "article ampstory page",
                        "subSection": "article ampstory detail page"
                    }
                  }
                `,
          }}
        />
      </amp-analytics>

      <main className="min-h-screen bg-white">
        <div className="px-4">
          <div className="flex bg-white w-full pb-2 pt-4">
            <div className="flex text-xs items-center w-11/12" role="list">
              <Link href="/" role="listitem" aria-label="home">
                HOME
              </Link>
              &nbsp;/&nbsp;
              <Link
                href={SHOP.IS_MYGLAMM ? "/glammstudio" : "/blog"}
                className="uppercase"
                role="listitem"
                aria-label={SHOP.IS_MYGLAMM ? "glammstudio" : "blog"}
              >
                {SHOP.IS_MYGLAMM ? "glammstudio" : "blog"}
              </Link>
              &nbsp;/&nbsp;
              <Link
                href={`${SHOP.IS_MYGLAMM ? "/glammstudio" : "/blog"}/${category?.slug}`}
                className="uppercase truncate"
                role="listitem"
                aria-label={`${category?.slug}`}
              >
                {`${category?.name}`}
              </Link>
            </div>
          </div>
          <h1 className="text-xl leading-tight pb-4">{parse(blogDetails?.title?.rendered)}</h1>
          <div className="flex bg-white pb-3 text-xs w-full items-center justify-between text-gray-600">
            <div>{format(new Date(blogDetails?.date), DATEFORMAT)}</div>
          </div>
        </div>
        {/* Header & Title */}
        {isAmp && (
          <div className="pb-2 i-amphtml-sizer-intrinsic">
            <amp-img data-hero src={imgData?.src} alt={imgData?.alt} width="768" height="432" layout="responsive" />
          </div>
        )}

        {/* HTML Content  */}
        <div className="bg-white">
          <BlogStyles />
          <div className="w-full p-4 pt-0 text-sm prose-sm Blogs storyContent" suppressHydrationWarning>
            {handleStoryHTML(blogDetails?.content?.rendered, true)}
          </div>
        </div>

        {SHOP.SITE_CODE === "stb" ? <STBFooter /> : <Footer />}
      </main>
    </React.Fragment>
  );
};

BlogPages.getLayout = (children: ReactElement) => <AMPLayout>{children}</AMPLayout>;

BlogPages.getInitialProps = async (ctx: any) => {
  const { slug } = ctx.query;
  try {
    const wpArticleApi = new WpArticleApi();
    const blogDetailsResponse: any = await wpArticleApi.getPostByPostSlug(slug);
    if (!blogDetailsResponse?.data?.length) {
      logURI(ctx.asPath);
      if (ctx.res) {
        ctx.res.statusCode = 404;
        return ctx.res.end("Not Found");
      }
      return {
        errorCode: 404,
      };
    }

    return {
      blogDetails: blogDetailsResponse?.data?.[0],
    };
  } catch (error: any) {
    logURI(ctx.asPath);
    if (ctx.res) {
      ctx.res.statusCode = 500;
      return ctx.res.end("Server Error");
    }

    return {
      errorCode: 404,
    };
  }
};

export default BlogPages;
