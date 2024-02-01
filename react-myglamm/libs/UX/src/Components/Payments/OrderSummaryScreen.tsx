import React, { useEffect, useState } from "react";
import { getFormattedAddress } from "@checkoutLib/Payment/HelperFunc";
import { useSelector } from "@libHooks/useValtioSelector";
import { formatPrice } from "@libUtils/format/formatPrice";
import { ValtioStore } from "@typesLib/ValtioStore";
import CartProduct from "@libComponents/Cart/CartProduct";
import { useRouter } from "next/router";
import clsx from "clsx";
import { PaymentType } from "@typesLib/Payment";
import PaymentSpinner from "./PaymentSpinner";
import { adobeEventForEditOrder } from "@checkoutLib/Cart/Analytics";
import { ADOBE_REDUCER, PAYMENT_REDUCER } from "@libStore/valtio/REDUX.store";
import { ADOBE } from "@libConstants/Analytics.constant";
import LocationIcon from "../../../public/svg/location-ico.svg";
import { UserAddress } from "@typesLib/Consumer";
import { adobeClickEventForConfirmOrder } from "@checkoutLib/Payment/Payment.Analytics";

const OrderSummaryScreen = ({ handleCreateOrder }: { handleCreateOrder: (arg1: PaymentType) => any }) => {
  const router = useRouter();

  const [count, setCount] = useState(0);
  const [isConfirmOrderBtnDisabled, setIsConfirmOrderBtnDisabled] = useState(true);

  const { payableAmount, shippingAddress, isPaymentProcessing } = useSelector((store: ValtioStore) => ({
    payableAmount: store.cartReducer.cart.payableAmount,
    shippingAddress: store.userReducer.shippingAddress,
    isPaymentProcessing: store.paymentReducer.isPaymentProcessing,
  }));

  useEffect(() => {
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: `web|Order re confirmation`,
        newPageName: "web|Order re confirmation",
        subSection: "Order re confirmation",
        assetType: "Order re confirmation",
        newAssetType: "",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };

    PAYMENT_REDUCER.isUserWatchingOrderConfirmationScreen = true;

    return () => {
      PAYMENT_REDUCER.isUserWatchingOrderConfirmationScreen = false;
    };
  }, []);

  useEffect(() => {
    let count = 1;

    let Interval = setInterval(() => {
      setCount(count++);

      // Enable the order confirm button after 10 seconds
      if (count === 3) {
        setIsConfirmOrderBtnDisabled(false);
      }

      if (count === 7) {
        clearInterval(Interval);
        handleCreateOrder("cash");
      }
    }, 5000);

    return () => clearInterval(Interval);
  }, []);

  if (isPaymentProcessing) return <PaymentSpinner />;

  return (
    <React.Fragment>
      <div className="flex flex-col h-full bg-white z-50 inset-0 fixed orderContainer">
        <div className="flex justify-between items-center p-3 border-b-2 border-gray-200 pb-2">
          <div className="font-bold text-lg">Confirming Order</div>
          <div className="text-10">
            <span className="">Amount to Pay</span>
            <div className="text-right font-semibold text-lg">{formatPrice(payableAmount, true, false)}</div>
          </div>
        </div>
        <div className="p-3 orderSummary">
          {/* shipping Address */}
          <DisplayShippingAddress shippingAddress={shippingAddress} />

          {/* Cart Products listing */}
          <DisplayCartProducts />

          {/* Edit order CTA */}
          <DisplayCTAPanel
            count={count}
            handleCreateOrder={handleCreateOrder}
            isConfirmOrderBtnDisabled={isConfirmOrderBtnDisabled}
          />
        </div>
      </div>
      <style jsx>{`
        .orderContainer {
        }
        .orderContainer::after {
          content: "";

          width: 100%;
          height: 150px;
          background-color: white;
          position: absolute;
          top: 100%;
          left: 0;
        }
        .orderSummary {
          overflow-y: auto;
          padding-bottom: 150px;
        }
      `}</style>
    </React.Fragment>
  );
};

const DisplayShippingAddress = ({ shippingAddress }: { shippingAddress?: UserAddress }) => {
  return (
    <>
      <p className="text-gray-400 font-bold">Shipping Address</p>
      <div className="border border-gray-300 rounded-lg p-3 mt-3">
        <div className="flex items-center">
          <LocationIcon className="mr-2" />
          <div>
            Delivery at <span className="text-color1">{shippingAddress?.addressNickName}</span>
          </div>
        </div>

        {shippingAddress && (
          <p className="w-4/5 text-gray-400 mt-2" dangerouslySetInnerHTML={{ __html: getFormattedAddress(shippingAddress) }} />
        )}
      </div>
    </>
  );
};

const DisplayCartProducts = () => {
  return (
    <>
      <p className="text-gray-400 font-bold mt-3 mb-3">Your Items</p>
      <div className="border rounded border-gray-300 overflow-auto p-1 ">
        <CartProduct isOrderSummary={true} />
      </div>
    </>
  );
};

const DisplayCTAPanel = ({
  count,
  handleCreateOrder,
  isConfirmOrderBtnDisabled,
}: {
  count: number;
  handleCreateOrder: (par: PaymentType) => any;
  isConfirmOrderBtnDisabled: boolean;
}) => {
  const router = useRouter();
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white z-50">
      <div className="bg-color2 p-3 flex items-center">
        <div>
          <p className="font-bold">Need any change in your order?</p>
          <div className="text-gray-600  text-md">Quickly modify shades or address before time runs out.</div>
        </div>
        <div className="flex items-center justify-around">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={clsx("w-1.5 h-5 ml-2  rounded-lg", count > i ? "bg-color1" : "bg-gray-300")}></div>
          ))}
        </div>
      </div>
      <div className="p-3 flex items-center">
        <button
          className="border border-color1 rounded  py-4 w-full text-color1 font-bold uppercase text-md"
          onClick={() => {
            adobeEventForEditOrder();
            sessionStorage.setItem("USER_EDITING_CART", JSON.stringify(true));
            router.push(`/shopping-bag`);
          }}
        >
          Edit Order
        </button>
        <button
          disabled={isConfirmOrderBtnDisabled}
          className={clsx(
            "border ml-3 rounded py-4 w-full font-bold uppercase text-md",
            isConfirmOrderBtnDisabled ? "border-gray-300 text-gray-200" : "border-black text-black"
          )}
          onClick={() => {
            adobeClickEventForConfirmOrder();
            handleCreateOrder("cash");
          }}
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default OrderSummaryScreen;
