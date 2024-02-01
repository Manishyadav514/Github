import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import Link from "next/link";
import Script from "next/script";

import { NextImage } from "@libComponents/NextImage";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import BlogStyles from "@libComponents/BlogsWP/BlogStyles/BlogWebStyles";
import BreadcrumbSchema from "@libComponents/BlogsWP/Schema/BreadcrumbSchema";
import BlogDetailHead from "@libComponents/BlogsWP/Head/BlogDetailHead";
import BlogSchema from "@libComponents/BlogsWP/Schema/BlogSchema";

import { check_webp_feature } from "@libUtils/webp";
import { showSuccess } from "@libUtils/showToaster";
import { convertHTMLToStr, blogDetailPageLoadAdobeCall } from "@libUtils/BlogUtils";

import useTranslation from "@libHooks/useTranslation";
import useAddToBag from "@libHooks/useAddToBag";

import { BLOG_SHARE } from "@libConstants/BLOGS.constant";
import { ADOBE } from "@libConstants/Analytics.constant";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

import { SET_MINI_CART_MODAL } from "@libStore/valtio/MODALS.store";

const BlogPage = ({ blogDetails }: any) => {
  const { t } = useTranslation();

  const category = blogDetails?._embedded?.["wp:term"]?.flat()?.filter((d: any) => d.taxonomy === "category")?.[0];
  const shortUrl = blogDetails?.short_link;
  const featuredMedia = blogDetails?._embedded?.["wp:featuredmedia"]?.[0];
  const IMGDATA = featuredMedia?.media_details?.sizes?.medium_large || featuredMedia?.media_details?.sizes?.full;
  const { addProductToCart } = useAddToBag();

  const [disableImageComponent, setDisableImageComponent] = useState(false);
  const hasReddit =
    blogDetails?.content?.rendered?.includes("reddit-card") ||
    blogDetails?.content?.rendered?.includes("reddit-embed") ||
    blogDetails?.content?.rendered?.includes("reddit-embed-bq");

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    showSuccess(t("linkCopied") || "Link Copied");
  };

  useEffect(() => {
    check_webp_feature("lossy", (_: any, result: boolean) => {
      if (!result) {
        setDisableImageComponent(true);
      }
    });
  }, []);

  const addToBagUsingSKU = (sku: any) => {
    addProductToCart(sku).then(result => {
      if (result) {
        SET_MINI_CART_MODAL({ show: true });
      }
    });
  };

  const addToBagEventHandlers = () => {
    const buyButtons = document.querySelectorAll(".buyButton");
    if (buyButtons?.length) {
      buyButtons.forEach((ele: any) => {
        /* EventListeners only for active brand products */
        const baseUrl: string = GBC_ENV.NEXT_PUBLIC_BASE_URL as string;
        if (ele.closest("a")?.href?.includes(baseUrl)) {
          ele.addEventListener("click", async (e: any) => {
            const { sku } = ele.dataset || {};
            if (sku) {
              e.preventDefault();
              await addToBagUsingSKU(sku);
            }
          });
        }
      });
    }
  };

  useEffect(() => {
    addToBagEventHandlers();
    blogDetailPageLoadAdobeCall(blogDetails?.title?.rendered, category?.name, ADOBE.DESKTOP_PLATFORM);
    // @ts-ignore
    window.twttr?.widgets?.load(document.querySelector(".storyContent"));
    // @ts-ignore
    window.instgrm?.Embeds?.process();
  }, []);

  return (
    <main className="bg-white">
      <BlogDetailHead seoTags={blogDetails?.seo_tags} slug={blogDetails?.slug} />
      <BlogSchema blogDetails={blogDetails} />

      {hasReddit && <Script src="https://www.redditstatic.com/comment-embed.js" />}
      {blogDetails?.content?.rendered?.includes("twitter-tweet") && <Script src="https://platform.twitter.com/widgets.js" />}
      {blogDetails?.content?.rendered?.includes("instagram-media") && (
        <Script src="https://platform.instagram.com/en_US/embeds.js" />
      )}

      <div className="uppercase py-3 border-b border-gray-300 text-xs flex items-center justify-center rounded tracking-widest">
        <BreadcrumbSchema slug={blogDetails?.slug} />
        <Link href="/">{t("home")}</Link>
        <>
          <p className="px-2 text-gray-300 font-bold">/</p>
          <Link href="/blog">blog</Link>
        </>
        {category?.name ? (
          <>
            <p className="px-2 text-gray-300 font-bold">/</p>
            <Link href={`/blog/${category?.slug}`}>{category?.name}</Link>
          </>
        ) : null}
      </div>
      <div className="max-w-screen-xl mx-auto px-16">
        <h1 className="font-bold text-3xl text-center pt-10 pb-6">{parse(blogDetails?.title?.rendered)}</h1>

        <div className="flex justify-between">
          <section className="w-2/3 px-8">
            {!disableImageComponent ? (
              <NextImage priority width={768} height={432} src={IMGDATA?.source_url} alt={featuredMedia?.alt_text} />
            ) : (
              <ImageComponent forceLoad src={IMGDATA?.source_url} alt={featuredMedia?.alt_text} />
            )}

            <BlogStyles />
            <div className="text-sm w-full p-2 box storyContent">{parse(blogDetails?.content?.rendered)}</div>
          </section>

          <section className="w-1/3 pl-8 pr-4 pt-8">
            <h4 className="uppercase py-1 border-b border-gray-300 font-bold tracking-wide">{t("share")}</h4>

            <ul className="list-none flex items-center pt-8">
              {BLOG_SHARE.map(share => (
                <li key={share.label} style={{ backgroundColor: share.bgColor }} className="rounded-sm h-14 w-14 mr-3 flex">
                  {share.shareUrl ? (
                    <a
                      className="w-full h-full flex items-center justify-center"
                      title={share.label}
                      href={
                        share.shareUrl
                          .replace("{name}", convertHTMLToStr(blogDetails?.title?.rendered))
                          .replace("{shortUrl}", shortUrl)
                        // .replace("{shortDescription}", shortDescription)
                        // .replace("{image}", getImage(content, "768x432") || SHOP.LOGO)
                      }
                    >
                      <img src={share.icon} alt={share.label} className="h-8" />
                    </a>
                  ) : (
                    <button type="button" className="w-full h-full flex justify-center items-center" onClick={handleCopy}>
                      <img src={share.icon} alt={share.label} className="h-8" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
};

export default BlogPage;
