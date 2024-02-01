import React from "react";

import { useSelector } from "@libHooks/useValtioSelector";

import useTranslation from "@libHooks/useTranslation";

import { formatPrice } from "@libUtils/format/formatPrice";

import DowntimeMsg from "@libComponents/Payments/DowntimeMsg";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

import { ValtioStore } from "@typesLib/ValtioStore";

import PopupModal from "./PopupModal";

interface ErrorModalProps {
  show: boolean;
  hide: () => void;
  onProceed: () => void;
}

const ErrorFreeProductsOnCartModal = ({ show, hide, onProceed }: ErrorModalProps) => {
  const { t } = useTranslation();

  const { gwpProducts, pwpProducts, couponData } = useSelector((store: ValtioStore) => store.cartReducer.cart);

  return (
    <PopupModal show={show} onRequestClose={hide} type="center-modal">
      <section className="rounded-2xl w-11/12 pt-6 mx-auto">
        <div className="px-2.5">
          <h3 className="font-semibold text-xl mb-2 text-center">{t("confirmation")}</h3>
          <p
            className="text-red-400 mb-2 text-center px-4 text-sm"
            dangerouslySetInnerHTML={{
              __html:
                t("errorFreeGiftMsg", [`<strong>${couponData.couponCode}</strong>`]) ||
                `You cannot avail these Free Gifts with the <strong>${couponData.couponCode}</strong> promo code.`,
            }}
          ></p>

          {/* Products Listing */}
          <div className="mb-3 overflow-y-auto max-h-60">
            {[...pwpProducts, ...gwpProducts]
              .filter(x => x.errorFlag)
              .map(product => (
                <div className="w-full flex items-center py-2" key={product.productId}>
                  <ImageComponent height={52} width={52} src={product.imageUrl} alt={product.name} />

                  <div className="flex flex-col justify-between pl-2 w-4/5">
                    <p className="text-xs truncate">{product.name}</p>
                    <p className="text-10 font-semibold uppercase text-gray-400">{product.shadeLabel}</p>
                    <div className="flex items-center">
                      <span className="font-semibold text-xs mr-1 uppercase">{t("free")}</span>
                      <del className="text-10 text-gray-400">{formatPrice(product.price, true)}</del>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <DowntimeMsg
            className="text-xs pr-2"
            downtimeMsg="Please note that these FREE Gifts will be removed before placing the order."
          />
        </div>

        <div className="text-sm w-full flex border-t border-gray-100">
          <button
            type="button"
            onClick={hide}
            className="font-semibold uppercase opacity-75 w-1/2 border-r border-gray-100 h-14"
          >
            {t("cancel")}
          </button>
          <button
            type="button"
            onClick={() => {
              /* Hide Modal as well as proceed further logic */
              onProceed();
              hide();
            }}
            className="w-1/2 h-14 font-semibold uppercase"
          >
            proceed
          </button>
        </div>
      </section>
    </PopupModal>
  );
};

export default ErrorFreeProductsOnCartModal;
