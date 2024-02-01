import React from "react";
import { useSelector } from "@libHooks/useValtioSelector";

import { GiBankIco } from "@libComponents/GlammIcons";

import { ValtioStore } from "@typesLib/ValtioStore";
import { PaymentType, RazorListData, PaymentData } from "@typesLib/Payment";
import { formatPrice } from "@libUtils/format/formatPrice";

interface NetBankingBinProps {
  RazorBankList?: RazorListData;
  handleCreateOrder: (arg1: PaymentType, arg2: PaymentData) => void;
}

const NetBankingBin = ({ RazorBankList, handleCreateOrder }: NetBankingBinProps) => {
  const { payableAmount, couponData, binSeriesData, isPincodeServiceable } = useSelector((store: ValtioStore) => ({
    payableAmount: store.cartReducer.cart.payableAmount,
    couponData: store.cartReducer.cart.couponData,
    binSeriesData: store.cartReducer.cart.binSeriesData,
    isPincodeServiceable: store.userReducer.isPincodeServiceable,
  }));

  const bank = binSeriesData?.bankName?.value;

  return (
    <button
      type="button"
      style={{ boxShadow: "1px 1px 10px #ddd" }}
      className="w-full p-4 mb-2 bg-white flex items-center relative rounded"
      onClick={() =>
        handleCreateOrder("razorpay", {
          method: "netbanking",
          bank,
        })
      }
      disabled={!isPincodeServiceable}
    >
      <GiBankIco width="30px" height="30px" fill="#13abdf" viewBox="0 50 500 700" className="inline mr-2" />
      <div className="">
        <p className="inline-block text-sm font-bold">
          Pay by {RazorBankList?.find(x => x.value === bank)?.name || ""} Net Banking
        </p>

        <p className="text-green-600 text-sm text-left">
          Get flat
          {formatPrice(couponData?.userDiscount as number, true, false)} off
        </p>
      </div>

      <p className="font-semibold absolute right-4 bottom-4 text-sm">
        Pay
        {formatPrice(payableAmount, true, false)}
      </p>
    </button>
  );
};

export default NetBankingBin;
