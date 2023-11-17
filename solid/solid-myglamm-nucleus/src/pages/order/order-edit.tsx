import { PageTitlebar } from "@components/PageTitlebar";
import { useParams } from "@solidjs/router";
import { CommonButton } from "@components/CommonButton";
import { ItemDetails, PayDetails } from "@/components/OrderComponent";
import { CommonIcon } from "@components/CommonIcon";
import { OrderBreadcrumb } from "@/constants/BreadcrumbConstant";
import OrderAPI from "@/services/order.service";
import { createSignal, onMount, For, createEffect } from "solid-js";
import { showError } from "@/utils/showToaster";
import { NoRecord } from "@/components/common/NoRecordComp";

export default function OrderEdit() {
  const [orderNumber, setOrderNumber] = createSignal<any>("");
  const [orderData, setOrderData] = createSignal<any>("");
  const [skuData, setSkuData] = createSignal<any>("");
  const params = useParams();
  const orderID = `${params.id}`;
  const orderAPI = new OrderAPI();

  const loadOrderDetails = async () => {
    try {
      const data = await orderAPI.fetchOrderDetails(orderID);
      let orderData = data?.data?.data;
      setOrderData(orderData);
      setOrderNumber(orderData?.orderNumber);
    } catch (err: any) {
      showError((err && err?.message) || (err && err.error && err.error.message));
    }
  };

  const loadOrderSKU = async () => {
    try {
      const data = await orderAPI.fetchOrderSKU(orderNumber()); // sometimes it takes sliced orderNUmber as  orderNumber()?.slice(0, -3). Don't know why!
      let orderSKU = data?.data?.data;
      setSkuData(orderSKU);
    } catch (err: any) {
      console.error((err && err?.message) || (err && err.error && err.error.message));
    }
  };

  onMount(() => {
    loadOrderDetails();
  });
  createEffect(() => {
    loadOrderSKU();
  }, [orderNumber()]);

  return (
    <div>
      <PageTitlebar
        breadcrumb={[
          ...OrderBreadcrumb,
          {
            name: `ORD-${orderNumber()}`
          }
        ]}
        pageTitle={`ORD-${orderNumber()}`}
        btnText="Edit Order for Re-Publish"
      />
      <div class="flex flex-row gap-7">
        <div class="w-3/4">
          <div class="bg-white p-5">
            <div class="flex flex-row justify-between mb-6">
              <div class="flex flex-col">
                <div class="text-lg font-semibold">Order Details</div>
                <div class="text-sm font-semibold leading-6">{orderData()?.createdAt}</div>
              </div>
              <div class="relative inline-flex self-center h-10">
                <select class="text-sm capitalize font-normal border-2 border-slate-400 text-gray-600  pl-3 pr-8 bg-white hover:border-gray-400 focus:outline-none appearance-none">
                  <option class="text-red-500 focus:bg-secondary">cancelled</option>
                  <option class="text-green-500 hover:bg-secondary">confirmed</option>
                  <option selected class="h-10 text-green-500 hover:bg-secondary">
                    ready to ship
                  </option>
                </select>
                <span class="h-full flex align-middle items-center justify-center text-black absolute top-0 right-0 pointer-events-none">
                  <CommonIcon icon="material-symbols:arrow-drop-down" />
                </span>
              </div>
            </div>
            <div class="flex flex-row justify-between mb-6 mr-12">
              <div>
                <div class="text-sm mb-8">
                  <div class="text-[#808593] leading-6">Invoice Number</div>
                  <div class="font-semibold leading-6">{orderData()?.invoiceNumber}</div>
                </div>
                <div class="text-sm">
                  <div class="text-[#808593] leading-6">Courier</div>
                  <div class="font-semibold leading-6">{orderData()?.courier}</div>
                </div>
              </div>
              <div>
                <div class="text-sm mb-8">
                  <div class="text-[#808593] leading-6">Payment Mode</div>
                  <div class="font-semibold leading-6 capitalize">{orderData()?.paymentDetails?.paymentMode?.[0]?.type}</div>
                </div>
                <div class="text-sm">
                  <div class="text-[#808593] leading-6">Delivery id</div>
                  <div class="font-semibold leading-6">{`${orderData()?.deliveryRequestId}`}</div>
                </div>
              </div>
              <div class="text-sm">
                <div class="text-[#808593] leading-6">Warehouse</div>
                <div class="font-semibold leading-6">{`${orderData()?.warehouseIdentifier} ( Need to modify this )`}</div>
              </div>
              <div>
                <div class="text-sm mb-8">
                  <div class="text-[#808593] leading-6">Expected Delivery Date</div>
                  <div class="font-semibold leading-6">{orderData()?.expectedDeliveryDate}</div>
                </div>
                <div class="text-sm">
                  <div class="text-[#808593] leading-6">Way bill no</div>
                  <div class="font-semibold leading-6 text-primary cursor-pointer">{`${orderData()?.waybillNumber}`}</div>
                </div>
              </div>
            </div>
            <table class="min-w-full text-center">
              <thead>
                <tr class="bg-white border-b">
                  <For each={["Item Name", "MRP", "Qty", "Discount", "Unit Price", "CGST", "SGST", "IGST", "Net Price"]}>
                    {(item, i) => (
                      <td class="text-sm text-[#908F97] font-light px-6 py-4 whitespace-nowrap text-start">{item}</td>
                    )}
                  </For>
                </tr>
              </thead>
              <tbody>
                <For each={orderData()?.products}>
                  {(item, i) => (
                    <>
                      <ItemDetails
                        imageUrl={item.imageUrl}
                        itemName={item?.name}
                        mrp={item.price}
                        qty={item.quantity}
                        discount={item.paymentDiscount}
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
                      DispatchBy={orderData()?.courier}
                      DeliveryID={orderData()?.deliveryRequestId}
                      WayBill={orderData()?.waybillNumber}
                      SubTotal={"SubTotal"}
                      PointsRedeemed={orderData()?.paymentDetails?.rewardPoints}
                      DiscountCoupon={orderData()?.paymentDetails?.discountAmount}
                      AddiotionalDiscount={orderData()?.paymentDetails?.additionalDiscount}
                      ShippingCharges={orderData()?.shippingCharges}
                      RefundedAmount={orderData()?.paymentDetails?.refundAmount}
                      BalanceAmount={"BalanceAmount"}
                      PaybleAmount={orderData()?.paymentDetails?.orderAmount}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div>
              <div class="my-4 ">
                <label for="exampleFormControlTextarea1" class="block mb-2 text-sm font-normal text-gray-500 dark:text-white">
                  Note
                </label>
                <textarea
                  class="form-control  min-h-[100px] block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-primary focus:border-1 focus:outline-none"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  placeholder="Add a note to this order..."
                ></textarea>
              </div>
              <div class="flex justify-end">
                <CommonButton
                  labelText="SAVE"
                  bgWhite={false}
                  btnType="button"
                  isDisabled={false}
                  clicked={() => alert("hey")}
                />
              </div>
            </div>
          </div>
          <div class="bg-white p-6 mt-6">
            <div class="mb-6 text-lg font-semibold">Notes</div>
            <NoRecord />
          </div>

          <div class="bg-white p-6 mt-6">
            <div class="mb-6 text-lg font-semibold">Warehouse Stock List</div>
            <div class="min-h-[100px] flex flex-col justify-center align-middle items-center">
              {skuData() ? (
                <For each={Object.keys(skuData())}>
                  {(item: any, i) => (
                    <div class="w-full border rounded mb-6">
                      <div class="w-full border-b py-3 pr-4 pl-4 bg-[#f2f3f8] text-primary">{item}</div>
                      <div class="py-3 px-12 border-b flex  justify-between">
                        <p>Priority</p>
                        <p class="text-primary">{skuData()[item]?.priority}</p>
                      </div>
                      <div class="py-3 px-12 flex  justify-between">
                        <p>{`Test_aman_width (SKU)`}</p>
                        {skuData()[item]?.test_aman_width && (
                          <span class="flex gap-2">
                            <p>Available Stock</p>
                            <p class="text-primary">{skuData()[item]?.test_aman_width}</p>
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </For>
              ) : (
                <p class="text-sm text-primary capitalize">No Records found</p>
              )}
            </div>
          </div>
          <div class="bg-white p-6 mt-6">
            <div class="mb-6 text-lg font-semibold">Track Order</div>
            <NoRecord />
          </div>
          <div class="bg-white p-6 mt-6">
            <div class="mb-6 text-lg font-semibold">Commission Details</div>
            <NoRecord />
          </div>
        </div>
        <div class="bg-white w-1/4">
          <div class="text-sm p-6 border-b border-[#808593]">
            <div class="flex flex-row gap-3 mb-4 align-middle items-center">
              <span class="text-black">
                <CommonIcon icon="mdi:user" width={18} height={18} />
              </span>

              <p class="font-semibold">Customer</p>
            </div>
            <p class="text-primary capitalize">{`${orderData()?.userInfo?.firstName} ${orderData()?.userInfo?.lastName}`}</p>
            <p class="text-[#808593]">{orderData()?.userInfo?.phoneNumber}</p>
          </div>
          <div class="text-sm p-6 border-b border-[#808593]">
            <div class="flex flex-row gap-3 mb-4 align-middle items-center">
              <span class="text-black">
                <CommonIcon icon="ion:home-outline" width={18} height={18} />{" "}
              </span>
              <div class="font-semibold">Shipping Address</div>
            </div>
            <p class="text-[#808593] capitalize">
              {orderData()?.address?.shippingAddress?.consumerName}
              <br></br>
              {orderData()?.address?.shippingAddress?.phoneNumber}
              <br></br>
              {`${orderData()?.address?.shippingAddress?.location} , ${orderData()?.address?.shippingAddress?.cityName} , ${
                orderData()?.address?.shippingAddress?.stateName
              }`}
              <br></br>
              {orderData()?.address?.shippingAddress?.zipcode}
            </p>
          </div>
          <div class="text-sm p-6 border-b border-[#808593]">
            <div class="flex flex-row gap-3 mb-4 items-center">
              <span class="text-black">
                <CommonIcon icon="mingcute:bill-line" width={18} height={18} />
              </span>
              <p class="font-semibold">Billing Address</p>
            </div>
            <p class="text-[#808593] capitalize">
              {orderData()?.address?.billingAddress?.consumerName}
              <br></br>
              {orderData()?.address?.billingAddress?.phoneNumber}
              <br></br>
              {`${orderData()?.address?.billingAddress?.location} , ${orderData()?.address?.billingAddress?.cityName} , ${
                orderData()?.address?.billingAddress?.stateName
              }`}
              <br></br>
              {orderData()?.address?.billingAddress?.zipcode}
            </p>
          </div>
          <div class="text-sm p-6 border-b border-[#808593]">
            <div class="flex flex-row gap-3 mb-4 items-center">
              <span class="text-black">
                <CommonIcon icon="ic:round-payment" width={18} height={18} />
              </span>

              <p class="font-semibold">Payment Details</p>
            </div>
            <div class="flex flex-row gap-3 mb-4">
              <p class="text-[#696F80] font-semibold min-w-[80px]">Type</p>
              <p class="text-[#808593]">{orderData()?.paymentDetails?.paymentMode?.[0]?.type}</p>
            </div>
            <div class="flex flex-row gap-3 mb-4">
              <p class="text-[#696F80] font-semibold min-w-[80px]">Gateway</p>
              <p class="text-[#808593]">{orderData()?.paymentDetails?.paymentMode?.[0]?.gatewayService}</p>
            </div>
            <div class="flex flex-row gap-3 mb-4">
              <p class="text-[#696F80] font-semibold min-w-[80px]">id</p>
              <div class="bg-slate-100 flex flex-row border border-dotted border-slate-300 rounded gap-4">
                <p class="text-[#808593] pl-2 w-20 truncate">{orderData()?.paymentDetails?.paymentMode?.[0]?.transactionId}</p>
                <span
                  onClick={() => alert("id")}
                  class="h-5 w-5 text-white bg-primary flex justify-center items-center align-middle rounded-tr rounded-br cursor-pointer"
                >
                  <CommonIcon icon="ph:copy-simple-thin" height={15} width={15} />
                </span>
              </div>
            </div>
            <div class="flex flex-row gap-3 mb-4">
              <p class="text-[#696F80] font-semibold min-w-[80px]">Amount</p>
              <p class="text-[#808593]">{orderData()?.paymentDetails?.paymentMode?.[0]?.amount}</p>
            </div>
            <div class="flex flex-row gap-3 mb-4">
              <p class="text-[#696F80] font-semibold min-w-[80px]">Status</p>
              <p class="text-[#808593] uppercase">{orderData()?.paymentDetails?.paymentMode?.[0]?.status}</p>
            </div>
            <div class="flex flex-row gap-3 mb-4">
              <p class="text-[#696F80] font-semibold min-w-[80px]">Link</p>
              <p class=" truncate text-[#808593]">{orderData()?.paymentDetails?.paymentMode?.[0]?.paymentLink}</p>
            </div>
          </div>
          <div class="text-sm p-6 border-b border-[#808593]">
            <div class="flex flex-row gap-3 mb-4 items-center">
              <span class="text-black">
                <CommonIcon icon="ic:round-card-giftcard" width={18} height={18} />
              </span>
              <p class="font-semibold">Gift Card Details</p>
            </div>
            <p class="text-[#808593]">-</p>
          </div>
          <div class="text-sm p-6 border-b border-[#808593]">
            <div class="flex flex-row gap-3 mb-4 items-center">
              <span class="text-black">
                <CommonIcon icon="icon-park-outline:transaction-order" width={18} height={18} />
              </span>
              <p class="font-semibold">Order Source</p>
            </div>
            <div class="flex flex-row gap-3 mb-4">
              <p class="text-[#696F80] font-semibold min-w-[80px]">Referral Code</p>
              <p class="text-[#808593] uppercase">{orderData()?.referralCode}</p>
            </div>
            <div class="flex flex-row gap-3 mb-4">
              <p class="text-[#696F80] font-semibold min-w-[80px]"> Campaign </p>
              <p class="text-[#808593] uppercase">-</p>
            </div>
            <div class="flex flex-row gap-3 mb-4">
              <p class="text-[#696F80] font-semibold min-w-[80px]">Content </p>
              <p class="text-[#808593] uppercase">-</p>
            </div>
            <div class="flex flex-row gap-3 mb-4">
              <p class="text-[#696F80] font-semibold min-w-[80px]">Medium</p>
              <p class="text-[#808593] uppercase">-</p>
            </div>
            <div class="flex flex-row gap-3 mb-4">
              <p class="text-[#696F80] font-semibold min-w-[80px]">Source</p>
              <p class="text-[#808593] uppercase">-</p>
            </div>
            <div class="flex flex-row gap-3 mb-4">
              <p class="text-[#696F80] font-semibold min-w-[80px]">Term</p>
              <p class="text-[#808593] uppercase">-</p>
            </div>
            <div class="flex flex-row gap-3 mb-4">
              <p class="text-[#696F80] font-semibold min-w-[80px] min-w-20">Affiliate</p>
              <p class="text-[#808593] uppercase">-</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
