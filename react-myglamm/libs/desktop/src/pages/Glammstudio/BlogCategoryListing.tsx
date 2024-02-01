import React, { useEffect, useState } from "react";

import Link from "next/link";
import { useInView } from "react-intersection-observer";

import PageAPI from "@libAPI/apis/PageAPI";

import { SHOP } from "@libConstants/SHOP.constant";

import useTranslation from "@libHooks/useTranslation";
import useEffectAfterRender from "@libHooks/useEffectAfterRender";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import BlogCategoryHead from "@libComponents/Blogs/BlogCategoryHead";

const BlogCategoryListing = ({ blog, errorCode, header, metaData }: any) => {
  console.log({ blog, errorCode, header, metaData });
  const { t } = useTranslation();
  const { ref, inView } = useInView();

  const CATEGORIES = t("glammCategories");

  const [skip, setSkip] = useState(10);
  const [blogsData, setBlogsData] = useState(blog.data);

  const getMoreBlogs = () => {
    const pageApi = new PageAPI();

    pageApi
      .getPage(skip, { categoryId: blogsData[0].categoryId })
      .then(({ data: res }) => setBlogsData([...blogsData, ...(res.data.data || [])]))
      .catch(error => error);

    setSkip(skip + 10);
  };

  useEffectAfterRender(() => {
    setBlogsData(blog.data);
  }, [header]);

  /* Pagination Logic */
  useEffect(() => {
    if (inView && skip < blog?.count) {
      getMoreBlogs();
    }
  }, [inView]);

  return (
    <main className="bg-white">
      <BlogCategoryHead header={header} metaData={metaData} />

      <div className="mx-auto max-w-screen-xl px-12">
        <h1 className="text-4xl text-center py-3 border-b border-gray-300">{header}</h1>

        <div className="flex justify-between">
          <section className="w-2/3 px-6 pt-6">
            {blogsData.map((blog: any, index: number) => {
              const { name, shortDescription } = blog?.cms[0]?.content || {};

              return (
                <Link
                  href={blog?.urlShortner?.slug}
                  className="p-7 pb-5 mb-4 block"
                  ref={index === blogsData?.length - 4 ? ref : null}
                  style={{ boxShadow: "0 0 4px 0 rgba(0,0,0,.2)" }}
                >
                  {blog.assets[0]?.type === "video" ? (
                    <iframe
                      allowFullScreen
                      className="w-full aspect-video"
                      src={`https://www.youtube.com/embed/${blog.assets[0]?.properties.videoId}`}
                    />
                  ) : (
                    <ImageComponent src={blog.assets[0]?.imageUrl["768x432"]} alt={name} />
                  )}

                  <h3 className="font-bold text-2xl pt-6 pb-4">{name}</h3>
                  <p>{shortDescription}</p>

                  <p className="font-bold capitalize text-right">{t("readMore")}</p>
                </Link>
              );
            })}
          </section>

          {CATEGORIES?.length > 0 && (
            <section className="w-1/3 pl-8 pr-4 pt-4">
              <p className="font-bold pb-2 tracking-wide my-8 border-b border-gray-300 uppercase">
                {t("category") || "Category"}
              </p>

              <ul className="list-none">
                {CATEGORIES.map((cat: string) => (
                  <li className={header.toLowerCase() === cat.toLowerCase() ? "text-themeGolden" : ""}>
                    <Link
                      className="mb-4 text-18 flex"
                      href={`/${SHOP.IS_MYGLAMM ? "glammstudio" : "blog"}/${cat.toLowerCase().replace(" ", "-")}`}
                    >
                      {cat}
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
