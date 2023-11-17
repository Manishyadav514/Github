import { createSignal, For, createEffect } from "solid-js";
import { PageTitlebar } from "@components/PageTitlebar";
import { OrderTable } from "@/components/order/OrderTable";
import { Tab } from "@components/Tab";
import { Pagination } from "@components/Pagination";
import { SearchBar } from "@components/common/SearchBar";
import { CommonButton } from "@components/CommonButton";
import { useNavigate } from "@solidjs/router";
import OrderAPI from "@services/order.service";
import { OrderBreadcrumb } from "@/constants/BreadcrumbConstant";
import { Filter } from "@/components/filter/Filter";
import { OrderStatusEnum } from "@/constants/Order.constant";
import { hideLoader, showLoader } from "@/services/loader.service";
import { showError } from "@/utils/showToaster";
import { API_CONFIG } from "@/constants/api.constant";
import { NoRecord } from "@/components/common/NoRecordComp";
import { ORDER_FILTER_CONFIG } from "@/constants/order.filter.constant";

export const statusArray = [
  {
    id: 1,
    name: "All Orders",
    statusIds: []
  },
  { id: 2, name: "Pending", statusIds: [OrderStatusEnum.PENDING] },
  { id: 3, name: "Confirmed", statusIds: [OrderStatusEnum.CONFIRMED] },
  { id: 4, name: "Ready To Ship", statusIds: [OrderStatusEnum.READY_TO_SHIP] },
  { id: 5, name: "Shipped", statusIds: [OrderStatusEnum.SHIPPED] },
  { id: 6, name: "Cancelled", statusIds: [OrderStatusEnum.CANCELLED] },
  {
    id: 7,
    name: "Failed",
    statusIds: [OrderStatusEnum.FAILED, OrderStatusEnum.REJECT, OrderStatusEnum.EXPIRED]
  },
  {
    id: 8,
    name: "Pending Approval",
    statusIds: [OrderStatusEnum.PENDING_APPROVAL]
  },
  {
    id: 9,
    name: "Offline",
    statusIds: [OrderStatusEnum.DELIVERED, OrderStatusEnum.RETURN_COMPLETED]
  },
  { id: 10, name: "Return initiated", statusIds: [OrderStatusEnum.RETURN_INITIATED] },
  { id: 11, name: "Return Completed", statusIds: [OrderStatusEnum.RETURN_COMPLETED] }
];

