import React, { useEffect, useState } from "react";
import debounce from "lodash.debounce";

import { useSelector } from "@libHooks/useValtioSelector";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import { subscriptionModel } from "@typesLib/Cart";
import useAddtoBag from "@libHooks/useAddToBag";
import useRemoveSubscriptionProduct from "@libHooks/useRemoveSubscriptionProduct";

import { ADOBE } from "@libConstants/Analytics.constant";

import { ValtioStore } from "@typesLib/ValtioStore";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

interface subsProps {
  availableSubscriptions: subscriptionModel;
  updateCheckout: () => void;
}

const CartNextOrderSubscription = ({ availableSubscriptions, updateCheckout }: subsProps) => {
  const [isSubscribeCheck, setSubscribeCheck] = useState(false);
  const products = useSelector((store: ValtioStore) => store.cartReducer.cart.products);
  const subscriptionData = availableSubscriptions;

  const { addProductToCart } = useAddtoBag();
  const { removeVirtualProduct } = useRemoveSubscriptionProduct();

  useEffect(() => {
    const isVirtualProductSubscriptionExist =
      products.length > 0 &&
      !!products.find(
        product => product.productMeta.isVirtualProduct && product.type === 1 && !product.productMeta.giftCardSku
      );

    setSubscribeCheck(isVirtualProductSubscriptionExist);
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
    return (
      <>
        <div className="relative items-center pb-2">
          <div
            className={`absolute w-5 h-5 top-11 left-2.5 mx-2 rounded shrink-0 ${
              isSubscribeCheck ? "bg-color1" : "bg-slate-300"
            } `}
          >
            <input
              type="checkbox"
              className="w-full h-full absolute t-0 l-0 opacity-0 z-50"
              onChange={(e: any) => onCheckSubscribe(e.target.checked)}
            />
            <span
              className={`absolute top-0.5 left-1.5 after:w-2 after:h-3 after:border-solid after:border-white after:border-white after:border-r-2 after:border-b-2 after:border-t-0 after:border-l-0 after:rotate-45 after:absolute`}
            ></span>
          </div>
          <div>
            <ImageComponent className="w-full h-24" alt={"49sub"} src={subscriptionData?.assets[0]?.url} />
          </div>
        </div>
      </>
    );
  } else {
    return null;
  }
};

export default CartNextOrderSubscription;
