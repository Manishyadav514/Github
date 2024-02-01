import React from "react";
import PopupModal from "./PopupModal";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import { formatPrice } from "@libUtils/format/formatPrice";

const ViewSubscriptionPlanModal = ({
  showMyPlanModal,
  setShowMyPlanModal,
  deliveryFrequencyText,
  subscriptionDetails,
  addToCart,
}: any) => {
  return (
    subscriptionDetails && (
      <PopupModal show={showMyPlanModal} onRequestClose={() => setShowMyPlanModal(false)}>
        <div className="bg-white rounded px-4 py-2">
          <div className="flex flex-col pt-2">
            <h1 className="font-medium text-lg">Your Plan</h1>
            <div className="flex space-x-2 mb-0.5 py-4 bg-white">
              <div role="presentation" className="h-20 w-20">
                <ImageComponent
                  alt={subscriptionDetails.product?.assets?.[0]?.name}
                  className={`"h-20 w-20"`}
                  src={subscriptionDetails?.product?.assets[0]?.imageUrl?.["200x200"]}
                />
              </div>
              <div className="flex flex-col justify-between">
                <div className="text-xs pt-1.5">{subscriptionDetails?.product?.cms[0].content?.name}</div>
                <div className="text-10 text-gray-400 font-medium">PACK OF {subscriptionDetails?.quantity} </div>
                <div className="flex space-x-1 pt-4 pb-2">
                  <p className="text-xs font-semibold">{formatPrice(subscriptionDetails?.subscriptionOfferPrice, true)}</p>
                  <p className="text-gray-400 text-xs">
                    <del>{formatPrice(subscriptionDetails?.product?.price, true)}</del>
                  </p>
                </div>
              </div>
            </div>
            <div className="mb-4 py-2">
              <p className="font-medium inline">Delivery:</p> {deliveryFrequencyText}
            </div>
            {subscriptionDetails?.shippingAddress && (
              <div className="flex flex-col">
                <h1 className="font-medium mb-2">Delivery Address</h1>
                <p className="w-1/2">{subscriptionDetails?.shippingAddress?.consumerName?.name}</p>
                <p className="text-sm break-all" style={{ marginBottom: "10px" }}>
                  {subscriptionDetails?.shippingAddress?.flatNumber}, {subscriptionDetails?.shippingAddress?.location}
                  {subscriptionDetails?.shippingAddress?.cityName},{subscriptionDetails?.shippingAddress?.stateName},{" "}
                  {subscriptionDetails?.shippingAddress?.zipcode}, {subscriptionDetails?.shippingAddress?.countryName}
                </p>
              </div>
            )}
          </div>

          {subscriptionDetails?.product && (
            <div className="flex justify-center pt-4">
              <button
                className="bg-color1 min-w-full rounded p-3 text-white font-semibold uppercase"
                onClick={() =>
                  addToCart(
                    subscriptionDetails?.product,
                    subscriptionDetails?.decoyPricingId,
                    subscriptionDetails?.recurringSubscriptionConfigId
                  )
                }
              >
                Quick Restart
              </button>
            </div>
          )}
        </div>
      </PopupModal>
    )
  );
};

export default ViewSubscriptionPlanModal;
