import React, { ReactElement } from "react";

import { PDPProd } from "@typesLib/PDP";

import { getImage } from "@libUtils/homeUtils";
import { formatPrice } from "@libUtils/format/formatPrice";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import useDiscountPartnership from "@libHooks/useDiscountPartnership";

interface fixedATCProps {
  ATCButton: (arg: boolean) => ReactElement;
  product: PDPProd;
  show: boolean;
}

const PDPATCBottomWeb = ({ product, show, ATCButton }: fixedATCProps) => {
  const { partnershipAmount } = useDiscountPartnership({ products: product?.id, productDetail: product });
  return (
    <div
      className={`fixed w-screen inset-x-0 py-3 border-t border-gray-200 bg-white shadow-inner z-40 transition-all ease-in-out duration-500 ${
        show ? "bottom-0" : "-bottom-28"
      }`}
    >
      <div className="max-w-screen-xl flex items-center mx-auto">
        <div className="w-2/5 flex items-center">
          <ImageComponent src={getImage(product, "200x200")} alt={product?.cms?.[0].content?.name} width={60} height={60} />

          <h4 className="text-18 font-bold pl-8">
            <span>{product?.cms?.[0].content?.name}</span>&nbsp;
            <span>
              {partnershipAmount?.payableAmount
                ? formatPrice(partnershipAmount?.payableAmount, true)
                : formatPrice(product.offerPrice, true)}
            </span>
            {product.offerPrice < product.price && (
              <del className="font-thin text-gray-400 ml-2">
                {partnershipAmount?.discountAmount
                  ? formatPrice(partnershipAmount?.discountAmount, true)
                  : formatPrice(product.price, true)}
              </del>
            )}
          </h4>
        </div>

        {ATCButton(false)}
      </div>
    </div>
  );
};

export default PDPATCBottomWeb;
