import React, { useEffect } from "react";
import PopupModal from "./PopupModal";
import useTranslation from "@libHooks/useTranslation";
import { formatPrice } from "@libUtils/format/formatPrice";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { ADOBE } from "@libConstants/Analytics.constant";
import { adobeKeepGiftCard } from "@checkoutLib/Payment/Payment.Analytics";
import { getLocalStorageValue } from "@libUtils/localStorage";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";

const RemoveGiftCardModal = ({
  show,
  close,
  product,
  removeProduct,
  setShowRemoveProductModal,
  isAddedFromMiscProducts,
}: {
  show: boolean;
  isAddedFromMiscProducts: boolean;
  close: () => void;
  product: any;
  removeProduct: (product: any) => void;
  setShowRemoveProductModal: (_: boolean) => void;
}) => {
  const { t } = useTranslation();

  const cart = useSelector((store: ValtioStore) => store.cartReducer.cart);

  const removeGiftCard = t("removeGiftCard");

  useEffect(() => {
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: "web|GC payment|Remove GC",
        newPageName: "Remove GC",
        assetType: "payment",
        newAssetType: "payment",
        platform: ADOBE.PLATFORM,
        pageLocation: "payment",
        technology: ADOBE.TECHNOLOGY,
      },
    };
  }, []);

  const shippingCharges = getLocalStorageValue(LOCALSTORAGE.SHIPPING_CHARGES, true);
  return (
    <PopupModal show={show} onRequestClose={close}>
      <div className="bg-white p-4 rounded-t-md">
        <div
          dangerouslySetInnerHTML={{
            __html: removeGiftCard
              .replace(
                "{{giftcardAmount}}",
                `<span class="font-bold">${formatPrice(
                  (isAddedFromMiscProducts ? product?.totalPrice : product?.priceMRP) / 100,
                  true,
                  false
                )}</span>`
              )
              .replace(
                isAddedFromMiscProducts ||
                  (cart.shippingCharges === 0 &&
                    `<li class='text-sm mt-2 ml-1'>Shipping charges worth {{shippingCharges}} would get added to your order</li>`),
                ""
              )
              .replace(
                "{{shippingCharges}}",
                `<span class="font-bold">${formatPrice(
                  shippingCharges || cart.shippings?.[0]?.shippingCharges,
                  true,
                  false
                )}</span>`
              )
              .replace(
                "{{discount}}",
                `<span class="font-bold"> ${
                  isAddedFromMiscProducts
                    ? `@${[Math.round((product?.offerPrice / product?.unitPrice) * 100).toString()]}%`
                    : "@50%"
                }  discount</span>`
              )
              .replace(
                "{{giftcardAmount}}",
                `<span class="font-bold">${formatPrice(
                  (isAddedFromMiscProducts ? product?.totalPrice : product?.priceMRP) / 100,
                  true,
                  false
                )}</span>`
              ),
          }}
        />

        <div className="flex items-center mt-5">
          <div className="w-1/2">
            <button
              onClick={() => {
                removeProduct(product);
                setShowRemoveProductModal(false);
              }}
              className=" border border-color1 text-color1 font-bold py-2 w-full uppercase rounded"
            >
              Remove
            </button>
          </div>
          <div className="w-1/2 ml-3">
            <button
              onClick={() => {
                adobeKeepGiftCard();
                close();
              }}
              className="bg-color1 text-white font-bold py-2 w-full uppercase rounded"
            >
              Keep Gift card
            </button>
          </div>
        </div>
      </div>
    </PopupModal>
  );
};

export default RemoveGiftCardModal;
