import React, { useEffect, useState, ReactElement } from "react";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import CancelSubscriptionPlanModal from "@libComponents/PopupModal/CancelSubscriptionPlanModal";
import ViewSubscriptionPlanModal from "@libComponents/PopupModal/ViewSubscriptionPlanModal";
import EditSubscriptionPlanModal from "@libComponents/PopupModal/EditSubscriptionPlanModal";
import RecurringSubscriptionAPI from "@libAPI/apis/RecurringSubscriptionAPI";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import Layout from "@libLayouts/Layout";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
const { format, addDays, isAfter, isSameDay } = require("date-fns");
import { formatPrice } from "@libUtils/format/formatPrice";
import useAddtoBag from "@libHooks/useAddToBag";
import { useRouter } from "next/router";
import Adobe from "@libUtils/analytics/adobe";
import { ADOBE } from "@libConstants/Analytics.constant";

const MyPlan = () => {
  const [showCancelPlanModal, setshowCancelPlanModal] = useState<boolean>(false);
  const [showMyPlanModal, setShowMyPlanModal] = useState<boolean>(false);
  const [showEditPlanModal, setShowEditPlanModal] = useState<boolean>(false);
  const [subscriptions, setSubscriptions] = useState<any>();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [deliveryFrequencyText, setDeliveryFrequencyText] = useState<any>();
  const [clickedSubscriptionDetails, setClickedSubscriptionDetails] = useState<any>();
  const [showCancellationSuccessful, setShowCancellationSuccessful] = useState<boolean>(false);
  const [updatedPlan, setShowUpdatedPlan] = useState<boolean>(false);

  const { addProductToCart } = useAddtoBag();

  const router = useRouter();

  /* Restart Plan */
  const addToCart = (product: any, decoyPriceId: any, subscriptionId: any) => {
    addProductToCart({ ...product, decoyPriceId, subscriptionId }, 1, undefined, undefined, true, true, false, false).then(
      res => {
        if (res) {
          router.push("/shopping-bag");
        }
      }
    );
  };

  const DELIVERY_FREQUENCY: any = { QUARTERLY: "once in 3 months", MONTHLY: "once every month", ONE_TIME: "once" };

  const { profile } = useSelector((store: ValtioStore) => ({
    profile: store.userReducer.userProfile,
  }));

  const handleCancelPlanModalClick = (subscription: any) => {
    setshowCancelPlanModal(true);
    setClickedSubscriptionDetails(subscription);
  };

  const handleShowMyPlanClick = (subscription: any) => {
    setDeliveryFrequencyText(DELIVERY_FREQUENCY[subscription?.frequency]);
    setClickedSubscriptionDetails(subscription);
    setShowMyPlanModal(true);
  };

  const handleEditPlanClick = (subscription: any) => {
    setShowEditPlanModal(true);
    setClickedSubscriptionDetails(subscription);
  };

  const handleEditPlanFromCancelModalClick = (subscription: any) => {
    setshowCancelPlanModal(false);
    handleEditPlanClick(subscription);
  };

  async function getSubscriptionData() {
    if (profile) {
      const recurringSubscriptionsApi = new RecurringSubscriptionAPI();
      const res = await recurringSubscriptionsApi.getRecurringSubscriptions(profile?.id);
      setSubscriptions(res?.data?.data);
      setIsReady(true);
    }
  }

  useEffect(() => {
    if (profile) {
      getSubscriptionData();
    }
  }, [profile, updatedPlan]);

  if (!isReady) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadSpinner />
      </div>
    );
  }

  /* Requirement to show edit plan for 7 days for first iteration later it will be based on delivery status */
  const showEditPlanTextAndButton = (date: any) => {
    const today = new Date();
    const enableEditPlanDate = addDays(new Date(date), 7);
    return isAfter(today, enableEditPlanDate) || isSameDay(today, enableEditPlanDate);
  };

  const adobeClickEventCancelSubscription = (ctaName: string) => {
    // On Click - Cancel Subscription
    (window as any).digitalData = {
      common: {
        linkName: `web|My Plan| Cancel`,
        linkPageName: `Subscription`,
        newLinkPageName: "My Plan",
        assetType: "Subscription My Plan",
        newAssetType: "Subscription My Plan",
        subSection: "My Plan",
        platform: ADOBE.PLATFORM,
        ctaName,
        pageLocation: "My Plan",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();
  };

  const adobeClickEventRestartPlan = (ctaName: string) => {
    // On Click - Restart Plan
    (window as any).digitalData = {
      common: {
        linkName: `web|My Plan| Restart`,
        linkPageName: `Subscription`,
        newLinkPageName: "My Plan",
        assetType: "My Plan Restart Plan",
        newAssetType: "My Plan Restart Plan",
        subSection: "My Plan",
        platform: ADOBE.PLATFORM,
        ctaName,
        pageLocation: "My Plan",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();
  };

  const adobeClickEventEditPlan = (ctaName: string) => {
    // On Click - Restart Plan
    (window as any).digitalData = {
      common: {
        linkName: `web|My Plan| Edit`,
        linkPageName: `Subscription`,
        newLinkPageName: "My Plan",
        assetType: "Subscription My Plan",
        newAssetType: "Subscription My Plan",
        subSection: "My Plan",
        platform: ADOBE.PLATFORM,
        ctaName,
        pageLocation: "My Plan",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();
  };

  return (
    <>
      <div className="flex items-center justify-center p-6 bg-white">
        <span className="text-xl font-medium capitalize">Welcome, {profile?.firstName || ""}</span>
      </div>

      <div className="mt-0.5 min-h-screen">
        <div className="p-4 bg-white">
          <p className="font-medium">Product in My Plan</p>
        </div>

        {subscriptions?.data?.length > 0 ? (
          subscriptions.data?.map((subscription: any, index: any) => (
            <div className="flex px-4 space-x-2 mb-0.5 py-4 bg-white" key={index}>
              <div role="presentation" className="h-20 w-20">
                <ImageComponent
                  alt={subscription?.product?.assets?.[0]?.name}
                  className={`"h-20 w-20"`}
                  src={subscription?.product?.assets[0]?.imageUrl?.["200x200"]}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <div
                  className={`${
                    subscription?.statusId === 1 ? "bg-[#50AD8C]" : "bg-gray-400"
                  }  rounded-full max-w-fit px-3 py-1 text-xs text-white font-bold`}
                >
                  {subscription?.statusId === 1 ? "ACTIVE" : "CANCELLED"}
                </div>
                <div className="text-xs pt-1.5">{subscription?.product?.cms[0].content.name}</div>
                <div className="text-10 text-gray-400 font-medium">
                  PACK OF {subscription?.quantity} • Delivered {DELIVERY_FREQUENCY[subscription?.frequency]}
                </div>
                <div className="text-10">
                  <p className="font-medium inline">Next Delivery: </p>
                  {format(new Date(subscription?.nextOrderDate), "do MMM, yyyy")}
                </div>
                <div className="text-10 font-medium">
                  Plan Amount: {formatPrice(subscription?.subscriptionOfferPrice, true)}
                </div>
                {subscription?.statusId === 1 && (
                  <div className="flex justify-between pt-4 pb-2 max-w-fit">
                    <div
                      className="text-xs text-gray-400 pr-2"
                      onClick={() => {
                        handleCancelPlanModalClick(subscription);
                        adobeClickEventCancelSubscription("Cancel Subscription");
                      }}
                    >
                      Cancel Subscription
                    </div>
                    {showEditPlanTextAndButton(subscription?.subscriptionStartDate) && (
                      <>
                        <div className="text-xs pr-2">|</div>
                        <div
                          className="text-xs text-color1"
                          onClick={() => {
                            adobeClickEventEditPlan("Edit Plan");
                            handleEditPlanClick(subscription);
                          }}
                        >
                          Edit Plan
                        </div>
                      </>
                    )}
                  </div>
                )}
                {subscription?.statusId === 2 && (
                  <div className="flex justify-between pt-4 pb-2 max-w-fit">
                    <div className="text-xs text-gray-400 pr-2" onClick={() => handleShowMyPlanClick(subscription)}>
                      View Plan
                    </div>
                    {subscription?.product && (
                      <>
                        <div className="text-xs pr-2">|</div>
                        <div
                          className="text-xs text-color1"
                          onClick={() => {
                            adobeClickEventRestartPlan("Restart Plan");
                            addToCart(
                              subscription?.product,
                              subscription?.decoyPricingId,
                              subscription?.recurringSubscriptionConfigId
                            );
                          }}
                        >
                          Restart Plan
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="min-h-[30vh] flex justify-center items-center bg-white">No active plans.</div>
        )}
      </div>

      <CancelSubscriptionPlanModal
        showCancelPlanModal={showCancelPlanModal}
        setshowCancelPlanModal={setshowCancelPlanModal}
        handleEditPlanModalClick={handleEditPlanFromCancelModalClick}
        subscriptionDetails={clickedSubscriptionDetails}
        profile={profile}
        showCancellationSuccessful={showCancellationSuccessful}
        setShowCancellationSuccessful={setShowCancellationSuccessful}
        setShowUpdatedPlan={setShowUpdatedPlan}
        showEditPlanTextAndButton={showEditPlanTextAndButton(clickedSubscriptionDetails?.subscriptionStartDate)}
      />
      <ViewSubscriptionPlanModal
        showMyPlanModal={showMyPlanModal}
        setShowMyPlanModal={setShowMyPlanModal}
        subscriptionDetails={clickedSubscriptionDetails}
        deliveryFrequencyText={deliveryFrequencyText}
        addToCart={addToCart}
      />
      <EditSubscriptionPlanModal
        showEditPlanModal={showEditPlanModal}
        setShowEditPlanModal={setShowEditPlanModal}
        subscriptionDetails={clickedSubscriptionDetails}
        profile={profile}
        setShowUpdatedPlan={setShowUpdatedPlan}
      />
    </>
  );
};

MyPlan.getLayout = (children: ReactElement) => <Layout footer={false}>{children}</Layout>;

export default MyPlan;
