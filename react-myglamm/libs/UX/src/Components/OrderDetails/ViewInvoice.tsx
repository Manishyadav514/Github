import React, { useState, useEffect } from "react";
import Router from "next/router";
import { isWebview } from "@libUtils/isWebview";
import { bbcActionCallback } from "@libUtils/bbcWVCallbacks";
import OrderAPI from "@libAPI/apis/OrderAPI";
import { formatPrice } from "@libUtils/format/formatPrice";
import CancelOrderModal from "@libComponents/MyOrder/CancelOrder.Modal";
import PopupModal from "../PopupModal/PopupModal";
import { useRouter } from "next/router";
import Link from "next/link";
import { getOrderStatusIds } from "@libConstants/ORDER_STATUS.constant";
import EditOrderModal from "@libComponents/PopupModal/EditOrderModal";
import { ADOBE } from "@libConstants/Analytics.constant";
import Adobe from "@libUtils/analytics/adobe";

const ViewInvoice = ({ orderInfo, t, showNeedHelpButton, invoiceUrl, invoiceError, editOrderData }: any) => {
  const [cancelMsg, setCancelMsg] = useState<any>();

  const hideCancelOrderBtn = getOrderStatusIds([
    "Completed",
    "Return_To_Origin",
    "Cancelled",
    "In_Transit",
    "Ready_To_Ship",
    "Out_For_Delivery",
    "Return_Initiated",
    "Return_Completed",
    "Replaced",
    "Processing",
  ]);

  // for brands that have cancellation reason list
  const [showCancelllationReasonsModal, setShowCancelllationReasonsModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [cancelReasonList, setCancelReasonList] = useState<any>();
  const [showEditOrderModal, setShowEditOrderModal] = useState<boolean | undefined>();

  // for brands that do not have cancellation reason list in api response
  const [showBasicModal, setshowBasicModal] = useState(false);
  const openBasicModal = () => setshowBasicModal(true);
  const closeBasicModal = () => setshowBasicModal(false);
  const router = useRouter();

  // fetch cancellation reasons
  const fetchCancelReasons = async () => {
    const orderApi = new OrderAPI();
    const { data } = await orderApi.getCancelOrderReason(orderInfo?.meta?.orderCancellationVariant);
    setCancelReasonList(data.data);
  };

  const toggleModal = () => {
    if (cancelReasonList?.reasons?.length > 0) {
      if (!showCancelllationReasonsModal) {
        setShowCancelllationReasonsModal(!showCancelllationReasonsModal);
      }
      setIsOpen(!isOpen);
    } else {
      openBasicModal();
    }
  };

  useEffect(() => {
    if (orderInfo) {
      fetchCancelReasons();
    }

    return () => {
      // orderApi.PendingRequest.cancel("Request Cancelled");
    };
  }, [orderInfo]);

  // For closing of order cancellation reason modal
  const closingWithCancellationReason = (data: any, other?: boolean) => {
    const cancelObj: any = {};
    if (data) {
      if (other) {
        cancelObj.meta = { cancelReason: "other", cancelSubReason: data };
      } else {
        cancelObj.meta = { cancelReason: data };
      }
    }

    setIsOpen(!isOpen);
    cancelOrder(cancelObj);
  };

  const cancelOrder = (cancelObj?: any) => {
    const orderApi = new OrderAPI();
    orderApi.orderCancel(localStorage.getItem("memberId") || "", orderInfo.id, cancelObj).then(res => {
      if (res.data.code === 200) {
        !cancelObj && closeBasicModal();
        setCancelMsg("We have recieved your request. Our customer support will get back to you");
        setTimeout(() => {
          Router.push("/my-orders");
        }, 3000);
      }
    });
  };

  /* Triggering Webview Callbacks */
  const handleInvoice = (e: any) => {
    if (isWebview()) {
      e.preventDefault();
      bbcActionCallback("download", { url: invoiceUrl });
    }
  };

  /* Adobe On Click Event - Post Order - Address Edit Modal */
  const adobeClickEventEditOrder = (ctaName: string) => {
    (window as any).digitalData = {
      common: {
        linkName: `web|my order|order details`,
        linkPageName: `web|my order|order details|edit order`,
        newLinkPageName: "order details",
        assetType: "",
        newAssetType: "",
        subSection: "",
        platform: ADOBE.PLATFORM,
        ctaName,
        pageLocation: "Order Details",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();
  };

  return (
    <React.Fragment>
      <div className="flex items-center">
        {!hideCancelOrderBtn.includes(orderInfo.statusId) && (
          <button
            className="w-full block uppercase text-center py-4 mb-4 mr-2 text-color1 rounded border border-color1 "
            type="button"
            onClick={toggleModal}
            disabled={orderInfo.paymentDetails?.orderAmount < 10000}
          >
            {t("cancelOrder")}
          </button>
        )}
        {showNeedHelpButton && (
          <Link
            href={`/chat-with-us?flow=MyOrder&orderNumber=${orderInfo?.orderNumber}`}
            className="w-full block uppercase text-center py-4 mb-4 mr-2 text-color1 rounded border border-color1 "
          >
            {t("needHelpButton") || "Need Help ?"}
          </Link>
        )}
        {orderInfo?.meta?.orderEditVariant === "1" && orderInfo?.statusId === 12 ? (
          <button
            className="w-full block uppercase text-white text-center py-4 mb-4 rounded"
            style={{ background: "var(--color1)" }}
            onClick={() => {
              setShowEditOrderModal(true);
              adobeClickEventEditOrder("edit order");
            }}
          >
            {t("editOrder") || "Edit Order"}
          </button>
        ) : (
          <a
            href={invoiceUrl}
            target="_blank"
            onClick={handleInvoice}
            rel="noreferrer noopner"
            className="w-full block uppercase text-white text-center py-4 mb-4 rounded"
            style={{ background: invoiceUrl ? "var(--color1)" : "#8c8c8c" }}
            aria-label={invoiceUrl && !invoiceError ? t("viewInvoice") : "Generating Invoice..."}
          >
            {invoiceUrl && !invoiceError ? t("viewInvoice") : "Generating Invoice..."}
          </a>
        )}
      </div>
      {cancelMsg && <p className="text-green-600 text-sm">{cancelMsg}</p>}
      {orderInfo.statusId === 14 && orderInfo.waybillNumber && (
        <button className="mb-2 underline" type="button">
          {t("trackShipment")}
        </button>
      )}

      {showCancelllationReasonsModal && (
        <CancelOrderModal
          open={isOpen}
          onRequestClose={toggleModal}
          cancelOrder={closingWithCancellationReason}
          cancelReasonList={cancelReasonList}
          editOrderData={editOrderData}
        />
      )}

      {/* Basic modal for brands where cancellation reasons is not present in API response */}
      <PopupModal show={showBasicModal} onRequestClose={closeBasicModal}>
        <section>
          <h6 className="text-base font-semibold" style={{ padding: "25px 10px" }}>
            {t("cancelOrder")}
          </h6>

          <p className="" style={{ padding: "10px" }}>
            {t("areYouSureYouWantToCancel")}
          </p>

          <div className="text-sm flex justify-end" style={{ padding: "10px" }}>
            <button type="button" className="mr-2" style={{ outline: "none" }} onClick={closeBasicModal}>
              {t("no")}
            </button>

            <button
              type="button"
              className="bg-black text-white rounded-sm"
              style={{ padding: "7px 15px" }}
              onClick={() => cancelOrder()}
            >
              {t("yes")}
            </button>
          </div>
        </section>
      </PopupModal>

      {showEditOrderModal && (
        <EditOrderModal
          show={showEditOrderModal}
          hide={() => {
            setShowEditOrderModal(false);
          }}
          orderData={editOrderData}
          showShippingAddress
        />
      )}
    </React.Fragment>
  );
};

export default ViewInvoice;
