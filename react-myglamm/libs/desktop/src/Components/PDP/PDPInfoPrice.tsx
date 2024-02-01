import React, { Fragment } from "react";

import { PDPProd } from "@typesLib/PDP";

import useTranslation from "@libHooks/useTranslation";
import useDiscountPartnership from "@libHooks/useDiscountPartnership";

import { isClient } from "@libUtils/isClient";
import { formatPrice } from "@libUtils/format/formatPrice";

import StarIcon from "../../../../UX/public/svg/star-filled.svg";

const PDPInfoPrice = ({ product }: { product: PDPProd }) => {
  const { t } = useTranslation();

  const { cms, ratings, price, offerPrice, partnerShipData, id } = product;

  const partnershipPayable = useDiscountPartnership({
    products: id,
    productDetail: product,
    SSRPartnerShipData: partnerShipData,
  }).partnershipAmount.payableAmount;

  const SSRpayableAmount = partnerShipData?.couponList?.find((data: any) => data.productId === id)?.payableAmount;

  const partnershipPayableAmount = isClient() ? partnershipPayable : SSRpayableAmount;

  return (
    <Fragment>
      <h1 className="font-bold pt-3 mb-2.5 text-2xl">{cms?.[0]?.content?.name}</h1>
      <h2 className="mb-2.5 text-gray-500">{cms?.[0]?.content?.subtitle}</h2>

      {ratings?.avgRating > 0 && (
        <div className="flex items-center mb-2">
          <span className="font-bold text-18 flex items-center">
            {ratings?.avgRating} <StarIcon className="ml-2" height={20} width={20} />
          </span>
          <div className="border-r border-gray-300 h-6 mx-3" />
          <span>
            {ratings.totalCount}&nbsp;{t("ratings")}
          </span>
        </div>
      )}

      <div className="flex items-center">
        <span className="text-2xl uppercase">
          {partnershipPayableAmount === 0 ? t("free") : formatPrice(partnershipPayableAmount || offerPrice, true)}
        </span>
        &nbsp;
        {offerPrice < price && <del className="text-22 text-gray-400 ml-1">{formatPrice(price, true)}</del>}
      </div>

      <p className="text-sm pt-2 pb-4">{t("mrpTaxes")}</p>
    </Fragment>
  );
};

export default PDPInfoPrice;
