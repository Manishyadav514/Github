import ProductAPI from "@libAPI/apis/ProductAPI";
import React, { useEffect, useState } from "react";
import MiniPDPHeader from "@libComponents/MiniPDP/MiniPDPHeader";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import useAddtoBag from "@libHooks/useAddToBag";
import MiniPDPShadeSelection from "@libComponents/MiniPDP/MiniPDPShadeSelection";
import { ADOBE } from "@libConstants/Analytics.constant";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import { GA4Event, GAPageView } from "@libUtils/analytics/gtm";

// @ts-ignore
import { ButtonContianer, ModalContainer } from "@libStyles/css/miniPDP.module.css";

import PopupModal from "./PopupModal";
import BagIconWhite from "../../../public/svg/carticon-white.svg";
import { formatPrice, getCurrency } from "@libUtils/format/formatPrice";
import { format } from "date-fns";
import { SOURCE_STATE } from "@libStore/valtio/SOURCE.store";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { PDP_STATES } from "@libStore/valtio/PDP.store";
import { setTrialProductCouponFromConfig, GLAMMCLUB_CONFIG } from "@libUtils/glammClubUtils";

const NotifyModal = dynamic(() => import(/* webpackChunkName: "NotifyModal" */ "@libComponents/PopupModal/NotifyModal"), {
  ssr: false,
});

