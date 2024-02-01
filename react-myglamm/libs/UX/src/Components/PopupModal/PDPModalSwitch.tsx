import dynamic from "next/dynamic";

import React, { useEffect, useState } from "react";

import ProductAPI from "@libAPI/apis/ProductAPI";

import { ProductData } from "@typesLib/PDP";

const MiniPDPModal = dynamic(() => import("./MiniPDPModal"), { ssr: false });
const UpsellComboProductsModal = dynamic(() => import("./UpsellComboProductsModal"), { ssr: false });

interface PDPModalSwitch {
  slug: string;
  modalProps: {
    show: boolean;
    hide: () => void;
    discount?: number;
    productSlug: { slug: string; discountedPriceLabel: any; CTA?: string };
  };
}

const PDPModalSwitch = ({ slug, modalProps }: PDPModalSwitch) => {
  const [productData, setProductData] = useState<ProductData>();

  useEffect(() => {
    const productApi = new ProductAPI();
    productApi
      .getProduct({ "urlManager.url": slug }, 0, [
        "type",
        "cms",
        "assets",
        "productMeta.isPreOrder",
        "price",
        "offerPrice",
        "sku",
      ])
      .then(({ data }) => setProductData(data.data?.data[0] || { type: 1 }))
      .catch(err => {
        console.error(err);
        // @ts-ignore
        setProductData({ type: 1 }); //fallback to minipdp single product
      });
  }, []);

  if (productData?.type === 1) {
    return <MiniPDPModal {...modalProps} />;
  }

  if (productData?.type === 2) {
    return (
      <UpsellComboProductsModal
        {...modalProps}
        product={productData}
        close={modalProps.hide}
        discountedPriceLabel={modalProps.productSlug.discountedPriceLabel}
        CTA={modalProps.productSlug.CTA}
      />
    );
  }

  return null;
};

export default PDPModalSwitch;
