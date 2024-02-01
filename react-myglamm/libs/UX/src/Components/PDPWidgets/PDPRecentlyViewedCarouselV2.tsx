import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import ProductAPI from "@libAPI/apis/ProductAPI";

import PDPLabel from "@libComponents/PDP/PDPLabel";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

import useTranslation from "@libHooks/useTranslation";
import useAddtoBag from "@libHooks/useAddToBag";

import { formatPrice } from "@libUtils/format/formatPrice";
import { showAddedToBagOrWishlist } from "@libUtils/showToaster";
import { isWebview } from "@libUtils/isWebview";

import { SHOP } from "@libConstants/SHOP.constant";

import { SOURCE_STATE } from "@libStore/valtio/SOURCE.store";
import { GA4Event } from "@libUtils/analytics/gtm";
import clsx from "clsx";
import PDPRatingV2 from "./PDPRatingV2";

const PreOrderModal = dynamic(() => import(/* webpackChunkName: "PreOrderModal" */ "@libComponents/PopupModal/PreOrderModal"), {
  ssr: false,
});
const NotifyModal = dynamic(() => import(/* webpackChunkName: "NotifyModal" */ "@libComponents/PopupModal/NotifyModal"), {
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
const CannotOrderModal = dynamic(
  () => import(/* webpackChunkName: "CannotOrderModal" */ "@libComponents/PopupModal/CannotOrderModal"),
  { ssr: false }
);

const CTAButton = dynamic(() => import("@libComponents/PDP/PDPCTAButton"), { ssr: false });

function PDPRecentlyViewedCarouselV2({ icid, productId}: any) {
  const { t } = useTranslation();
  const router = useRouter();
  const { addProductToCart } = useAddtoBag();

  const [recentViewProducts, setRecentViewProducts] = useState<any>([]);
  const [activeModal, setActiveModal] = React.useState("");
  const [notifyId, setNotifyId] = useState<any>();
  const [preOrderId] = useState<any>();
  const [miniPDPFreeProduct, setMiniPDPFreeProduct] = useState<any>({});
  const [miniPDPProduct, setMiniPDPProduct] = useState<any>({});
  const [productPosition, setProductPosition] = useState();
  const [productList, setProductList] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const id = productId;
    // get ids of recently views products save pdp
    let prevVal: any = localStorage.getItem("recentProduct");

    if (prevVal) {
      prevVal = JSON.parse(prevVal);
      setProductList(prevVal.filter((x: any) => x !== id));
    }
  }, [productId]);

  useEffect(() => {
    const recentProduct = async () => {
      try {
        const where = {
          id: {
            inq: productList,
          },
        };
        const include = [
          "price",
          "sku",
          "brand",
          "categories",
          "products",
          "productMeta",
          "offerPrice",
          "productTag",
          "type",
          "urlManager",
          "cms",
          "wms",
          "inStock",
          "assets",
        ];
        const api = new ProductAPI();
        const viewedProduct = await api.getProduct(where, 0, include, undefined, true);

        if (viewedProduct) {
          setRecentViewProducts(viewedProduct?.data?.data?.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    recentProduct();
  }, [productList]);

  //Set data and open miniPDP
  const openModal = (product: any, position: any) => {
    setMiniPDPProduct(product);
    setProductPosition(position);
    setActiveModal("mini_pdp");
  };

  // miniPDPProductModal call method
  const miniPDPProductData = (product: any, position: any) => {
    SOURCE_STATE.addToBagSource = t("recentlyViewedProdeucts");
    if (product?.shades?.length > 1) {
      SOURCE_STATE.pdpSource = t("recentlyViewedProdeucts");
      openModal(product, position);
    } else {
      setProductPosition(position);
      setLoading(true);
      addProductToCart(product, product?.productMeta.isPreOrder ? 3 : 1).then(res => {
        if (isWebview() && SHOP.SITE_CODE === "bbc") {
          router.push("/shopping-bag");
        } else {
          setLoading(false);
        }
        if (res) showToast();
      });
    }
  };

  //Open minPDP or redirect to PDP page if product shades not found
  const miniPDPOnImgClick = (product: any, position: any) => {
    SOURCE_STATE.pdpSource = t("recentlyViewedProdeucts");
    SOURCE_STATE.addToBagSource = t("recentlyViewedProdeucts");
    if (!product?.shades?.length || product?.shades?.length <= 1) return router.push(product.urlManager.url);
    openModal(product, position);
  };

  const showToast = () => {
    showAddedToBagOrWishlist(t("addedToCart") || "Added To Cart", 2500);
  };

  // notify logic
  const setNotify = (id: any) => {
    setActiveModal("notify");
    setNotifyId(id);
  };
  if (!(productList.length > 0)) {
    return null;
  }

  return (
    <section className="RecentlyViewProductV2 py-5 border-b-4 border-themeGray">
      {recentViewProducts.length > 0 && (
        <>
          <p className="text-15 font-bold pb-4 px-4 capitalize"> {t("recentlyViewedProdeucts") || "Recently Viewed"} </p>
        </>
      )}
      <ul
        className="px-4 overflow-x-auto flex list-none mb-0.5"
        dir="ltr"
        style={{
          scrollSnapType: "x mandatory",
        }}
      >
        {recentViewProducts?.map((product: any, index: number) => (
          <li
            key={product.id}
            className={clsx("mr-2 h-full rounded-3 overflow-hidden")}
            //!isNewDesign && "mb-2 px-2 py-3"
            style={{
              width: "125px",
              minWidth: "125px",
              boxShadow: "0 0 1px 0 rgba(0,0,0,.12)",
              border: "0.745px solid #EFEFEF",
            }}
          >
            <div
              className="flex justify-center"
              onClick={e => {
                miniPDPOnImgClick(product, index + 1);
              }}
            >
              <ImageComponent
                className="rounded-t-3"
                style={{ width: "124px", height: "124px" }}
                src={product?.assets[0]?.imageUrl?.["400x400"]}
                alt={product?.assets[0]?.name}
              />
            </div>
            <div className="p-1.5 -mt-5">
              <div className="h-5 my-1">
                <PDPRatingV2 avgRating={product?.rating?.avgRating} fontSize={10} svgSize={9} />
              </div>
              <p className="text-xs h-8 line-clamp-2 capitalize  mb-1.5">
                {product.cms[0]?.content?.name || product.productTag}
              </p>
              <div className="flex h-4 line-clamp-1 overflow-hidden">
                <p className="font-semibold text-13 mr-1.5">{formatPrice(product.offerPrice, true)}</p>
                {product.offerPrice !== product.price && (
                  // change text color text-gray-400 to text-gray-500 for sufficient color contrast
                  <>
                    <del className="text-11 text-gray-500 mr-1 mt-0.5">{formatPrice(product.price, true)}</del>
                    <span className="text-11 font-bold text-green-600 lowercase mt-0.5">
                      {t("priceOffPercentage", [
                        Math.round(((product.price - product.offerPrice) / product.price) * 100).toString(),
                      ])}
                    </span>
                  </>
                )}
              </div>
              <div className="mt-1">
                {product.productMeta.isPreOrder ? (
                  <CTAButton
                    loading={loading && productPosition === index + 1}
                    CTA={t("preOrderNow")}
                    clickAction={() => {
                      miniPDPProductData(product, index + 1);
                    }}
                  />
                ) : product.inStock ? (
                  <CTAButton
                    loading={loading && productPosition === index + 1}
                    CTA={t("addToBag")}
                    clickAction={() => {
                      miniPDPProductData(product, index + 1);
                    }}
                    isNewDesign={true}
                  />
                ) : (
                  <CTAButton
                    CTA={t("notifyMe")}
                    clickAction={(e: any) => {
                      e.stopPropagation();
                      setNotify(product.id);
                    }}
                    isNewDesign={true}
                  />
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      {/* MiniPDP modal  starts */}
      {activeModal === "mini_pdp" && (
        <HomeMiniPDPModal
          show={activeModal === "mini_pdp"}
          onRequestClose={() => setActiveModal("")}
          product={miniPDPProduct}
          icid={icid}
          productPosition={productPosition}
          t={t}
          themeColor="var(--color1)" //f88d8d //TODO
          setMiniPDPFreeProduct={(freeProd: any) => {
            setMiniPDPFreeProduct(freeProd);
            setActiveModal("pdp_free_product");
          }}
          widgetName={t("recentlyViewedProdeucts")}
        />
      )}
      {activeModal === "pdp_free_product" && miniPDPFreeProduct && (
        <PDPFreeProductModal
          show={activeModal === "pdp_free_product"}
          hide={() => setActiveModal("")}
          freeProduct={miniPDPFreeProduct}
          product={{ id: miniPDPFreeProduct?.parentId || 0 }}
          t={t}
        />
      )}
      {/* MiniPDP modal ends */}
      {activeModal === "notify" && (
        <NotifyModal show={activeModal === "notify"} productId={notifyId} onRequestClose={() => setActiveModal("")} />
      )}
      {activeModal === "preorder" && (
        <PreOrderModal show={activeModal === "preorder"} onRequestClose={() => setActiveModal("")} productId={preOrderId} />
      )}
      {activeModal === "cannot_order" && (
        <CannotOrderModal CannotOrder={activeModal === "cannot_order"} onRequestClose={() => setActiveModal("")} />
      )}
    </section>
  );
}

export default React.memo(PDPRecentlyViewedCarouselV2);
