import React, { useEffect, useState } from "react";
import PopupModal from "./PopupModal";
import RecurringSubscriptionAPI from "@libAPI/apis/RecurringSubscriptionAPI";

const CancelSubscriptionPlanModal = ({
  showCancelPlanModal,
  setshowCancelPlanModal,
  handleEditPlanModalClick,
  subscriptionDetails,
  profile,
  showCancellationSuccessful,
  setShowCancellationSuccessful,
  setShowUpdatedPlan,
  showEditPlanTextAndButton,
}: any) => {
  async function handleCancelPlanClick(subscription: any) {
    if (profile) {
      setShowUpdatedPlan(false);
      const recurringSubscriptionsApi = new RecurringSubscriptionAPI();
      const res = await recurringSubscriptionsApi.cancelRecurringSubscription(subscription?.id);
      if (res.data.code === 204) {
        setShowCancellationSuccessful(true);
      }
    }
  }

  return (
    <PopupModal show={showCancelPlanModal} onRequestClose={() => setshowCancelPlanModal(false)} type="center-modal">
      {showCancellationSuccessful ? (
        <div className="bg-white px-2 py-3 rounded w-max">
          <div className="flex flex-col justify-center items-center space-y-5">
            <h1 className="font-semibold text-xs pt-3">Your plan has been cancelled successfully.</h1>
            <div className="text-xs w-48 text-center">Hope to see you again.</div>

            <div className="flex justify-around space-x-2">
              <button
                className="bg-color1 rounded text-white px-3 py-2 text-xs font-semibold"
                onClick={() => {
                  setShowUpdatedPlan(true);
                  setShowCancellationSuccessful(false);
                  setshowCancelPlanModal(false);
                }}
              >
                GO TO MY PLAN
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white px-2 py-3 rounded w-max">
          <div className="flex flex-col justify-center items-center space-y-5">
            <h1 className="font-semibold text-xs pt-3">Are you sure?</h1>
            {showEditPlanTextAndButton ? (
              <div className="text-xs w-48 text-center">You can edit your plan instead of cancelling your current plan.</div>
            ) : (
              <div className="text-xs w-48 text-center">You want to cancel your plan.</div>
            )}
            <div className="flex justify-around space-x-2">
              <button
                className="bg-gray-200 rounded text-black px-3 py-2 text-xs font-semibold"
                onClick={() => handleCancelPlanClick(subscriptionDetails)}
              >
                CANCEL NOW
              </button>

              {showEditPlanTextAndButton && (
                <button
                  className="bg-color1 rounded text-white px-3 py-2 text-xs font-semibold"
                  onClick={() => handleEditPlanModalClick(subscriptionDetails)}
                >
                  EDIT YOUR PLAN
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </PopupModal>
  );
};

export default CancelSubscriptionPlanModal;
