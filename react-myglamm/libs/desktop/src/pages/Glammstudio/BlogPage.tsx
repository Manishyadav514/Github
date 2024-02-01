import React, { useEffect, useState } from "react";

import BlogsHead from "@libComponents/Blogs/BlogsHead";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import CustomNextImage from "@libComponents/CustomNextImage";

import { getImage } from "@libUtils/homeUtils";
import { check_webp_feature } from "@libUtils/webp";
import { showSuccess } from "@libUtils/showToaster";

import useTranslation from "@libHooks/useTranslation";

import { BLOG_SHARE, BLOG_TYPE } from "@libConstants/BLOGS.constant";

import Breadcrumbs from "../../Components/breadcrumb";
import BlogContent from "../../Components/blogs/blogContent";
import { SHOP } from "@libConstants/SHOP.constant";

const BlogPage = ({ products, productRelationalData, content, header, categorySlug }: any) => {
  const { t } = useTranslation();

  const { name, shortDescription, longDescription } = content?.cms[0]?.content || {};

  const image = content?.assets?.find((a: any) => a.type === "image");
  const video = content?.assets?.find((a: any) => a.type === "video");
  const shortUrl = encodeURIComponent(content?.urlShortner?.shortUrl);

  const [disableImageComponent, setDisableImageComponent] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content?.urlShortner?.shortUrl);
    showSuccess(t("linkCopied") || "Link Copied");
  };

  useEffect(() => {
    check_webp_feature("lossy", (_: any, result: boolean) => {
      if (!result) {
        // only change set if webp is not supported to prevent component re-render

        setDisableImageComponent(true);
      }
    });
  }, []);

  return (
    <main className="bg-white">
      <BlogsHead products={products} content={content} header={header} category={categorySlug} />

      <Breadcrumbs
        navData={[{ name: BLOG_TYPE, slug: `/${BLOG_TYPE}` }, ...content.navigation?.slice(1, content.navigation?.length - 1)]}
      />

      <div className="max-w-screen-xl mx-auto px-16">
        <h1 className="font-bold text-3xl text-center pt-10 pb-6">{name}</h1>

        <div className="flex justify-between">
          <section className="w-2/3 px-8">
            {image ? (
              <>
                {!disableImageComponent ? (
                  <CustomNextImage
                    priority
                    width={768}
                    height={432}
                    src={image?.imageUrl["768x432"]}
                    alt={image?.properties?.altText || image?.name}
                  />
                ) : (
                  <ImageComponent forceLoad src={image?.imageUrl["768x432"]} alt={image?.properties?.altText || image?.name} />
                )}
              </>
            ) : (
              <iframe
                title={video?.name || ""}
                className="w-full aspect-video"
                src={`https://www.youtube.com/embed/${video?.properties?.videoId}`}
              />
            )}

            <BlogContent
              blog={content}
              header={header}
              description={longDescription}
              relationalData={productRelationalData}
              editorData={content?.editorData?.cms[0]}
            />
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
                      href={share.shareUrl
                        .replace("{name}", name)
                        .replace("{shortUrl}", shortUrl)
                        .replace("{shortDescription}", shortDescription)
                        .replace("{image}", getImage(content, "768x432") || SHOP.LOGO)}
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
