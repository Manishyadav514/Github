import React, { ReactElement, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

import useTranslation from "@libHooks/useTranslation";

import { CONFIG_REDUCER } from "@libStore/valtio/REDUX.store";

import OrderAPI from "@libAPI/apis/OrderAPI";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

import OrdersHead from "@libComponents/MyOrder/OrdersHead";
import LoadSpinner from "@libComponents/Common/LoadSpinner";

import UserLayout from "../Components/layout/UserLayout";
import OrderCardWeb from "../Components/user/OrderCardWeb";

const MyOrders = () => {
  const { ref, inView } = useInView({ triggerOnce: true });
  const { t } = useTranslation();

  const orderType = [
    { label: t("live") || "live", id: 1, labelId: "live-order" },
    { label: t("completed") || "completed", id: 2, labelId: "delivered-order" },
    { label: t("cancelled") || "cancelled", id: 3, labelId: "cancelled-orders" },
  ];

  const [ordersData, setOrdersData] = useState<any[]>();
  const [selectedTab, setSelectedTab] = useState(orderType[0]);

  const getOrdersData = (reset = false) => {
    const orderApi = new OrderAPI();

    // @ts-ignore
    orderApi.getMyOrders(checkUserLoginStatus()?.memberId, ordersData?.length || 0, selectedTab.id).then(({ data }) => {
      if (reset) {
        setOrdersData(data.data);
      } else {
        setOrdersData([...(ordersData || []), ...(data?.data || [])]);
      }
    });
  };

  useEffect(() => {
    getOrdersData(true);
  }, [selectedTab]);

  // pagination
  useEffect(() => {
    if (inView) {
      getOrdersData();
    }
  }, [inView]);

  return (
    <section className="w-3/4 py-8 relative">
      <OrdersHead />

      <ul className="flex list-none border-b border-gray-300 mb-4">
        {orderType.map(order => (
          <li key={order.labelId}>
            <button
              onClick={() => {
                setSelectedTab(order);
                setOrdersData(undefined);
              }}
              className={`font-bold text-sm uppercase tracking-wider border-b-4 px-4 pb-2.5 mr-4 ${
                selectedTab.id === order.id ? "border-black" : "border-transparent"
              }`}
            >
              {order.label}
            </button>
          </li>
        ))}
      </ul>

      {(() => {
        // @ts-ignore
        if (ordersData?.length > 0) {
          return ordersData?.map((order, index) => (
            <OrderCardWeb order={order} orderRef={index === ordersData?.length - 4 ? ref : null} />
          ));
        }

        if (ordersData?.length === 0) {
          return (
            <p>
              {t("noOrderText")}&nbsp;
              <Link href="/" className="text-themeGolden">
                {t("click")}!
              </Link>
            </p>
          );
        }

        return <LoadSpinner />;
      })()}
    </section>
  );
};

MyOrders.getLayout = (page: ReactElement) => (
  <UserLayout header={CONFIG_REDUCER.configV3?.myOrders || "my orders"}>{page}</UserLayout>
);

export default MyOrders;
