import React, { useEffect } from "react";
import dynamic from "next/dynamic";

import { useSplit } from "@libHooks/useSplit";

import { FEATURES } from "@libStore/valtio/FEATURES.store";

import { OrderPurchaseEvent } from "@libAnalytics/OrderSummary.Analytics";
import VendorDynamicComponent from "@libComponents/VendorDynamicComponent";

const OrderSuccessORH = dynamic(() => import(/* webpackChunkName: "OrderORH" */ "./OrderSuccessORH"), { ssr: false });
const OrderSuccessBBC = dynamic(() => import(/* webpackChunkName: "OrderBBC" */ "./OrderSuccessBBC"), { ssr: false });
const OrderSuccessMGP = dynamic(() => import(/* webpackChunkName: "OrderMGP" */ "./OrderSuccessMGP"), { ssr: false });
const OrderSuccessTWK = dynamic(() => import(/* webpackChunkName: "OrderWK" */ "./OrderSuccessTWK"), { ssr: false });
const OrderSuccessPopxo = dynamic(() => import(/* webpackChunkName: "OrderPopxo" */ "./OrderSuccessPopxo"), { ssr: false });
const OrderSuccessCommon = dynamic(() => import(/* webpackChunkName: "OrderCommon" */ "./OrderSucessCommon"), { ssr: false });
const OrderSuccessSimple = dynamic(() => import(/* webpackChunkName: "OrderSimple" */ "./OrderSuccessSimple"), { ssr: false });

const OrderSuccessGamification = dynamic(
  () => import(/* webpackChunkName: "OrderGamification" */ "./OrderSuccessGamification"),
  {
    ssr: false,
  }
);

interface successProps {
  orderDetails: any;
  orderStatus: string;
  isPaymentPending?: boolean;
}

const OrderSuccess = ({ orderDetails, orderStatus, isPaymentPending }: successProps) => {
  const SplitVariants =
    useSplit({
      experimentsList: [{ id: "bountyRewardsOrderSummary" }, { id: "unlockCouponByAppExp" }],
      deps: [],
    }) || {};

  const { bountyRewardsOrderSummary, unlockCouponByAppExp } = SplitVariants || {};

  /**
   * Analytics - Adobe and Webengage
   */
  useEffect(() => {
    OrderPurchaseEvent();
  }, []);

  if (FEATURES?.gamificationScreen) {
    return (
      <OrderSuccessGamification
        orderDetails={orderDetails}
        orderStatus={orderStatus}
        isPaymentPending={isPaymentPending}
        variant={bountyRewardsOrderSummary}
        unlockCouponByAppExp={unlockCouponByAppExp}
      />
    );
  }

  const props = { orderDetails, orderStatus };

  return (
    <VendorDynamicComponent
      orh={<OrderSuccessORH {...props} />}
      popxo={<OrderSuccessPopxo {...props} />}
      mgp={<OrderSuccessMGP {...props} />}
      lit={<OrderSuccessCommon {...props} />}
      mnm={<OrderSuccessCommon {...props} />}
      blu={<OrderSuccessCommon {...props} />}
      bbc={<OrderSuccessBBC {...props} />}
      srn={<OrderSuccessCommon {...props} />}
      twk={<OrderSuccessTWK {...props} />}
      default={<OrderSuccessSimple {...props} />}
    />
  );
};

export default OrderSuccess;
