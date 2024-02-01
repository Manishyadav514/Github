import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Link from "next/link";

import useAddtoBag from "@libHooks/useAddToBag";
import useAppRedirection from "@libHooks/useAppRedirection";
import useTranslation from "@libHooks/useTranslation";

import { PLPProduct } from "@typesLib/PLP";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import PLPShadesGrid from "@libComponents/PLP/PLPShadesGrid";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import PLPWishlistButton from "@libComponents/PLP/PLPWishlistButton";
import ProductAPI from "@libAPI/apis/ProductAPI";
import StarIcon from "../../../public/svg/star-filled.svg";
import CartIcon from "../../../public/svg/carticon-white.svg";
import { isWebview } from "@libUtils/isWebview";
import { WidgetProduct } from "@typesLib/Cart";
import { GAAddProduct } from "@checkoutLib/Cart/Analytics";
import { GAaddToCart } from "@libUtils/analytics/gtm";
import { ADOBE } from "@libConstants/Analytics.constant";
import Adobe from "@libUtils/analytics/adobe";
import { getAdobeProduct } from "@checkoutLib/Cart/Analytics";
import PDPAvgRating from "@libComponents/PDP/PDPAvgRating";
import { formatPrice } from "@libUtils/format/formatPrice";

const NotifyModal = dynamic(() => import(/* webpackChunkName: "NotifyModal" */ "@libComponents/PopupModal/NotifyModal"), {
  ssr: false,
});

interface PDPGrid {
  product: PLPProduct;
  productRef?: any;
  forceLoad?: boolean;
  setMiniPDPFreeProduct?: any;
}

