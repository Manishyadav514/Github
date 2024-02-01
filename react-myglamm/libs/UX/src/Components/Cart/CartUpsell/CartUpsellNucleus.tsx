import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import CartUpsellSkeleton from "@libComponents/Skeleton/CartUpsellSkeleton";
import CartUpsellProduct from "./CartUpsellProduct";
import CartUpsellScrollTogether from "./CartUpsellScrollTogether";
import ShowUpsellProductsTitle from "./ShopUpsellProductsTitle";

import { useSelector } from "@libHooks/useValtioSelector";
import useTranslation from "@libHooks/useTranslation";
import useDsAdobe from "@libHooks/useDsAdobe";

import CartAPI from "@libAPI/apis/CartAPI";

import { addToBag } from "@libStore/actions/cartActions";
import { SOURCE_STATE } from "@libStore/valtio/SOURCE.store";

import { setValueForAdobe } from "@libUtils/widgetUtils";
import { GAaddToCart } from "@libUtils/analytics/gtm";
import { GAAddProduct, upsellClickEvent, upsellAddToBagClickEvent } from "@checkoutLib/Cart/Analytics";
import {
  getUpsellWidgetData,
  customizeUpsellDataBasedOnExpVariant,
  updateProducts,
  getPersonalisedUpsellWidget,
} from "@checkoutLib/Cart/HelperFunc";

import { ValtioStore } from "@typesLib/ValtioStore";
import { MiniPDPProd, UpsellData, WidgetProduct } from "@typesLib/Cart";

const UpsellMiniPDP = dynamic(() => import(/* webpackChunkName: "UpsellMiniPDP" */ "../../PopupModal/UpsellMiniPDP"), {
  ssr: false,
});

const GlammClubUpsellNucleusLayout = ({ children, dsWidgetRef }: any) => {
  return (
    <div
      className={"w-full py-2 mb-2 rounded-b-md"}
      ref={dsWidgetRef}
      style={{ backgroundImage: " linear-gradient(to right bottom, rgb(231, 34, 70), rgb(231, 34, 70), rgb(244, 59, 39))" }}
    >
      {children}
    </div>
  );
};

const CartUpsellNucleusLayout = ({ children, dsWidgetRef, cartTitle, cartSubTitle }: any) => {
  return (
    <div className="w-full py-2 bg-color2 rounded mb-2" ref={dsWidgetRef}>
      <ShowUpsellProductsTitle cartTitle={cartTitle} cartSubTitle={cartSubTitle} />
      {children}
    </div>
  );
};

