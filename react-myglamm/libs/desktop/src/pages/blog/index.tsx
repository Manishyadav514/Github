import React, { useEffect } from "react";
import Link from "next/link";
import parse from "html-react-parser";

import { ADOBE } from "@libConstants/Analytics.constant";

import useTranslation from "@libHooks/useTranslation";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import BlogLandingHead from "@libComponents/BlogsWP/Head/BlogLandingHead";

import { blogLandingGetInitialProps, blogPageLoadAdobeCall } from "@libUtils/BlogUtils";

import GoodGlammSlider from "../../Components/GoodGlammSlider";

const Glammstudio = ({ categoryBlogs }: { categoryBlogs: any }) => {
  const { t } = useTranslation();

  useEffect(() => {
    blogPageLoadAdobeCall(ADOBE.DESKTOP_PLATFORM);
  }, []);

  return (
    <main className="bg-white">
      <BlogLandingHead />
      <div className="mb-10">
        <div className="w-full block">
          <img src="https://files.stbotanica.com/site-images/original/stbotanica_1.jpg" alt="Blog" className="w-full" />
        </div>
      </div>

      <section className="max-w-screen-xl px-16 mx-auto">
        {categoryBlogs?.map((categoryBlog: any, categoryBlogINdex: number) => {
          if (categoryBlog?.blogs?.length) {
            return (
              <figure className="px-8">
                <div className="px-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-300 text-lg tracking-widest">
                    <h3 className="font-bold uppercase">{categoryBlog.category.name}</h3>

                    <Link className="hover:text-themeGolden" href={`/blog/${categoryBlog.category.slug}`}>
                      {t("viewAll")}
                    </Link>
                  </div>
                </div>

                <GoodGlammSlider slidesPerView={3} arrowClass={{ left: "-left-16", right: "-right-16" }}>
                  {categoryBlog?.blogs?.map((blog: any) => (
                    <Link href={`/blog/${blog.slug}`} className="p-3">
                      <ImageComponent
                        alt={blog?._embedded?.["wp:featuredmedia"]?.[0]?.alt_text}
                        className="w-full mx-auto max-h-48"
                        style={{ boxShadow: "0 8px 11px 0 rgba(0,0,0,.3)" }}
                        src={blog?._embedded?.["wp:featuredmedia"]?.[0]?.source_url}
                      />

                      <figcaption className="py-5">{parse(blog?.title?.rendered)}</figcaption>
                    </Link>
                  ))}
                </GoodGlammSlider>
              </figure>
            );
          }

          return null;
        })}
      </section>
    </main>
  );
};

Glammstudio.getInitialProps = blogLandingGetInitialProps;

export default Glammstudio;
