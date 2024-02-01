import React, { useState } from "react";

import { useRouter } from "next/router";

import useAddtoBag from "@libHooks/useAddToBag";

import LoadSpinner from "@libComponents/Common/LoadSpinner";

import { GAaddToCart } from "@libUtils/analytics/gtm";
import { formatPrice, getCurrency } from "@libUtils/format/formatPrice";

import { PDPBundleProd } from "@typesLib/PDP";

import { SESSIONSTORAGE } from "@libConstants/Storage.constant";
import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

const PDPRountineBundling = ({ bundleData }: { bundleData: PDPBundleProd }) => {
  console.log("PDPRoutineBundling");
  const router = useRouter();

  const { productData, relationalData, bundleImg, CTA } = bundleData;

  const { addProductToCart } = useAddtoBag();

  const [loader, setLoader] = useState(false);

  const handleAddToCart = async () => {
    setLoader(true);

    addProductToCart(productData, 1, undefined, undefined).then(res => {
      setLoader(false);

      if (res) {
        gaAddtoCart(productData);
        router.push("/shopping-bag");
      }
    });
  };

  // #region // *WebEngage [16] - Product Add To Cart - PDP Routine Bundling : GA Function
  const gaAddtoCart = (addedProduct: any, isFreeProduct = false) => {
    const childId = addedProduct?.categories.filter((c: any) => c.type === "child")[0]?.id;
    const categoryData = relationalData?.categories[childId]?.cms[0]?.content.name;

    // #region // *WebEngage [16] - Product Add To Cart - PDP Routine Bundling : Function Call
    const webEngageProductDataLayer = prepareWebengageAddedProductsDatalayer(addedProduct, isFreeProduct);
    // #endregion // WebEngage [16] - Product Add To Cart - PDP Routine Bundling : Function Call

    GAaddToCart(webEngageProductDataLayer, categoryData);
  };
  // #endregion // WebEngage [16] - Product Add To Cart - PDP Routine Bundling : GA Function

  // #region // *WebEngage [16] - Product Add To Cart - PDP Routine Bundling: Prepare Function
  const prepareWebengageAddedProductsDatalayer = (addedProduct: any, isFreeProduct = false) => {
    let strProductName = "";
    let strBundleName = "";
    if (addedProduct?.type === 2) {
      strBundleName = addedProduct?.cms[0]?.content.name;
    } else {
      strProductName = addedProduct?.cms[0]?.content.name;
    }
    addedProduct.webengage = {
      bundleName: strBundleName,
      currency: getCurrency(),
      freeGiftWithProduct: false,
      inviteCode: "",
      preOrder: addedProduct?.productMeta?.isPreOrder,
      price: formatPrice(addedProduct?.price),
      productName: strProductName,
      productSKU: addedProduct?.sku,
      productSubCategoryName: addedProduct?.productTag,
      shade: addedProduct?.cms[0]?.attributes?.shadeLabel || "",
      type: addedProduct?.productMeta?.showInParty ? "Party" : "Normal",
      userType: localStorage.getItem("memberId") ? "Member" : "Guest",
      isFreeProduct: !!isFreeProduct || addedProduct?.offerPrice === 0,
      offerPrice: formatPrice(addedProduct?.offerPrice),
      productType: addedProduct?.type,
      isTrial: addedProduct?.productMeta?.isTrial || "",
    };

    const fbEventId = sessionStorage.getItem(SESSIONSTORAGE.FB_EVENT_ID);
    if (fbEventId) {
      addedProduct.webengage["eventID"] = fbEventId;
    }

    return addedProduct;
  };
  // #endregion // WebEngage [16] - Product Add To Cart - PDP Routine Bundling: Prepare Function

  return (
    <div className="relative">
      <div className="px-1 py-2">
        <img src={bundleImg || DEFAULT_IMG_PATH()} alt="Bundle_Product" />
      </div>

      <div className="flex justify-between bg-white px-3 py-2" style={{ height: "3.5rem" }}>
        <div className="w-2/4 flex items-center">
          <div>
            <h2 className="text-xl font-semibold">{formatPrice(productData.offerPrice, true)}</h2>
          </div>
          <div>
            {productData.offerPrice < productData.price && (
              <p className="text-sm font-medium ml-2 text-gray-600 line-through">{formatPrice(productData.price, true)}</p>
            )}
          </div>
        </div>

        <div
          aria-hidden="true"
          className="w-3/4 flex items-center justify-center h-10"
          onClick={() => handleAddToCart()}
          style={{
            backgroundImage: "linear-gradient(to left, #000000, #454545)",
            borderRadius: "2px",
            opacity: loader ? "0.5" : "1",
          }}
        >
          <div className="flex justify-center">
            {loader && <LoadSpinner className="absolute w-6 mx-auto" />}
            <span className="flex  text-white text-sm font-semibold">{CTA}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDPRountineBundling;
