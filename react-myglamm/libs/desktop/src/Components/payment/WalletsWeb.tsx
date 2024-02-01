import React, { Fragment, useState } from "react";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";
import { useFetchBestOffers } from "@libHooks/useFetchBestOffers";

import { ValtioStore } from "@typesLib/ValtioStore";
import { PayNBData, PaymentMethodProps } from "@typesLib/Payment";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

import BestOffers from "./BestOffers";
import DownTimeMessage from "./downTimeMessage";

const WalletsWeb = ({ handleCreateOrder, payment }: PaymentMethodProps) => {
  const { t } = useTranslation();

  const { RazorWallets } = useSelector((store: ValtioStore) => store.paymentReducer.razorPayData) || {};

  const [loader, setLoader] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(payment.data?.[0] || RazorWallets?.[0]);

  /* get best offers for wallets */
  const { bestOffer } = useFetchBestOffers({
    paymentMethodType: "WALLET",
  });

  const handlePlaceOrder = async () => {
    setLoader(true);

    try {
      if (RazorWallets) {
        handleCreateOrder("razorpay", {
          method: "wallet",
          wallet: selectedWallet.name,
        });
      } else {
        handleCreateOrder("juspay", {
          method: "WALLET",
          wallet: selectedWallet.code,
        });
      }
    } catch {
      setLoader(false);
    }
  };

  return (
    <Fragment>
      <DownTimeMessage downtimeMsg={payment.downtimes?.message} />

      <BestOffers offers={bestOffer} showOfferTag={false} styledInParagraphTag={false} />

      <div className="flex flex-wrap gap-6 mb-6">
        {(RazorWallets || payment.data).map((wallet: PayNBData) => (
          <button
            type="button"
            key={wallet.name}
            onClick={() => setSelectedWallet(wallet)}
            className={`rounded-lg border-2 p-1 ${
              wallet.name === selectedWallet.name ? "border-black" : "border-gray-300 hover:border-black"
            }`}
          >
            <ImageComponent
              width={89}
              height={89}
              src={wallet.imageUrl || `https://cdn.razorpay.com/wallet/${wallet.name}.png`}
            />
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={loader}
        onClick={handlePlaceOrder}
        className="rounded-sm font-bold uppercase bg-ctaImg text-white w-56 h-14 relative"
      >
        {t("proceedPay")}
        {loader && <LoadSpinner className="w-10 inset-0 absolute m-auto" />}
      </button>
    </Fragment>
  );
};

export default WalletsWeb;
