import React, { useState, useEffect } from "react";

import Link from "next/link";
import dynamic from "next/dynamic";
import { LazyLoadComponent } from "react-lazy-load-image-component";

import { NextImage } from "@libComponents/NextImage";
import { GiShareIco } from "@libComponents/GlammIcons";
import LooksHead from "@libComponents/Looks/LooksHead";
import ConfigText from "@libComponents/Common/ConfigText";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import AddToBagButton from "@libComponents/Buttons/AddToBagButton";
import RecommendedLooks from "@libComponents/Looks/RecommendedLooks";

import { decodeHtml } from "@libUtils/decodeHtml";
import { check_webp_feature } from "@libUtils/webp";
import { formatPrice } from "@libUtils/format/formatPrice";
import { getLooksInitialProps } from "@libUtils/looksUtils";

import { CONFIG_REDUCER } from "@libStore/valtio/REDUX.store";

import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

const ZoomModal = dynamic(() => import(/* webpackChunkName: "ZoomModal" */ "@libComponents/PopupModal/ZoomModal"), {
  ssr: false,
});

function LooksPage({ looks }: any) {
  const [looksData] = looks.data;
  const [zoomModal, setZoomModal] = useState<boolean>(false);
  const [disableImageComponent, setDisableImageComponent] = useState(false);

  const desc = decodeHtml(looksData.cms[0]?.content.shortDescription, {
    stripSlash: true,
  });

  const handleShareNEarn = () => {
    CONFIG_REDUCER.shareModalConfig = {
      shareUrl: looksData?.urlShortner?.shortUrl,
      productName: looksData?.cms[0]?.content?.name,
      slug: looksData?.urlShortner?.slug,
      module: "lookbook",
      image: looksData?.assets[0]?.url || DEFAULT_IMG_PATH(),
    };
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
    <React.Fragment>
      <LooksHead looks={looks} />

      <main className="bg-white">
        {/* FEATURED PRODUCT CARD */}
        <section className="featured-card relative">
          <a aria-hidden onClick={() => setZoomModal(true)} aria-label={looksData?.assets[0]?.name}>
            {!disableImageComponent ? (
              <NextImage priority width={800} height={800} src={looksData?.assets[0]?.url} alt={looksData?.assets[0]?.name} />
            ) : (
              <ImageComponent src={looksData?.assets[0]?.url} alt={looksData?.assets[0]?.name} />
            )}
          </a>
          <div className="p-5">
            <h1 className="text-base font-semibold mb-3">{looksData.cms[0]?.content?.name?.replace(/\\/g, "")}</h1>
            <h2 className="text-sm mt-8 mb-2 uppercase" style={{ color: "#9b9b9b" }}>
              {looks.relationalData.categoryId[looksData.categoryId].cms[0].content.name}
            </h2>
            <p
              style={{
                fontSize: "0.88rem",
                lineHeight: "1.64",
                color: "#1d1f24",
              }}
            >
              {desc?.substring(0, desc.length - 6)} ...
            </p>
          </div>

          <button type="button" className="w-full" onClick={handleShareNEarn}>
            <div
              style={{
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                borderTop: "1px solid #e9e9e9",
              }}
              className="flex justify-center items-center p-1 font-bold"
            >
              <GiShareIco name="share-ico" width="40px" height="40px" viewBox="-250 -115 1000 1000" />

              <span style={{ fontSize: "0.9rem", color: "rgb(33, 37, 41)" }}>
                <ConfigText configKey="shareEarn" className="uppercase pr-1" />
                <ConfigText configKey="freeMakeup" className="uppercase" />
              </span>
            </div>
          </button>
        </section>

        {/* PRODUCTS SECTION */}
        <section>
          <div className="p-5 text-center">
            <h1 style={{ fontSize: "1.2rem" }} className="text-center font-bold mt-8">
              <ConfigText configKey="makeupUsed" fallback="MAKEUP USED" />
            </h1>

            <p
              style={{
                fontSize: "1rem",
                color: "#9b9b9b",
              }}
            >
              <ConfigText configKey="looksPageText" />
            </p>
          </div>

          {/* PRODUCT CARDS WRAPPER */}
          <div className="p-3">
            {/* CARDS */}

            {Object.values(looks.relationalData.products).map((product: any) => {
              let imgLink = null;

              const whatIsIt = decodeHtml(product.cms[0]?.content?.whatIsIt, {
                stripSlash: true,
              });

              for (let i = 0; i < product.assets.length; i += 1) {
                if (product.assets[i].type === "image") {
                  imgLink = product.assets[i].imageUrl["200x200"];
                  break;
                }
              }

              return (
                <div
                  key={product.id}
                  style={{
                    minHeight: " 200px",
                    padding: "0.9rem",
                    boxShadow: "0 0 12px rgba(0, 0, 0, 0.2)",
                    background: "#fff",
                    marginBottom: "0.5rem",
                  }}
                  className="p-2 flex flex-col justify-between"
                >
                  <Link
                    href={product.urlManager.url}
                    target="__blank"
                    aria-label={product.cms[0]?.content?.name || product.productTag}
                  >
                    {/* ROW 1 */}
                    <div className="flex justify-between">
                      <div style={{ flex: 1 }}>
                        <ImageComponent className="responsive" src={imgLink} alt={product?.assets[0]?.name} />
                      </div>
                      <div style={{ flex: 3 }} className="px-3">
                        <h1 className="font-bold uppercase" style={{ lineHeight: "16px" }}>
                          {product.cms[0]?.content?.name || product.productTag}
                        </h1>
                        <h2 className="mb-2" style={{ fontSize: "12px" }}>
                          {product.cms[0]?.content?.subtitle}
                        </h2>
                        {product.price > product.offerPrice ? (
                          <div className="flex w-full">
                            <h1 className="font-bold text-sm mr-1">{formatPrice(product.offerPrice, true)}</h1>
                            <h1 className="font-bold text-xs line-through" style={{ color: "#9b9b9b", marginTop: "2px" }}>
                              {formatPrice(product.price, true)}
                            </h1>
                          </div>
                        ) : (
                          <div className="flex flex-start items-center w-full">
                            <h1 className="font-bold text-sm ">{formatPrice(product.offerPrice, true)}</h1>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* ROW 2 */}
                    {whatIsIt && (
                      <div
                        className="text-sm text-center py-2 px-2"
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{
                          __html: `${whatIsIt.substring(0, 230)}...`,
                        }}
                      />
                    )}
                  </Link>

                  {/* ROW 3 */}

                  <div className="text-center" aria-hidden>
                    <AddToBagButton
                      product={product}
                      name={looksData?.cms[0]?.content?.name?.toLowerCase() || ""}
                      category={
                        looks?.relationalData?.categoryId[looksData.categoryId]?.cms[0]?.content?.name?.toLowerCase() || ""
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Looks Card Carousel */}
        <section>
          <LazyLoadComponent>
            <RecommendedLooks looks={looks} />
          </LazyLoadComponent>

          <button type="button" className="w-full mb-8" onClick={handleShareNEarn}>
            <div
              style={{
                borderTop: "1px solid #e9e9e9",
              }}
              className="flex justify-center items-center p-1 font-bold"
            >
              <GiShareIco name="share-ico" width="40px" height="40px" viewBox="-250 -115 1000 1000" />

              <span style={{ fontSize: "0.9rem", color: "rgb(33, 37, 41)" }}>
                <ConfigText configKey="shareEarn" className="uppercase pr-1" />
                <ConfigText configKey="freeMakeup" className="uppercase" />
              </span>
            </div>
          </button>
        </section>

        {/* Zoom modal */}
        {zoomModal && (
          <ZoomModal
            isOpen={zoomModal}
            onRequestClose={() => setZoomModal(false)}
            title={looksData?.cms[0]?.content?.name}
            assets={looksData?.assets}
          />
        )}
      </main>
    </React.Fragment>
  );
}

LooksPage.getInitialProps = getLooksInitialProps;

export default LooksPage;
