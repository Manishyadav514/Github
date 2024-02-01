import React, { Fragment, useEffect, useState } from "react";
import dynamic from "next/dynamic";

import ProductAPI from "@libAPI/apis/ProductAPI";

import useTranslation from "@libHooks/useTranslation";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import VideoModal from "@libComponents/PopupModal/VideoModal";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import PDPShadeGrid from "@libComponents/PDP/PDPShadeGrid";
import PDPAvgRating from "@libComponents/PDP/PDPAvgRating";
import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";

// @ts-ignore
import { ShadesContainer, SCSkipThankyou } from "@libStyles/css/miniPDP.module.css";

import { SESSIONSTORAGE } from "@libConstants/Storage.constant";

import { formatPrice } from "@libUtils/format/formatPrice";
import { getStaticUrl } from "@libUtils/getStaticUrl";
// @ts-ignore
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { getSessionStorageValue, setSessionStorageValue } from "@libUtils/sessionStorage";
import { getTrialProductPricing, GLAMMCLUB_CONFIG } from "@libUtils/glammClubUtils";
import useDiscountPartnership from "@libHooks/useDiscountPartnership";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";

const PDPSearchTags = dynamic(() => import(/* webpackChunkName: "PDPSearchTags" */ "@libComponents/PDP/PDPSearchTags"), {
  ssr: false,
});
interface shadeProps {
  slug?: string;
  isFree?: boolean;
  nin?: Array<string>;
  productTag?: string;
  productId?: string;
  includes?: Array<string>;
  showShades?: boolean;
  discountAmount?: number;
  setActiveProd: (arg1: any) => void;
  setRelationalData?: (arg1: any) => void | undefined;
  setDiscountDetails?: (arg1: any) => void | undefined;
  styles?: {
    themeColor?: string;
    dots?: string;
    dotsBackground?: string;
    svg?: string;
  };
  imgSize?: string;
  skipThankYou?: boolean;
  discountedPriceLabel?: string;
  bestSelling?: boolean;
  upsellDSPrice?: number;
  activeProduct?: any;
  discountCode?: string;
  isMiniPDPBanner?: boolean;
  source?: string;
}