const HomeMiniPDP = ({
  t,
  show,
  onRequestClose,
  product,
  icid,
  productPosition,
  themeColor = "#e0d1ff",
  setMiniPDPFreeProduct,
  widgetName,
  callback,
  isFree = false,
  addOnData,
  discountCode = null,
  isMiniPDPBanner = false,
}: any) => {
  const router = useRouter();
  const productApi = new ProductAPI();

  const [loader, setLoader] = useState(false);
  const [activeProduct, setActiveProduct] = useState<any>();
  const [relationalData, setRelationalData] = useState<any>();
  const [discountDetails, setDiscountDetails] = useState<any>();
  const [freeProducts, setFreeProducts] = useState<any>();
  const [CTA, setCTA] = useState<string>();
  const [addToCartType, setAddToCartType] = useState<number>(1);
  const [showNotifyModal, setNotifyModal] = useState(false);

  const { addProductToCart } = useAddtoBag(relationalData);

  const { profile } = useSelector((store: ValtioStore) => ({
    profile: store.userReducer.userProfile,
  }));

  const { addOnExp } = addOnData || {};

  /* OnClick Handler - Add Product to Bag */
  const addToCart = () => {
    // check if product is oos & not pre-order
    if (!activeProduct?.inStock && !activeProduct?.productMeta.isPreOrder) {
      setNotifyModal(true);
    } else {
      if (addOnExp) {
        PDP_STATES.addOnData = { ...addOnData, addOnMethod: "AddOnSelected", showMiniPDPModal: false };
      } else {
        setLoader(true);
        if (widgetName === "Banner Widget") {
          SOURCE_STATE.addToBagSource = "home";
        }
        addProductToCart({ ...activeProduct, widgetName, key: product?.key }, addToCartType).then(async res => {
          const isFreeProductAvailable = await checkFreeProduct();
          if (isFreeProductAvailable?.data.data.length === 1) {
            addProductToCart(isFreeProductAvailable.data.data, 2, activeProduct?.id).then(() => {
              onRequestClose(activeProduct, isFreeProductAvailable);
            });
          } else if (isFreeProductAvailable?.data.data.length) {
            onRequestClose(activeProduct, isFreeProductAvailable);
            isFreeProductAvailable.parentId = activeProduct?.id;
            setMiniPDPFreeProduct(isFreeProductAvailable);
          } else if (callback) {
            onRequestClose();
            callback();
          } else {
            onRequestClose();
            router.push(`/shopping-bag`);
          }
          setLoader(false);
        });

        /* Glamm trial product set coupon from config */
        const glammClubConfig = GLAMMCLUB_CONFIG() || {};
        const userMemberShipLevel =
          profile && profile?.memberType?.typeName === "ambassador" ? profile?.memberType?.levelName : "Glamm Star";

        const membershipLevelIndex = glammClubConfig?.glammClubMemberShipLevels?.findIndex(
          (membership: string) => membership === userMemberShipLevel
        );
        setTrialProductCouponFromConfig(activeProduct, profile, glammClubConfig, membershipLevelIndex);
      }
    }
  };

  // Changes the CTA text to Pre-Order || Add To Bag According to Product Meta
  useEffect(() => {
    async function check() {
      if (activeProduct?.productMeta.isPreOrder) {
        setCTA(t("preOrderNow") || `PRE-ORDER`); // 3
        setAddToCartType(3);
      } else if (!activeProduct?.inStock) {
        setCTA(t("notifyMe"));
      } else {
        setCTA(t("addToBag") || `ADD TO BAG`); // 1
        setAddToCartType(1);
      }
      // To Display Free Product worth - Uncomment this section
      const isFreeProductAvailable = await checkFreeProduct();
      if (isFreeProductAvailable?.data.data.length) {
        setFreeProducts(isFreeProductAvailable);
      } else {
        setFreeProducts({});
      }
    }
    check();
  }, [activeProduct]);

  useEffect(() => {
    if (activeProduct && relationalData) {
      // for adobe first load event
      adobeLoadEvent();
    }
  }, [freeProducts]);

  const checkFreeProduct = () => {
    if (discountDetails && discountDetails?.[activeProduct?.id] && activeProduct) {
      const include = ["price", "productTag", "type", "cms", "assets", "inStock", "categories", "sku", "offerPrice"];
      let fPwhere = {};

      const freeProductType = discountDetails?.[activeProduct.id].discountValue?.freeProducts?.type;
      if (discountDetails && freeProductType) {
        switch (freeProductType) {
          case "productCategory": {
            fPwhere = {
              "categories.id": {
                inq: [discountDetails.categoryId],
              },
              inStock: true,
            };
            break;
          }

          case "products": {
            fPwhere = {
              id: {
                inq: discountDetails[activeProduct?.id]?.discountValue?.freeProducts?.ids,
              },
              inStock: true,
            };
            break;
          }

          case "productTag": {
            fPwhere = {
              productTag: {
                inq: discountDetails[activeProduct?.id]?.discountValue?.freeProducts?.ids,
              },
              inStock: true,
            };
            break;
          }
          default: {
            console.info(`No Free Product`);
          }
        }

        return productApi.getProductShades("IND", fPwhere, 0, include).then(({ data: freeProd }) => freeProd);
      }
      return null;
    }
    return null;
  };

  /* Adobe Modal Load Event - Mini PDP */
  const adobeLoadEvent = () => {
    let category = "";
    let categoryId = "";
    let subCategory = "";
    let pwp = "";
    if (relationalData?.categories) {
      categoryId = activeProduct?.categories?.find((x: any) => x.type === "child")?.id;
      category =
        relationalData?.categories?.[activeProduct?.categories?.find((x: any) => x.type === "child")?.id]?.cms[0]?.content.name;
      subCategory =
        relationalData?.categories?.[activeProduct?.categories?.find((x: any) => x.type === "subChild")?.id]?.cms[0]?.content
          .name;
    }

    let tags: any = [];
    const { list } = activeProduct?.tag || [];

    if (list.length > 0) {
      list.map((tag: any) => {
        tags.push(tag.name);
        tags.push(`${tag.name}-${format(new Date(), "ddMMyy")}`);
      });
    }

    if (freeProducts) {
      if (freeProducts?.data?.count === 1) {
        pwp = freeProducts?.data?.data[0]?.cms[0]?.content?.name;
      } else {
        pwp = freeProducts?.data?.data[0]?.productTag;
      }
    }

    // #region // *WebEngage [19] - Product View
    let strProductName = activeProduct?.cms[0]?.content?.name;
    let strBundleName = "";

    if (activeProduct?.type === 2) {
      strBundleName = activeProduct?.cms[0]?.content?.name;
    }

    // GA : GTM , FBPixel Object required for Page Load Event & AddToBag Event
    const GAobj: any = {
      name: activeProduct?.cms[0]?.content?.name || "",
      id: activeProduct?.sku,
      price: formatPrice(activeProduct?.price),
      brand: "myglamm",
      category,
      variant: "",
      "Logged in": 0,
      "Product ID": activeProduct?.sku,
      "Stock Status": `${activeProduct?.inStock ? 1 : 0}`,
      "Selling Price": formatPrice(activeProduct?.offerPrice),
      "Product category ID": categoryId,
      "Product SKU": activeProduct?.sku,
      "Entry Location": window?.location?.href,
      MRP: formatPrice(activeProduct?.price),
      productId: activeProduct.id,
    };

    // GA : WebEngage object required for Page Load Event.
    const WebEngageObj: any = {
      bundleName: strBundleName || "",
      outOfStock: !activeProduct?.inStock,
      preOrder: activeProduct?.productMeta?.isPreOrder,
      currency: getCurrency(),
      discounted: activeProduct?.offerPrice < activeProduct?.price,
      inStock: activeProduct?.inStock,
      price: formatPrice(activeProduct?.price),
      offerPrice: formatPrice(activeProduct?.offerPrice),
      productName: strProductName || "",
      productSubCategoryName: activeProduct?.productTag,
      productSKU: activeProduct?.sku,
      starRating: "",
      userType: profile?.id ? "Member" : "Guest",
      virtualTryOn: false,
      productURL: activeProduct?.urlManager?.url,
      productImageURL: activeProduct?.assets?.find((x: any) => x.type === "image")?.imageUrl?.["200x200"] || "",
      productId: activeProduct.id,
      primaryCategory: category,
      tags,
    };

    const pageViewobject = {
      product: GAobj,
      webengage: WebEngageObj,
    };

    GAPageView("/", pageViewobject, "product");
    GA4Event([
      {
        event: "view_item",
        ecommerce: {
          currency: getCurrency(),
          value: pageViewobject.product.MRP,
          items: [
            {
              id: pageViewobject.product.id,
              item_id: pageViewobject.product.id,
              item_name: pageViewobject.product.name,
              discount: pageViewobject.product.MRP - pageViewobject.product.price,
              item_brand: pageViewobject.product.brand,
              item_category: pageViewobject.product.category,
              price: pageViewobject.product.price,
              quantity: 1,
              inventory_status: pageViewobject?.product?.inStock || activeProduct?.inStock ? "in stock" : "out of stock",
            },
          ],
        },
      },
    ]);

    const miniPDPLoad = {
      common: {
        pageName: `web|${activeProduct?.productTag}|minipdp`,
        newPageName: "mini pdp",
        subSection: `${category} - ${subCategory}`,
        assetType: "product",
        newAssetType: "product",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
        source: SOURCE_STATE.pdpSource || "other",
        ...(widgetName === "Banner Widget" && { bannerSource: "home" }),
      },
      product: [
        {
          productSKU: activeProduct.sku,
          productQuantity: 1,
          productOfferPrice: formatPrice(activeProduct.offerPrice),
          productPrice: formatPrice(activeProduct.price),
          productDiscountedPrice: formatPrice(activeProduct.price - activeProduct.offerPrice),
          productRating: "",
          productTotalRating: "",
          stockStatus: activeProduct?.inStock ? "in stock" : "out of stock",
          isPreOrder: "no",
          PWP: pwp || "",
          hasTryOn: "no",
        },
      ],
      widgetName: widgetName?.toLowerCase() || "",
      dsRecommendationWidget: {
        title: widgetName?.toLowerCase() || "",
      },
    };
    ADOBE_REDUCER.adobePageLoadData = miniPDPLoad;
  };

  return (
    <>
      {!showNotifyModal ? (
        <PopupModal show={show} onRequestClose={onRequestClose}>
          <section className={ModalContainer}>
            <MiniPDPHeader
              title={
                product.shades?.length > 1
                  ? t("HomeMiniPDPHeader") || `Select ${t("shade")} Before Add to Bag`
                  : "Product Details"
              }
            />
            {freeProducts?.data?.data.length > 0 && (
              <div className="flex justify-start" style={{ minHeight: "21px" }}>
                <span className="text-sm">
                  {t("HomeMiniPDPFreeText", [formatPrice(freeProducts?.data?.data[0]?.price)]) ||
                    `Free Gift ${t("worthAmount", [formatPrice(freeProducts?.data?.data[0]?.price, true)])} With this Purchase`}
                </span>
              </div>
            )}
            <MiniPDPShadeSelection
              slug={product?.urlManager?.url || product?.URL}
              activeProduct={activeProduct}
              setActiveProd={activeProd => setActiveProduct(activeProd)}
              setRelationalData={RData => setRelationalData(RData)}
              isFree={isFree}
              setDiscountDetails={(discountData: any) => {
                setDiscountDetails(discountData);
              }}
              styles={{
                themeColor,
                dots: themeColor, // "#8e73d5",
                dotsBackground: "var(--color2)", // "#ccb9ff"
              }}
              discountCode={discountCode}
              isMiniPDPBanner={isMiniPDPBanner}
            />
          </section>

          {activeProduct && (
            <div className={`flex justify-between bg-white px-3 py-2 relative ${ButtonContianer}`}>
              <a
                role="presentation"
                onClick={() => {
                  onRequestClose();
                  addOnExp
                    ? (PDP_STATES.addOnData = { ...addOnData, addOnMethod: "AddOnSkipped", showMiniPDPModal: false })
                    : router.push(
                        !icid
                          ? activeProduct?.urlManager?.url
                          : `${
                              activeProduct?.urlManager?.url
                            }?icid=${icid}_${activeProduct?.cms[0]?.content?.name?.toLowerCase()}_${productPosition}`
                      );
                }}
                className="bg-gray-300 mr-1 rounded-sm py-2 flex uppercase items-center text-gray-600 text-sm font-semibold w-full h-full justify-center relative"
                aria-label={t("miniPDPMoreDetails") || `MORE DETAILS`}
              >
                {addOnExp ? "Skip Now" : t("miniPDPMoreDetails") || `MORE DETAILS`}
              </a>

              <button
                type="button"
                disabled={loader}
                onClick={addToCart}
                className="flex uppercase items-center text-white text-sm font-semibold w-full justify-center relative rounded ml-1 bg-ctaImg outline-none"
              >
                {CTA ? (
                  <>
                    {CTA}
                    <div className="ml-3">
                      <BagIconWhite role="img" aria-labelledby="add to cart" />
                    </div>
                    {loader && <LoadSpinner className="absolute inset-0 w-8 mx-auto" />}
                  </>
                ) : (
                  "\u00A0"
                )}
              </button>
            </div>
          )}
        </PopupModal>
      ) : (
        <NotifyModal
          show={showNotifyModal}
          onRequestClose={() => {
            setNotifyModal(false);
            onRequestClose();
          }}
          productId={activeProduct?.id}
        />
      )}
    </>
  );
};

export default HomeMiniPDP;
