import React from "react";
import { useRouter } from "next/router";
import { getStaticUrl } from "@libUtils/getStaticUrl";
import useTranslation from "@libHooks/useTranslation";

const OrderPending = () => {
  const { t } = useTranslation();

  const router = useRouter();

  return (
    <div className="h-screen bg-white">
      <div className="flex flex-col justify-center items-center  text-center h-4/6 ">
        <div className="w-20 h-20">
          <img src={getStaticUrl("/global/images/paymentPending.gif")} alt="payment pending gif" />
        </div>
        <h2 className="font-bold text-2xl mt-6 text-color1">{t("paymentPending") || "Payment Pending"}</h2>
        <p
          className="text-gray-600 mt-2 px-5"
          dangerouslySetInnerHTML={{
            __html:
              t("paymentPendingMsg1")?.replace("\n", "<br />") ||
              "This is taking longer than usual. <br /> We will notify you once the order is confirmed",
          }}
        ></p>
      </div>

      <div className="flex flex-col justify-center items-center  h-2/6 text-center border-t-8 border-gray-300">
        <p
          className="text-gray-600 px-5"
          dangerouslySetInnerHTML={{
            __html:
              t("paymentPendingMsg2")?.replace("\n", "<br />") ||
              "You can also check the order status in <br /> the My Orders section.",
          }}
        ></p>
        <button
          onClick={() => router.push("/my-orders")}
          className="mt-3 text-sm flex relative items-center text-white font-semibold uppercase py-3.5 px-4 justify-evenly bg-ctaImg rounded w-1/2"
        >
          {t("viewMyOrders") || "view my orders"}
        </button>
      </div>
    </div>
  );
};

export default OrderPending;
