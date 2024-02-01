import React from "react";
import { format } from "date-fns";

import useTranslation from "@libHooks/useTranslation";

import { cartProduct } from "@typesLib/Cart";
import { UserAddress } from "@typesLib/Consumer";

import ImageComponent from "@libComponents/Common/LazyLoadImage";

import { formatPrice } from "@libUtils/format/formatPrice";

import { getFormattedAddress } from "@checkoutLib/Payment/HelperFunc";

import OrderManage from "./OrderManage";
import { OrderStatuses } from "../../Constants/User.constant";

const OrderCardWeb = ({ order, orderRef }: { order: any; orderRef: any }) => {
  const { t } = useTranslation();

  const address = order.address.shippingAddress as UserAddress;
  const paymentInfo = order.paymentDetails;

  return (
    <div ref={orderRef} className="rounded-md mb-4" style={{ boxShadow: "0 0 4px 0 rgba(0,0,0,.25)" }}>
      <div className="p-5">
        <ul className="flex list-none pb-5 border-b border-gray-300 mb-4">
          {order.invoiceNumber && (
            <li className="mr-8 uppercase">
              <p className="text-xs font-bold mb-0.5 text-gray-500">{t("invoiceNo")}</p>
              <p className="text-sm uppercase">{order.invoiceNumber}</p>
            </li>
          )}

          <li className="mr-8 uppercase">
            <p className="text-xs font-bold mb-0.5 text-gray-500">{t("orderDate")}</p>
            <p className="text-sm uppercase">{format(new Date(order.orderPlaced?.split("T")[0]), "MMM dd, yyyy")}</p>
          </li>

          {order.expectedDeliveryDate && (
            <li className="mr-8 uppercase">
              <p className="text-xs font-bold mb-0.5 text-gray-500">{t("expectedDeliveryDate")}</p>
              <p className="text-sm uppercase">{format(new Date(order.expectedDeliveryDate), "MMM dd, yyyy")}</p>
            </li>
          )}

          <li className="mr-8 uppercase">
            <p className="text-xs font-bold mb-0.5 text-gray-500">{t("modeOfPayment")}</p>
            <p className="text-sm uppercase">{order.paymentDetails?.paymentMode[0]?.type}</p>
          </li>

          <li className="ml-auto mr-16 text-xs text-white font-bold p-1 px-2 rounded h-min bg-blue-400">
            {OrderStatuses[order.statusId]?.label}
          </li>
        </ul>

        {[...order.products, ...order.preProduct, ...order.freeProducts].map((product: cartProduct) => (
          <div key={product.productId} className="flex justify-between items-center px-4 pr-8 mb-2">
            <ImageComponent src={product.imageUrl} alt={product.name} height={85} width={85} />

            <p className="p-2.5 w-1/3">{product.name}</p>

            <div className="text-right w-1/6">
              <p className="text-gray-400 uppercase text-xs font-bold">{t("unitPrice")}</p>
              <p className="text-xs">{formatPrice(product.unitPrice, true)}</p>
            </div>

            <div className="text-right w-1/6">
              <p className="text-gray-400 uppercase text-xs font-bold">{t("quantity")}</p>
              <p className="text-xs">{product.quantity}</p>
            </div>

            <div className="text-right w-1/6">
              <p className="text-gray-400 uppercase text-xs font-bold">{t("amount")}</p>
              <p className="text-xs">{formatPrice(product.totalPrice)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-themeGray p-5 flex justify-between">
        <div className="w-1/2">
          <p className="uppercase text-gray-500 text-xs">{t("shippingTo") || "Shipping To"}</p>

          {/* @ts-ignore */}
          <h5 className="text-sm my-2">{address.consumerName}</h5>

          <address className="text-xs mb-0.5" dangerouslySetInnerHTML={{ __html: getFormattedAddress(address) }} />
          <p className="text-xs mb-0.5">{address.phoneNumber}</p>
          <p className="text-xs mb-0.5">{address.email}</p>
        </div>

        <div className="w-1/2 text-right">
          <p className="text-gray-500 text-xs">{t("actualAmount")}</p>
          <p className="text-22 font-bold">{formatPrice(paymentInfo.grossAmount, true)}</p>
          <p className="text-gray-500 text-xs mb-2">({t("noteInclusiveTaxes") || "Note: Inclusive of all taxes"})</p>

          {paymentInfo?.discountAmount > 0 && (
            <div className="flex text-sm mb-0.5 text-gray-500 text-right justify-end gap-10">
              <span>{t("discount")}</span>
              <span>- {formatPrice(paymentInfo?.discountAmount, true)}</span>
            </div>
          )}

          <div className="flex text-sm mb-0.5 text-gray-500 text-right justify-end gap-10">
            <span>{t("subtotal")}</span>
            <span>{formatPrice(paymentInfo.netAmount, true)}</span>
          </div>

          {paymentInfo?.rewardPoints > 0 && (
            <div className="flex text-sm mb-0.5 text-gray-500 text-right justify-end gap-10">
              <span>{t("myglammPointsReedemed")}</span>
              <span>- {formatPrice(paymentInfo?.rewardPoints, true, false)}</span>
            </div>
          )}

          <div className="flex text-sm mb-0.5 font-bold text-right justify-end gap-10">
            <span>{t("amountPayable")}</span>
            <span>{formatPrice(paymentInfo.orderAmount, true)}</span>
          </div>
        </div>
      </div>

      <OrderManage order={order} />
    </div>
  );
};

export default OrderCardWeb;
