import React from "react";

import { formatPrice } from "@libUtils/format/formatPrice";

import DeleteIcon from "../../../public/svg/delete.svg";
import Checkbox from "../../../public/svg/checkbox.svg";

const FreeProducts = (props: any) => {
  const {
    freeGifts,
    cartFreeGifts,
    discountTagProduct,
    discountProduct,
    remove,
    removeCartFreeProduct,
    reSelectCartFreeGift,
    t,
  } = props;

  return (
    <React.Fragment>
      {/* Product Free Products */}
      {(!discountTagProduct || !discountProduct) &&
        freeGifts.map((freeProduct: any, productIndex: number) => (
          <div key={productIndex} className="w-full mb-2 bg-white my-1 pb-1">
            <div className={`${freeProduct.freeProduct.errorFlag ? "" : "py-2"} w-full flex px-2`} key={freeProduct.productId}>
              <div className="w-2/6 flex justify-content items-center">
                {freeProduct.freeProduct.errorFlag ? (
                  <button
                    type="button"
                    className="border border-pink w-5 h-5 bg-white my-auto ml-1 outline-none rounded"
                    onClick={() => {
                      reSelectCartFreeGift(freeProduct.freeProduct);
                    }}
                  />
                ) : (
                  <Checkbox width="20" height="20" className="my-auto w-8" />
                )}
                <img src={freeProduct.freeProduct.imageUrl} className="w-12 h-12 px-1 ml-3 " alt="gift" />
              </div>

              <div className="w-4/6 relative">
                <span className="text-xxs text-red-400 text-center">{freeProduct.freeProduct.errorMessage}</span>
                <p className="text-xs mb-1 truncate w-8/12">{freeProduct.freeProduct.name}</p>
                <p className="text-xxs font-bold opacity-50 pb-1 uppercase">{freeProduct.freeProduct.shadeLabel}</p>
                <span className="font-bold text-xs uppercase">{t("free")}</span>
                <span className="line-through pl-2 opacity-50 text-xs">
                  {formatPrice(freeProduct.freeProduct.offerPrice, true)}
                </span>

                <DeleteIcon
                  className={`${freeProduct.freeProduct.errorFlag ? "top-0.5" : "top-1"} mt-1 absolute right-1`}
                  onClick={() => {
                    const isFreeProduct = true;
                    const parentId = freeProduct.parentProduct.productId;
                    remove(
                      freeProduct.freeProduct.productId,
                      freeProduct.freeProduct.type,
                      freeProduct.freeProduct,
                      isFreeProduct,
                      parentId
                    );
                  }}
                />
              </div>
            </div>
          </div>
        ))}

      {/* Cart Free Products */}
      {cartFreeGifts.map((freeProduct: any, productIndex: any) => (
        <div
          key={productIndex}
          className="w-full mb-2 bg-white my-1 pb-1"
          style={{
            background: "url(https://files.myglamm.com/site-images/original/backgift.png)  no-repeat #ffebeb",
            backgroundPosition: "100% bottom",
            backgroundSize: "50px",
          }}
        >
          <div className={`${freeProduct.freeProduct.errorFlag ? "" : "py-2"} w-full flex px-2`} key={freeProduct.productId}>
            <div className="w-2/6 flex justify-content items-center">
              {freeProduct.freeProduct.errorFlag ? (
                <button
                  type="button"
                  className="border border-pink w-5 h-5 bg-white my-auto ml-1 outline-none rounded"
                  onClick={() => {
                    reSelectCartFreeGift(freeProduct.freeProduct);
                  }}
                />
              ) : (
                <Checkbox width="20" height="20" className="my-auto w-8" />
              )}
              <img src={freeProduct.freeProduct.imageUrl} className="w-12 h-12 px-1 ml-3 " alt="gift" />
            </div>

            <div className="w-4/6 relative">
              <span className="text-xxs text-red-400 text-center">{freeProduct.freeProduct.errorMessage}</span>
              <p className="text-xs mb-1 truncate w-8/12">{freeProduct.freeProduct.name}</p>
              <p className="text-xxs font-bold opacity-50 pb-1 uppercase">{freeProduct.freeProduct.shadeLabel}</p>
              <span className="font-bold text-xs uppercase">{t("free")}</span>
              <span className="line-through pl-2 opacity-50 text-xs">
                {formatPrice(freeProduct.freeProduct.offerPrice, true)}
              </span>

              <DeleteIcon
                className={`${freeProduct.freeProduct.errorFlag ? "top-1.5" : "top-1"} mt-1 absolute right-1`}
                onClick={() => {
                  removeCartFreeProduct(freeProduct.freeProduct.productId, freeProduct.freeProduct.discountId);
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </React.Fragment>
  );
};

export default FreeProducts;
