import React, { useEffect, useState } from "react";
import useTranslation from "@libHooks/useTranslation";
import { GiWalletIco } from "@libComponents/GlammIcons";
import { PaymentType, RazorListData, PaymentData, WalletOffer } from "@typesLib/Payment";
import { SHOP } from "@libConstants/SHOP.constant";
import { useFetchBestOffers } from "@libHooks/useFetchBestOffers";
import dynamic from "next/dynamic";
import { formatPrice } from "@libUtils/format/formatPrice";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import { RadioButtonPayment } from "@libStyles/TSStyles/radio-button-payment";
import { getFinalAmountAfterDiscount } from "@checkoutLib/Payment/HelperFunc";
import clsx from "clsx";

const FreeShippingStrip = dynamic(() => import("@libComponents/Cart/FreeShippingStrip"), { ssr: false });
const GetFreeShippingCTA = dynamic(() => import("./GetFreeShippingCTA"), { ssr: false });
const DowntimeMsg = dynamic(() => import("./DowntimeMsg"), {
  ssr: false,
});

const WhatsappEnabeCheckbox = dynamic(() => import("@libComponents/Payments/WhatsappEnableCheckbox"), {
  ssr: false,
});

interface WalletProps {
  downtimeMsg?: string;
  walletList?: { code: string; imageurl?: string; name: string }[];
  handleCreateOrder: (arg1: PaymentType, arg2: PaymentData) => void;
  RazorWallets: RazorListData;
  setActiveTab: (name: string) => void;
  activeTab: string;
  name: string;
  bankOrder: string[];
}