const MiniPDPGrid = ({ product, productRef, forceLoad = false, setMiniPDPFreeProduct }: PDPGrid) => {
  const router = useRouter();
  const { request_source, platform } = router.query;
  const { redirect } = useAppRedirection();
  const { t } = useTranslation();
  const { addProductToCart } = useAddtoBag();

  const [CTA, setCTA] = useState(t("addToBag"));
  const [loader, setLoader] = useState(false);
  const [activeIndex, setActiveIndex] = useState(
    product.shades.length > 0 ? product.shades.findIndex(data => data.productId === product.productId) : 0
  );
  const [showNotifyModal, setShowNotifyModal] = useState<boolean | undefined>();

  const activeShade = product.shades[activeIndex];
  const { priceMRP, priceOffer } = activeShade || product || {};
  const { inStock } = activeShade || product?.meta || {};
  const isPreOrder = activeShade ? activeShade.isPreOrder : product.meta?.isPreProduct;

  const addToBag = () => {
    if (inStock) {
      setLoader(true);

      addProductToCart(activeShade || product, isPreOrder ? 3 : 1).then(async (res: any) => {
        if (res) {
          if (isWebview()) {
            if (isWebview() === "android") {
              (window as any).MobileApp.redirect(t("miniPDPCartRedirect"));
            } else {
              window.location.href = t("miniPDPCartRedirect");
            }
          } else {
            const isFreeProductAvailable = await getProductDetails(activeShade || product, product.productTag);

            if (isFreeProductAvailable?.data.data.length === 1) {
              addProductToCart(isFreeProductAvailable.data.data[0], 2, product.productId);
            } else if (isFreeProductAvailable?.data.data.length) {
              isFreeProductAvailable.parentId = activeShade?.productId;
              setMiniPDPFreeProduct(isFreeProductAvailable);
            } else {
              router.push(`/shopping-bag`);
            }
          }
        }
        setLoader(false);
      });
    } else {
      setShowNotifyModal(true);
    }
  };

  const getProductDetails = (product: any, productTag: any) => {
    const where = {
      inStock: true,
      id: product?.productId,
      productTag: encodeURIComponent(productTag),
      "productMeta.displaySiteWide": true,
    };
    const include = ["price", "productTag", "cms", "inStock", "type", "sku", "categories"];
    const productApi = new ProductAPI();

    return productApi.getProductShades("IND", where, 0, include).then(({ data: prodRes }) => {
      const productData: WidgetProduct = {
        ...prodRes.data.data[0],
        id: product.productId,
        offerPrice: product.priceOffer,
        price: product.priceMRP,
        urlManager: { url: product.slug },
        assets: [{ imageUrl: { ["200x200"]: product.shadeImage }, name: "" }],
        productMeta: {
          isPreOrder: product?.isPreOrder,
          showInParty: false,
          tryItOn: false,
          allowShadeSelection: false,
        },
        products: [],
      };

      /*Call to  Collection  Add To Bag Events */
      collectionAddToBagAnalytics(productData, prodRes.data.relationalData, prodRes.data.data[0].categories);

      return checkFreeProduct(prodRes.data, product.productId);
    });
  };

  const checkFreeProduct = (product: any, id: any) => {
    if (product.discountDetails && product.discountDetails?.[id]) {
      const include = ["price", "productTag", "type", "cms", "assets", "inStock", "categories", "sku", "offerPrice"];
      let fPwhere = {};

      const freeProductType = product.discountDetails?.[id].discountValue?.freeProducts?.type;
      if (product.discountDetails && freeProductType) {
        switch (freeProductType) {
          case "productCategory": {
            fPwhere = {
              "categories.id": {
                inq: [product.discountDetails.categoryId],
              },
              inStock: true,
            };
            break;
          }

          case "products": {
            fPwhere = {
              id: {
                inq: product.discountDetails[id]?.discountValue?.freeProducts?.ids,
              },
              inStock: true,
            };
            break;
          }

          case "productTag": {
            fPwhere = {
              productTag: {
                inq: product.discountDetails[id]?.discountValue?.freeProducts?.ids,
              },
              inStock: true,
            };
            break;
          }
          default: {
            console.info(`No Free Product`);
          }
        }

        const productApi = new ProductAPI();
        return productApi.getProductShades("IND", fPwhere, 0, include).then(({ data: freeProd }) => freeProd);
      }
      return null;
    }
    return null;
  };

  const addToBagAdobeEvent = (product: any, category: any, subCategory: any) => {
    const ADOBE_DATA = ADOBE.ADD_TO_BAG["collection"];
    const { assetType, newAssetType, newLinkPageName } = ADOBE_DATA || {};

    (window as any).digitalData = {
      common: {
        assetType,
        newAssetType,
        newLinkPageName,
        ctaName: "add to bag",
        platform: ADOBE.PLATFORM,
        linkPageName: ADOBE_DATA.linkPageName.replace("{productTag}", product.productTag || " "),
        linkName: ADOBE_DATA.linkName
          .replace("{name}", product.cms[0]?.content?.name || product.productTag || " ")
          .replace("{category}", category || " "),
        subSection: `${category || "{category}"} - ${subCategory || product.productTag || " "}`,
      },
      user: Adobe.getUserDetails(),
      product: getAdobeProduct([product]),
    };
    Adobe.Click();
  };

  /* Collection  Add To Bag Events */
  const collectionAddToBagAnalytics = (product: WidgetProduct, relationalData: any, categories: any) => {
    let category = "";
    let subCategory = "";
    if (relationalData?.categories && categories) {
      category = relationalData?.categories[categories.find((x: any) => x.type === "child")?.id]?.cms[0]?.content.name;
      subCategory = relationalData?.categories[categories.find((x: any) => x.type === "subChild")?.id]?.cms[0]?.content.name;
    }

    /* Adobe  Add To Bag Event */
    addToBagAdobeEvent(product, category, subCategory);
    /* GA Add To Bag Event */
    GAaddToCart(GAAddProduct(product, category, true), category);
  };

  useEffect(() => {
    if (!inStock) {
      setCTA(t("notifyMe"));
    } else if (isPreOrder) {
      setCTA(t("preOrderNow"));
    } else {
      setCTA(t("addToBag"));
    }
  }, [t, inStock]);

  return (
    <div ref={productRef} className="bg-white rounded-lg px-5 pb-5 text-center relative mb-5" role="listitem">
      <div className="relative">
        <ImageComponent
          forceLoad={forceLoad}
          src={activeShade?.productImage || product.imageURL}
          alt={activeShade?.shadeLabel || product.imageAltTag}
          className="w-[200px] h-[200px] mx-auto"
        />
      </div>

      {product?.rating?.avgRating > 0 && (
        <div className="flex -mt-5  ">
          <PDPAvgRating
            size={10}
            avgRating={
              product?.rating?.avgRating % 1 != 0 ? product?.rating?.avgRating.toFixed(1) : product?.rating?.avgRating + ".0"
            }
            totalCount={product?.rating?.totalCount}
          />
        </div>
      )}
      <PLPWishlistButton
        product={product}
        activeShadeId={activeShade?.productId}
        TLstyle={{ btn: "top-3 right-3", svg: "h-9 w-9" }}
      />

      <p className="text-sm truncate py-2.5 capitalize">{product.productTag}</p>

      <PLPShadesGrid shades={product.shades} activeIndex={activeIndex} setActiveIndex={i => setActiveIndex(i)} />

      <div className="flex items-center justify-center">
        <span className="font-semibold text-22">{formatPrice(product.priceOffer, true)}</span>
        {priceMRP > priceOffer && (
          <div className="mt-0.5">
            <del className="text-gray-400 text-sm mx-2">{formatPrice(priceMRP, true)}</del>
            <span className="text-red-500 font-semibold tracking-wider text-sm">
              -{Math.round(((priceMRP - priceOffer) / priceMRP) * 100)}% OFF
            </span>
          </div>
        )}
      </div>

      <button
        type="button"
        disabled={loader}
        onClick={addToBag}
        className="bg-ctaImg text-white font-semibold relative w-full rounded-sm mt-2 mb-4 py-2"
      >
        {CTA}
        <CartIcon className="absolute inset-y-0 my-auto right-2" />
        {loader && <LoadSpinner className="absolute inset-0 m-auto w-8" />}
      </button>

      <Link
        href={activeShade?.slug || product.URL}
        prefetch={false}
        className="uppercase font-semibold text-gray-400 w-full text-sm"
        aria-label={t("viewDetails")}
      >
        {t("viewDetails")}
      </Link>

      {/* Notify Me Modal */}
      {typeof showNotifyModal === "boolean" && (
        <NotifyModal
          show={showNotifyModal}
          onRequestClose={() => setShowNotifyModal(false)}
          productId={(activeShade || product)?.productId}
        />
      )}
    </div>
  );
};

export default MiniPDPGrid;
