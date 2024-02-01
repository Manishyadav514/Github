import React, { useEffect, useState } from "react";
import useTranslation from "@libHooks/useTranslation";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import recommendationHelper from "@libUtils/recommendationHelper";
import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";
import SearchLabel from "@libComponents/Search/SearchLabel";
import useDsAdobe from "@libHooks/useDsAdobe";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import PDPAvgRating from "@libComponents/PDP/PDPAvgRating";
import { formatPrice } from "@libUtils/format/formatPrice";
import { showAddedToBagOrWishlist } from "@libUtils/showToaster";
import useAddtoBag from "@libHooks/useAddToBag";
import { ParseJSON } from "@libUtils/widgetUtils";
import TagsFlag from "@libComponents/TagsFlag";
import { SOURCE_STATE } from "@libStore/valtio/SOURCE.store";
import PLPWishlistButton from "@libComponents/PLP/PLPWishlistButton";
import Link from "next/link";
import MiniPDPModal from "@libComponents/PopupModal/MiniPDPModal";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import { getTrialProductFromConfig, checkMemberShipEligibility, GLAMMCLUB_CONFIG } from "@libUtils/glammClubUtils";
import { ADOBE } from "@libConstants/Analytics.constant";
import Adobe from "@libUtils/analytics/adobe";
import { isWebview } from "@libUtils/isWebview";
import { LOCALSTORAGE, SESSIONSTORAGE } from "@libConstants/Storage.constant";
import { getLocalStorageValue } from "@libUtils/localStorage";
import useAppRedirection from "@libHooks/useAppRedirection";
import { urlJoin } from "@libUtils/urlJoin";
import { setSessionStorageValue } from "@libUtils/sessionStorage";
import { WEBSITE_URL } from "@libConstants/WEBSITE_URL.constant";
import { SITE_CODE } from "@libConstants/GLOBAL_SHOP.constant";

const PDPFreeProductModal = dynamic(
  () => import(/* webpackChunkName: "FreeProductModal" */ "@libComponents/PopupModal/PDPFreeProductModal"),
  { ssr: false }
);

const CTAButton = dynamic(() => import("@libComponents/Buttons/GlammClubWidgetButton"), { ssr: false });

