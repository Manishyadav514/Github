import React, { Fragment, useEffect, useState } from "react";

import { PDPProd } from "@typesLib/PDP";

import useTranslation from "@libHooks/useTranslation";

import { formatPrice } from "@libUtils/format/formatPrice";

import ProductAPI from "@libAPI/apis/ProductAPI";

import { SHOP } from "@libConstants/SHOP.constant";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

import ArrowIcon from "../../../../UX/public/svg/arrow-left.svg";
import ExclusivOfferIcon from "../../../public/svg/exclusive_offers.svg";

const ExclusiveOffersCashback = ({ product, offers }: { product: PDPProd; offers: any[] }) => {
  const { t } = useTranslation();

  const [cashbackPoints, setCashbackPoints] = useState();
  const [showReadMore, setShowReadMore] = useState(false);

  useEffect(() => {
    if (product.inStock && SHOP.IS_MYGLAMM) {
      const productApi = new ProductAPI();
      const { memberId } = checkUserLoginStatus() || {};
      productApi
        .getGPOnPDP({ unitPrice: product.price, id: memberId || "", isGuestUser: !memberId })
        .then(({ data: res }) => setCashbackPoints(res.data.commissionEarnings));
    }
  }, [product.id]);

  return (
    <Fragment>
      {cashbackPoints && (
        <div className="bg-themeGray p-2 w-max rounded mb-4">
          {t("youRecieve")}&nbsp;
          <strong>
            {t("cashWorth")}&nbsp;
            {formatPrice(cashbackPoints, true)}
          </strong>
          &nbsp;
          {t("pointPurchase")}
        </div>
      )}

      {offers?.length > 0 && (
        <section
          className={`border-t border-b border-gray-300 w-full transition-all pb-8 overflow-y-hidden ${
            showReadMore ? "h-max" : "h-32"
          }`}
        >
          <h2 className="flex items-center justify-between mt-5 mb-2.5">
            <ExclusivOfferIcon />

            {offers.length > 1 && (
              <button
                type="button"
                onClick={() => setShowReadMore(!showReadMore)}
                className="text-xs flex items-center uppercase font-bold"
              >
                {showReadMore ? t("readLess") : t("readMore")}
                <ArrowIcon className={`ml-3 w-4 h-4 transition-all ${showReadMore ? "rotate-90" : "-rotate-90"}`} />
              </button>
            )}
          </h2>

          <div className="p-2 pb-2.5 pl-0" dangerouslySetInnerHTML={{ __html: offers[0].commonDetails.description }} />

          {offers.slice(1).map(offer => (
            <div key={offer.id} className="p-2 pl-0" dangerouslySetInnerHTML={{ __html: offer.commonDetails.description }} />
          ))}
        </section>
      )}

      {/* PreOrder Info and Offers */}
      {product.productMeta.isPreOrder && product.productMeta.preOrderDetails?.shortDescription && (
        <div className="bg-themeGray p-2 w-max rounded mb-4">{product.productMeta.preOrderDetails.shortDescription}</div>
      )}
    </Fragment>
  );
};

export default ExclusiveOffersCashback;
