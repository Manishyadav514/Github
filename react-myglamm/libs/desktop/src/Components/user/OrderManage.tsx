import React, { useEffect, useState } from "react";

import OrderAPI from "@libAPI/apis/OrderAPI";

import useTranslation from "@libHooks/useTranslation";

import { showSuccess } from "@libUtils/showToaster";
import { getLocalStorageValue } from "@libUtils/localStorage";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";

const OrderManage = ({ order }: { order: any }) => {
  const { t } = useTranslation();

  const [invoiceUrl, setInvoiceUrl] = useState<string>();

  const handleCancelOrder = () => {
    if (confirm("Are you sure you want to cancel the order?")) {
      const orderApi = new OrderAPI();
      orderApi.orderCancel(order.userInfo?.identifier, order.id).then(() => {
        showSuccess(t("orderCancelledSuccess") || "Order Cancelled Successfully");
        location.reload();
      });
    }
  };

  useEffect(() => {
    if (order.statusId === 15) {
      const orderApi = new OrderAPI();
      orderApi
        .getOrderInvoice(order.id, getLocalStorageValue(LOCALSTORAGE.MEMBER_ID))
        .then(res => setInvoiceUrl(res.data?.data?.path));
    }
  }, []);

  return (
    <div className="flex items-center justify-between p-5">
      {order.statusId === 12 && (
        <button type="button" className="uppercase" onClick={handleCancelOrder}>
          {t("cancelRequest")}
        </button>
      )}

      {invoiceUrl && (
        <a href={invoiceUrl} target="_blank" className="flex justify-between items-center gap-2 cursor-pointer">
          <img src="https://files.myglamm.com/site-images/original/download-1.png" width={24} />
          {t("downloadInvoice")}
        </a>
      )}
    </div>
  );
};

export default OrderManage;
