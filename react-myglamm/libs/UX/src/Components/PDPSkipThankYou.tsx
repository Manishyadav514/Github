import React, { useEffect, useState } from "react";
import useAddtoBag from "@libHooks/useAddToBag";
import useTranslation from "@libHooks/useTranslation";
import Adobe from "@libUtils/analytics/adobe";
import { ADOBE } from "@libConstants/Analytics.constant";
import { formatPrice } from "@libUtils/format/formatPrice";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import MiniPDPShadeSelection from "@libComponents/MiniPDP/MiniPDPShadeSelection";

import { GAaddToCart, GAPageView } from "@libUtils/analytics/gtm";
import { GAAddProduct } from "@checkoutLib/Cart/Analytics";
import dynamic from "next/dynamic";
// @ts-ignore
import { ButtonContianer } from "@libStyles/css/miniPDP.module.css";
import { format } from "date-fns";
import { SESSIONSTORAGE } from "@libConstants/Storage.constant";
import CartAPI from "@libAPI/apis/CartAPI";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { isWebview } from "@libUtils/isWebview";
import useAppRedirection from "@libHooks/useAppRedirection";

import { getLocalStorageValue } from "@libUtils/localStorage";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";

const ConfettiModal = dynamic(
  () => import(/* webpackChunkName: "ConfettiModal" */ "@libComponents/OrderSummary/ConfettiModal"),
  {
    ssr: false,
  }
);

interface miniPDP {
  productSlug: { slug: string | undefined; couponCode: string };
  discount?: number;
  widgetMeta?: any;
  bannerImage?: string;
  isSurvey?: boolean;
}

