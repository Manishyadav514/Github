import { OrderBreadcrumb } from "@/constants/BreadcrumbConstant";
import { PageTitlebar } from "@components/PageTitlebar";
import { useParams } from "@solidjs/router";
import OrderAPI from "@/services/order.service";
import { createSignal, onMount } from "solid-js";
import { showError } from "@/utils/showToaster";

export default function OrderInvoice() {
  const [orderNumber, setOrderNumber] = createSignal<any>("");
  const [invoiceSRC, setInvoiceSRC] = createSignal("");
  const params = useParams();
  const orderID = `${params.id}`;
  const orderAPI = new OrderAPI();

  const loadOrder = async () => {
    try {
      const data = await orderAPI.fetchOrderDetails(orderID);
      setOrderNumber(data?.data?.data?.orderNumber);
    } catch (err: any) {
      showError((err && err?.message) || (err && err.error && err.error.message));
    }
  };
  const loadInvoice = async () => {
    try {
      const data = await orderAPI.fetchOrderInvoice(orderID);
      let paginationData = data?.data?.data;
      setInvoiceSRC(paginationData?.path);
    } catch (err: any) {
      showError((err && err?.message) || (err && err.error && err.error.message));
    }
  };

  onMount(() => {
    loadInvoice();
    loadOrder();
  });
  const handleDownload = () => {
    window.open(invoiceSRC());
  };

  return (
    <div>
      <PageTitlebar
        addBtnTrigger={handleDownload}
        breadcrumb={[
          ...OrderBreadcrumb,
          {
            name: `ORD-${orderNumber()}`
          }
        ]}
        pageTitle={`ORD-${orderNumber()}`}
        btnText="Download PDF"
      />
      <div class="p-12 h-screen w-full scrollbar bg-white">
        <iframe
          src={invoiceSRC() && `${invoiceSRC()}#toolbar=0`}
          width="100%"
          height="100%"
          frame-border="0"
          webkit-allowfullscreen
          moz-allowfullscreen
          allowfullscreen
          allow-transparency="true"
          class=""
        ></iframe>
      </div>
    </div>
  );
}