const Wallets = ({
  downtimeMsg,
  walletList,
  handleCreateOrder,
  RazorWallets,
  activeTab,
  setActiveTab,
  name,
  bankOrder,
}: WalletProps) => {
  const { t } = useTranslation();

  const [selectedWallet, setSelectedWallet] = useState<string>(bankOrder[0]);

  const [amountAfterDiscount, setAmountAfterDiscount] = useState<number>();

  const { payableAmount, isPincodeServiceable, showUpsellOnPaymentsPage } = useSelector((store: ValtioStore) => ({
    payableAmount: store.cartReducer.cart.payableAmount,
    isPincodeServiceable: store.userReducer.isPincodeServiceable,
    showUpsellOnPaymentsPage: store.paymentReducer.showUpsellOnPaymentsPage,
  }));

  /* get best offers for wallets */
  const { bestOffer } = useFetchBestOffers({ paymentMethodType: "WALLET" });

  /* fetch the final amount after offer */
  useEffect(() => {
    const finalAmountOfSelectedWallet = getFinalAmountAfterDiscount({
      selectedBank: selectedWallet,
      paymentMethod: "wallet",
      bestOffer,
    });

    if (finalAmountOfSelectedWallet) {
      return setAmountAfterDiscount(+finalAmountOfSelectedWallet);
    }
    return setAmountAfterDiscount(payableAmount);
  }, [selectedWallet, bestOffer?.wallet_offers]);

  // filtering Top banks from banks list
  const getTopWallets = () => (walletList?.length && walletList?.filter((bank: any) => bankOrder.includes(bank.code))) || [];

  /* render wallet offers */
  const displayWalletOffers = (walletCode: string) => {
    return bestOffer?.wallet_offers?.map((walletOffer: WalletOffer) => {
      if (walletOffer.wallet === walletCode) {
        return (
          <div key={walletOffer.offer_id} className="p-1 px-2 ml-3 bg-green-50">
            <span className="text-green-700 font-semibold">
              {t("save")} {formatPrice(+walletOffer.discount_amount, true, false)}
            </span>
          </div>
        );
      }
    });
  };

  /* show list of all wallets */
  const showListOfOtherWallets = (
    <select
      id="WalletList"
      name="WalletList"
      defaultValue={t("otherWallets") || "Other Wallets"}
      onChange={e => setSelectedWallet(e.target.value)}
      className="outline-none h-10 mt-4 text-sm text-gray-700 font-bold my-2 w-full py-1 px-2 bg-white border-black rounded-sm border"
      role="listbox"
    >
      <option hidden role="option">
        {t("otherWallets") || "Other Wallets"}
      </option>
      {walletList?.length &&
        walletList?.map((bank: { code: string; name: string }) => (
          <option className="bg-white" key={bank.code} value={bank.code} role="option">
            {bank.name}
          </option>
        ))}
    </select>
  );

  /* Wallets from Juspay */
  const showWalletsListFromJuspay = (
    <React.Fragment>
      {getTopWallets()?.map((wallet: any) => (
        <div key={wallet.code} className="flex items-center mt-5">
          <label className="flex items-center w-full">
            <input
              id={wallet.code}
              type="radio"
              value={wallet.code}
              checked={selectedWallet === wallet.code}
              onChange={e => setSelectedWallet(e.target.value)}
            />
            <img
              src={wallet.imageUrl}
              alt={wallet.name}
              className="ml-2.5 w-11 h-11 rounded-full flex justify-center border border-gray-200"
            />
            <span className="ml-3" style={{ maxWidth: "128px" }}>
              {wallet.name}
            </span>
            {bestOffer?.wallet_offers?.length ? displayWalletOffers(wallet.code) : null}
          </label>
        </div>
      ))}

      {showListOfOtherWallets}

      {showUpsellOnPaymentsPage && <FreeShippingStrip showStripOnPayments={true} />}

      <div className={clsx("mt-4", showUpsellOnPaymentsPage ? "flex items-center justify-between" : "")}>
        {showUpsellOnPaymentsPage && <GetFreeShippingCTA />}
        <button
          type="button"
          className=" py-2 rounded font-bold uppercase w-full bg-black text-white _analytics-gtm-payment-info"
          onClick={e => {
            e.currentTarget.disabled = true;
            handleCreateOrder("juspay", {
              method: "WALLET",
              wallet: selectedWallet,
            });
          }}
          disabled={!selectedWallet}
        >
          {t("pay")} {formatPrice(amountAfterDiscount ? amountAfterDiscount : payableAmount, true, false)}
        </button>
      </div>

      {/* radio button UI CSS */}
      {RadioButtonPayment}
    </React.Fragment>
  );

  /* wallets from razorPay */
  const showWalletsListFromRazorPay = (
    <ul className="list-none">
      {RazorWallets?.map((wallet: any) => (
        <li key={wallet.name} className="mx-1">
          <button
            type="button"
            className="border-b border-gray-400 py-2 text-left w-full _analytics-gtm-payment-info"
            onClick={() =>
              handleCreateOrder("razorpay", {
                method: "wallet",
                wallet: wallet.name,
              })
            }
          >
            <img
              alt={wallet.name}
              src={`https://cdn.razorpay.com/wallet/${wallet.name}.png`}
              className="inline mx-4 h-8 w-24 object-contain _analytics-gtm-payment-info"
            />
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <details
      className={`bg-white rounded py-3 px-2 mb-2 text-sm ${!isPincodeServiceable ? "pointer-events-none opacity-50" : ""}`}
      open={SHOP.ENABLE_JUSPAY && activeTab === name}
    >
      <summary
        className="outline-none"
        onClick={e => {
          if (SHOP.ENABLE_JUSPAY) {
            e.preventDefault();
            if (activeTab === name) {
              setActiveTab("");
            } else {
              setActiveTab(name);
            }
          }
        }}
      >
        <GiWalletIco
          className="inline mr-4"
          width="30px"
          height="30px"
          fill="#13abdf"
          viewBox="0 50 500 700"
          role="img"
          aria-labelledby="wallet"
        />
        {t("wallets")}
      </summary>

      <div className="pt-4 px-4">
        <DowntimeMsg downtimeMsg={downtimeMsg} />

        <WhatsappEnabeCheckbox />

        {SHOP.ENABLE_JUSPAY ? showWalletsListFromJuspay : showWalletsListFromRazorPay}
      </div>
    </details>
  );
};

export default Wallets;
