import * as React from "react";

import PopupModal from "@libComponents/PopupModal/PopupModal";

import CancelOrder from "./CancelOrder";

const CancelOrderModal = ({ open, onRequestClose, cancelOrder, cancelReasonList, editOrderData }: any) => (
  <PopupModal show={open} onRequestClose={onRequestClose}>
    <CancelOrder
      cancelOrder={cancelOrder}
      onRequestClose={onRequestClose}
      cancelReasonList={cancelReasonList}
      editOrderData={editOrderData}
    />
  </PopupModal>
);

export default CancelOrderModal;
