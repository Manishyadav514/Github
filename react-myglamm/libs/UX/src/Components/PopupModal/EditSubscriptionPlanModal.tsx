import PDPSubscriptions from "@libComponents/PDP/PDPSubscriptions";
import React, { useEffect, useState } from "react";
import PopupModal from "./PopupModal";
import RecurringSubscriptionAPI from "@libAPI/apis/RecurringSubscriptionAPI";
import LoadSpinner from "@libComponents/Common/LoadSpinner";

type selectedRecurringSubscriptionType = {
  quantity: number;
  decoyPriceId: string;
  subscriptionId: string;
  frequency: string;
};
const EditSubscriptionPlanModal = ({
  showEditPlanModal,
  setShowEditPlanModal,
  subscriptionDetails,
  profile,
  setShowUpdatedPlan,
}: any) => {
  const [subscriptionPlans, setSubscriptionPlans] = useState<any>();
  const [selectedRecurringSubscription, setSelectedRecurringSubscription] = useState<selectedRecurringSubscriptionType>();
  const [isReady, setIsReady] = useState<boolean>(false);

  async function handleSavePlanClick(subscription: any) {
    if (profile) {
      setShowUpdatedPlan(false);
      const recurringSubscriptionsApi = new RecurringSubscriptionAPI();
      const res = await recurringSubscriptionsApi.editRecurringSubscription(subscription?.id, data);
      if (res.data.code === 204) {
        setShowEditPlanModal(false);
        setShowUpdatedPlan(true);
      }
    }
  }

  useEffect(() => {
    setIsReady(false);
    const api = new RecurringSubscriptionAPI();
    subscriptionDetails?.product?.sku &&
      api.getSubscriptionPlans(subscriptionDetails?.product?.sku).then((data: any) => {
        setSubscriptionPlans(data?.data?.data);
        setIsReady(true);
      });
  }, [subscriptionDetails?.product?.sku]);

  const data = {
    decoyPricingId: selectedRecurringSubscription?.["decoyPriceId"],
    recurringSubscriptionConfigId: selectedRecurringSubscription?.["subscriptionId"],
    quantity: selectedRecurringSubscription?.["quantity"],
    frequency: selectedRecurringSubscription?.["frequency"],
  };

  return (
    <PopupModal show={showEditPlanModal} onRequestClose={() => setShowEditPlanModal(false)}>
      <div className="bg-white rounded">
        <div className="flex flex-col pt-4 pl-4">
          <h1 className="font-medium text-lg">Edit Your Plan</h1>
        </div>
        {!isReady ? (
          <div className="relative min-h-[50vh]">
            <LoadSpinner className="m-auto top-0 bottom-0 right-0 left-0 h-20 absolute" />
          </div>
        ) : (
          <PDPSubscriptions
            data={subscriptionPlans}
            defaultSelectedPack={subscriptionDetails?.quantity}
            defaultSelectedFrequency={subscriptionDetails?.frequency}
            setSelectedSubscription={(selected: selectedRecurringSubscriptionType) => {
              setSelectedRecurringSubscription(selected);
            }}
          />
        )}
        <div className="flex justify-center mx-4 pb-4">
          <button
            className="bg-color1 min-w-full rounded p-3 text-white font-semibold"
            onClick={() => handleSavePlanClick(subscriptionDetails)}
          >
            SAVE CHANGES
          </button>
        </div>
      </div>
    </PopupModal>
  );
};
export default EditSubscriptionPlanModal;