const MiniPDPShadeSelection = ({
  slug,
  styles,
  productTag,
  productId = "",
  nin = [],
  isFree = true,
  includes = [],
  discountAmount = 0,
  setRelationalData,
  setDiscountDetails,
  imgSize = "200px",
  skipThankYou = false, //skipThankYou is use for A/B on this use to change Classnames,styles, Hide Shade Name
  discountedPriceLabel = "",
  bestSelling = true,
  upsellDSPrice,
  activeProduct,
  setActiveProd,
  discountCode = "",
  isMiniPDPBanner = false,
  source,
}: shadeProps) => {
  const { t } = useTranslation();
  const glammClubConfig = GLAMMCLUB_CONFIG() || {};
  const { userProfile } = useSelector((store: ValtioStore) => ({
    userProfile: store.userReducer.userProfile,
  }));

  const productApi = new ProductAPI();

  const [shades, setShades] = useState<any>([]);
  const [ratings, setRatings] = useState<any>(null);

  const [videoModal, setVideoModal] = useState({
    videoId: "",
    show: false,
  });

  const [disablePan, setDisablePan] = useState<boolean>(true);
  const { partnershipAmount }: any =
    useDiscountPartnership({ products: activeProduct?.id, discountCode, productDetail: activeProduct, isMiniPDPBanner }) || {};

  /* Img, Video and Styles for Shade */
  let activeImgs = activeProduct?.assets.filter((x: any) => x.type === "image");
  const activeVideo = activeProduct?.assets.find((x: any) => x.type === "video");

  if (activeVideo) {
    activeImgs = [...activeImgs, activeVideo];
  }

  /* CSS Objects - Constants */
  const { themeColor } = styles || {};

  const videoStyle = {
    backgroundPosition: " 0 -285px",
    backgroundImage: `url(${getStaticUrl("/global/images/ico-pdp-sprite.png")})`,
    backgroundRepeat: "no-repeat",
    height: "35px",
    width: "35px",
    top: "45%",
    marginLeft: "1rem",
  } as React.CSSProperties;

  /* Initiate Incase of Mutation of Slug */
  useEffect(() => {
    setShades([]);
    setActiveProd(undefined);
    let where: { [char: string]: any } = {
      "urlManager.url": slug,
    };
    if (productTag) {
      where = {
        id: { nin },
        inStock: true,
        "productMeta.displaySiteWide": true,
        productTag: encodeURIComponent(productTag),
      };
    }

    const include = [
      "price",
      "productTag",
      "type",
      "cms",
      "assets",
      "inStock",
      "categories",
      "sku",
      "offerPrice",
      "productMeta",
      "urlManager",
      "brand",
      "tag",
      ...includes,
    ];
    productApi.getProductShades("IND", where, 0, include, undefined, 100).then(({ data: prod }) => {
      let IndexCartProduct = 0;
      if (productId) {
        IndexCartProduct = prod.data.data.findIndex((product: any) => {
          return product.id === productId;
        });

        if (IndexCartProduct === -1) {
          IndexCartProduct = 0;
        }
      }
      const mainProduct = prod.data.data[IndexCartProduct];
      const discountDetails = prod?.data?.discountDetails;
      if (productId) {
        //Move selected shade to 0 index
        prod.data.data.splice(0, 0, prod.data.data.splice(IndexCartProduct, 1)[0]);
      }
      /* Product Shades - API Call */
      if (mainProduct) {
        const shadeWhere = {
          inStock: true,
          id: {
            nin: [...Array.from(new Set([...nin, mainProduct.id]))],
          },
          productTag: encodeURIComponent(mainProduct.productTag),
          "productMeta.displaySiteWide": true,
        };
        if (!productTag) {
          productApi
            .getProductShades("IND", shadeWhere, bestSelling ? 0 : 30, include, undefined, 30)
            .then(({ data: shade }) => {
              const freeProductId = JSON.parse(sessionStorage.getItem(SESSIONSTORAGE.FREE_XO_PRODUCT) || "{}")?.id;
              /* Condtioning Based on the stock Available of the Product and it's Shades */
              if (mainProduct.inStock) {
                if (freeProductId && isFree) {
                  const IndexSurveyProduct = shade.data.data.findIndex((product: any) => {
                    return product.id === freeProductId;
                  });
                  const newShadesData = [mainProduct, ...shade.data.data];
                  return setCondtionalData(
                    newShadesData[IndexSurveyProduct + 1],
                    {
                      relationalData: prod.data.relationalData,
                      data: newShadesData,
                    },
                    {
                      ...discountDetails,
                      ...(shade.data.discountDetails || {}),
                    }
                  );
                }
                setCondtionalData(
                  mainProduct,
                  {
                    relationalData: prod.data.relationalData,
                    data: [mainProduct, ...shade.data.data],
                  },
                  {
                    ...discountDetails,
                    ...(shade.data.discountDetails || {}),
                  }
                );
              } else if (shade.data.data.length) {
                if (freeProductId && isFree) {
                  const IndexSurveyProduct = shade.data.data.findIndex((product: any) => {
                    return product.id === freeProductId;
                  });
                  return setCondtionalData(shade.data.data[IndexSurveyProduct], shade.data, {
                    ...discountDetails,
                    ...(shade.data.discountDetails || {}),
                  });
                }
                setCondtionalData(shade.data.data[0], shade.data, {
                  ...discountDetails,
                  ...(shade.data.discountDetails || {}),
                });
              } else {
                setCondtionalData(mainProduct, undefined, discountDetails);
              }
            });
        } else {
          setCondtionalData(mainProduct, prod.data, discountDetails);
        }
      }
    });
  }, [slug, productTag]);

  /* Setting Active Shade and scrolling ProdImg into View */
  const setActiveShade = async (shade: any) => {
    setActiveProd({ ...shade });
    const ratingsData = await productApi.getavgRatings(shade.id || shade.productId, "product");
    setRatings(ratingsData.data.data);
  };

  /* Data to be set for each case on load of miniPDP */
  const setCondtionalData = (mainProduct: any, prodData?: any, discountDetails?: any) => {
    setActiveShade(mainProduct);
    setShades(prodData?.data);

    /* Passing Relational Data to Parent if needed for adobe */
    if (setRelationalData) {
      setRelationalData(prodData?.relationalData);
    }
    /* Passing Discount as in PWP details to Parent if need to check Free Prodcut */
    if (setDiscountDetails) {
      setDiscountDetails(discountDetails);
    }
  };

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

  const userMemberShipLevel =
    userProfile && userProfile?.memberType?.typeName === "ambassador" ? userProfile?.memberType?.levelName : "Glamm Star";

  const membershipLevelIndex = glammClubConfig?.glammClubMemberShipLevels?.findIndex(
    (membership: string) => membership === userMemberShipLevel
  );

  const displayProductPrice = () => {
    if (upsellDSPrice) {
      return upsellDSPrice;
    } else if (discountAmount) {
      return formatPrice((formatPrice(activeProduct?.price) as number) - discountAmount, true, false);
    }

    /* Glamm trial product show pricing from config */
    return getTrialProductPricing(activeProduct, userProfile, glammClubConfig, membershipLevelIndex);
  };

  if (activeProduct && (shades?.length > 0 || !shades)) {
    return (
      <Fragment>
        <div
          className={`py-1 mt-1 w-full ${
            activeProduct?.productMeta?.isTrial ? "border-[1px] rounded px-2" : !skipThankYou && "border-dashed border"
          }`}
          style={{ borderColor: activeProduct?.productMeta?.isTrial ? "#FFE3C9" : themeColor || "var(--color2)" }}
        >
          <GoodGlammSlider dots="dots">
            {activeImgs?.map((img: any) => (
              <div
                key={img.id || img.url}
                role="presentation"
                className="flex justify-center relative"
                onClick={() => {
                  if (img.type === "video") {
                    setVideoModal({
                      videoId: img?.properties?.videoId,
                      show: true,
                    });
                  }
                }}
              >
                {activeProduct?.productMeta?.isTrial && glammClubConfig?.PDPTrialIconV2 && (
                  <img
                    className="absolute m-auto left-2 top-2 z-30 w-16"
                    src={glammClubConfig?.PDPTrialIconV2}
                    alt="Glamm Club Trial Product"
                  />
                )}
                <TransformWrapper
                  panning={{
                    disabled: disablePan,
                  }}
                  onPanningStart={(e: any) => {
                    if (e.state.scale <= 1) {
                      setDisablePan(true);
                    } else {
                      setDisablePan(false);
                    }
                  }}
                  doubleClick={{
                    step: 0.4,
                  }}
                >
                  <TransformComponent>
                    <ImageComponent
                      alt={img.name}
                      style={{ height: imgSize || "200px" }}
                      src={img.imageUrl ? img.imageUrl[skipThankYou ? "400x400" : "200x200"] : img.properties?.thumbnailUrl}
                    />
                  </TransformComponent>
                </TransformWrapper>
                {img.type === "video" && <div style={videoStyle} className="absolute m-auto" />}
              </div>
            ))}
          </GoodGlammSlider>
          {/* Ratings */}
          {ratings?.avgRating > 0 && (
            <div className={`relative flex items-center justify-between ml-2 ${skipThankYou ? "-mt-5" : "my-0.5"}`}>
              <PDPAvgRating
                avgRating={ratings?.avgRating % 1 != 0 ? ratings?.avgRating : ratings?.avgRating + ".0"}
                totalCount={ratings?.totalCount}
                size={10}
              />
            </div>
          )}
          <p className="font-semibold  my-1 pl-1 mt-3">{activeProduct?.cms[0].content.name}</p>
          <p className=" text-sm text-gray-700 pl-1 opacity-75">{activeProduct?.cms[0].content.subtitle}</p>
          <div className="-ml-3">
            <PDPSearchTags tags={activeProduct?.cms[0].content?.searchText || activeProduct?.productMeta?.searchText} />
          </div>
          {discountedPriceLabel ? (
            <div className="mt-2 mb-1 pl-1">
              <del className="text-18 mr-2.5 text-gray-500">{formatPrice(activeProduct?.price, true)}</del>
              <span className="text-color1 text-lg font-semibold uppercase">
                {parseFloat(discountedPriceLabel) ? "₹" + discountedPriceLabel : discountedPriceLabel}
              </span>
            </div>
          ) : (
            <>
              {isFree ? (
                <div className="mt-2 mb-1 pl-1">
                  {source === "glamm-club-widget" ? (
                    getTrialProductPricing(
                      activeProduct,
                      userProfile || source === "glamm-club-widget",
                      glammClubConfig,
                      membershipLevelIndex
                    )
                  ) : (
                    <>
                      <del className="pl-1 text-18 mr-2.5 text-gray-500">{formatPrice(activeProduct?.price, true)}</del>
                      <span className="text-color1 text-lg font-semibold uppercase">{t("free")}</span>
                    </>
                  )}
                </div>
              ) : (partnershipAmount?.payableAmount || partnershipAmount?.payableAmount === 0) &&
                partnershipAmount?.discountAmount &&
                activeProduct?.productTag === partnershipAmount?.productTag ? (
                <div className="mt-2 mb-1 pl-1">
                  <span className="font-semibold text-center tracking-wide mr-2">
                    {partnershipAmount?.payableAmount === 0
                      ? t("free") || "FREE"
                      : formatPrice(partnershipAmount?.payableAmount, true)}
                  </span>
                  <del className="text-xs text-gray-400">{formatPrice(activeProduct?.price, true)}</del>
                  <span className="text-color1 lowercase ml-1">
                    {discountPercentage(activeProduct?.price, partnershipAmount?.payableAmount)}% off
                  </span>
                </div>
              ) : (
                <div className="mt-2 mb-1 pl-1">
                  <span className="font-semibold text-center tracking-wide mr-2">{displayProductPrice()}</span>

                  {(activeProduct?.offerPrice < activeProduct?.price || discountAmount > 0) && (
                    <>
                      <del className="text-xs text-gray-400">{formatPrice(activeProduct?.price, true)}</del>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        {activeProduct?.cms[0].attributes?.shadeLabel && !skipThankYou && (
          <div className="flex items-center pl-1 my-2">
            <p className="text-sm text-gray-700 opacity-75">{t("shade")}</p>
            <p className="ml-2 text-sm uppercase font-bold ">
              {shades?.find((x: any) => nin.includes(x.id))?.cms?.[0]?.attributes?.shadeLabel ||
                activeProduct?.cms[0].attributes?.shadeLabel}
            </p>
          </div>
        )}
        <section className={skipThankYou ? SCSkipThankyou : ShadesContainer}>
          <div className="h-1.5 w-full bg-gradient-to-b from-white to-white/10 sticky top-0 z-20" />

          {/* Shade Listing */}
          {shades?.length > 1 && activeProduct?.type !== 2 && (
            <PDPShadeGrid
              shadeLabel={activeProduct?.cms?.[0]?.attributes?.shadeLabel}
              currentProductId={activeProduct?.id}
              shades={shades}
              isMiniShadeSelection
              setActiveShade={(activeShade: any) => setActiveShade(activeShade)}
            />
          )}

          <div className="h-1.5 w-full bg-gradient-to-t from-white to-white/0 sticky bottom-0 z-20" />
        </section>

        {videoModal?.videoId && (
          <VideoModal
            videoId={videoModal?.videoId}
            isOpen={videoModal?.show}
            onRequestClose={() => {
              setVideoModal({
                videoId: "",
                show: false,
              });
            }}
          />
        )}
        <style jsx>
          {`
            .w-18 {
              width: 4.75rem;
            }
          `}
        </style>
      </Fragment>
    );
  }
  return (
    <div className="relative min-h-[70vh]">
      <LoadSpinner className="m-auto top-0 bottom-0 right-0 left-0 h-20 absolute" />
    </div>
  );
};

export default MiniPDPShadeSelection;
