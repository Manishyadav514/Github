import React, { useState, useEffect } from "react";
import format from "date-fns/format";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Axios from "axios";
import Link from "next/link";
import LazyHydrate from "react-lazy-hydration";

import BlogBody from "@libComponents/Blogs/BlogBody";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import AddToBagButton from "@libComponents/Buttons/AddToBagButton";

import { check_webp_feature } from "@libUtils/webp";

import CustomNextImage from "@libComponents/CustomNextImage";
import BlogFooter from "@libComponents/Blogs/BlogFooter";

import useTranslation from "@libHooks/useTranslation";

import { isWebview } from "@libUtils/isWebview";
import { decodeHtml } from "@libUtils/decodeHtml";

import ErrorComponent from "../_error";
import BlogShare from "@libComponents/Blogs/BlogShare";
import { SHOP } from "@libConstants/SHOP.constant";
import { formatPrice } from "@libUtils/format/formatPrice";
import { BASE_URL } from "@libConstants/COMMON.constant";

import BlogsHead from "@libComponents/Blogs/BlogsHead";

const DATEFORMAT = "do MMM, yyyy";

const LoginModal = dynamic(() => import(/* webpackChunkName: "LoginModal" */ "@libComponents/Auth/Login.Modal"), {
  ssr: false,
});

const HomeMiniPDPModal = dynamic(
  () => import(/* webpackChunkName: "HomeMiniPDPModal" */ "@libComponents/PopupModal/HomeMiniPDP"),
  { ssr: false }
);

const PDPFreeProductModal = dynamic(
  () => import(/* webpackChunkName: "FreeProductModal" */ "@libComponents/PopupModal/PDPFreeProductModal"),
  { ssr: false }
);

const VideoModal = dynamic(() => import(/* webpackChunkName: "VideoModal" */ "@libComponents/PopupModal/VideoModal"), {
  ssr: false,
});

// const BlogFooter = dynamic(() => import(/* webpackChunkName: "BlogFooter" */ "@libComponents/Blogs/BlogFooter"), { ssr: false });

