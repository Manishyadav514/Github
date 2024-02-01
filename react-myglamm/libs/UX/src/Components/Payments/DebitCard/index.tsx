import React from "react";
import { useSelector } from "@libHooks/useValtioSelector";
import useTranslation from "@libHooks/useTranslation";
import { GiCard1Ico, GiShieldIco } from "@libComponents/GlammIcons";
import { getCommaSeparatedAmount } from "@libUtils/getCommaSeparatedAmount";
import { ValtioStore } from "@typesLib/ValtioStore";
import { PaymentType, RazorListData, PaymentData } from "@typesLib/Payment";
import JuspayDebitCardForm from "./juspayDebitCard";
import { SHOP } from "@libConstants/SHOP.constant";
import dynamic from "next/dynamic";

const DebitCardForm = dynamic(() => import("./DebitCardForm"), { ssr: false });
const DowntimeMsg = dynamic(() => import("../DowntimeMsg"), { ssr: false });
import { formatPrice } from "@libUtils/format/formatPrice";

interface DebitCardProps {
  isBin?: boolean;
  downtimeMsg?: string;
  RazorBankList?: RazorListData;
  handleCreateOrder: (arg1: PaymentType, arg2: PaymentData) => void;
  setActiveTab: (name: string) => void;
  activeTab: string;
  name: string;
}

const DebitCard = ({ downtimeMsg, isBin, RazorBankList, handleCreateOrder, activeTab, name, setActiveTab }: DebitCardProps) => {
  const { t } = useTranslation();

  const { binSeriesData, couponData, payableAmount, isPincodeServiceable } = useSelector((store: ValtioStore) => ({
    binSeriesData: store.cartReducer.cart.binSeriesData,
    couponData: store.cartReducer.cart.couponData,
    payableAmount: store.cartReducer.cart.payableAmount,
    isPincodeServiceable: store.userReducer.isPincodeServiceable,
  }));

  const showBinSection = (
    <summary className="outline-none flex justify-between relative">
      <div className="flex items-center">
        <GiCard1Ico width="30px" height="30px" fill="#d65274" viewBox="0 50 500 700" className="inline mr-4" />
        <div className="">
          <p className="inline-block text-sm font-semibold mb-1.5">
            Pay by {RazorBankList?.find(x => x.value === binSeriesData?.bankName?.value)?.name || ""} Credit/Debit Card
          </p>
          <span className="text-green-600 text-sm block mr-4">
            Get flat
            {formatPrice(couponData?.userDiscount || 0, true, false)} off
          </span>
        </div>

        <span className="font-semibold text-sm absolute right-0 bottom-0">
          Pay &#8377;
          {formatPrice(getCommaSeparatedAmount(payableAmount) as number, true, false)}
        </span>
      </div>
    </summary>
  );

  const displayCardProtectionText = (
    <div className="flex items-center mb-4">
      <GiShieldIco
        width="30px"
        height="30px"
        fill="#01c717"
        viewBox="0 50 500 700"
        className="inline mr-2"
        role="img"
        aria-labelledby="100% Secure Data Encryption"
      />
      <div className="inline-block text-sm">
        <p className="font-semibold">{t("secureDataEncryption")}</p>
        <p className="text-gray-500">{t("weGuaranteeSecurity")}</p>
      </div>
    </div>
  );

  return (
    <details
      className={`bg-white rounded py-3 px-2 mb-2 text-sm ${!isPincodeServiceable ? "pointer-events-none opacity-50" : ""}`}
      open={SHOP.ENABLE_JUSPAY && activeTab === name}
    >
      {isBin ? (
        showBinSection
      ) : (
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
          <GiCard1Ico
            className="inline mr-4"
            width="30px"
            height="30px"
            fill="#d65274"
            viewBox="0 50 500 700"
            role="img"
            aria-labelledby="Credit or Debit Card"
          />
          {t("creditOrDebitCard")}
        </summary>
      )}

      <div className="bg-white pt-6">
        {/* Display card protection labels */}
        {displayCardProtectionText}

        <DowntimeMsg downtimeMsg={downtimeMsg} />

        {SHOP.ENABLE_JUSPAY ? (
          <JuspayDebitCardForm handleCreateOrder={handleCreateOrder} isBin={isBin} key={payableAmount} />
        ) : (
          <DebitCardForm handleCreateOrder={handleCreateOrder} isBin={isBin} />
        )}
      </div>
    </details>
  );
};

export default DebitCard;
