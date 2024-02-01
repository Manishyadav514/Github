import React, { useEffect, useState } from "react";
import PopupModal from "./PopupModal";

// @ts-ignore
import style from "@libStyles/css/miniPDP.module.css";
import MiniPDPHeader from "@libComponents/MiniPDP/MiniPDPHeader";
import ProductAPI from "@libAPI/apis/ProductAPI";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import VideoModal from "./VideoModal";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import Link from "next/link";
import useTranslation from "@libHooks/useTranslation";

import StarFilled from "../../../public/svg/star-filled.svg";
import PDPAvgRating from "@libComponents/PDP/PDPAvgRating";
import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";
import { formatPrice } from "@libUtils/format/formatPrice";
import { getStaticUrl } from "@libUtils/getStaticUrl";
import dynamic from "next/dynamic";

interface minPDPProps {
  show: boolean;
  mainProd: any;
  hide: () => void;
  styles?: {
    themeColor?: string;
    dots?: string;
    dotsBackground?: string;
    svg?: string;
  };
  ctaTitle?: string;
}
const PDPSearchTags = dynamic(() => import(/* webpackChunkName: "PDPSearchTags" */ "@libComponents/PDP/PDPSearchTags"), {
  ssr: false,
});

const CartMiniPDPDetails = ({ show, mainProd, hide, styles, ctaTitle }: minPDPProps) => {
  const productApi = new ProductAPI();
  const { t } = useTranslation();
  const [productRes, setProductRes] = useState<any>();

  //Video Modal State
  const [videoId, setVideoId] = useState<string>();
  const [showVideoModal, setShowVideoModal] = useState(false);

  const { themeColor, dots, dotsBackground, svg } = styles || {};
  /* Img and Video for Product*/
  let activeImgs = productRes?.product?.assets.filter((x: any) => x.type === "image");
  const activeVideo = productRes?.product?.assets.find((x: any) => x.type === "video");

  if (activeVideo) {
    activeImgs = [...activeImgs, activeVideo];
  }

  const videoStyle = {
    backgroundPosition: " 0 -285px",
    backgroundImage: `url(${getStaticUrl("/global/images/ico-pdp-sprite.png")})`,
    backgroundRepeat: "no-repeat",
    height: "35px",
    width: "35px",
    top: "45%",
    marginLeft: "1rem",
  } as React.CSSProperties;

  const getProduct = async () => {
    const where = {
      id: mainProd.productId,
    };
    const include = [
      "id",
      "price",
      "sku",
      "brand",
      "products",
      "offerPrice",
      "productTag",
      "name",
      "subtitle",
      "type",
      "cms",
      "urlManager",
      "assets",
      "inStock",
      "productMeta",
    ];
    const product = await productApi.getProduct(where, 0, include);
    const ratingsData = await productApi.getavgRatings(mainProd.productId, "product");
    const ratings = ratingsData.data.data;
    setProductRes({ product: product.data.data.data[0], ratings });
  };

  useEffect(() => {
    getProduct();
  }, [mainProd?.productId]);

  // calculating the discount percentage w.r.t the decreased price
  const discountPercentage = (actualPrice: number, offerPrice: number) => {
    try {
      let discountedPrice = actualPrice - offerPrice;
      let discountedPercentage = (discountedPrice / actualPrice) * 100;
      return Math.round(discountedPercentage);
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  return (
    <>
      <PopupModal show={show} onRequestClose={hide}>
        <div>
          <section className={style.ModalContainer}>
            {productRes ? (
              <>
                <MiniPDPHeader title="Product Details" />
                <div
                  className="mt-4 mb-3 px-2  w-full border-dashed border"
                  style={{ borderColor: "var(--color2)", paddingTop: "3px" }}
                >
                  <GoodGlammSlider dots="dots">
                    {activeImgs?.map((img: any) => (
                      <div
                        key={img.id}
                        role="presentation"
                        className="flex justify-center relative"
                        onClick={() => {
                          if (img.type === "video") {
                            setShowVideoModal(true);
                            setVideoId(img.properties?.videoId);
                          }
                        }}
                      >
                        <ImageComponent
                          alt={img.name}
                          style={{ height: "200px" }}
                          src={img.imageUrl ? img.imageUrl["200x200"] : img.properties?.thumbnailUrl}
                        />
                        {img.type === "video" && <div style={videoStyle} className="absolute m-auto" />}
                      </div>
                    ))}
                  </GoodGlammSlider>
                  {/* Ratings */}
                  {productRes?.ratings?.avgRating > 0 && (
                    <div className="relative flex  my-0.5 items-center justify-between ml-2">
                      <PDPAvgRating
                        avgRating={
                          productRes?.ratings?.avgRating % 1 != 0
                            ? productRes?.ratings?.avgRating
                            : productRes?.ratings?.avgRating + ".0"
                        }
                        totalCount={productRes?.ratings?.totalCount}
                        size={10}
                      />
                    </div>
                  )}
                  {/* Products Details name and price */}
                  <p className="font-semibold  mt-2 mb-1">{productRes?.product?.productTag}</p>
                  <p className="text-sm text-gray-700 opacity-75">{mainProd.subtitle}</p>
                  {/* searchTags ab experiment */}
                  <div className="-ml-4">
                    <PDPSearchTags
                      tags={productRes?.product?.cms[0]?.content?.searchText || productRes?.product?.productMeta?.searchText}
                    />
                  </div>
                  <div className="my-2">
                    <span className="font-semibold   tracking-wide mr-2">
                      {formatPrice(productRes?.product?.offerPrice, true)}
                    </span>
                    {productRes?.product?.offerPrice < productRes?.product?.price && (
                      <>
                        <del className="text-xs  text-gray-400">{formatPrice(productRes?.product?.price, true)}</del>
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="relative min-h-[70vh]">
                <LoadSpinner className="m-auto top-0 bottom-0 right-0 left-0 h-20 absolute" />
              </div>
            )}
          </section>
          {/* Action Buttons */}
          {productRes && (
            <div className={`flex w-full ${style.ButtonContianer}`}>
              <Link href={productRes?.product?.urlManager?.url} legacyBehavior>
                <a
                  className="w-1/2 bg-white text-gray-300 text-center font-semibold text-sm uppercase py-3 outline-none"
                  aria-label={t("viewDetailsButton")}
                >
                  {t("viewDetailsButton")}
                </a>
              </Link>
              <button
                type="button"
                onClick={hide}
                className="bg-ctaImg text-white w-1/2 font-semibold uppercase text-sm py-3 relative rounded-sm"
              >
                {ctaTitle || t("exchangeCtaStep2Positive")}
              </button>
            </div>
          )}
        </div>
      </PopupModal>
      {videoId && <VideoModal videoId={videoId} isOpen={showVideoModal} onRequestClose={() => setShowVideoModal(false)} />}
      <style jsx>
        {`
          .w-18 {
            width: 4.75rem;
          }
        `}
      </style>
    </>
  );
};

export default CartMiniPDPDetails;
