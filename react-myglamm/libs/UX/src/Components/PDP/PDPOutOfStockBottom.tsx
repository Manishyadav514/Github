import ProductAPI from "@libAPI/apis/ProductAPI";
import ConfigText from "@libComponents/Common/ConfigText";
import ViewSimilarOOSPopup from "@libComponents/PopupModal/ViewSimilarOOSPopup";
import useDsAdobe from "@libHooks/useDsAdobe";
import { PDPProd } from "@typesLib/PDP";
import { getClientQueryParam } from "@libUtils/_apputils";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

const NotifyModal = dynamic(() => import(/* webpackChunkName: "NotifyModal" */ "@libComponents/PopupModal/NotifyModal"), {
  ssr: false,
});

const PDPOutOfStockBottom = ({ product }: { product: PDPProd }) => {
  const [showNotifyModal, setNotifyModal] = useState<boolean>();
  const [show, setShow] = useState<boolean>();
  const [products, setProducts] = useState<any>();
  const [loader, setLoader] = useState<boolean>(true);
  const discountCode = getClientQueryParam("discountCode") || "";

  useEffect(() => {
    const productApi = new ProductAPI();
    productApi
      // @ts-ignore
      .getViewSimilarOOSProduct(product?.sku || product?.SKU, discountCode)
      .then(res => {
        setProducts(res.data.data[0]);
        if (res.data?.data?.[0]?.value?.products.length) {
          setLoader(false);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const { dsWidgetRef } = useDsAdobe({
    title: products?.key,
    dsWidgetType: products?.key,
    products: products?.value?.products || [] ,
    variantValue: products?.value.variantValue,
  });
  return (
    <>
      <div
        className="PDPOutOfStockBottom bg-white pb-2 sticky bottom-0 z-20 "
        style={{
          boxShadow: "0px 0px 3px rgba(0, 0, 0, 0.20)",
        }}
      >
        <ConfigText
          configKey="outOfStock"
          className="text-red-600 text-center font-bold block mx-auto text-xs py-1.5 capitalize"
        />
        <div className="flex gap-3 px-2">
          <button
            type="button"
            className="flex rounded-sm uppercase items-center  text-sm font-semibold w-full justify-center relative whitespace-nowrap h-10 border border-gray-300 "
            onClick={() => {
              setNotifyModal(true);
            }}
          >
            <ConfigText configKey="notifyMe" fallback="Notify Me" />
          </button>
          <button
            type="button"
            disabled={loader}
            className="flex rounded-sm uppercase items-center text-white text-sm font-semibold w-full justify-center relative bg-ctaImg whitespace-nowrap h-10"
            onClick={() => setShow(true)}
          >
            <ConfigText configKey="viewSimilar" fallback="View Similar" />
          </button>
        </div>
      </div>

      {/* Notify Me Modal */}
      {showNotifyModal && (
        <NotifyModal show={showNotifyModal} onRequestClose={() => setNotifyModal(false)} productId={product?.id} />
      )}

      {show && (
        <ViewSimilarOOSPopup show={show} onRequestClose={() => setShow(false)} products={products} dsRef={dsWidgetRef} />
      )}
    </>
  );
};

export default PDPOutOfStockBottom;
