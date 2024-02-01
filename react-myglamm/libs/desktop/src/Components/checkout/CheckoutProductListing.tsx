import React from "react";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { formatPrice } from "@libUtils/format/formatPrice";

import { ValtioStore } from "@typesLib/ValtioStore";

import ImageComponent from "@libComponents/Common/LazyLoadImage";

const CheckoutProductListing = () => {
  const { t } = useTranslation();

  const { allProducts } = useSelector((store: ValtioStore) => store.cartReducer.cart);

  const products = allProducts.filter(x => x.cartType !== 2); // products without PWP

  return (
    <div>
      <h6 className="font-bold uppercase border-b border-gray-300 mt-2.5 pb-4">{t("yourOrder") || "Your Order"}</h6>

      {products.map((prod, index) => (
        <div className={` ${products.length === index + 1 ? "" : "border-b border-gray-300"}`}>
          <div className={`flex justify-between items-center p-2`}>
            <ImageComponent src={prod.imageUrl} alt={prod?.name} height={88} width={88} />

            <p className="p-2.5 capitalize w-3/5">{prod?.name}</p>

            <span className="w-1/6 text-center">{prod?.quantity}</span>

            <span className="w-1/6 text-center">{formatPrice(prod?.totalPrice, true)}</span>
          </div>

          {prod.freeProducts?.map(freeProduct => (
            <div className={`flex items-center p-2`}>
              <ImageComponent src={freeProduct.imageUrl} alt={freeProduct?.name} height={88} width={88} />

              <p className="p-2.5 capitalize w-3/5">{freeProduct?.name}</p>

              <span className="w-1/6 text-center uppercase">{t("free")}</span>

              <span className="w-1/6" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CheckoutProductListing;
