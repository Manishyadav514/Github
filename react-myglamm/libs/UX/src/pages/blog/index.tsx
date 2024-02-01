import React, { useEffect } from "react";
import Link from "next/link";
import useTranslation from "@libHooks/useTranslation";
import { ErrorBoundary } from "react-error-boundary";
import Image from "next/image";
import parse from "html-react-parser";

import BlogLandingHead from "@libComponents/BlogsWP/Head/BlogLandingHead";
import ErrorFallback from "@libComponents/ErrorBoundary/ErrorFallBack";
import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";

import { ADOBE } from "@libConstants/Analytics.constant";
import { SHOP } from "@libConstants/SHOP.constant";

import { blogPageLoadAdobeCall, blogLandingGetInitialProps } from "@libUtils/BlogUtils";

const Blog = ({ categoryBlogs }: any) => {
  const { t } = useTranslation();

  useEffect(() => {
    blogPageLoadAdobeCall(ADOBE.PLATFORM);
  }, []);

  return (
    <React.Fragment>
      <BlogLandingHead />
      <main>
        <div className="w-full sticky flex pl-3 py-3 overflow-x-auto flex-no-wrap z-20 bg-themeGray top-12">
          {categoryBlogs?.map((categoryBlog: any, categoryBlogIndex: number) => {
            const name = categoryBlog.category.name;
            const slug = categoryBlog.category.slug;
            return (
              <Link href={`/${SHOP.SITE_CODE === "mgp" ? "glammstudio" : "blog"}/${slug}`} key={name}>
                <button
                  type="button"
                  className={`px-5 py-2 text-s mr-3 rounded-full text-center border border-color1 bg-white text-color1 capitalize w-max `}
                  id={`headercategory_${categoryBlogIndex}`}
                >
                  {name?.toLowerCase()}
                </button>
              </Link>
            );
          })}
        </div>

        <div>
          <div
            className="relative demo"
            style={{
              backgroundImage: `url(https://files.stbotanica.com/site-images/original/Blog-Banner-.png)`,
              backgroundSize: "100% auto",
              backgroundColor: "#FCEEEE",
              backgroundRepeat: "no-repeat",
              boxSizing: "border-box",
              maxWidth: "100%",
              height: "390px",
              width: "100%",
            }}
          >
            <div
              className="relative z-10"
              style={{
                top: "70%",
              }}
            >
              <h2 className="text-xl font-semibold text-center uppercase tracking-widest text-white">Blog Posts</h2>

              <div className="flex justify-center">
                <Link
                  href={`/blog`}
                  className="text-base text-center text-white font-semibold tracking-wider border-b border-white py-1 w-1/4"
                  aria-label={t("readMore")}
                >
                  {t("readMore")}
                </Link>
              </div>
            </div>
            <div className="absolute bg-black right-0 top-0 bottom-0 left-0 opacity-50" />
          </div>
        </div>

        {/* Blog Slider */}
        {categoryBlogs?.map((categoryBlog: any, categoryBlogIndex: number) => {
          return (
            <ErrorBoundary FallbackComponent={ErrorFallback} key={categoryBlog.category.id}>
              <div className="bg-white">
                <div className="flex mt-1 pt-4 justify-between items-center border-b border-gray-400 pb-1">
                  <h2 className="text-lg font-semibold uppercase px-2 left-0 w-3/4" id={`category_${categoryBlogIndex}`}>
                    {categoryBlog.category.name}
                  </h2>
                  {/* <Ripples> */}
                  <Link
                    href={`${SHOP.IS_MYGLAMM ? "glammstudio" : "blog"}/${categoryBlog.category.slug}`}
                    className="text-sm font-semibold uppercase px-2 right-0"
                  >
                    {t("viewAll")?.toUpperCase()}
                  </Link>
                  {/* </Ripples> */}
                </div>

                {categoryBlog?.blogs?.length > 0 && (
                  <GoodGlammSlider slidesPerView={1.3}>
                    {categoryBlog?.blogs?.map((blog: any, blogIndex: number) => {
                      return (
                        <div key={blog.id}>
                          <Link href={SHOP.IS_MYGLAMM ? `/glammstudio/${blog.slug}` : `/blog/${blog.slug}`}>
                            <div className="py-2 pl-2 -pr-1 w-full h-40 relative">
                              <Image
                                src={blog?._embedded?.["wp:featuredmedia"]?.[0]?.source_url}
                                alt={blog?._embedded?.["wp:featuredmedia"]?.[0]?.alt_text}
                                priority={categoryBlogIndex < 3 && blogIndex < 3}
                                className="relative  p-1 "
                                fill
                              />
                            </div>

                            <p className="pl-2 pr-1 my-1 mb-3 line-clamp-2 h-11">{parse(blog?.title?.rendered)}</p>
                          </Link>
                        </div>
                      );
                    })}
                  </GoodGlammSlider>
                )}
              </div>
            </ErrorBoundary>
          );
        })}
      </main>
    </React.Fragment>
  );
};

Blog.getInitialProps = blogLandingGetInitialProps;

export default Blog;