function BlogPages(props: any) {
  const {
    products,
    productRelationalData,
    query,
    errorCode,
    content,
    header,
    recommendedListing,
    mostPopular,
    latestArticles,
    categorySlug,
  } = props;

  const description = decodeHtml(content?.cms[0]?.content?.longDescription, {
    stripSlash: true,
  });
  const editorData = content?.editorData?.cms[0];

  const router = useRouter();
  const { category, blogs } = query;

  const [loginModal, setLoginModal] = useState<boolean>(false);

  const image = content?.assets?.find((a: any) => a.type === "image");
  const video = content?.assets?.find((a: any) => a.type === "video");

  const { t } = useTranslation();

  const [videoUrl, setVideoUrl] = useState<any>();
  const [videoModal, setVideoModal] = useState(false);

  const academyMeta = router.asPath?.split("/")[3]?.replace(/-/g, " ");
  const [showMiniPDPModal, setShowMiniPDPModal] = useState(false);
  const [miniPDPFreeProduct, setMiniPDPFreeProduct] = useState<any>({});
  const [showPDPFreeProductModal, setShowPDPFreeProductModal] = useState(false);
  const [miniPDPProduct, setMiniPDPProduct] = useState<any>({});
  const [disableImageComponent, setDisableImageComponent] = useState(false);

  // miniPDPProductModal call method
  const callMiniPDP = (product: any) => {
    setMiniPDPProduct(product);
    setShowMiniPDPModal(true);
  };

  useEffect(() => {
    check_webp_feature("lossy", (_: any, result: boolean) => {
      if (!result) {
        // only change set if webp is not supported to prevent component re-render

        setDisableImageComponent(true);
      }
    });
  }, []);

  useEffect(() => {
    let listeners: NodeListOf<Element>;
    const videoListners: Array<Element | null> = [];

    const { nologin, request_source } = router.query;

    if (category === "myglamm-academy") {
      Axios.get(`/api/myglamm-academy-urls?course=${blogs}`).then(response => {
        const glammVideUrls = response.data.data;

        /**
         * Get HTML Elements for Share Icon and Banner
         */
        listeners = document.querySelectorAll(".ico-share, .share-acdemy");

        /**
         * Attach Click Event Listner on Element for Share and Earn Modal
         */
        if (isWebview()) {
          listeners.forEach(Element => {
            Element.setAttribute("style", "display:none");
          });
        } else {
          listeners.forEach(Element =>
            Element?.addEventListener("click", () => {
              const memberId = localStorage.getItem("memberId");
              if (!memberId) {
                setLoginModal(true);
              }
            })
          );
        }

        /**
         * Get all the Video Card Elements
         */
        glammVideUrls.forEach((data: any) => {
          videoListners.push(document.querySelector(data.name));
        });

        /**
         * Attach Click Event Listener to it for Video Modal
         */
        videoListners.forEach((Element, index) =>
          Element?.addEventListener("click", () => {
            const memberId = localStorage.getItem("memberId");
            if (!memberId && !nologin) {
              setLoginModal(true);
            } else {
              setVideoModal(true);
              setVideoUrl(glammVideUrls[index].url);
            }
          })
        );
      });
    }

    /**
     * Clean Up function on componentDidUnmount to remove all
     * Event listners
     */
    return () => {
      if (videoListners) {
        videoListners.forEach(Element =>
          Element?.removeEventListener("click", () => {
            setVideoModal(false);
            setVideoUrl(undefined);
            setLoginModal(false);
          })
        );
      }
    };
  }, []);

  /** Breadcrumb Schema */
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL(),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `${SHOP.IS_MYGLAMM ? "glammstudio" : "blog"}`,
        item: `${BASE_URL()}${SHOP.IS_MYGLAMM ? "/glammstudio" : "/blog"}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category,
        item: `${BASE_URL()}${SHOP.IS_MYGLAMM ? "/glammstudio" : "/blog"}/${category}`,
      },
    ],
  };

  if (errorCode) {
    return <ErrorComponent statusCode={errorCode} />;
  }

  return (
    <React.Fragment>
      <BlogsHead products={products} academyMeta={academyMeta} content={content} category={categorySlug} header={header} />

      <main className="min-h-screen">
        {/* Header & Title */}
        {category !== "myglamm-academy" && (
          <React.Fragment>
            <div className="flex bg-white px-3 pt-3 w-full">
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
                  href={`${SHOP.IS_MYGLAMM ? "/glammstudio" : "/blog"}/${categorySlug}`}
                  className="uppercase truncate"
                  role="listitem"
                  aria-label={`${header}`}
                >
                  {/* header is Category name & categorySlug is path */}
                  {`${header}`}
                </Link>
                {/* &nbsp;/&nbsp;
                <Link href={`/glammstudio/${category}/${blogs}`}>
                  <a className="uppercase truncate font-bold">{`${blogs}`}</a>
                </Link> */}
              </div>
            </div>
            <div className="flex bg-white p-3 pb-1 w-full items-center justify-between">
              <h1 className="text-2xl font-bold leading-tight">{content?.cms[0]?.content?.title}</h1>
            </div>
            {content?.publishDate ? (
              <div className="flex bg-white px-3 pb-3 text-xs w-full items-center justify-between text-gray-600">
                <div>{format(new Date(content?.publishDate), DATEFORMAT)}</div>
              </div>
            ) : null}

            <div className="bg-white">
              {image ? (
                <>
                  {!disableImageComponent ? (
                    <CustomNextImage
                      priority
                      width={768}
                      height={432}
                      alt={image?.properties?.altText || image?.name}
                      src={image?.imageUrl["768x432"]}
                    />
                  ) : (
                    <ImageComponent
                      forceLoad
                      alt={image?.properties?.altText || image?.name}
                      src={image?.imageUrl["768x432"]}
                    />
                  )}
                </>
              ) : (
                <iframe
                  title="videoId"
                  frameBorder="0"
                  className="w-full h-64"
                  src={`https://www.youtube.com/embed/${video?.properties?.videoId}`}
                />
              )}
            </div>
          </React.Fragment>
        )}

        {/* HTML Content  */}
        <BlogBody description={description} editorData={editorData || []} />
        <BlogShare
          blogName={content?.cms[0]?.content?.name}
          shortUrl={content?.urlShortner?.shortUrl}
          shortUrlSlug={content?.urlShortner?.slug}
        />

        <LazyHydrate whenVisible>
          <BlogFooter title="Recommended Articles" items={recommendedListing?.commonDetails?.descriptionData[0]?.value} />
        </LazyHydrate>

        <LazyHydrate whenVisible>
          <BlogFooter title="Most Popular" items={mostPopular?.commonDetails?.descriptionData[0]?.value} />
        </LazyHydrate>

        <LazyHydrate whenVisible>
          <BlogFooter title="Latest Articles" items={latestArticles?.commonDetails?.descriptionData[0]?.value} />
        </LazyHydrate>

        {/* Product List */}
        {products?.length > 0 && (
          <div className="bg-white mt-4">
            <div className="flex items-center justify-center">
              <h3 className="text-xl font-bold leading-tight tracking-none text-center my-4">{t("productsUsed")}</h3>
            </div>
            {products.map((product: any) => {
              const img = product.assets.find((a: any) => a.type === "image");
              return (
                <div key={product.id} className="m-2 py-2 bg-white">
                  <Link
                    href={product?.urlShortner?.slug}
                    className="flex h-32 p-3"
                    aria-label={product?.cms[0]?.content?.name || product.productTag}
                  >
                    <div className="w-1/4">
                      <ImageComponent
                        className="h-20"
                        style={{ maxHeight: "135px" }}
                        src={img?.imageUrl["400x400"]}
                        alt={img?.name}
                      />
                    </div>
                    <div className="w-3/4">
                      <h3 className="text-base font-medium leading-tight" style={{ padding: "0px 15px" }}>
                        {product?.cms[0]?.content?.name || product.productTag}
                      </h3>
                      {product.price > product.offerPrice ? (
                        <div className="flex w-full p-4">
                          <h1 className="font-bold text-sm mr-1">{formatPrice(product.offerPrice, true)}</h1>
                          <h1 className="font-bold text-xs line-through mt-0.5 text-gray-400">
                            {formatPrice(product.price, true)}
                          </h1>
                        </div>
                      ) : (
                        <div className="flex flex-start items-center w-full">
                          <h1 className="font-bold text-sm p-4">{formatPrice(product.offerPrice, true)}</h1>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div aria-hidden className="flex flex-col justify-center items-center">
                    <AddToBagButton
                      product={product}
                      relationalData={productRelationalData}
                      category={header?.toLowerCase() || ""}
                      name={content?.cms[0]?.content?.name?.toLowerCase() || ""}
                      callMiniPDP={callMiniPDP}
                      showMiniPDP
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <HomeMiniPDPModal
          show={showMiniPDPModal}
          onRequestClose={() => setShowMiniPDPModal(false)}
          product={miniPDPProduct}
          t={t}
          themeColor="#f88d8d" // f88d8d
          setMiniPDPFreeProduct={(freeProd: any) => {
            setMiniPDPFreeProduct(freeProd);
            setShowPDPFreeProductModal(true);
          }}
        />

        {showPDPFreeProductModal && miniPDPFreeProduct && (
          <PDPFreeProductModal
            show={showPDPFreeProductModal}
            hide={() => setShowPDPFreeProductModal(false)}
            freeProduct={miniPDPFreeProduct}
            product={{ id: miniPDPFreeProduct?.parentId || 0 }}
            t={t}
          />
        )}

        {/* Video Modal */}
        {category === "myglamm-academy" && (
          <React.Fragment>
            <VideoModal
              isOpen={videoModal}
              onRequestClose={() => {
                setVideoModal(!videoModal);
              }}
              videoId={videoUrl}
            />
            <LoginModal show={loginModal} onRequestClose={() => setLoginModal(false)} hasGuestCheckout={false} />
          </React.Fragment>
        )}
      </main>
    </React.Fragment>
  );
}

export default BlogPages;
