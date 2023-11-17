import { For, Match, Show, Switch, createSignal } from "solid-js";
import { CommonIcon } from "../CommonIcon";
import { OrderDeviceTypeEnum, OrderStatusEnum } from "@/constants/Order.constant";
import { ItemDetails, PayDetails } from "./OrderComponent";
import { formatDate } from "@/utils/format/formatDate";
import { formatPrice } from "@/utils/format/formatPrice";

const OrderTable = (props: any) => {
  return (
    <div class="flex flex-col pt-8 bg-white">
      <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-4 inline-block min-w-full sm:px-6 lg:px-8">
          <div class="overflow-hidden">
            <table class="w-full">
              <thead class="h-12 border-y border-[#DEE2E6]">
                <tr>
                  <For
                    each={[
                      "Order Number",
                      "Customer Name",
                      "Date",
                      "Status",
                      "Dispatch Date (Estimated / Actual)",
                      "Delivery Date (Estimated / Actual)",
                      "Amount",
                      "Payment",
                      "Action"
                    ]}
                  >
                    {(item, i) => (
                      <th scope="col" class="text-sm font-medium text-start text-[#8190A4] p-3">
                        {item}
                      </th>
                    )}
                  </For>
                </tr>
              </thead>
              <tbody>
                <For each={props?.orderData}>{(item, i) => <OrderRow data={item} />}</For>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderRow = ({ data }: any) => {
  const [viewOrderDetail, setVOD] = createSignal(false);
  return (
    <>
      <TableRowEle
        orderNumber={data?.orderNumber}
        orderID={data?.id}
        customerName={data?.userInfo?.firstName}
        orderDate={data?.orderPlaced}
        orderStatus={data?.statusId}
        dispatchDate={data?.dispatchDate}
        deliveryDate={data?.deliveryDate}
        orderAmount={data?.paymentDetails?.orderAmount}
        paymentMode={data?.paymentDetails?.paymentMode?.[0]?.type}
        invoiceNumber={data?.invoiceNumber}
        device={data?.meta?.deviceType}
        viewOrderDetail={viewOrderDetail}
        setVOD={setVOD}
      />
      <Show when={viewOrderDetail()}>
        <tr>
          <td colspan={9}>
            <table class="min-w-full text-center">
              <thead>
                <tr class="bg-white border-b">
                  <For each={["Item Name", "MRP", "Qty", "Discount", "Unit Price", "CGST", "SGST", "IGST", "Net Price"]}>
                    {(item, i) => <td class="text-sm text-[#908F97] font-light px-6 py-4 whitespace-nowrap">{item}</td>}
                  </For>
                </tr>
              </thead>
              <tbody>
                <For each={data?.products}>
                  {(item, i) => (
                    <>
                      <ItemDetails
                        imageUrl={item.imageUrl}
                        itemName={item?.name}
                        mrp={item?.totalPrice}
                        qty={item.quantity}
                        discount={data?.paymentDetails?.additionalDiscount}
                        unitPrice={item.priceAfterCouponCodeWithoutTaxesPerQuantity}
                        cgst={item.taxList?.filter((d: any) => d.details?.[0].label === "CGST")?.[0]?.tax}
                        sgst={item.taxList?.filter((d: any) => d.details?.[0].label === "SGST")?.[0]?.tax}
                        igst={item.taxList?.filter((d: any) => d.details?.[0].label === "IGST")?.[0]?.tax}
                        netPrice={item.priceAfterCouponCodePerQuantity}
                        hsnCode={item.productMeta?.hsn}
                        childProduct={item.childProducts?.length}
                        productId={item.productId}
                      />
                      {item.childProducts?.length > 0 && (
                        <For each={item.childProducts}>
                          {(childItem, i) => (
                            <ItemDetails
                              imageUrl={childItem?.imageUrl}
                              itemName={childItem?.name}
                              qty={childItem.quantity}
                              hsnCode={childItem?.productMeta?.hsn}
                              childProduct={0}
                              productId={childItem.productId}
                            />
                          )}
                        </For>
                      )}
                    </>
                  )}
                </For>
                <tr class="border-b border-slate-200">
                  <td colspan={9}>
                    <PayDetails
                      DispatchBy={data?.courier}
                      DeliveryID={data?.deliveryRequestId}
                      WayBill={data?.waybillNumber}
                      SubTotal={data?.paymentDetails?.grossAmount}
                      PointsRedeemed={data?.paymentDetails?.rewardPoints}
                      DiscountCoupon={data?.paymentDetails?.discountAmount}
                      AddiotionalDiscount={data?.paymentDetails?.additionalDiscount}
                      ShippingCharges={data?.shippingCharges}
                      RefundedAmount={data?.paymentDetails?.refundAmount}
                      BalanceAmount={"BalanceAmount"}
                      PaybleAmount={data?.paymentDetails?.orderAmount}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </Show>
    </>
  );
};

const TableRowEle = ({
  customerName,
  orderNumber,
  orderID,
  orderDate,
  orderStatus,
  dispatchDate,
  deliveryDate,
  orderAmount,
  paymentMode,
  device,
  viewOrderDetail,
  setVOD,
  invoiceNumber
}: {
  orderNumber: string;
  orderID: string;
  customerName: string;
  orderDate: string;
  orderStatus: any;
  dispatchDate: string;
  deliveryDate: string;
  orderAmount: number;
  paymentMode: string;
  device: string;
  viewOrderDetail: any;
  setVOD: any;
  invoiceNumber: string | number;
}) => {
  return (
    <tr class="h-[80px] bg-white border-b cursor-pointer" onClick={e => setVOD(!viewOrderDetail())}>
      <td class="h-full p-3 text-sm font-medium text-gray-900 ">
        <div class="flex flex-wrap items-center gap-1">
          <div
            style={{
              rotate: `${viewOrderDetail() ? "90deg" : "0deg"}`
            }}
          >
            <span class="text-primary flex justify-center items-center align-middle">
              <CommonIcon icon="material-symbols:play-arrow-rounded" />
            </span>
          </div>
          <Switch fallback={<CommonIcon height={14} width={14} icon="carbon:application-web" />}>
            <Match when={device === "android"}>
              <span class="">
                <CommonIcon height={14} width={14} icon="basil:android-solid" />
              </span>{" "}
            </Match>
            <Match when={device === "apple"}>
              <span class="text-primary">
                <CommonIcon height={14} width={14} icon="mdi:apple" />
              </span>{" "}
            </Match>
            <Match when={device === OrderDeviceTypeEnum.MOBILE}>
              <span class="text-primary">
                <CommonIcon height={14} width={14} icon="ic:outline-tablet-android" />
              </span>{" "}
            </Match>
            <Match when={device === "admin"}>
              <span class="text-primary">
                <CommonIcon height={14} width={14} icon="mingcute:key-1-line" />
              </span>
            </Match>
          </Switch>
          {`ORD-${orderNumber}`}
        </div>
      </td>
      <td class="text-sm text-primary font-light p-3 whitespace-nowrap">{customerName}</td>
      <td class="text-sm text-gray-900 font-light p-3">{formatDate(`${orderDate}`)}</td>
      <td class="text-sm text-gray-900 font-light p-3 whitespace-nowrap">
        <Switch
          fallback={
            <span class="w-20 bg-yellowLight text-yellowDark capitalize font-normal text-[13px] p-2 ">{orderStatus}</span>
          }
        >
          <Match when={[OrderStatusEnum.PENDING].includes(orderStatus)}>
            <span class="w-20 bg-orangeLight text-orangeDark capitalize font-normal text-[13px] p-2 ">Pending</span>
          </Match>
          <Match when={[OrderStatusEnum.SHIPPED].includes(orderStatus)}>
            <span class="w-20 bg-yellowLight text-yellowDark capitalize font-normal text-[13px] p-2 ">Shipped</span>
          </Match>
          <Match when={[OrderStatusEnum.CONFIRMED, OrderStatusEnum.RETURN_TO_ORIGIN].includes(orderStatus)}>
            <span class="w-20 bg-blueLight text-blueDark capitalize font-normal text-[13px] p-2 ">Confirmed</span>
          </Match>
          <Match when={[OrderStatusEnum.READY_TO_SHIP].includes(orderStatus)}>
            <span class="w-20 bg-yellowLight text-yellowDark capitalize font-normal text-[13px] p-2">Ready to Ship</span>
          </Match>
          <Match when={[OrderStatusEnum.CANCELLED].includes(orderStatus)}>
            <span class="w-20 bg-redLight text-redDark capitalize font-normal text-[13px] p-2 ">Cancelled</span>
          </Match>
          <Match when={[OrderStatusEnum.RETURN_INITIATED].includes(orderStatus)}>
            <span class="w-20 bg-redLight text-redDark capitalize font-normal text-[13px] p-2 ">Return Initiated</span>
          </Match>
          <Match when={[OrderStatusEnum.FAILED, OrderStatusEnum.REJECT, OrderStatusEnum.EXPIRED].includes(orderStatus)}>
            <span class="w-20 bg-redLight text-redDark capitalize font-normal text-[13px] p-2 ">Failed</span>
          </Match>
          <Match when={[OrderStatusEnum.DELIVERED].includes(orderStatus)}>
            <span class="w-20 bg-greenLight text-greenDark capitalize font-normal text-[13px] p-2 ">Delivered</span>
          </Match>
          <Match when={[OrderStatusEnum.RETURN_COMPLETED].includes(orderStatus)}>
            <span class="w-20 bg-orangeLight text-orangeDark capitalize font-normal text-[13px] p-2 ">Return Completed</span>
          </Match>
          <Match when={[OrderStatusEnum.PENDING_APPROVAL].includes(orderStatus)}>
            <span class="w-20 bg-orangeLight text-orangeDark capitalize font-normal text-[13px] p-2 ">Peding Approval</span>
          </Match>
        </Switch>
      </td>
      <td class="text-sm text-gray-900 font-light p-3">{formatDate(`${dispatchDate}`)}</td>
      <td class="text-sm text-gray-900 font-light p-3">{formatDate(`${deliveryDate}`)}</td>
      <td class="text-sm text-gray-900 font-light p-3">{formatPrice(orderAmount, 2, true)}</td>
      <td class="text-sm text-gray-900 font-light p-3 whitespace-nowrap">
        <span class="w-20 bg-[var(--primary-light-color)] text-primary capitalize font-normal text-[13px] p-2 ">
          {orderAmount === 0 ? "Discounted" : paymentMode}
        </span>
      </td>
      <td class="p-3 whitespace-nowrap ">
        <div class="flex gap-2 items-center text-primary ">
          <span class={`${invoiceNumber ? "cursor-pointer" : "cursor-not-allowed"}`}>
            <a
              href={`${invoiceNumber ? `/order/invoice/${orderID}` : "#"}`}
              target="_blank"
              class={`${invoiceNumber ? "cursor-pointer" : "pointer-events-none"}`}
            >
              <CommonIcon icon="pixelarticons:reciept" rotate="180deg" />
            </a>
          </span>
          <a href={`${window.location.href}/edit/${orderID}`} target="_blank">
            <CommonIcon icon="ph:pencil-thin" />
          </a>
        </div>
      </td>
    </tr>
  );
};

export { OrderTable };
