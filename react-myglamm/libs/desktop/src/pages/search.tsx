import React, { useState } from "react";

import Link from "next/link";
import { NextPageContext } from "next";

import useTranslation from "@libHooks/useTranslation";
import { useInfiniteScrollGA4Event } from "@libHooks/useInfiniteScrollGA4Event";

import { getImage, getSearchData } from "@libUtils/homeUtils";

import { patchCollectionProductRes } from "@PLPLib/collection/patchProductRes";

import { ProductData } from "@typesLib/PDP";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";

import Breadcrumbs from "../Components/breadcrumb";
import ProductTile from "../Components/PLP/ProductTile";

const Search = ({ searchData, q }: { searchData: any; q: string }) => {
  const { t } = useTranslation();

  const { PRODUCTS, BLOGS, LOOKS } = searchData;

  const [loading, setLoading] = useState(false);
  const [searchProducts, setSearchProducts] = useState<ProductData[]>(PRODUCTS?.data || []);

  const getMoreProducts = async () => {
    setLoading(true);
    const { PRODUCTS: products } = await getSearchData(q, 10, searchProducts.length);

    setLoading(false);
    setSearchProducts([...searchProducts, ...(products?.data || [])]);
  };

  useInfiniteScrollGA4Event(
    searchProducts.filter(p => !!p.sku) // skip widgets
  );

  return (
    <main className="bg-white">
      <div className="max-w-screen-xl mx-auto">
        <Breadcrumbs navData={[{ name: t("search") || "search" }]} />

        <p className="py-8 border-b border-gray-300 text-xl text-center">
          {t("showing")} {(PRODUCTS?.count || 0) + (BLOGS?.count || 0) + (LOOKS?.count || 0)} {t("resultsFor")} “
          <span>{q}</span>”
        </p>

        {searchProducts.length > 0 && (
          <section className="pb-6">
            <h2 className="font-bold text-2xl py-6 uppercase text-center">
              {t("products") || "products"} ({PRODUCTS?.count})
            </h2>

            <div className="grid grid-cols-3 gap-8 px-20">
              {searchProducts.map((product: any) => (
                <ProductTile key={(product as any).id} product={patchCollectionProductRes(product)} />
              ))}
            </div>

            <div className="w-full flex justify-center py-5">
              {searchProducts.length < PRODUCTS?.count && (
                <button
                  type="button"
                  disabled={loading}
                  onClick={getMoreProducts}
                  className="border border-black rounded-sm text-13 font-bold uppercase tracking-wide h-14 px-20 mx-auto relative"
                >
                  {loading && <LoadSpinner className="h-10 inset-0 m-auto absolute" />}
                  {t("showMore")}
                </button>
              )}
            </div>
          </section>
        )}

        {LOOKS?.data?.length > 0 && (
          <section className="pb-6 px-10">
            <h2 className="font-bold text-2xl py-6 uppercase text-center">
              {t("looks") || "looks"} ({LOOKS?.count})
            </h2>

            <GoodGlammSlider slidesPerView={3} slidesToScroll={3} arrowClass={{ left: "-left-10", right: "-right-10" }}>
              {LOOKS?.data.map((look: any) => (
                <Link href={look.urlManager.url} className="flex flex-col items-center px-10">
                  <ImageComponent src={getImage(look, "400x400")} alt={look.cms[0].content?.name} className="rounded-sm" />

                  <p className="text-center pt-4 pb-1">{look.cms?.[0]?.content?.name}</p>
                </Link>
              ))}
            </GoodGlammSlider>
          </section>
        )}

        {BLOGS?.data?.length > 0 && (
          <section className="pb-6 px-10">
            <h2 className="font-bold text-2xl py-6 uppercase text-center">
              {t("tutorialAndBlogs") || "tutorial and blogs"} ({BLOGS?.count})
            </h2>

            <GoodGlammSlider slidesPerView={3} slidesToScroll={3} arrowClass={{ left: "-left-10", right: "-right-10" }}>
              {BLOGS?.data.map((blog: any) => (
                <Link href={blog.urlManager.url} className="flex flex-col items-center px-8">
                  <ImageComponent
                    className="rounded-sm object-cover"
                    alt={blog.cms[0].content?.name}
                    src={
                      blog?.assets[blog?.assets.findIndex((x: any) => x.type === "image")]?.url ||
                      blog?.assets[blog?.assets.findIndex((x: any) => x.type === "video")]?.properties.thumbnailUrl
                    }
                  />

                  <figcaption className="text-center p-4 pt-2 shadow-shadowCmn mb-1">
                    <p className="h-12 line-clamp-2">{blog.cms[0].content?.name}</p>
                  </figcaption>
                </Link>
              ))}
            </GoodGlammSlider>
          </section>
        )}
      </div>
    </main>
  );
};

Search.getInitialProps = async (ctx: NextPageContext) => {
  const { q } = ctx.query;

  if (!q) {
    return ctx.res?.writeHead(302, { Location: "/" }).end();
  }

  const searchData = await getSearchData(q as string, 10);

  return { searchData, q };
};

export default Search;
