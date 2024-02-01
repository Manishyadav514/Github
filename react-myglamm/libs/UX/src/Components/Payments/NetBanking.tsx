import React, { useState, memo } from "react";
import { useSelector } from "@libHooks/useValtioSelector";

import useTranslation from "@libHooks/useTranslation";

import { NetBankingList } from "@libConstants/NetBankingList.constant";

import { GiBankIco } from "@libComponents/GlammIcons";
import WhatsappEnabeCheckbox from "@libComponents/Payments/WhatsappEnableCheckbox";

import { ValtioStore } from "@typesLib/ValtioStore";
import { PaymentType, RazorListData, PaymentData } from "@typesLib/Payment";

import DowntimeMsg from "./DowntimeMsg";
import { formatPrice } from "@libUtils/format/formatPrice";

interface NetBankingProps {
  downtimeMsg?: string;
  bankOrder: Array<string>;
  RazorBankList?: RazorListData;
  handleCreateOrder: (arg1: PaymentType, arg2: PaymentData) => void;
}

function NetBanking({ downtimeMsg, bankOrder, RazorBankList, handleCreateOrder }: NetBankingProps) {
  const { t } = useTranslation();

  const { payableAmount, isPincodeServiceable } = useSelector((store: ValtioStore) => ({
    payableAmount: store.cartReducer.cart.payableAmount,
    isPincodeServiceable: store.userReducer.isPincodeServiceable,
  }));

  const [selectedBank, setSelectedBank] = useState<string>();

  return (
    <details className={`bg-white rounded py-3  text-sm mb-2 ${!isPincodeServiceable ? "pointer-events-none opacity-50" : ""}`}>
      <summary className="outline-none px-2">
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

        <h3 className="text-gray-600 mb-2 mt-6 font-bold uppercase">{t("chooseYourBank")}</h3>
        <ul className="list-none flex overflow-y-scroll">
          {bankOrder.map((bank: string) => (
            <li key={bank} className="rounded m-2 shadow-lg p-1 outline-none">
              <button
                type="button"
                className="w-16 h-16 _analytics-gtm-payment-info"
                onClick={() =>
                  handleCreateOrder("razorpay", {
                    method: "netbanking",
                    bank,
                  })
                }
              >
                <img
                  src={`${NetBankingList[bank].src}`}
                  alt={`${NetBankingList[bank].alt}`}
                  className="_analytics-gtm-payment-info"
                />
              </button>
            </li>
          ))}
        </ul>

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
          {RazorBankList?.map(bank => (
            <option className="bg-white" key={bank.value} value={bank.value} role="option">
              {bank.name}
            </option>
          ))}
        </select>

        <button
          type="button"
          disabled={!selectedBank}
          className="mt-4 py-3 rounded-sm font-bold uppercase w-full bg-black text-white _analytics-gtm-payment-info"
          onClick={() =>
            handleCreateOrder("razorpay", {
              method: "netbanking",
              bank: selectedBank,
            })
          }
        >
          {t("pay")} {formatPrice(payableAmount, true, false)}
        </button>
      </div>
    </details>
  );
}

export default memo(NetBanking);
