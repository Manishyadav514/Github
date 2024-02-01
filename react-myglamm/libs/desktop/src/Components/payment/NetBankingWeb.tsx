import React, { Fragment, useEffect, useState } from "react";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";
import { useFetchBestOffers } from "@libHooks/useFetchBestOffers";

import { ValtioStore } from "@typesLib/ValtioStore";
import { PayNBData, PaymentMethodProps } from "@typesLib/Payment";

import { formatPrice } from "@libUtils/format/formatPrice";

import LoadSpinner from "@libComponents/Common/LoadSpinner";

import { getFinalAmountAfterDiscount } from "@checkoutLib/Payment/HelperFunc";

import BestOffers from "./BestOffers";
import DownTimeMessage from "./downTimeMessage";

import DownArrow from "../../../../UX/public/svg/down-arrow.svg";

const NetBankingWeb = ({ handleCreateOrder, payment }: PaymentMethodProps) => {
  const { t } = useTranslation();

  const { payableAmount } = useSelector((store: ValtioStore) => store.cartReducer.cart);
  const { RazorBankList } = useSelector((store: ValtioStore) => store.paymentReducer.razorPayData) || {};

  const CHOOSE_BANK = t("chooseYourBank")?.toUpperCase();

  const [loader, setLoader] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedBank, setSelectedBank] = useState(CHOOSE_BANK);
  const [amountAfterDiscount, setAmountAfterDiscount] = useState<number>();

  const { bestOffer } = useFetchBestOffers({
    paymentMethodType: "NB",
  });

  const handleSelectBank = (bankName: string) => {
    setSelectedBank(bankName);
    setShowDropdown(false);
  };

  const onPay = async () => {
    setLoader(true);

    const bank = (RazorBankList || payment.data).find((x: any) => x.name === selectedBank);
    try {
      // use razorpay incase juspay is diabled
      if (RazorBankList) {
        await handleCreateOrder("razorpay", {
          method: "netbanking",
          bank: bank.name,
        });
      } else {
        await handleCreateOrder("juspay", {
          method: "NB",
          bank: bank.code,
        });
      }
    } catch {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (bestOffer?.nb_offers?.length) {
      const finalAmount = getFinalAmountAfterDiscount({ bestOffer, paymentMethod: "NB", selectedBank });

      if (finalAmount) {
        return setAmountAfterDiscount(+finalAmount);
      }
      return setAmountAfterDiscount(payableAmount);
    }
  }, [selectedBank, bestOffer?.nb_offers]);

  return (
    <Fragment>
      <DownTimeMessage downtimeMsg={payment.downtimes?.message} />
      <BestOffers offers={bestOffer} showOfferTag={false} styledInParagraphTag={false} />

      <form className="flex relative">
        <div
          onClick={() => setShowDropdown(!showDropdown)}
          className="rounded h-14 border px-4 border-gray-300 w-2/5 flex justify-between items-center mr-4 cursor-pointer"
        >
          {selectedBank}

          <DownArrow className={`transition-all ${showDropdown ? "rotate-180" : ""}`} />
        </div>

        <button
          type="button"
          onClick={onPay}
          disabled={selectedBank === CHOOSE_BANK || loader}
          className="bg-ctaImg text-white font-bold h-14 w-1/5 uppercase rounded-sm relative"
        >
          {t("pay") || "pay"} {formatPrice(amountAfterDiscount || payableAmount, true, false)}
          {loader && <LoadSpinner className="w-10 absolute m-auto inset-0" />}
        </button>

        {showDropdown && (
          <ul className="list-none absolute left-0 top-14 w-full max-w-sm bg-white shadow-md h-48 overflow-auto">
            {(RazorBankList || payment.data).map((bank: PayNBData) => (
              <li
                key={bank.name}
                onClick={() => handleSelectBank(bank.name)}
                className="capatalize px-1.5 py-3 hover:bg-black hover:text-white cursor-pointer"
              >
                {bank.name}
              </li>
            ))}
          </ul>
        )}
      </form>
    </Fragment>
  );
};

export default NetBankingWeb;