const CartUpsellNucleus = ({
  showCallbackPersonalisedUpsell = false,
  variantTagsFlag,
  variant,
  showSingleRow = false,
  variants: experiments,
}: any) => {
  const { t } = useTranslation();
  const cart = useSelector((store: ValtioStore) => store.cartReducer.cart);

  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  const payableAmount = cart.payableAmount * 100;
  const upsellBuckets = t("cartUpsellBuckets");

  const [loader, setLoader] = useState<string>();
  const [showMiniPDP, setShowMiniPDP] = useState<boolean | undefined>(undefined);

  const [miniPDPProduct, setMiniPDPProduct] = useState<MiniPDPProd>();
  const [upsellWidgetData, setUpsellWidgetData] = useState<UpsellData>({});
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [upsellProducts, setUpsellProducts] = useState<any>([]);

  /* Upsell Widget Call and Logic */
  useEffect(() => {
    if (upsellBuckets && payableAmount !== undefined && !showCallbackPersonalisedUpsell) {
      /**
       * Evaluating the Slug based on the Cart Payable Amount and calling widgets api and storing it
       * Note: current slug is sent to avoid calling same widget again in case price bucket is same
       */
      getUpsellWidgetData(upsellBuckets, payableAmount, upsellWidgetData.slug).then(res => {
        if ((res as UpsellData).slug) {
          setUpsellWidgetData(res);
          setUpsellProducts(customizeUpsellDataBasedOnExpVariant(res.products, showSingleRow));
        }
        setShowSkeleton(false);
      });
    }
  }, [payableAmount, upsellBuckets, showCallbackPersonalisedUpsell]);

  /*  widget fallback call for personalised upsell  */
  useEffect(() => {
    if (showCallbackPersonalisedUpsell) {
      getPersonalisedUpsellWidget("mobile-site-personalised-upsell").then(res => {
        if ((res as UpsellData).slug) {
          setUpsellWidgetData(res);
          setUpsellProducts(customizeUpsellDataBasedOnExpVariant(res.products, showSingleRow));
        }
        setShowSkeleton(false);
      });
    }
  }, [showCallbackPersonalisedUpsell]);

  const getUpsellTitle = () => {
    if (variant === "2") {
      return "cartupsell_tworows_with_perpicks";
    }
    if (showSingleRow && !showCallbackPersonalisedUpsell) {
      return "cartupsell_singlerow";
    }
    if (showCallbackPersonalisedUpsell) {
      return "Personalised picks For you";
    }
    return "cartupsell_tworows";
  };

  const getChildrenForOneRowUpsell = () => {
    return (
      <React.Fragment>
        <div className="w-full flex overflow-x-scroll px-1" ref={dsWidgetRef}>
          {upsellProducts?.map((product: WidgetProduct) => (
            <CartUpsellProduct
              product={product}
              loader={loader}
              handleAddToBag={handleAddToBag}
              key={product.id}
              openMiniPdpModal={openMiniPdpModal}
            />
          ))}
        </div>
      </React.Fragment>
    );
  };

  const getChildrenForTwoRowUpsell = () => {
    return experiments?.scrollUpsellRowsTogether === "1" ? (
      <div className="w-full flex overflow-x-scroll px-1">
        <CartUpsellScrollTogether
          upsellData={upsellProducts}
          loader={loader}
          handleAddToBag={handleAddToBag}
          openMiniPdpModal={openMiniPdpModal}
          variants={experiments}
        />
      </div>
    ) : (
      <React.Fragment>
        <div className="w-full flex overflow-x-scroll px-1">
          {upsellProducts.firstHalfProducts?.map((product: WidgetProduct) => (
            <CartUpsellProduct
              product={product}
              loader={loader}
              handleAddToBag={handleAddToBag}
              key={product.id}
              openMiniPdpModal={openMiniPdpModal}
            />
          ))}
        </div>

        <div className="w-full flex overflow-x-scroll px-1">
          {upsellProducts.secondHalfProducts?.map((product: WidgetProduct) => (
            <CartUpsellProduct
              product={product}
              loader={loader}
              handleAddToBag={handleAddToBag}
              key={product.id}
              openMiniPdpModal={openMiniPdpModal}
            />
          ))}
        </div>
      </React.Fragment>
    );
  };

  /* Trigger Ds load Adobe Event */
  const { dsWidgetRef } = useDsAdobe({
    title: getUpsellTitle(),
    dsWidgetType: "none",
    variantValue: "99xoDefault",
    products: upsellWidgetData?.products,
    evarName: showCallbackPersonalisedUpsell ? "evar136" : "evar87",
  });

  useEffect(() => {
    setValueForAdobe(variantTagsFlag, upsellProducts?.[0]?.meta?.tags?.[0]?.name);
  }, [variantTagsFlag, upsellProducts]);

  const openMiniPdpModal = (product: WidgetProduct) => {
    SOURCE_STATE.addToBagSource = upsellWidgetData.title || "other";
    SOURCE_STATE.pdpSource = upsellWidgetData.title || "other";
    const cartApi = new CartAPI();
    return (
      cartApi
        /* Here first params "product.products" is the id of the child products in bundle */
        .getProductCustom(product.products, ["sku", "productTag"])
        .then(({ data: res }) => {
          setLoader(undefined);

          /* Removing product with sku = shippingCharges and sending its data to show miniPDP */
          const comboProd = res.data?.data?.filter((x: MiniPDPProd) => x.sku !== t("upSellSkipProductInCombo"))?.[0];

          if (comboProd) {
            setMiniPDPProduct({
              ...comboProd,
              mainComboProductId: product.id,
              mainComboProdOfferPrice: product.offerPrice,
              /**
               * Appending ShippingCharge product's id as childproduct that will
               * used while adding product in cart
               */
              childProductIds: product.products.find(x => x !== comboProd.id),
            });
            setShowMiniPDP(true);
          }
        })
        .catch(() => setLoader(undefined))
    );
  };

  const handleAddToBag = async (product: WidgetProduct) => {
    SOURCE_STATE.addToBagSource = upsellWidgetData.title || "other";
    setLoader(product.id);
    upsellClickEvent(userProfile, cart);

    /* In-Case of Allow Shade Selection Show MiniPDP */
    if (product.productMeta.allowShadeSelection) {
      return openMiniPdpModal(product);
    }

    const cartType = product.productMeta.isPreOrder ? 3 : 1;
    const res = await updateProducts({ ...product, cartType }, 1);
    const upsellTitle = getUpsellTitle();
    if (res) {
      addToBag(res);
      upsellAddToBagClickEvent(product, upsellTitle);
      GAaddToCart(GAAddProduct(product), "");
    }
    setLoader(undefined);
  };

  /* Skeleton Loader */
  if (showSkeleton) {
    return <CartUpsellSkeleton variants={experiments} />;
  }
  // check for product data if present then only show UI
  if (upsellWidgetData && (upsellProducts?.length || upsellProducts?.firstHalfProducts?.length)) {
    return (
      <React.Fragment>
        {showSingleRow || showCallbackPersonalisedUpsell ? (
          experiments?.glammClubUpsell === "1" ? (
            <GlammClubUpsellNucleusLayout>{getChildrenForOneRowUpsell()}</GlammClubUpsellNucleusLayout>
          ) : (
            <CartUpsellNucleusLayout cartTitle={upsellWidgetData?.title} cartSubTitle={upsellWidgetData?.subTitle}>
              {getChildrenForOneRowUpsell()}
            </CartUpsellNucleusLayout>
          )
        ) : experiments?.glammClubUpsell === "1" ? (
          <GlammClubUpsellNucleusLayout dsWidgetRef={dsWidgetRef}>{getChildrenForTwoRowUpsell()}</GlammClubUpsellNucleusLayout>
        ) : (
          <CartUpsellNucleusLayout
            dsWidgetRef={dsWidgetRef}
            cartTitle={upsellWidgetData?.title}
            cartSubTitle={upsellWidgetData?.subTitle}
          >
            {getChildrenForTwoRowUpsell()}{" "}
          </CartUpsellNucleusLayout>
        )}

        {miniPDPProduct && typeof showMiniPDP === "boolean" && (
          <UpsellMiniPDP
            show={showMiniPDP}
            comboProduct={miniPDPProduct}
            hide={() => setShowMiniPDP(false)}
            upsellTitle={getUpsellTitle()}
          />
        )}
      </React.Fragment>
    );
  }
  return null;
};

export default CartUpsellNucleus;
