import { formatPrice } from "@/utils/format/formatPrice";
import { useNavigate } from "@solidjs/router";
import clsx from "clsx";

const ItemDetails = (props: ItemDetailsProps) => {
  const navigate = useNavigate();
  return (
    <tr class="h-[140px] border-b border-slate-200 text-sm font-medium text-gray-900">
      <td>
        <div class="flex flex-col ml-4">
          <div class="h-full flex flex-row items-center justify-start gap-4 mb-2">
            <img
              class="h-20 w-20 border-2 border-slate-300"
              alt="image"
              src={props?.imageUrl || "https://nucleus-alpha.myglamm.net/assets/images/default.svg"}
            />
            <p
              class="w-40 text-primary text-start cursor-pointer"
              onclick={() => {
                navigate(`/products/edit/${props.productId}`);
              }}
            >
              {props?.itemName}
            </p>
          </div>
          <div class="flex items-start text-[#908F97] text-xs">{`HSN Code: ${props?.hsnCode}`}</div>
          <div class="flex items-start font-semibold text-sm py-3">
            {props?.childProduct > 0 && `List of products in this Bundled`}
          </div>
        </div>
      </td>
      <td>{formatPrice(props?.mrp, 2, true)}</td>
      <td>{props?.qty || ""}</td>
      <td>{formatPrice(props?.discount, 2, true)} </td>
      <td>{formatPrice(props?.unitPrice, 2, true)} </td>
      <td>{formatPrice(props?.cgst, 2, true)}</td>
      <td>{formatPrice(props?.sgst, 2, true)}</td>
      <td>{formatPrice(props?.igst, 2, true)}</td>
      <td>{formatPrice(props?.netPrice, 2, true)} </td>
    </tr>
  );
};

const PayDetails = (props: PayDetailsProps) => {
  return (
    <div class=" flex flex-row justify-between text-sm font-medium p-8">
      <div class="flex text-start gap-12 text-[#6a6a6d] capitalize">
        <div class="flex flex-col gap-5">
          <p>dispatched By</p>
          <p>Delivery Id</p>
          <p>Waybill No By</p>
        </div>
        <div class="flex flex-col gap-5 text-black">
          <p>{props?.DispatchBy || "-"}</p>
          <p>{props?.DeliveryID || "-"}</p>
          <p class="text-primary cursor-pointer">{props?.WayBill || "-"}</p>
        </div>
      </div>

      <div class="flex flex-col text-[#808593] gap-8 mr-8 font-semibold">
        <div class="flex flex-row justify-between gap-32">
          <p class="">Subtotal</p>
          <p class={`${0 >= props.SubTotal && "text-red-500"}`}>{formatPrice(props.SubTotal, 2, true)}</p>
        </div>
        <div class="flex flex-row justify-between gap-32">
          <p>Glamm Points Redeemed</p>
          <p class={`${0 >= props.PointsRedeemed && "text-red-500"}`}>
            {props?.PointsRedeemed || formatPrice(props?.PointsRedeemed, 2, true)}{" "}
          </p>
        </div>
        <div class="flex flex-row justify-between gap-32">
          <p>Discount Coupon</p>
          <p>{formatPrice(props?.DiscountCoupon, 2, true)}</p>
        </div>
        <div class="flex flex-row justify-between gap-32">
          <p>Additional Discount</p>
          <p>{formatPrice(props?.AddiotionalDiscount, 2, true)}</p>
        </div>
        <div class="flex flex-row justify-between gap-32">
          <p>Shipping Charges</p>
          <p>{formatPrice(props?.ShippingCharges, 2, true)}</p>
        </div>
        <div class="flex flex-row justify-between gap-32">
          <p>Refunded Amount</p>
          <p class={clsx(props?.RefundedAmount < 0 ? "text-red-600" : "text-[#808593]")}>
            {formatPrice(props?.RefundedAmount, 2, true)}
          </p>
        </div>
        <div class="flex flex-row justify-between gap-32">
          <p>Balance Amount</p>
          <p class={clsx(props?.BalanceAmount < 0 ? "text-red-600" : "text-[#808593]")}>
            {formatPrice(props?.BalanceAmount, 2, true)}
          </p>
        </div>
        <div class="flex flex-row justify-between gap-32">
          <p class="text-gray-900">Payable amount</p>
          <p class="text-gray-900">{formatPrice(props?.PaybleAmount, 2, true)}</p>
        </div>
      </div>
    </div>
  );
};

interface ItemDetailsProps {
  productId: string;
  itemName?: any;
  mrp?: any;
  qty?: any;
  discount?: any;
  unitPrice?: any;
  cgst?: any;
  sgst?: any;
  igst?: any;
  netPrice?: any;
  hsnCode?: any;
  imageUrl?: any;
  childProduct: number;
}

interface PayDetailsProps {
  WayBill: any;
  SubTotal: any;
  PointsRedeemed: any;
  DiscountCoupon: any;
  ShippingCharges: any;
  AddiotionalDiscount: any;
  RefundedAmount: any;
  BalanceAmount: any;
  PaybleAmount: any;
  DeliveryID: any;
  DispatchBy: any;
}

export { ItemDetails, PayDetails };