const SkipThankYou = ({ productSlug, discount, widgetMeta, bannerImage, isSurvey = true }: miniPDP) => {
  const { slotMachine, miniPDPCTA }: any = JSON.parse(widgetMeta || "{}");

  const { t } = useTranslation();

  const { addProductToCart } = useAddtoBag();

  const [loader, setLoader] = useState(false);

  const [activeProduct, setActiveProduct] = useState<any>();
  const [relationalData, setRelationalData] = useState<any>();
  const [showConfetti, setShowConfetti] = useState(false);
  const [removeConfetti, setRemoveConfetti] = useState(slotMachine);

  const { products, productCount } = useSelector((store: ValtioStore) => store.cartReducer.cart);

  const productLength =
    products?.length || productCount > 0 || getLocalStorageValue("webengageCartDetails", true)?.cart?.numberOfItems > 0;

  /* Adobe Modal Load Event - Mini PDP */
  let categoryId = "";
  let category = "";
  let subCategory = "";
  if (relationalData?.categories && activeProduct) {
    categoryId = activeProduct?.categories?.find((x: any) => x.type === "child")?.id;
    category =
      relationalData?.categories[activeProduct?.categories?.find((x: any) => x.type === "child")?.id]?.cms[0]?.content.name;
    subCategory =
      relationalData?.categories[activeProduct?.categories?.find((x: any) => x.type === "subChild")?.id]?.cms[0]?.content.name;
  }

  useEffect(() => {
    if (activeProduct && relationalData) {
      const miniPDPLoad = {
        common: {
          pageName: `web|${activeProduct.productTag}|minipdp`,
          newPageName: "mini pdp",
          subSection: `${category} - ${subCategory}`,
          assetType: "product",
          newAssetType: "product",
          platform: ADOBE.PLATFORM,
          pageLocation: "",
          technology: ADOBE.TECHNOLOGY,
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
            PWP: "",
            hasTryOn: "no",
          },
        ],
        widgetName: slotMachine ? "slot_machine thankyoupage" : "surveythankyoupage",
      };
      ADOBE_REDUCER.adobePageLoadData = miniPDPLoad;
      productViewGAEvent();
    }
  }, [relationalData, activeProduct]);

  useEffect(() => {
    if (removeConfetti && activeProduct) {
      setTimeout(() => setShowConfetti(true), 100);

      setTimeout(() => {
        setShowConfetti(false);
        setRemoveConfetti(false);
      }, 4000);
    }
  }, [slotMachine, activeProduct]);

  const productViewGAEvent = () => {
    // #region // *WebEngage [19] - Product View
    let strProductName = "";
    let strBundleName = "";
    if (activeProduct?.type === 2) {
      strBundleName = activeProduct?.cms[0]?.content?.name;
    } else {
      strProductName = activeProduct?.cms[0]?.content?.name;
    }

    let tags: any = [];
    const { list } = activeProduct?.tag || [];

    if (list.length > 0) {
      list.map((tag: any) => {
        tags.push(tag.name);
        tags.push(`${tag.name}-${format(new Date(), "ddMMyy")}`);
      });
    }

    // GA : GTM , FBPixel Object required for Page Load Event & AddToBag Event
    const GAobj: any = {
      name: activeProduct?.cms[0]?.content?.name || "",
      id: activeProduct?.sku,
      price: parseFloat((activeProduct?.price / 100).toString()),
      brand: "myglamm",
      category,
      variant: "",
      "Logged in": 0,
      "Product ID": activeProduct?.sku,
      "Stock Status": `${activeProduct?.inStock ? 1 : 0}`,
      "Selling Price": parseFloat((activeProduct?.offerPrice / 100).toString()),
      "Product category ID": categoryId,
      "Product SKU": activeProduct?.sku,
      "Entry Location": window?.location?.href,
      MRP: parseFloat((activeProduct?.price / 100).toString()),
    };

    // GA : WebEngage object required for Page Load Event.
    const WebEngageObj: any = {
      bundleName: strBundleName || "",
      outOfStock: !activeProduct?.inStock,
      preOrder: activeProduct?.productMeta?.isPreOrder,
      currency: "INR",
      discounted: activeProduct?.offerPrice < activeProduct?.price,
      inStock: activeProduct?.inStock,
      price: parseFloat((activeProduct?.price / 100).toString()),
      offerPrice: parseFloat((activeProduct?.offerPrice / 100).toString()),
      productName: strProductName || "",
      productSubCategoryName: activeProduct?.productTag,
      productSKU: activeProduct?.sku,
      starRating: "",
      userType: localStorage.getItem("memberId") ? "Member" : "Guest",
      virtualTryOn: false,
      productURL: activeProduct.urlManager?.url,
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
  };

  const { redirect } = useAppRedirection();

  /* Adobe Event to be Called After Free Product added to Cart  */

  const AdobeEventATB = () => {
    (window as any).digitalData = {
      common: {
        linkName: `web|${category} - ${subCategory}|product description page|Claim Your Reward`,
        linkPageName: `web|${subCategory}|${activeProduct.productTag}|product description page`,
        newLinkPageName: window.digitalData?.common?.pageName,
        assetType: "product",
        newAssetType: "product",
        subSection: "",
        platform: ADOBE.PLATFORM,
        ctaName: "claim free lipstick",
        pageLocation: "",
      },
      user: Adobe.getUserDetails(),
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
          PWP: "",
          hasTryOn: "no",
        },
      ],
    };
    Adobe.Click();
  };

  /* OnClick Handler - Add Product to Bag */
  const claimFreeLipstick = () => {
    setLoader(true);
    if (SESSIONSTORAGE.FREE_XO_PRODUCT in sessionStorage && productLength) {
      const FreeProductDetails = JSON.parse(sessionStorage.getItem(SESSIONSTORAGE.FREE_XO_PRODUCT) || "{}");
      const cartApi = new CartAPI();
      cartApi
        .replaceProductInCart({ oldSKU: FreeProductDetails.sku, newSKU: activeProduct.sku })
        .then(({ data: result }: any) => {
          AdobeEventATB();
          setLoader(false);
          if (isSurvey) {
            sessionStorage.setItem(SESSIONSTORAGE.FREE_XO_PRODUCT, JSON.stringify(activeProduct));
          }
          redirect(
            `/shopping-bag${
              LOCALSTORAGE.CARTID in localStorage && isWebview() ? `?cartId=${getLocalStorageValue(LOCALSTORAGE.CARTID)}` : ""
            }`
          );
        })
        .catch((err: any) => {
          console.error(err.response?.data?.message || "Cart minipdp error");
        });

      return;
    }
    /* Adobe.send('click') Event - Claim Free Lipstick */
    addProductToCart(activeProduct, 1, undefined, undefined, false).then(res => {
      if (res) {
        AdobeEventATB();
        GAaddToCart(GAAddProduct(activeProduct, category), category);
        if (isSurvey) {
          sessionStorage.setItem(SESSIONSTORAGE.FREE_XO_PRODUCT, JSON.stringify(activeProduct));
        }
        redirect(
          `/shopping-bag${
            LOCALSTORAGE.CARTID in localStorage && isWebview() ? `?cartId=${getLocalStorageValue(LOCALSTORAGE.CARTID)}` : ""
          }`
        );
      }

      setLoader(false);
    });
  };

  const isFree = !discount;

  return (
    <>
      <section className="bg-white">
        {showConfetti && <ConfettiModal show={showConfetti} />}
        <img
          className="w-full h-auto object-cover"
          src={bannerImage || "https://files.myglamm.com/site-images/original/Congratulations---1.png"}
        />
        <div className="px-6">
          <MiniPDPShadeSelection
            isFree={isFree}
            discountAmount={discount}
            slug={productSlug.slug}
            setActiveProd={product => setActiveProduct(product)}
            activeProduct={activeProduct}
            setRelationalData={RData => setRelationalData(RData)}
            imgSize={"220px"}
            skipThankYou={true}
          />
        </div>
      </section>

      {/* This will work only for ab testing */}
      {activeProduct && (
        <div className={`${ButtonContianer} fixed bottom-0 left-0 pb-7 px-44 h-16 z-[51]`}>
          <button
            type="button"
            disabled={loader}
            onClick={claimFreeLipstick}
            className="relative uppercase font-semibold text-sm text-white w-full bg-themePink py-2 rounded-md h-10"
          >
            {miniPDPCTA || (isFree ? t("miniPDPCTA") : t("miniPDPCTA")?.replace(" Free", ""))}
            {loader && <LoadSpinner className="w-8 inset-0 absolute m-auto" />}
          </button>
        </div>
      )}
    </>
  );
};

export default SkipThankYou;
