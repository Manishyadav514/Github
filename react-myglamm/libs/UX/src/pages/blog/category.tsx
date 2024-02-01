import React, { useState, useEffect } from "react";
import Link from "next/link";
import parse from "html-react-parser";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import BlogCategoryHead from "@libComponents/BlogsWP/Head/BlogCategoryHead";
import { NextImage } from "@libComponents/NextImage";

import { ADOBE } from "@libConstants/Analytics.constant";

import useTranslation from "@libHooks/useTranslation";

import { BlogListLimitCSR, categoryPageLoadAdobeCall } from "@libUtils/BlogUtils";
import Ripples from "@libUtils/Ripples";

import WpArticleApi from "@libAPI/apis/WpArticleApi";

import { check_webp_feature } from "@libUtils/webp";

const CategoryListing = ({ blogList: tempBlogList, category, slug }: any) => {
  const [blogList, setBlogList] = useState(tempBlogList);
  const [pageNo, setPageNo] = useState(1);
  const [disableImageComponent, setDisableImageComponent] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    categoryPageLoadAdobeCall(category?.name, ADOBE.PLATFORM);
  }, []);

  const loadNextData = async () => {
    try {
      const wpArticleApi = new WpArticleApi();
      const blogListResponse: any = await wpArticleApi.getPostsByCategorySlug(slug, pageNo + 1, BlogListLimitCSR);
      setPageNo(no => no + 1);
      setBlogList((dataTemp: any) => [...dataTemp, ...blogListResponse?.data]);
    } catch (error: any) {
      //
    }
  };

  useEffect(() => {
    if (blogList?.length) {
      const id = blogList.length >= 2 ? blogList[blogList.length - 2].id : blogList[blogList.length - 1].id;

      const elem: HTMLElement | null = document.getElementById(id);
      if (elem) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              loadNextData();
              observer.unobserve(elem);
            }
          },
          {
            threshold: 0,
          }
        );

        if (elem) {
          observer.observe(elem);
        }

        return () => {
          observer.unobserve(elem);
        };
      }
    }
    return () => {
      // no-op
    };
  }, [blogList]);

  useEffect(() => {
    check_webp_feature("lossy", (_: any, result: boolean) => {
      if (!result) {
        // only change set if webp is not supported to prevent component re-render
        setDisableImageComponent(true);
      }
    });
  }, []);

  return (
    <React.Fragment>
      <BlogCategoryHead seoTags={category?.seo_tags} slug={category.slug} />
      <main>
        <div className="flex justify-center items-center px-2 py-4">
          <h1 className="text-2xl uppercase leading-tight">{category?.name}</h1>
        </div>
        {blogList.map((blog: any) => {
          return (
            <div>
              <div className="bg-white p-4" id={blog.id}>
                <Ripples>
                  <Link href={`/blog/${blog.slug}`}>
                    <div>
                      {!disableImageComponent ? (
                        <NextImage
                          priority
                          width={768}
                          height={432}
                          src={blog?._embedded?.["wp:featuredmedia"]?.[0].media_details?.sizes?.medium?.source_url}
                          alt={blog?._embedded?.["wp:featuredmedia"]?.[0]?.alt_text}
                          objectFit="contain"
                        />
                      ) : (
                        <ImageComponent
                          src={blog?._embedded?.["wp:featuredmedia"]?.[0].media_details?.sizes?.medium?.source_url}
                          alt={blog?._embedded?.["wp:featuredmedia"]?.[0]?.alt_text}
                          style={{
                            objectFit: "contain",
                          }}
                        />
                      )}
                      <h2 className="text-lg font-semibold px-2 mt-5 leading-tight capitalize">
                        {parse(blog?.title?.rendered)}
                      </h2>
                      <a className="flex justify-end items-center px-2 my-6 text-color1">{t("readMore")}</a>
                    </div>
                  </Link>
                </Ripples>
              </div>
            </div>
          );
        })}
      </main>
    </React.Fragment>
  );
};

export default CategoryListing;
