import React, { useState, memo, useEffect } from "react";
import { useSelector } from "@libHooks/useValtioSelector";
import useTranslation from "@libHooks/useTranslation";
import { GiBankIco } from "@libComponents/GlammIcons";
import { ValtioStore } from "@typesLib/ValtioStore";
import { NetBankingOffer, PaymentType, PaymentData } from "@typesLib/Payment";
import { useFetchBestOffers } from "@libHooks/useFetchBestOffers";
import dynamic from "next/dynamic";
import { formatPrice } from "@libUtils/format/formatPrice";
import { RadioButtonPayment } from "@libStyles/TSStyles/radio-button-payment";
import { getFinalAmountAfterDiscount } from "@checkoutLib/Payment/HelperFunc";
import clsx from "clsx";

const FreeShippingStrip = dynamic(() => import("@libComponents/Cart/FreeShippingStrip"), { ssr: false });
const GetFreeShippingCTA = dynamic(() => import("./GetFreeShippingCTA"), { ssr: false });
const WhatsappEnabeCheckbox = dynamic(() => import("@libComponents/Payments/WhatsappEnableCheckbox"), { ssr: false });

const DowntimeMsg = dynamic(() => import("./DowntimeMsg"), { ssr: false });
interface JuspayNetBankingProps {
  bankList: { code: string; name: string; imageUrl: string }[];
  downtimeMsg?: string;
  bankOrder: Array<string>;
  handleCreateOrder: (arg1: PaymentType, arg2: PaymentData) => void;
  setActiveTab: (name: string) => void;
  activeTab: string;
  name: string;
}

function JuspayNetBanking({
  downtimeMsg,
  bankOrder,
  handleCreateOrder,
  bankList,
  activeTab,
  name,
  setActiveTab,
}: JuspayNetBankingProps) {
  const { t } = useTranslation();

  const { payableAmount, isPincodeServiceable, showUpsellOnPaymentsPage, shippingCharges, appliedGlammPoints } = useSelector(
    (store: ValtioStore) => ({
      payableAmount: store.cartReducer.cart.payableAmount,
      isPincodeServiceable: store.userReducer.isPincodeServiceable,
      showUpsellOnPaymentsPage: store.paymentReducer.showUpsellOnPaymentsPage,
      shippingCharges: store.cartReducer.cart.shippingCharges,
      appliedGlammPoints: store.cartReducer.cart.appliedGlammPoints,
    })
  );

  const [selectedBank, setSelectedBank] = useState<string>(bankOrder[0]);
  const [amountAfterDiscount, setAmountAfterDiscount] = useState<number>();

  /* get best offers for net banking */
  const { bestOffer } = useFetchBestOffers({ paymentMethodType: "NB" });

  useEffect(() => {
    const finalAmount = getFinalAmountAfterDiscount({ bestOffer, paymentMethod: "NB", selectedBank });

    if (finalAmount) {
      return setAmountAfterDiscount(+finalAmount);
    }
    return setAmountAfterDiscount(payableAmount);
  }, [selectedBank, bestOffer?.nb_offers]);

  // filtering Top banks from banks list
  const getTopNetBankingBanks = () => bankList?.filter((bank: any) => bankOrder.includes(bank.code) ?? []);

  const displayNetBankingOffer = (bankCode: string) => {
    return bestOffer?.nb_offers?.map((netBankingOffer: NetBankingOffer) => {
      if (netBankingOffer.bank === bankCode) {
        return (
          <div key={netBankingOffer.offer_id} className="p-1 px-2 ml-3 bg-green-50">
            <span className="text-green-700 font-semibold">
              {t("save")} {formatPrice(+netBankingOffer.discount_amount, true, false)}
            </span>
          </div>
        );
      }
    });
  };
  /* render top banks list */
  const showTopNetBankingBanks = (
    <React.Fragment>
      {getTopNetBankingBanks()?.map((bank: { code: string; imageUrl: string; name: string }) => (
        <div key={bank.code} className="flex items-center mt-5">
          <label className="flex items-center w-full">
            <input
              id={bank.code}
              type="radio"
              value={bank.code}
              checked={selectedBank === bank.code}
              onChange={e => setSelectedBank(e.target.value)}
            />
            <img
              src={bank.imageUrl}
              alt={bank.name}
              className="ml-2.5 w-11 h-11 rounded-full flex justify-center border border-gray-200"
            />
            <span className="ml-3">{bank.name}</span>
            {bestOffer?.nb_offers?.length ? displayNetBankingOffer(bank.code) : null}
          </label>
        </div>
      ))}

      {/* radio button UI CSS */}
      {RadioButtonPayment}
    </React.Fragment>
  );

  const showAllNetbankingBanks = (
    <select
      id="BankList"
      name="BankList"
      defaultValue={t("otherBanks")}
      onChange={e => setSelectedBank(e.target.value)}
      className="outline-none h-10 text-sm text-gray-700 font-bold my-2 w-full py-1 px-2 bg-white border-black rounded-sm border"
      role="listbox"
    >
      <option hidden role="option">
        {t("otherBanks")}
      </option>
      {bankList?.map((bank: { code: string; name: string }) => (
        <option className="bg-white" key={bank.code} value={bank.code} role="option">
          {bank.name}
        </option>
      ))}
    </select>
  );

  return (
    <details
      className={`bg-white rounded py-3 mb-2 text-sm ${!isPincodeServiceable ? "pointer-events-none opacity-50" : ""} `}
      open={activeTab === name}
    >
      <summary
        className="outline-none px-2"
        onClick={e => {
          e.preventDefault();
          if (activeTab === name) {
            setActiveTab("");
          } else {
            setActiveTab(name);
          }
        }}
      >
        <GiBankIco
          width="30px"
          height="30px"
          fill="#13abdf"
          viewBox="0 50 500 700"
          className="inline mr-4"
          role="img"
          aria-labelledby="Net Banking"
        />
        {t("netBanking")}
      </summary>

      <div className="px-4 pt-4">
        <DowntimeMsg downtimeMsg={downtimeMsg} />

        <WhatsappEnabeCheckbox />

        {/* render top net banking banks list */}
        {showTopNetBankingBanks}

        {/* All netbanking banks list */}
        {showAllNetbankingBanks}

        {showUpsellOnPaymentsPage && <FreeShippingStrip showStripOnPayments={true} />}

        <div className={clsx("mt-4", showUpsellOnPaymentsPage ? "flex items-center justify-between" : "")}>
          {showUpsellOnPaymentsPage && <GetFreeShippingCTA />}
          <button
            type="button"
            disabled={!selectedBank}
            className="py-2 rounded font-bold uppercase w-full bg-black text-white _analytics-gtm-payment-info"
            onClick={e => {
              e.currentTarget.disabled = true;
              handleCreateOrder("juspay", {
                method: "NB",
                bank: selectedBank,
              });
            }}
          >
            {t("pay")} {formatPrice(amountAfterDiscount ? amountAfterDiscount : payableAmount, true, false)}
          </button>
        </div>
      </div>
    </details>
  );
}

export default memo(JuspayNetBanking);
