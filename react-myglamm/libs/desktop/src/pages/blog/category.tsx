import React, { useEffect, useState } from "react";
import Link from "next/link";
import parse from "html-react-parser";

import WpArticleApi from "@libAPI/apis/WpArticleApi";

import { ADOBE } from "@libConstants/Analytics.constant";

import { BlogListDesktopLimitCSR, categoryPageLoadAdobeCall } from "@libUtils/BlogUtils";

import useTranslation from "@libHooks/useTranslation";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import BlogCategoryHead from "@libComponents/BlogsWP/Head/BlogCategoryHead";

const BlogCategoryListing = ({ slug, blogList: tempBlogList, category, categoriesList }: any) => {
  const { t } = useTranslation();

  const [blogList, setBlogList] = useState(tempBlogList);
  const [pageNo, setPageNo] = useState(1);

  useEffect(() => {
    setBlogList(tempBlogList);
  }, [tempBlogList]);

  const loadNextData = async () => {
    try {
      const wpArticleApi = new WpArticleApi();
      const blogListResponse: any = await wpArticleApi.getPostsByCategorySlug(slug, pageNo + 1, BlogListDesktopLimitCSR);
      setPageNo(no => no + 1);
      setBlogList((dataTemp: any) => [...dataTemp, ...blogListResponse?.data]);
    } catch (error: any) {
      //
    }
  };

  useEffect(() => {
    if (blogList?.length) {
      const id = blogList?.[blogList.length - 1]?.id;
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
    categoryPageLoadAdobeCall(category?.name, ADOBE.DESKTOP_PLATFORM);
  }, []);

  return (
    <main className="bg-white">
      <BlogCategoryHead seoTags={category?.seo_tags} slug={category.slug} />
      <div className="mx-auto max-w-screen-xl px-12">
        <h1 className="text-4xl text-center py-3 border-b border-gray-300">{category.name}</h1>

        <div className="flex justify-between">
          <section className="w-2/3 px-6 pt-6">
            {blogList?.map((blog: any, blogIndex: number) => {
              const featuredMedia = blog?._embedded?.["wp:featuredmedia"]?.[0];
              const IMGDATA = featuredMedia?.media_details?.sizes?.medium_large || featuredMedia?.media_details?.sizes?.full;

              return (
                <Link
                  href={`/blog/${blog.slug}`}
                  className="p-7 pb-5 mb-4 block"
                  style={{ boxShadow: "0 0 4px 0 rgba(0,0,0,.2)" }}
                  id={blog.id}
                >
                  <ImageComponent src={IMGDATA?.source_url} alt={featuredMedia?.alt_text} />
                  <h2 className="font-bold text-2xl pt-6 pb-4">{parse(blog?.title?.rendered)}</h2>
                  <p className="font-bold capitalize text-right">{t("readMore")}</p>
                </Link>
              );
            })}
          </section>

          {categoriesList?.length > 0 && (
            <section className="w-1/3 pl-8 pr-4 pt-4">
              <p className="font-bold pb-2 tracking-wide my-8 border-b border-gray-300 uppercase">
                {t("category") || "Category"}
              </p>

              <ul className="list-none">
                {categoriesList.map((cat: any) => (
                  <li className={slug === cat.slug ? "text-themeGolden" : ""}>
                    <Link className="mb-4 text-18 flex" href={`/blog/${cat.slug}`}>
                      {cat.name.replace(/-/g, " ")}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </main>
  );
};

export default BlogCategoryListing;
