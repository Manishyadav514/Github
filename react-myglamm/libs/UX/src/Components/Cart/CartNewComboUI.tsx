import CartAPI from "@libAPI/apis/CartAPI";
import ProductAPI from "@libAPI/apis/ProductAPI";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import PDPKitShadeModalV2 from "@libComponents/PopupModal/PDPKitShadeModalV2";
import useTranslation from "@libHooks/useTranslation";
import { updateCart, updateCartLoader } from "@libStore/actions/cartActions";
import { GLAMMCLUB_CONFIG } from "@libUtils/glammClubUtils";
import { adobeClickShadeChange, adobeShadeChangeSuccess } from "@productLib/pdp/AnalyticsHelper";
import { cartProduct } from "@typesLib/Cart";
import { clsx } from "clsx";
import React, { useState } from "react";

const CartNewComboProductUI = ({
  childProducts,
  product,
  displayProductPrice,
  displayCartCta,
  isOrderSummary,
}: {
  childProducts: cartProduct[];
  product: cartProduct;
  displayProductPrice: (product: cartProduct) => React.ReactElement;
  displayCartCta: (product: cartProduct) => React.ReactElement;
  isOrderSummary?: boolean;
}) => {
  const { t } = useTranslation();
  const [selectedShade, setSelectedShade] = useState<number>(0);
  const [comboShades, setComboShades] = useState<any>([]);
  const [showMiniPdpModal, setShowMiniPdpModal] = useState<boolean | undefined>();
  const glammClubConfig = GLAMMCLUB_CONFIG() || {};
  const lastChildProduct = childProducts[childProducts.length - 1].productId;

  const handleShadeChange = async (index: number, childProductSku: string, product: cartProduct) => {
    adobeClickShadeChange(product);

    const productApi = new ProductAPI();

    const response = await productApi.getComboShades(product?.sku, product?.productId);

    if (response?.data?.status) {
      let updateComboShade = response.data.data;

      let activeShadeIndexDetails: Array<any> = updateComboShade[index]?.productDetails;

      const findSkuByIndex = activeShadeIndexDetails.findIndex((shade: any) => shade.sku === childProductSku);

      activeShadeIndexDetails?.splice(0, 0, activeShadeIndexDetails.splice(findSkuByIndex, 1)[0]);

      setSelectedShade(index);
      setComboShades(activeShadeIndexDetails);
      setShowMiniPdpModal(true);
    }
  };
  const changeProductShade = async (selectedComboShade: any) => {
    adobeShadeChangeSuccess(product);

    const newChildShadeSku = comboShades[selectedComboShade].sku;
    const oldChildSku = childProducts.find((_, index: number) => index === selectedShade)?.sku ?? "";

    updateCartLoader(true);
    const cartApi = new CartAPI();

    const response = await cartApi.replaceComboProductInCart({
      productId: product.productId,
      oldSKU: oldChildSku,
      newSKU: newChildShadeSku,
    });

    if (response.data.status) {
      updateCart(response.data);
    }

    updateCartLoader(false);
  };

  return (
    <div className={clsx("mb-2 flex bg-white")}>
      <div className="w-4/12 p-2 pr-0">
        {childProducts.map((childProduct: cartProduct, index: number) => (
          <div
            className={`bg-color2 p-2 relative ${index < childProducts.length - 1 ? "pb-4" : ""}`}
            key={`${childProduct.productId}_${index}`}
          >
            {product?.productMeta?.isTrial && glammClubConfig?.PDPTrialIconV2 && index === 0 && (
              <img
                src={glammClubConfig?.PDPTrialIconV2}
                alt="Glamm Club Trial Product"
                className="absolute left-1 z-10"
                width={33}
              />
            )}
            <div className="flex justify-center">
              <ImageComponent src={childProduct.imageUrl} alt={childProduct.name} className="w-24 h-24" />
            </div>
            {index < childProducts.length - 1 && (
              <span className="flex justify-center absolute inset-x-0 mx-auto z-10 -bottom-0.5 opacity-70 text-2xl leading-3">
                +
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="w-8/12 p-3 flex flex-col justify-between">
        <div>
          <p className="font-bold text-sm line-clamp-2">{product.name}</p>
          <span className="text-xs border-dashed border-b border-stone-300 mt-3">Items in this combo</span>
          {childProducts.map((childProduct: cartProduct, index: number) => (
            <div key={`${childProduct.productId}_${index}`} className="mt-3">
              <p className="text-xs text-gray-500">{`${childProduct.quantity}x ${
                childProduct.name.includes("-")
                  ? childProduct.name.slice(0, childProduct.name.lastIndexOf("-"))
                  : childProduct.name
              }`}</p>

              {childProduct?.shadeLabel && (
                <div className="flex items-center justify-between mt-2 mb-3">
                  <div className="flex items-center">
                    <img src={childProduct.shadeImage} alt={childProduct.shadeLabel} className="w-3 h-3 rounded-sm" />
                    <span className="text-xs ml-1 ">{`- ${childProduct.shadeLabel}`}</span>
                  </div>

                  {!isOrderSummary && (
                    <>
                      {!childProduct?.name?.toLowerCase()?.includes("giftcard" || "gift card") && (
                        <button
                          onClick={() => handleShadeChange(index, childProduct.sku, product)}
                          className="border-color1 text-color1 text-xs border-b leading-tight"
                        >
                          Change Shade
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs  w-full">
          {displayProductPrice(product)}
          <div className={clsx("", !product.errorFlag ? "flex justify-between" : "")}>
            {!isOrderSummary && displayCartCta(product)}
          </div>
        </div>
      </div>

      {typeof showMiniPdpModal === "boolean" && (
        <PDPKitShadeModalV2
          shades={comboShades}
          showModal={showMiniPdpModal}
          setShowModal={setShowMiniPdpModal}
          variant={t("shades")}
          changeProductShade={changeProductShade}
          parentProduct={product}
        />
      )}
    </div>
  );
};
export default CartNewComboProductUI;
