import React, { useState, useEffect } from "react";
import format from "date-fns/format";
import { useRouter } from "next/router";
import Link from "next/link";
import parse from "html-react-parser";
import Script from "next/script";

import BlogDetailHead from "@libComponents/BlogsWP/Head/BlogDetailHead";
import BreadcrumbSchema from "@libComponents/BlogsWP/Schema/BreadcrumbSchema";
import BlogShare from "@libComponents/Blogs/BlogShare";
import BlogSchema from "@libComponents/BlogsWP/Schema/BlogSchema";
import BlogStyles from "@libComponents/BlogsWP/BlogStyles/BlogMwebStyles";
import { NextImage } from "@libComponents/NextImage";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

import { check_webp_feature } from "@libUtils/webp";
import { convertHTMLToStr, blogDetailPageLoadAdobeCall, DATEFORMAT } from "@libUtils/BlogUtils";
import { showAddedToBagOrWishlist } from "@libUtils/showToaster";

import { SHOP } from "@libConstants/SHOP.constant";
import { ADOBE } from "@libConstants/Analytics.constant";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

import useAddtoBag from "@libHooks/useAddToBag";

function BlogPages(props: any) {
  const { blogDetails } = props;

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

  const router = useRouter();

  const { addProductToCart } = useAddtoBag();

  const [disableImageComponent, setDisableImageComponent] = useState(false);
  const hasReddit =
    blogDetails?.content?.rendered?.includes("reddit-card") ||
    blogDetails?.content?.rendered?.includes("reddit-embed") ||
    blogDetails?.content?.rendered?.includes("reddit-embed-bq");

  const addToBagEventHandlers = () => {
    const buyButtons = document.querySelectorAll(".buyButton");
    if (buyButtons?.length) {
      buyButtons.forEach((ele: any) => {
        /* EventListeners only for active brand products */
        const baseUrl: string = GBC_ENV.NEXT_PUBLIC_BASE_URL as string;
        if (ele.closest("a")?.href?.includes(baseUrl)) {
          ele.addEventListener("click", (e: any) => {
            const { sku } = ele.dataset || {};
            if (sku) {
              e.preventDefault();
              addProductToCart(sku).then(() => {
                showAddedToBagOrWishlist("Added To Cart", 2500);
              });
            }
          });
        }
      });
    }
  };

  useEffect(() => {
    addToBagEventHandlers();
    blogDetailPageLoadAdobeCall(blogDetails?.title?.rendered, category?.name, ADOBE.PLATFORM);
    check_webp_feature("lossy", (_: any, result: boolean) => {
      if (!result) {
        // only change set if webp is not supported to prevent component re-render
        setDisableImageComponent(true);
      }
    });
  }, []);

  return (
    <>
      <BlogDetailHead seoTags={blogDetails?.seo_tags} slug={blogDetails?.slug} />
      <BlogSchema blogDetails={blogDetails} />
      {hasReddit && <Script src="https://www.redditstatic.com/comment-embed.js" />}
      {blogDetails?.content?.rendered?.includes("twitter-tweet") && <Script src="https://platform.twitter.com/widgets.js" />}
      {blogDetails?.content?.rendered?.includes("instagram-media") && (
        <Script src="https://platform.instagram.com/en_US/embeds.js" />
      )}
      <main>
        <BreadcrumbSchema slug={blogDetails.slug} />
        <div className="flex bg-white px-3 pt-3 w-full">
          <div className="flex text-xs items-center w-11/12" role="list">
            <Link href="/" role="listitem">
              HOME
            </Link>
            &nbsp;/&nbsp;
            <Link href={SHOP.IS_MYGLAMM ? "/glammstudio" : "/blog"} className="uppercase" role="listitem">
              {SHOP.IS_MYGLAMM ? "glammstudio" : "blog"}
            </Link>
            {category?.name ? (
              <>
                &nbsp;/&nbsp;
                <Link
                  href={`${SHOP.IS_MYGLAMM ? "/glammstudio" : "/blog"}/${category?.slug}`}
                  className="uppercase truncate"
                  role="listitem"
                >
                  {`${category?.name}`}
                </Link>
              </>
            ) : null}
          </div>
        </div>
        <div className="flex bg-white p-3 pb-1 w-full items-center justify-between">
          <h1 className="text-2xl font-bold leading-tight">{parse(blogDetails?.title?.rendered)}</h1>
        </div>
        <div className="flex bg-white px-3 pb-3 text-xs w-full items-center justify-between text-gray-600">
          <div>{format(new Date(blogDetails?.date), DATEFORMAT)}</div>
        </div>
        <div className="bg-white">
          <>
            {!disableImageComponent ? (
              <NextImage priority width={imgData.width} height={imgData.height} alt={imgData?.alt} src={imgData?.src} />
            ) : (
              <ImageComponent forceLoad width={imgData.width} height={imgData.height} alt={imgData?.alt} src={imgData?.src} />
            )}
          </>
        </div>
        <div className="bg-white">
          <BlogStyles />
          <div className="w-full p-4 pt-0 text-sm prose-sm Blogs storyContent" suppressHydrationWarning>
            {parse(blogDetails?.content?.rendered)}
          </div>
        </div>
        <BlogShare
          blogName={`${convertHTMLToStr(blogDetails?.title?.rendered).toLowerCase()}`}
          shortUrl={blogDetails.short_link}
          shortUrlSlug={`${router.asPath.split("?")[0]}`}
        />
      </main>
    </>
  );
}

export default BlogPages;
