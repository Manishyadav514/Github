import React from "react";

import { formatPrice } from "@libUtils/format/formatPrice";

import DeleteIcon from "../../../public/svg/delete.svg";
import Checkbox from "../../../public/svg/checkbox.svg";

const DiscountFreeProduct = ({ discountTagProduct, discountProduct, onRemoveDiscount, removeGP, t }: any) => {
  const removeTagProduct = () => {
    if (!confirm("Are you sure you want to remove this product from the shopping bag?")) {
      return;
    }
    // true param indicate that user removed freeproduct manually by self so we will ignore that coupon
    onRemoveDiscount(true);
  };
  if (discountTagProduct) {
    return (
      <div
        className="w-full mb-2 bg-white my-1 pb-1"
        style={{
          background: "url(https://files.myglamm.com/site-images/original/backgift.png) right bottom no-repeat #ffebeb",
          backgroundPosition: "100% bottom",
          backgroundSize: "50px",
        }}
      >
        {/* <div className="relative w-full flex relative"> */}
        <div className="w-full flex px-2 py-2">
          <div className="w-2/6 flex justify-content items-center">
            <Checkbox width="20" height="20" className="my-auto w-8" />

            {discountTagProduct?.assets[0]?.imageUrl && discountTagProduct?.assets[0]?.imageUrl["200x200"] && (
              <img
                src={discountTagProduct?.assets[0]?.imageUrl["200x200"] || discountTagProduct?.assets[0]?.url}
                className="w-12 h-12 px-1 ml-3 "
                alt="gift"
              />
            )}
          </div>

          <div className="w-4/6 relative">
            <p className="text-xs mb-2 truncate w-8/12">{discountTagProduct?.cms[0]?.content?.name}</p>
            <p className="text-xxs font-bold opacity-50 pb-1 uppercase">{discountTagProduct?.cms[0]?.content?.shadeLabel}</p>
            <span className="font-bold text-xs uppercase">{t("free")}</span>
            <span className="line-through pl-2 opacity-50 text-xs">{formatPrice(discountTagProduct?.offerPrice, true)}</span>

            <DeleteIcon className="mt-1 absolute top-1 right-1" onClick={removeTagProduct} />
          </div>
        </div>
        {/* </div> */}
      </div>
    );
  }
  if (discountProduct) {
    return (
      <div
        className="w-full mb-2 bg-white my-1 pb-1"
        style={{
          background: "url(https://files.myglamm.com/site-images/original/backgift.png) right bottom no-repeat #ffebeb",
          backgroundPosition: "100% bottom",
          backgroundSize: "50px",
        }}
      >
        <div className={`${discountProduct.errorFlag ? "" : "py-2"} w-full flex px-2`}>
          <div className="w-2/6 flex justify-content items-center">
            {discountProduct.errorFlag ? (
              <button
                type="button"
                className="border border-pink w-5 h-5 bg-white my-auto ml-1 outline-none rounded"
                onClick={removeGP}
              />
            ) : (
              <Checkbox width="20" height="20" className="my-auto w-8" />
            )}
            <img src={discountProduct.assets[0].imageUrl["200x200"]} className="w-12 h-12 px-1 ml-3 " alt="gift" />
          </div>

          <div className="w-4/6 relative">
            <p className="text-xs mb-2 truncate w-8/12">{discountProduct?.cms[0]?.content?.name}</p>
            <p className="text-xxs font-bold opacity-50 pb-1 uppercase">{discountProduct?.cms[0]?.content?.shadeLabel}</p>
            <span className="font-bold text-xs uppercase">{t("free")}</span>
            <span className="line-through pl-2 opacity-50 text-xs">{formatPrice(discountProduct?.offerPrice, true)}</span>
            <DeleteIcon
              className={`${discountProduct.errorFlag ? "top-1.5" : "top-1"} mt-1 absolute right-1`}
              onClick={removeTagProduct}
            />
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default DiscountFreeProduct;
