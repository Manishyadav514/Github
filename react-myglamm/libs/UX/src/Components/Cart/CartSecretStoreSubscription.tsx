import React, { useEffect, useState } from "react";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import debounce from "lodash.debounce";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import useAddtoBag from "@libHooks/useAddToBag";
import useRemoveSubscriptionProduct from "@libHooks/useRemoveSubscriptionProduct";
import { ADOBE } from "@libConstants/Analytics.constant";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import { subscriptionModel } from "@typesLib/Cart";
import CartSecretStoreSubscriptionSlider from "./CartSecretStoreSubscriptionSlider";

interface subsProps {
  availableSubscriptions: subscriptionModel;
  updateCheckout: () => void;
}

const CartSecretStoreSubscription = ({ availableSubscriptions, updateCheckout }: subsProps) => {
  const [isSubscribeCheck, setSubscribeCheck] = useState(false);
  const [isShowProducts, setShowProducts] = useState(false);
  const products = useSelector((store: ValtioStore) => store.cartReducer.cart.products);
  const subscriptionData = availableSubscriptions;

  const { addProductToCart } = useAddtoBag();
  const { removeVirtualProduct } = useRemoveSubscriptionProduct();

  useEffect(() => {
    const isVirtualProductExist =
      products.length > 0 ? products?.some(product => product.productMeta.isVirtualProduct && product.type === 1) : false;
    setSubscribeCheck(isVirtualProductExist);
  }, [products]);

  useEffect(() => {
    /* ADOBE EVENT - PAGELOAD - Subscription banner widget load */
    const { sku } = subscriptionData;
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: `web|cart page| subscription widget | ${sku} `,
        newPageName: "subscription widget",
        subSection: "subscription widget",
        assetType: "subscription_widget",
        newAssetType: "subscription_widget",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };
  }, []);

  /**
   * on change checkbox value Function
   * @param isChecked - checkbox current value - boolean
   */
  const onCheckSubscribe = debounce((isChecked: boolean) => {
    const { sku } = subscriptionData;
    if (isSubscribeCheck) {
      const virtualProductData =
        products.length > 0 ? products.find(product => product.productMeta.isVirtualProduct && product.type === 1) : null;
      removeVirtualProduct(virtualProductData, updateCheckout);
      setSubscribeCheck(false);
    } else {
      // on checked value - Add to bag logic - mapped subscription SKU product adding below.
      addProductToCart({ id: sku }, 1, undefined, [], true, true, false, true).then(res => {
        if (res) {
          setSubscribeCheck(isChecked);
        }
      });
    }
  }, 500);

  if (subscriptionData) {
    const { imgUrl, offerText, showLabelText, hideLabelText } = subscriptionData.meta && JSON.parse(subscriptionData.meta);
    return (
      <>
        <div>
          {/* secretstore banner section start */}
          <div className="text-sm px-2.5 py-2.5 bg-color2 flex items-center">
            {/* checkbox section */}
            <div className="relative w-5 h-5 shrink-0 mr-5">
              <div
                className={`absolute w-5 h-5 top-0 left-0 mx-2 rounded shrink-0 ${
                  isSubscribeCheck ? "bg-color1" : "bg-slate-300"
                } `}
              >
                <input
                  type="checkbox"
                  className="w-full h-full absolute top-0 left-0 opacity-0 z-50"
                  onChange={(e: any) => onCheckSubscribe(e.target.checked)}
                />
                <span
                  className={`absolute top-0.5 left-1.5 after:w-2 after:h-3 after:border-solid after:border-white after:border-white after:border-r-2 after:border-b-2 after:border-t-0 after:border-l-0 after:rotate-45 after:absolute`}
                ></span>
              </div>
            </div>
            {/* secret store text */}
            <div>
              <p>{offerText}</p>
              <div className="mt-0.5">
                <button className=" inline-block text-color1 underline" onClick={() => setShowProducts(!isShowProducts)}>
                  {isShowProducts ? hideLabelText || "Hide Products" : showLabelText || "View Products"}
                </button>
              </div>
            </div>
          </div>
          {/* Secretstore banner section end */}
          {/* Subscription products banners */}
          {isShowProducts && (
            <div className="flex relative bg-color2 my-2">
              {imgUrl && (
                <ImageComponent
                  className="w-28 shrink-0 min-w-[112px] max-w-[112px] min-h-[194px] max-h-[194px]"
                  alt={"49sub"}
                  src={imgUrl}
                />
              )}
              <div className="overflow-x-scroll" style={{ width: imgUrl ? `calc(100% - 112px)` : `w-full` }}>
                <CartSecretStoreSubscriptionSlider dots={"full"} slidesPerView={1.2} hideDots>
                  {subscriptionData?.assets.length > 0 &&
                    subscriptionData?.assets.map((obj, idx) => {
                      return (
                        <div className="w-28 shrink-0" key={idx}>
                          <ImageComponent
                            className="min-w-[112px] max-w-[112px] min-h-[194px] max-h-[194px]"
                            alt={"49sub"}
                            src={obj.url}
                          />
                        </div>
                      );
                    })}
                </CartSecretStoreSubscriptionSlider>
              </div>
            </div>
          )}
        </div>
      </>
    );
  } else {
    return null;
  }
};

export default CartSecretStoreSubscription;
