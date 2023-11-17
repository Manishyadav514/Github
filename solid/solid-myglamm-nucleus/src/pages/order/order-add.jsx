import { onMount, createSignal } from "solid-js";
import { PageTitlebar } from "@components/PageTitlebar";
import { Tab } from "@components/Tab";
import OrderAPI from "@services/order.service";
import { OrderBreadcrumb } from "@/constants/BreadcrumbConstant";

export default function Order() {
  let breadcrumb = [
    ...OrderBreadcrumb,
    {
      name: "Create Order",
    },
  ];

  onMount(async () => {
    const orderAPI = new OrderAPI();
    // pagination data
    try {
      const data = await orderAPI.count();
      let paginationData = data?.data?.data;
      setOrderCount(paginationData?.paginationCount);
    } catch (e) {
      console.log(e);
    }
    // order data
    try {
      const res = await orderAPI.listing();
      let data = res?.data?.data;
      setOrderData(data);
      console.log(data?.data?.[0]);
    } catch (e) {
      console.log(e);
    }
  });

  const titles = [
    { label: "English", id: 1 },
    { label: "+ Add New Language", id: 2 },
  ];

  // track active tab in parent
  const [activeTab, setActiveTab] = createSignal(titles[0]);
  const onTabChange = e => {
    setActiveTab(e);
  };
  const createOrder = () => {
    alert("Create Order");
  };

  return (
    <div>
      <PageTitlebar breadcrumb={breadcrumb} pageTitle="Create Order" />
      <Tab titles={titles} activeTab={activeTab} changeTab={onTabChange} country={true} />
    </div>
  );
}
