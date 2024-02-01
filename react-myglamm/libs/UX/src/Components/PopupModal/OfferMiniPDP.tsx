import LoadSpinner from "@libComponents/Common/LoadSpinner";
import MiniPDPHeader from "@libComponents/MiniPDP/MiniPDPHeader";
import dynamic from "next/dynamic";
import MiniPDPShadeSelection from "@libComponents/MiniPDP/MiniPDPShadeSelection";
import useAddtoBag from "@libHooks/useAddToBag";
import React, { useEffect, useState } from "react";
import ProductAPI from "@libAPI/apis/ProductAPI";
import { useRouter } from "next/router";
import { ADOBE } from "@libConstants/Analytics.constant";

// @ts-ignore
import { ButtonContianer, ModalContainer } from "@libStyles/css/miniPDP.module.css";

import PopupModal from "./PopupModal";
import BagIconWhite from "../../../public/svg/carticon-white.svg";
import { formatPrice } from "@libUtils/format/formatPrice";
import { CONFIG_REDUCER, ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

const NotifyModal = dynamic(() => import(/* webpackChunkName: "NotifyModal" */ "@libComponents/PopupModal/NotifyModal"), {
  ssr: false,
});

const OfferMiniPDP = ({ slug, productTag, show, onRequestClose, t }: any) => {
  const productApi = new ProductAPI();
  const router = useRouter();

  const [loader, setLoader] = useState(false);
  const [activeProduct, setActiveProduct] = useState<any>();
  const [relationalData, setRelationalData] = useState<any>();
  const [discountDetails, setDiscountDetails] = useState<any>();
  const [freeProducts, setFreeProducts] = useState<any>();
  const [showNotifyModal, setNotifyModal] = useState(false);
  const [loadCount, setLoadCount] = useState(0);
  const { addProductToCart } = useAddtoBag(relationalData, {
    freeProduct: freeProducts?.data?.data,
  });
  /* OnClick Handler - Add Product to Bag */
  const addToCart = () => {
    setLoader(true);
    addProductToCart(activeProduct, 1).then(() => {
      if (freeProducts) onRequestClose(activeProduct, freeProducts);
      else {
        onRequestClose();
        router.push(`/shopping-bag`);
      }
      setLoader(false);
    });
  };

  useEffect(() => {
    if (loadCount === 0 && activeProduct && relationalData) {
      // for adobe first load event
      setLoadCount(1);
      adobeLoadEvent();
    }
  }, [activeProduct, relationalData]);

  useEffect(() => {
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
        productApi.getProductShades("IND", fPwhere, 0, include).then(({ data: freeProd }) => {
          setFreeProducts(freeProd);
        });
      }
    } else {
      setFreeProducts(undefined);
    }
  }, [discountDetails, activeProduct]);

  /* Adobe Modal Load Event - Mini PDP */
  const adobeLoadEvent = () => {
    let category = "";
    let subCategory = "";
    if (relationalData?.categories) {
      category =
        relationalData?.categories[activeProduct?.categories?.find((x: any) => x.type === "child")?.id]?.cms[0]?.content.name;
      subCategory =
        relationalData?.categories[activeProduct?.categories?.find((x: any) => x.type === "subChild")?.id]?.cms[0]?.content
          .name;
    }

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
      widgetName: "offers",
    };
    ADOBE_REDUCER.adobePageLoadData = miniPDPLoad;
  };

  return (
    <PopupModal show={show} onRequestClose={onRequestClose}>
      <section className={ModalContainer}>
        <MiniPDPHeader
          title={`Buy this Product ${
            freeProducts && freeProducts?.data?.data?.length > 0 && freeProducts?.data?.data[0]?.productTag
              ? `and Get FREE ${freeProducts?.data?.data[0]?.productTag}`
              : ""
          }`}
          underlineColor="#ffb4b4"
        />
        {freeProducts?.data?.data.length > 0 && (
          <div className="flex justify-start">
            <span className="text-smfont-thin">
              {t("worthAmount", [formatPrice(freeProducts?.data?.data[0]?.price, true)])}
            </span>
          </div>
        )}
        <MiniPDPShadeSelection
          slug={slug}
          productTag={productTag}
          activeProduct={activeProduct}
          setActiveProd={product => setActiveProduct(product)}
          setRelationalData={RData => setRelationalData(RData)}
          isFree={false}
          setDiscountDetails={(discountData: any) => setDiscountDetails(discountData)}
        />
      </section>

      <div className={ButtonContianer}>
        {activeProduct && !activeProduct.inStock ? (
          <button
            type="button"
            onClick={() => setNotifyModal(true)}
            className="relative uppercase font-semibold text-sm text-white bg-ctaImg py-2 flex justify-center w-full outline-none"
          >
            {t("notifyMe")}
          </button>
        ) : (
          <button
            type="button"
            disabled={loader}
            onClick={addToCart}
            className="relative uppercase font-semibold text-sm text-white bg-ctaImg py-2 flex justify-center w-full outline-none"
          >
            {discountDetails && freeProducts?.data?.data?.length > 0
              ? `Add to bag and ${freeProducts.data.data.length === 1 ? `get free product` : `select free product`}`
              : t("addToBag")}
            <BagIconWhite className="ml-5" />
            {loader && <LoadSpinner className="w-8 inset-0 m-auto absolute" />}
          </button>
        )}
      </div>

      {/* Notify Modal */}
      {showNotifyModal && (
        <NotifyModal
          show={showNotifyModal}
          productId={activeProduct.id}
          onRequestClose={() => {
            setNotifyModal(false);
            onRequestClose();
          }}
        />
      )}
    </PopupModal>
  );
};

export default OfferMiniPDP;