const ModuleCarousel12 = ({ item, widgetIndex, icid }: any) => {
  const { t } = useTranslation();
  const glammClubConfig = GLAMMCLUB_CONFIG() || {};
  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  const router = useRouter();
  const [showDSBestSeller, setShowDSBestSeller] = useState(!!router.query.layout);
  const [widgetData, setWidgetData] = useState<any>();
  const {
    evarName,
    title,
    customTitle,
    titleBadgeImgSrc,
    catalogueType,
    level,
    backgroundColor,
    lockedCatalogueRedirectSlug,
    personalisation,
  } = ParseJSON(item?.meta?.widgetMeta);
  const widgetTitle = item?.commonDetails?.title?.trim();

  useEffect(() => {
    recommendationHelper(
      item?.meta?.widgetMeta,
      item?.commonDetails,
      item?.productSKU ? item?.productSKU : "",
      showDSBestSeller
    ).then((res: any) => {
      setWidgetData(res);
    });
  }, [showDSBestSeller]);

  const { dsWidgetRef } = useDsAdobe({
    title: widgetTitle,
    dsWidgetType: widgetData?.dsWidgetType,
    products: widgetData?.products,
    variantValue: showDSBestSeller ? widgetData?.variantValue : "Default",
    evarName: evarName || "evar92", //widgetData?.evarName
  });

  // Variable declaration for miniPDP modal
  const [showMiniPDPModal, setShowMiniPDPModal] = useState(false);
  const [miniPDPFreeProduct, setMiniPDPFreeProduct] = useState<any>({});
  const [showPDPFreeProductModal, setShowPDPFreeProductModal] = useState(false);
  const [miniPDPProduct, setMiniPDPProduct] = useState<any>({});
  const [productPosition, setProductPosition] = useState();

  const [loading, setLoading] = useState<boolean>(false);

  const { addProductToCart } = useAddtoBag();

  // miniPDPProductModal call method
  const miniPDPProductData = (product: any, productPosition: any) => {
    SOURCE_STATE.pdpSource = widgetTitle;
    setMiniPDPProduct(product);
    setProductPosition(productPosition);
    if (router.pathname === "/") {
      router.push(`?icid=${icid}`);
    }
    setShowMiniPDPModal(true);
  };

  const showToast = () => {
    showAddedToBagOrWishlist("Added To Cart", 2500);
  };

  const { redirect } = useAppRedirection();

  // miniPDPProductModal call method
  const handleAddToBag = (product: any, position: any) => {
    const couponCode = getTrialProductFromConfig(product?.productTag)?.discountCode;

    if (SITE_CODE() !== product?.vendorCode) {
      let url = `${WEBSITE_URL[process.env.NEXT_PUBLIC_PRODUCT_ENV || "ALPHA"]?.[product?.vendorCode]}${
        product.urlManager.url
      }`;

      const isCrossBrandTrial = SITE_CODE() !== product?.vendorCode;
      url = url.concat(`${url.includes("?") ? "&" : "?"}isCrossBrandTrial=${isCrossBrandTrial}`);

      // add discountCode in URL for webview
      if (isWebview() && couponCode) {
        url = url.concat(`${url.includes("?") ? "&" : "?"}discountCode=${couponCode}`);
      }

      url = url.concat(
        `${url.includes("?") ? "&" : "?"}icid=${icid}_${product.cms[0]?.content.name.toLowerCase()}_${position}_${SITE_CODE()} `
      );

      // Callback for App for cross brand products
      if (isWebview()) {
        return redirect(`${url}&openInChrome=true&uiType=trial`);
      }

      return window.open(url, "_blank");
    } else {
      if (product?.hasShade || product?.isShades || product?.shade?.length > 1 || product?.shades?.length > 1) {
        if (isWebview()) {
          if (couponCode) {
            return redirect(`${product.urlManager.url}?showMiniPdp=true&uiType=trial&discountCode=${couponCode}`);
          }
          return redirect(`${product.urlManager.url}?showMiniPdp=true&uiType=trial`);
        }

        miniPDPProductData(product, position);
      } else {
        setProductPosition(position);
        setLoading(true);
        setSessionStorageValue(SESSIONSTORAGE.TEMP_TRIAL_PRICE, product?.productTag);
        // Callback for App to redirect to PDP
        if (isWebview()) {
          setLoading(false);
          if (couponCode) {
            return redirect(`${product?.urlManager?.url}?uiType=trial&discountCode=${couponCode}`);
          }
          return redirect(`${product?.urlManager?.url}?uiType=trial`);
        }

        return redirect(
          `${product?.urlManager?.url}?icid=${icid}_${product?.cms[0]?.content?.name?.toLowerCase()}_${position}`
        );
      }
    }
  };

  //Open minPDP or redirect to PDP page if product shades not found
  const miniPDPOnImgClick = (product: any, position: any) => {
    SOURCE_STATE.pdpSource = widgetTitle;
    SOURCE_STATE.addToBagSource = widgetTitle;
    adobeClickEventPDPImage("Product Tile");
    const couponCode = getTrialProductFromConfig(product?.productTag)?.discountCode;

    if (SITE_CODE() === product?.vendorCode) {
      if (!(product.hasShade || product.shadeCount > 1 || product?.shades?.length > 1)) {
        setSessionStorageValue(SESSIONSTORAGE.TEMP_TRIAL_PRICE, product.productTag);

        // Callback for App to redirect to PDP
        if (isWebview()) {
          if (couponCode) {
            return redirect(`${product?.urlManager?.url}?uiType=trial&discountCode=${couponCode}`);
          }
          return redirect(`${product?.urlManager?.url}?uiType=trial`);
        }

        return redirect(`${product.urlManager.url}?icid=${icid}_${product.cms[0]?.content.name.toLowerCase()}_${position}`);
      }
      // Callback for App to show mini PDP
      if (isWebview()) {
        if (couponCode) {
          return redirect(`${product.urlManager.url}?showMiniPdp=true&uiType=trial&discountCode=${couponCode}`);
        }
        return redirect(`${product.urlManager.url}?showMiniPdp=true&uiType=trial`);
      }

      miniPDPProductData(product, position);
    } else {
      let pdpURL = `${WEBSITE_URL[process.env.NEXT_PUBLIC_PRODUCT_ENV || "ALPHA"]?.[product?.vendorCode]}${
        product.urlManager.url
      }`;
      const isCrossBrandTrial = SITE_CODE() !== product?.vendorCode;
      pdpURL = pdpURL.concat(`${pdpURL.includes("?") ? "&" : "?"}isCrossBrandTrial=${isCrossBrandTrial}`);

      // add discountCode in URL for webview
      if (isWebview() && couponCode) {
        pdpURL = pdpURL.concat(`${pdpURL.includes("?") ? "&" : "?"}discountCode=${couponCode}`);
      }

      pdpURL = pdpURL.concat(
        `${
          pdpURL.includes("?") ? "&" : "?"
        }icid=${icid}_${product.cms[0]?.content.name.toLowerCase()}_${position}_${SITE_CODE()} `
      );

      // Callback for App for cross brand products
      if (isWebview()) {
        return redirect(`${pdpURL}&openInChrome=true&uiType=trial`);
      }

      return window.open(pdpURL, "_blank");
    }
  };

  const slugValue = miniPDPProduct?.urlManager?.url;

  const [userMemberShipLevel, setUserMemberShipLevel] = useState("");

  useEffect(() => {
    if (userProfile && userProfile?.memberType?.typeName === "ambassador") {
      setUserMemberShipLevel(userProfile?.memberType?.levelName);
    } else {
      setUserMemberShipLevel("Glamm Star");
    }
  }, [userProfile]);

  useEffect(() => {
    setLoading(false);
  }, [router]);

  const membershipLevelIndex = glammClubConfig?.glammClubMemberShipLevels?.findIndex(
    (membership: string) => membership === userMemberShipLevel
  );

  const adobeClickEventTryThis = (ctaName: string) => {
    // On Click - Try This CTA
    (window as any).digitalData = {
      common: {
        linkName: `web|Glammclub|Trial Catalog|Try This`,
        linkPageName: `Trial Catalog`,
        newLinkPageName: "Trial Catalog",
        assetType: "Glammclub",
        newAssetType: "Glammclub",
        subSection: "Trial Catalog",
        platform: ADOBE.PLATFORM,
        ctaName,
        pageLocation: "",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();
  };

  const adobeClickEventPDPImage = (ctaName: string) => {
    // On Click - Product Tile
    (window as any).digitalData = {
      common: {
        linkName: `web|Glammclub|Trial Catalog|Product Tile`,
        linkPageName: `Trial Catalog`,
        newLinkPageName: "Trial Catalog",
        assetType: "Glammclub",
        newAssetType: "Glammclub",
        subSection: "Trial Catalog",
        platform: ADOBE.PLATFORM,
        ctaName,
        pageLocation: "",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();
  };

  if (widgetData?.products?.length === 0) {
    return <div />;
  }

  if (personalisation && level !== userMemberShipLevel) {
    return <div />;
  }

  return (
    <ErrorBoundary>
      <section className={`RecentlyViewProduct pt-2 rounded-md`} role="banner">
        <div className="recommended-products pb-2">
          {!customTitle?.length && widgetTitle ? (
            <SearchLabel label={item?.commonDetails.title} color={"color2"} />
          ) : (
            <div
              className="flex px-3 items-center pb-4 pt-4"
              style={{
                backgroundColor: `${backgroundColor ? backgroundColor : "#fffff"}`,
              }}
            >
              <img src={titleBadgeImgSrc} className="pr-2 h-5" />
              <div className="flex flex-wrap">
                {customTitle?.map((element: any, index: any) => {
                  return (
                    <span
                      key={index}
                      className={`pr-1 font-bold leading-4 ${catalogueType !== "glamm-trial" ? "text-lg" : ""}`}
                      style={{
                        color: `${element?.color}`,
                      }}
                    >
                      {element?.text}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          <ul
            className={`overflow-x-auto flex list-none mb-0.5 px-3 pb-2`}
            dir="ltr"
            style={{
              scrollSnapType: "x mandatory",
              backgroundColor: `${backgroundColor ? backgroundColor : "#fffff"}`,
            }}
            ref={dsWidgetRef}
          >
            {widgetData?.products?.map((product: any, index: number) => (
              <li
                key={product.id}
                className={`flex flex-col mr-2 mb-2 bg-white relative pt-3
                
                ${
                  checkMemberShipEligibility(product?.productMeta?.memberTypeLevel, membershipLevelIndex, glammClubConfig) ||
                  catalogueType !== "glamm-trial"
                    ? "border-[1px] border-orange-100 rounded-sm"
                    : "rounded-md"
                }
                
                `}
                style={{
                  width: "150px",
                  minWidth: "150px",
                  minHeight: "300px",
                }}
              >
                <div className="px-2">
                  {catalogueType === "glamm-trial" &&
                    !checkMemberShipEligibility(product?.productMeta?.memberTypeLevel, membershipLevelIndex, glammClubConfig) &&
                    glammClubConfig?.lockedOverlayImgSrc &&
                    (lockedCatalogueRedirectSlug ? (
                      <Link href={lockedCatalogueRedirectSlug}>
                        <img src={glammClubConfig?.lockedOverlayImgSrc} className="absolute top-0 left-0 right-0 z-20 h-full" />
                      </Link>
                    ) : (
                      <img src={glammClubConfig?.lockedOverlayImgSrc} className="absolute top-0 left-0 right-0 z-20 h-full" />
                    ))}

                  <TagsFlag tagName={product?.meta?.tags?.[0].name} />
                  <div
                    onClick={e => {
                      miniPDPOnImgClick(product, index + 1);
                    }}
                  >
                    <div className="flex justify-center">
                      <ImageComponent
                        style={{ width: "120px", height: "120px" }}
                        src={product?.assets[0]?.imageUrl?.["400x400"]}
                        alt={product.cms[0]?.content.name || product?.assets[0]?.title || product?.assets[0]?.name}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-5 my-1">
                        {product?.rating?.avgRating > 0 && (
                          <PDPAvgRating
                            size={10}
                            avgRating={
                              product?.rating?.avgRating % 1 != 0
                                ? product?.rating?.avgRating.toFixed(1)
                                : product?.rating?.avgRating + ".0"
                            }
                            totalCount={product?.rating?.totalCount}
                            source="trial-catalogue"
                          />
                        )}
                      </div>

                      <div className="flex items-start h-3.5 mb-1">
                        {product?.shades?.length > 0 && (
                          <>
                            {product?.shades.slice(0, 1).map((shade: any, index: number) => (
                              <div key={index} className="relative mr-0.5">
                                {index === 0 && <div className="h-1 w-1 rounded-full bg-white absolute m-auto inset-0" />}
                                <img src={shade?.shadeImage} alt={shade?.shadeLabel} className="w-3 h-3 rounded" />
                              </div>
                            ))}
                            {product?.shades?.length > 1 && (
                              <span className="text-xxs opacity-80 capitalize">
                                +{product?.shades?.length - 1}&nbsp;
                                {product?.shades?.length - 1 === 1 ? t("shade") : t("shades")}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-xs capitalize h-8">
                      <p className="line-clamp-2">{product.cms[0]?.content?.name}</p>
                    </div>
                    <div className="flex flex-wrap items-center">
                      <div className="font-semibold text-13 mr-1.5">
                        {product?.productMeta?.isTrial &&
                        getTrialProductFromConfig(product?.productTag)?.offerPrice != undefined ? (
                          getTrialProductFromConfig(product?.productTag)?.offerPrice === 0 ? (
                            <span className="uppercase">{t("free") || "Free"}</span>
                          ) : (
                            formatPrice(getTrialProductFromConfig(product?.productTag)?.offerPrice, true)
                          )
                        ) : (
                          formatPrice(product.offerPrice, true)
                        )}
                      </div>
                      {product.offerPrice <= product.price && (
                        <>
                          <del className="text-11 text-gray-500 mr-1">{formatPrice(product.price, true)}</del>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="mt-1">
                    {product?.isPreOrder ? (
                      <CTAButton
                        loading={loading && productPosition === index + 1}
                        CTA={t("preOrderNow")}
                        clickAction={() => {
                          handleAddToBag(product, index + 1);
                        }}
                        customCSSClass="text-white w-full bg-ctaImg p-2 uppercase rounded min-h-[32px] text-10 font-semibold whitespace-nowrap"
                      />
                    ) : (
                      <>
                        <div className="flex items-center mt-2">
                          {!checkMemberShipEligibility(
                            product?.productMeta?.memberTypeLevel,
                            membershipLevelIndex,
                            glammClubConfig
                          ) && (
                            <div onClick={e => e.stopPropagation()} className="z-10">
                              <PLPWishlistButton
                                product={product}
                                activeShadeId={product?.id}
                                TLstyle={{
                                  btn: "relative right-1 top-1 mx-1 px-1 rounded border border-gray-200 ",
                                  svg: "h-7 w-5",
                                }}
                              />
                            </div>
                          )}
                          <CTAButton
                            loading={loading && productPosition === index + 1}
                            CTA={
                              catalogueType === "glamm-trial" &&
                              checkMemberShipEligibility(
                                product?.productMeta?.memberTypeLevel,
                                membershipLevelIndex,
                                glammClubConfig
                              )
                                ? glammClubConfig?.tryThisCTAText || "Try This"
                                : product.hasShade
                                ? `Show ${t("shade")}`
                                : t("addToBag")
                            }
                            clickAction={() => {
                              catalogueType === "glamm-trial" && adobeClickEventTryThis("Try This");
                              handleAddToBag(product, index + 1);
                            }}
                            customCSSClass="text-white w-full bg-ctaImg p-2 uppercase rounded min-h-[32px] text-10 font-semibold"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {product?.productMeta?.isTrial &&
                catalogueType === "glamm-trial" &&
                getTrialProductFromConfig(product?.productTag)?.offerPrice != undefined &&
                product?.price > getTrialProductFromConfig(product?.productTag)?.offerPrice ? (
                  <div
                    className={`mt-auto w-full text-xxs py-1 rounded-b-sm`}
                    style={{
                      backgroundColor: `${glammClubConfig?.customBottomStripBgColor || "white"}`,
                    }}
                  >
                    <div className="flex space-x-1 items-center justify-center">
                      <span>{glammClubConfig?.youSaveText || "You Save"}</span>
                      <span className="text-green-500 font-semibold">
                        {formatPrice(product?.price - getTrialProductFromConfig(product?.productTag)?.offerPrice, true)}
                      </span>
                      <div className="">{glammClubConfig?.withText || "with"}</div>
                      <img className="w-7" src={glammClubConfig?.glammClubThumbnailIcon} alt="Glamm Club" />
                    </div>
                  </div>
                ) : (
                  product?.price > product?.offerPrice && (
                    <div
                      className={`mt-auto w-full text-xxs py-1 rounded-b-sm`}
                      style={{
                        backgroundColor: `${glammClubConfig?.customBottomStripBgColor || "white"}`,
                      }}
                    >
                      <div className="flex space-x-1 items-center justify-center">
                        <span>{glammClubConfig?.youSaveText || "You Save"}</span>
                        <span className="text-green-500 font-semibold">
                          {formatPrice(product?.price - product?.offerPrice, true)}
                        </span>
                        <div className="">{glammClubConfig?.withText || "with"}</div>
                        <img className="w-7" src={glammClubConfig?.glammClubThumbnailIcon} alt="Glamm Club" />
                      </div>
                    </div>
                  )
                )}
              </li>
            ))}
          </ul>
          {typeof showMiniPDPModal === "boolean" && slugValue && (
            <MiniPDPModal
              source="glamm-club-widget"
              show={showMiniPDPModal}
              productSlug={{
                slug: slugValue,
                catalogueType: catalogueType,
              }}
              hide={() => {
                setShowMiniPDPModal(false);
              }}
            />
          )}

          {showPDPFreeProductModal && miniPDPFreeProduct && (
            <PDPFreeProductModal
              show={showPDPFreeProductModal}
              hide={() => setShowPDPFreeProductModal(false)}
              freeProduct={miniPDPFreeProduct}
              product={{ id: miniPDPFreeProduct?.parentId || 0 }}
              t={t}
            />
          )}
          {/* MiniPDP modal ends */}
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default ModuleCarousel12;
