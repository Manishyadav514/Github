import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Router from "next/router";

import PopupModal from "./PopupModal";

import { formatPrice } from "@libUtils/format/formatPrice";
import { showSuccess } from "@libUtils/showToaster";

import ProductAPI from "@libAPI/apis/ProductAPI";

import PDPAvgRating from "@libComponents/PDP/PDPAvgRating";
import PDPKitShadeSelectionV3 from "@libComponents/PDP/PDPKitShadeSelectionV3";
import LoadSpinner from "@libComponents/Common/LoadSpinner";

import useTranslation from "@libHooks/useTranslation";
import useAddtoBag from "@libHooks/useAddToBag";

import { addToBagUpsellAnalytics, updateProducts } from "@checkoutLib/Cart/HelperFunc";

import { addToBag } from "@libStore/actions/cartActions";
import { ADOBE } from "@libConstants/Analytics.constant";

import { getAdobeProduct } from "@checkoutLib/Cart/Analytics";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { SOURCE_STATE } from "@libStore/valtio/SOURCE.store";

import BagIconWhite from "../../../public/svg/carticon-white.svg";

const GiftCardDetails = dynamic(() => import("./GiftCardDetails"));

const UpsellComboProductsModal = ({
  show,
  close,
  product,
  isUpsellOnPayment,
  upsellTitle,
  discountedPriceLabel,
  CTA,
}: {
  show: boolean;
  close: () => void;
  product: any;
  isUpsellOnPayment?: boolean;
  upsellTitle?: string;
  discountedPriceLabel?: number;
  CTA?: string;
}) => {
  const { t } = useTranslation();

  const [comboShades, setComboShades] = useState<any>([]);
  const [comboShadeV3, setComboShadeV3] = useState<any>([]);
  const [loader, setLoader] = useState<boolean | undefined>();
  const [addToBagLoader, setAddToBagLoader] = useState<boolean | undefined>();
  const [openGiftCardTermsModal, setOpenGiftCardTermsModal] = useState<boolean | undefined>();
  const [minimumGiftCardBillAmount, setMinimumGiftCardBillAmount] = useState<number | undefined>();
  const includesProductsWithShade = comboShades?.some((item: any) => item?.productDetails?.length > 1);
  useEffect(() => {
    if (product) {
      fetchComboProducts();
    }
  }, [product]);

  const fetchComboProducts = async () => {
    setLoader(true);
    const productApi = new ProductAPI();
    const response = await productApi.getComboShades(product?.sku, product?.productId);
    try {
      if (response.data.status) {
        let updateComboShades = response.data.data;
        const childProd = updateComboShades.map((product: any) => {
          return product.productDetails?.[0];
        });

        setComboShadeV3(childProd);
        setComboShades(updateComboShades);
        setLoader(false);
      }
    } catch (err) {
      setLoader(false);
      console.error(err);
    }
  };

  /* Replace Active Kit Product with User Selected One in V3  */
  const selectProductShade = (shadeData: any, activeProdIndex: number) => {
    let updatedKitList: any[] = [...comboShadeV3];
    updatedKitList.splice(activeProdIndex, 1, shadeData);
    setComboShadeV3(updatedKitList);
  };

  const { addProductToCart } = useAddtoBag();

  const handleAddToBag = async () => {
    setAddToBagLoader(true);
    const selectedProduct = {
      ...product,
      childProductIds: comboShadeV3.map((combo: any) => combo.id),
      type: product.subProductType,
    };

    // no upsell page so add nomrally to cart and redirect
    if (!upsellTitle) {
      return addProductToCart(
        product,
        1,
        comboShadeV3.map((combo: any) => combo.id)
      ).then(result => {
        if (result) {
          setAddToBagLoader(false);
          close();
          Router.push("/shopping-bag");
        }
      });
    }

    try {
      const response = await updateProducts(selectedProduct, 1);

      if (response.status) {
        addToBagUpsellAnalytics(product, upsellTitle, isUpsellOnPayment ? "cartupsellPayment" : product.upsellKey);
        addToBag(response);
        setAddToBagLoader(false);
        close();
        showSuccess("Product added Successfully", 3000);
      }
    } catch (err) {
      setAddToBagLoader(false);
      console.error(err);
    }
  };

  /* Adobe Modal Load Event - Mini PDP */
  useEffect(() => {
    if (show && product) {
      const categoryDetails = {
        category: product?.productCategory?.find((x: any) => x.type === "child")?.name,
        subCategory: product?.productCategory?.find((x: any) => x.type === "subChild")?.name,
      };

      const miniPDPLoad = {
        common: {
          pageName: `web|${product.productTag}|minipdp`,
          newPageName: "mini pdp",
          subSection: `${categoryDetails?.category} - ${categoryDetails?.subCategory}`,
          assetType: "product",
          newAssetType: "product",
          platform: ADOBE.PLATFORM,
          pageLocation: "",
          technology: ADOBE.TECHNOLOGY,
          source: SOURCE_STATE.pdpSource || "other",
          upsellProductPosition: (window as any).evars.evar156,
        },
        product: getAdobeProduct([product]),
        widgetName: "upsell",
        dsRecommendationWidget: {
          title: Router.pathname === "/payment" ? "cartupsellPayment" : "upsell",
        },
      };
      ADOBE_REDUCER.adobePageLoadData = JSON.parse(JSON.stringify(miniPDPLoad));
    }

    /* ActiveProduct Changes on evershade selection that's why using ref to load view event once */
  }, [show]);

  return (
    <PopupModal show={show} onRequestClose={close}>
      <div className="bg-white p-2 rounded-t-lg">
        {loader ? (
          <div className="relative min-h-[70vh]">
            <LoadSpinner className="m-auto top-0 bottom-0 right-0 left-0 h-20 absolute" />
          </div>
        ) : (
          <React.Fragment>
            <h3 className="text-18 font-semibold inline pr-1 capitalize">
              {includesProductsWithShade ? t("selectShadesBeforeAddToBag") || "Select Shades Before Add To Bag" : "Add To Bag"}
            </h3>
            <div className="flex items-start mt-3">
              <div className="w-1/3">
                <img src={product?.assets[0]?.imageUrl["200x200"]} />
              </div>
              <div className="ml-4 w-2/3">
                <div className="flex flex-col justify-between h-32">
                  <div>
                    <ProductRatings product={product} />
                    <div className="text-sm line-clamp-3 overflow-hidden mt-2">{product.cms[0]?.content.name}</div>
                  </div>

                  <ProductPrice product={product} discountedPriceLabel={(discountedPriceLabel || 0) * 100} />
                </div>
              </div>
            </div>
            <div className="mt-3 border-t-2 border-gray-200">
              {comboShadeV3.length > 0 && (
                <PDPKitShadeSelectionV3
                  comboShades={comboShades}
                  comboShadesV3={comboShadeV3}
                  selectProductShade={selectProductShade}
                  showShadesHeader={false}
                  setOpenGiftCardTermsModal={setOpenGiftCardTermsModal}
                  setMinimumGiftCardBillAmount={setMinimumGiftCardBillAmount}
                />
              )}
            </div>

            {openGiftCardTermsModal && typeof openGiftCardTermsModal === "boolean" && (
              <GiftCardDetails
                show={openGiftCardTermsModal}
                onClose={() => setOpenGiftCardTermsModal(false)}
                selectedProduct={product}
                handleAddToBag={handleAddToBag}
                minBillAmount={minimumGiftCardBillAmount}
              />
            )}
            <button
              type="button"
              onClick={handleAddToBag}
              disabled={addToBagLoader}
              className="flex justify-center items-center bg-ctaImg capitalize text-sm text-white font-semibold w-full h-12 rounded-sm outline-none relative mt-3"
            >
              {CTA || t("addToBag")}
              <BagIconWhite className="ml-2" role="img" aria-labelledby="add to cart" />
              {addToBagLoader && <LoadSpinner className="absolute inset-0 m-auto w-8" />}
            </button>
          </React.Fragment>
        )}
      </div>
    </PopupModal>
  );
};

const ProductRatings = ({ product }: { product: any }) => {
  if (product.rating?.avgRating > 0) {
    return (
      <div className="w-5">
        <PDPAvgRating
          avgRating={
            product?.rating?.avgRating % 1 != 0 ? product?.rating?.avgRating.toFixed(1) : product?.rating?.avgRating + ".0"
          }
          totalCount={product?.rating?.totalCount}
        />
      </div>
    );
  }

  return null;
};

const ProductPrice = ({ product, discountedPriceLabel }: { product: any; discountedPriceLabel?: number }) => {
  if ((discountedPriceLabel || product.offerPrice) < product.price) {
    return (
      <div className="flex items-center">
        <span className="text-sm font-bold">{formatPrice(discountedPriceLabel || product.offerPrice, true)}</span>
        <del className="text-left text-gray-600 opacity-60 text-sm ml-1">{formatPrice(product.price, true)}</del>
      </div>
    );
  }

  return <div className="font-bold text-sm">{formatPrice(product.price, true)}</div>;
};

export default UpsellComboProductsModal;
