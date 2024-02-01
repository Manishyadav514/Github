import React, { useEffect, useState } from "react";

import ConfigText from "@libComponents/Common/ConfigText";
import useTranslation from "@libHooks/useTranslation";
import PopupModal from "../PopupModal/PopupModal";
import CloseIcon from "../../../public/svg/group-2.svg";
import dynamic from "next/dynamic";
import { ADDRESS_FORM_MODAL_STATE } from "@libStore/valtioStore";
import EditOrderModal from "@libComponents/PopupModal/EditOrderModal";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { ADOBE } from "@libConstants/Analytics.constant";
import Adobe from "@libUtils/analytics/adobe";

const ChooseAddressModalV2 = dynamic(
  () => import(/* webpackChunkName: "ChooseAddressModal" */ "@libComponents/PopupModal/ChooseAddressModalV2"),
  { ssr: false }
);

type filterProps = {
  onRequestClose: () => void;
  cancelReasonList: any;
  cancelOrder: (data: any, other?: boolean) => void;
  editOrderData: any;
};
const CancelOrder = (props: filterProps) => {
  const { t } = useTranslation();

  const { cancelOrder, onRequestClose, cancelReasonList, editOrderData } = props;
  const [showSuggestionFlag, setSuggestionFlag] = useState<any>();
  const [showOtherSuggestion, setShowOtherSuggestion] = useState<any>(false);
  const [cancelReasonText, setCancelReasonText] = useState<any>("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showChangeAddressModal, setShowChangeAddressModal] = useState<boolean | undefined>();
  const [showChangeShadeModal, setShowChangeShadeModal] = useState<boolean | undefined>();
  const [redirection, setRedirection] = useState<any>();

  useEffect(() => {
    setSuggestionFlag(false);
    setShowOtherSuggestion(false);
  }, []);

  const setSuggestion = (suggestion: any) => {
    setSuggestionFlag(suggestion.suggestion);
  };

  const otherSuggestion = (event: any) => {
    if (event.target.value.replace(/\s/g, "").length) {
      setCancelReasonText(event?.target.value);
    }
  };

  const handleAddressShadeCancellationReason = (redirectTo: any) => {
    if (
      editOrderData?.meta?.orderEditVariant === "1" &&
      !editOrderData?.productMeta?.isSubscriptionProduct &&
      !editOrderData?.productMeta?.isDecoyPricedProduct
    ) {
      setRedirection(redirectTo);
      if (redirectTo === "changeaddress" || redirectTo === "updateorder") {
        setShowConfirmationModal(true);
        adobeConfirmationModalLoaded(redirectTo);
      }
    }
  };

  const handleCancelOrderBtnClick = () => {
    if (redirection === "changeaddress" || redirection === "updateorder") {
      setShowConfirmationModal(true);
      adobeConfirmationModalLoaded(redirection);
    } else {
      cancelOrder(cancelReasonText, showOtherSuggestion);
    }
  };

  const adobeConfirmationModalLoaded = (edit: any) => {
    let eventText = "";
    if (edit === "changeaddress") {
      eventText = "address";
    } else if (edit === "updateorder") {
      eventText = "shade";
    } else {
      eventText = "";
    }

    /* Adobe Load Event - Shade/Address Edit Confirmation Popup Modal */
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: `web|${eventText} edit popup`,
        newPageName: `post order ${eventText} edit - cancellation`,
        subSection: "",
        assetType: "",
        newAssetType: "",
        platform: ADOBE.PLATFORM,
        pageLocation: "order details",
        technology: ADOBE.TECHNOLOGY,
      },
    };
  };

  /* Adobe On Click Event Change Order - Confirmation Modal */
  const adobeClickEventChangeOrder = (redirection: string) => {
    let eventText = "";
    if (redirection === "changeaddress") {
      eventText = "Address";
    } else if (redirection === "updateorder") {
      eventText = "Shade";
    } else {
      eventText = "";
    }
    (window as any).digitalData = {
      common: {
        linkName: `web|${eventText} edit popup|Change ${eventText}`,
        linkPageName: `web|${eventText} edit popup|Change ${eventText}`,
        newLinkPageName: `${eventText} edit screen popup`,
        assetType: "",
        newAssetType: "",
        subSection: "",
        platform: ADOBE.PLATFORM,
        ctaName: `Change ${eventText}`,
        pageLocation: "Order Details",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();
  };

  /* Adobe On Click Event - Cancel Order - Confirmation Modal */
  const adobeClickEventCancelOrder = (redirection: string) => {
    let eventText = "";
    if (redirection === "changeaddress") {
      eventText = "Address";
    } else if (redirection === "updateorder") {
      eventText = "Shade";
    } else {
      eventText = "";
    }
    (window as any).digitalData = {
      common: {
        linkName: `web|${eventText} edit popup|Cancel`,
        linkPageName: `web|${eventText} edit popup|Cancel`,
        newLinkPageName: `${eventText} edit screen popup`,
        assetType: "",
        newAssetType: "",
        subSection: "",
        platform: ADOBE.PLATFORM,
        ctaName: "Cancel",
        pageLocation: "Order Details",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();
  };

  return (
    <div className="bg-gray-100 h-screen">
      <style jsx>
        {`
          input[type="radio"] {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-clip: content-box;
            border-radius: 50%;
            padding: 2px;
            border: solid 1px #dfe2ea;
          }
          input[type="radio"]:checked {
            border: solid 1px var(--color1);
            background-color: var(--color1);
          }
        `}
      </style>

      <div className="mb-2 flex bg-white p-3">
        <button type="button" onClick={onRequestClose}>
          <img src="https://files.myglamm.com/site-images/original/back_1.png" alt="back" />
        </button>
        <span className="font-semibold ml-2">
          <ConfigText configKey={"cancelOrder"} fallback={`Cancel Order`} />
        </span>
      </div>
      <div className="px-2">
        <div className=" bg-white p-3">
          <div className="flex justify-content">
            <div className="w-10/12">
              <p className="text-xl font-bold">
                <ConfigText configKey={"beforeYouCancelTitle"} fallback={`Before You Cancel...`} />
              </p>
              <p className="text-sm">
                <ConfigText
                  configKey={"beforeYouCancelDesc"}
                  fallback={`Help us understand why you would like 
                to cancel your order.`}
                />
              </p>
            </div>
            <div className="w-2/12">
              <img
                className="w-10 h-10 items-right"
                src="https://files.myglamm.com/site-images/original/cancel-order.png"
                alt="cancel-order"
              />
            </div>
          </div>
          <div className="py-2 mt-3 bg-white" style={{ height: "80vh" }}>
            <div className="mx-auto my-2 mt-2 text-base cursor-pointer">
              <div className=" mt-2 input-radio">
                {cancelReasonList?.reasons.map((value: any) => (
                  <div key={value.text}>
                    <div className="flex items-center mb-2">
                      <input
                        id={value.text}
                        type="radio"
                        name="reason"
                        className="mr-1 w-5 h-5 outline-none"
                        value={value.text}
                        onChange={() => {
                          setSuggestion(value);
                          setShowOtherSuggestion(false);
                          setCancelReasonText(value.text);
                          /* Handle incorrect address & incorrect shade cancellation reason */
                          handleAddressShadeCancellationReason(value?.meta?.redirection || "");
                        }}
                      />
                      <label htmlFor={value.text} className="text-sm ml-2">
                        {value.text}
                      </label>
                    </div>
                    {value?.suggestion?.length && value.suggestion === showSuggestionFlag && (
                      <>
                        <p className="flex justify-content items-center bg-red-100 border w-11/12 px-2 py-1 ml-7 mb-4 rounded-sm outline-none border-color1 placeholder-gray-500 text-sm">
                          <img src="https://files.myglamm.com/site-images/original/flash.png" alt="flash" />{" "}
                          <span className="ml-2">{value.suggestion}</span>
                        </p>
                      </>
                    )}
                  </div>
                ))}
                {cancelReasonList?.isOtherOption && (
                  <div>
                    <div className="flex items-center mr-4 mb-4">
                      <input
                        id="other"
                        type="radio"
                        name="reason"
                        className="mr-1 w-5 h-5 outline-none"
                        value="other"
                        onChange={() => {
                          setShowOtherSuggestion(!showOtherSuggestion);
                          setSuggestionFlag(false);
                          setCancelReasonText("");
                        }}
                      />
                      <label htmlFor="other" className="text-sm ml-2">
                        {t("otherOptionTitle") || "Other"}
                      </label>
                    </div>
                    {showOtherSuggestion && (
                      <textarea
                        rows={6}
                        maxLength={1000}
                        onChange={otherSuggestion}
                        placeholder={t("otherOptionDesc")}
                        className="border w-11/12 px-2 py-1 ml-7  rounded-sm outline-none border-color1 placeholder-gray-500 text-sm"
                      />
                    )}
                  </div>
                )}

                {(showSuggestionFlag || cancelReasonText !== "") && (
                  <div>
                    <button
                      type="button"
                      onClick={handleCancelOrderBtnClick}
                      className="sticky bottom-20 z-10 w-full text-sm text-center text-white font-semibold uppercase px-2 py-4 mt-6 rounded-sm bg-red-300 "
                    >
                      {t("cancelOrder")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* modal for asking the user if he wants to change address/shade instead of directly cancelling the order */}
      <PopupModal show={showConfirmationModal} onRequestClose={() => setShowConfirmationModal(false)}>
        <div className="bg-white rounded-t-3xl p-3 pt-6 flex flex-col items-center">
          <h6 className="text-base font-semibold">{t("areYouSure") || "Are you sure?"}</h6>

          <CloseIcon onClick={() => setShowConfirmationModal(false)} className="absolute right-3 top-3" />

          <p className="text-sm p-3 text-center">
            {redirection === "changeaddress"
              ? t("changeAddressConfirmationText") ||
                "Do you want to cancel this order or would you like to change the address?"
              : ""}

            {redirection === "updateorder"
              ? t("changeShadeConfirmationText") || "Do you want to cancel this order or would you like to change the shade?"
              : ""}
          </p>

          <div className="w-full flex justify-between pt-3">
            <button
              type="button"
              className="w-1/2 mr-2 p-2 rounded-sm uppercase font-semibold"
              style={{
                border: "1px solid #fde1e1",
                color: "#fab6b5",
              }}
              onClick={() => {
                cancelOrder(cancelReasonText);
                adobeClickEventCancelOrder(redirection);
              }}
            >
              {t("cancel") || "Cancel"}
            </button>

            <button
              type="button"
              className="w-1/2 p-2 rounded-sm uppercase font-semibold text-white bg-color1"
              onClick={() => {
                redirection === "changeaddress" && setShowChangeAddressModal(true);
                redirection === "updateorder" && setShowChangeShadeModal(true);
                adobeClickEventChangeOrder(redirection);
              }}
            >
              {redirection === "changeaddress" ? t("changeAddress") || "Change Address" : ""}
              {redirection === "updateorder" ? t("changeShade") || "Change Shade" : ""}
            </button>
          </div>
        </div>
      </PopupModal>

      {/* modal to choose new shipping address for the order */}
      {showChangeAddressModal && (
        <ChooseAddressModalV2
          show={showChangeAddressModal}
          hide={() => {
            ADDRESS_FORM_MODAL_STATE.showAddressForm = false;
            setShowChangeAddressModal(false);
          }}
          shippingAddress={Object.assign(editOrderData?.address?.shippingAddress, {
            id: editOrderData?.address?.shippingAddress["addressId"],
          })}
        />
      )}

      {showChangeShadeModal && (
        <EditOrderModal
          show={showChangeShadeModal}
          hide={() => {
            setShowChangeShadeModal(false);
          }}
          orderData={editOrderData}
        />
      )}
    </div>
  );
};

export default CancelOrder;