export default function Order() {
  const [orderFilter, setOrderFilter] = createSignal(ORDER_FILTER_CONFIG);
  const [orderCount, setOrderCount] = createSignal(0); // no. of orders
  const [orderData, setOrderData] = createSignal([]);
  const [activeTab, setActiveTab] = createSignal(statusArray[0]); // default select tab with index 0 or id 1
  const [currentPageNo, setCurrentPageNo] = createSignal(1); // current active page
  const [sort, setSort] = createSignal("orderPlaced DESC");
  const [searchInput, setSearchInput] = createSignal("");
  const [where, setWhere] = createSignal({
    vendorCode: "mgp",
    country: "IND"
  });

  // filter compomnent
  // {
  //   vendorCode: "mgp",
  //   country: "IND",
  //   createdAt: { between: ["2023-04-19T18:30:00.000Z", "2023-04-27T18:29:59.999Z"] },
  //   "paymentDetails.orderAmount": { between: [10100, 210000] }, // maximum selected {"lte":39800}
  //   "meta.deviceType": { inq: ["Mobile_Website"] },
  //   statusId: { inq: [13, 17, 18, 16, 19, 81, 71] },
  //   dispatchDelay: "BW2T3D",
  //   deliveryDelay: "BW1T2D",
  //   warehouseIdentifier: "EASYECOMTMC-DL",
  //   "paymentDetails.paymentMode.status": { inq: [26] }
  // }

  const navigate = useNavigate();
  const pageSize = API_CONFIG.pageSize;
  const orderAPI = new OrderAPI();

  const loadOrderCount = async () => {
    const orderStatusQuery = activeTab()?.statusIds?.length > 0 ? activeTab()?.statusIds : undefined;
    const orderSearchInput = searchInput().length > 0 ? searchInput() : undefined;
    try {
      const data: any = await orderAPI.fetchOrderCount(currentPageNo(), pageSize, sort(), orderStatusQuery, orderSearchInput);
      let paginationData = data?.data?.data;
      setOrderCount(paginationData?.paginationCount);
    } catch (err: any) {
      showError((err && err?.message) || (err && err.error && err.error.message));
    }
  };

  const loadOrderData = async () => {
    const orderStatusQuery = activeTab()?.statusIds?.length > 0 ? activeTab()?.statusIds : undefined;
    const orderSearchInput = searchInput().length > 0 ? searchInput() : undefined;
    showLoader("Loading...");
    try {
      const res: any = await orderAPI.fetchAllOrder(currentPageNo(), pageSize, sort(), orderStatusQuery, orderSearchInput);
      let data = res?.data?.data?.data;
      setOrderData(data);
    } catch (err: any) {
      showError((err && err?.message) || (err && err.error && err.error.message) || "Party Theme");
    } finally {
      hideLoader();
    }
  };

  // onMount(() => {
  //   loadOrderData();
  //   loadOrderCount();
  // });

  // track active tab in parent
  const onTabChange = (e: any) => {
    setActiveTab(e);
    loadOrderData();
    loadOrderCount();
  };

  // handle page click
  const handlePageChange = (e: any) => {
    setCurrentPageNo(e);
    loadOrderData();
  };

  // handle search input
  const handleSearch = (e: string) => {
    setSearchInput(e);
    loadOrderData();
    loadOrderCount();
  };
  createEffect(() => {}, [orderFilter()]);

  // filter
  const [showFilter, setShowFilter] = createSignal(false);

  return (
    <div>
      <PageTitlebar
        breadcrumb={OrderBreadcrumb}
        pageTitle="Orders"
        btnText="create order"
        addBtnTrigger={() => navigate(`/order/add`, { replace: false })}
      >
        <CommonButton
          labelText="Bulk Comment Upload"
          bgWhite={true}
          btnType="button"
          btnIcon="material-symbols:cloud-upload"
          isDisabled={false}
          customClass="mx-3"
          clicked={() => navigate(`/order/bulk-comment-upload`, { replace: false })}
        />
        <CommonButton
          labelText="Reload Data"
          bgWhite={true}
          btnType="button"
          btnIcon="tabler:reload"
          isDisabled={false}
          customClass="mx-3"
          clicked={() => location.reload()}
        />
      </PageTitlebar>
      <Tab titles={statusArray} labelKey="name" activeTab={activeTab} changeTab={onTabChange} country={true} />
      <div>
        <button onclick={() => console.log(orderFilter(), where())}>check filter</button>
      </div>
      <div>
        <For each={orderFilter()}>{item => <>{item.selectedValue}</>}</For>
      </div>
      <SearchBar placeholder="Search by Order Number, Mobile Number, Email,Coupon Code" onInput={handleSearch}>
        <CommonButton
          labelText="Filter"
          btnIcon="material-symbols:filter-list"
          bgWhite={true}
          hoverLightPink={true}
          clicked={() => setShowFilter(!showFilter())}
        />
        <CommonButton
          labelText="Download"
          btnIcon="ic:outline-file-download"
          customClass={"text-[#727477]"}
          bgWhite={true}
          hoverLightPink={true}
          clicked={() => console.log("downlaod")}
        />
      </SearchBar>
      {orderData()?.length > 0 ? (
        <>
          <OrderTable orderData={orderData()} />
          <Pagination
            onPageChange={handlePageChange}
            totalItems={orderCount()}
            currentPageNo={currentPageNo()}
            noOfPageSlots={5}
          />
        </>
      ) : (
        <NoRecord />
      )}
      {showFilter() && (
        <Filter
          checkIsSidebar={showFilter()}
          closeSidebar={() => setShowFilter(!showFilter())}
          filterData={orderFilter()}
          setFilterData={setOrderFilter}
          where={where()}
          setWhere={setWhere}
        />
      )}
    </div>
  );
}
