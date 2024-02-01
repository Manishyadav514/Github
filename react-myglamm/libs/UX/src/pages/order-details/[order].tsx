import React, { useState, useEffect, ReactElement } from "react";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import DateInfo from "@libComponents/OrderDetails/DateInfo";
import AddressInfo from "@libComponents/OrderDetails/AddressInfo";
import OrderPaymentDetails from "@libComponents/OrderDetails/OrderPaymentDetails";
import ViewInvoice from "@libComponents/OrderDetails/ViewInvoice";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import Link from "next/link";
import { useRouter } from "next/router";
import WidgetAPI from "@libAPI/apis/WidgetAPI";
import Layout from "@libLayouts/Layout";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import OrderAPI from "@libAPI/apis/OrderAPI";
import { formatPrice } from "@libUtils/format/formatPrice";
import { reOrder } from "@libPages/my-orders";
import useAddProduct from "@libHooks/useAddProduct";
import { showError, showSuccess } from "@libUtils/showToaster";
import Adobe from "@libUtils/analytics/adobe";
import { ADOBE } from "@libConstants/Analytics.constant";
import { setLocalStorageValue } from "@libUtils/localStorage";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { SHOP } from "@libConstants/SHOP.constant";
import { getOrderStatusIds } from "@libConstants/ORDER_STATUS.constant";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { ValtioStore } from "@typesLib/ValtioStore";
import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

export const ChildProductCard = (props: any) => {
  const { productImage, productName, showIcon, orderID } = props;
  const router = useRouter();

  return (
    <div className="flex bg-white" onClick={() => orderID && router.push(`${orderID}`)}>
      <div className="w-20 flex flex-col justify-between bg-[#FFF3F3]">
        <div className="m-3 w-16 h-16 items-center">
          <ImageComponent width={60} height={60} src={productImage} alt={productName} />
        </div>
        {showIcon && (
          <div className="z-30 w-full h-0 -mt-1 flex justify-center item-center">
            <span className="-mt-0.5">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7.59995 3.59999H4.40001V0.399974C4.40001 0.179223 4.22079 0 3.99996 0C3.77921 0 3.59999 0.179223 3.59999 0.399974V3.59999H0.399974C0.179223 3.59999 0 3.77921 0 3.99996C0 4.22079 0.179223 4.40001 0.399974 4.40001H3.59999V7.59995C3.59999 7.82078 3.77921 8 3.99996 8C4.22079 8 4.40001 7.82078 4.40001 7.59995V4.40001H7.59995C7.82078 4.40001 8 4.22079 8 3.99996C8 3.77921 7.82078 3.59999 7.59995 3.59999Z"
                  fill="black"
                />
              </svg>
            </span>
          </div>
        )}
      </div>
      <div className="w-4/5 mr-5">
        <h6 className="text-start text-xs font-normal w-full mt-3 pl-4 line-clamp-2">{productName}</h6>
      </div>
    </div>
  );
};

const ProductDetailCard = (props: any) => {
  const {
    productImage,
    freeProduct,
    productName,
    orderDetailsProductQuantity,
    orderDetailsProductAmount,
    showOrderDetailsProductAmount,
    showOrderDetailsProductQuantity,
    t,
    border = true,
    orderID,
  } = props;
  const router = useRouter();

  return (
    <div
      className={`flex my-1 bg-white items-center pt-3 pb-2 ${border && "border-t border-themeGray"}`}
      onClick={() => orderID && router.push(`${orderID}`)}
    >
      <div className="w-20 mb-2">
        <div className="w-20 h-auto">
          <ImageComponent width={80} src={productImage} alt={productName} />
        </div>
      </div>

      <div className="w-4/5 ml-5">
        <h6 className="text-sm m2-3 mb-4 w-full pr-8 line-clamp-2">{productName}</h6>
        {showOrderDetailsProductQuantity && (
          <p className="mr-4 text-xs mb-3" style={{ color: "#949494" }}>
            {t("qty")} <span className="text-xs text-black">{orderDetailsProductQuantity}</span>
          </p>
        )}
        {freeProduct ? (
          <p className="my-1 flex items-center">
            <span className="text-lg text-red-600 font-semibold">{t("free")}</span>
            <span className="text-lg text-gray-600 line-through font-thin mx-1">
              {formatPrice(orderDetailsProductAmount, true, false)}
            </span>
          </p>
        ) : (
          showOrderDetailsProductAmount && <p className="font-bold">{formatPrice(orderDetailsProductAmount, true, false)}</p>
        )}
      </div>
    </div>
  );
};

function OrderDetails() {
  const { t } = useTranslation();

  const router = useRouter();

  const [orderInfo, setOrderInfo] = useState<any>();
  const [splitOrder, setSplitOrder] = useState<any>();
  const [totalOrderPrice, setTotalOrderPrice] = useState<any>();
  const { profile } = useSelector((store: ValtioStore) => ({
    profile: store.userReducer.userProfile,
  }));
  const [freeProducts, setFreeProducts] = useState<any>([]);
  const [orderDetailWidgets, setOrderDetailWidgets] = useState<any>();
  const failedPendingExpiredStatus = getOrderStatusIds(["Failed", "Pending", "Expired"]);
  const { addProduct, isProductAdded, setIsProductAdded } = useAddProduct();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState<any>();
  const [invoiceError, setInvoiceError] = useState(false);
  const [editOrderData, setEditOrderData] = useState<any>();

  const orderCancellationMessageStatusFor = getOrderStatusIds(["Confirmed", "Processing"]);

  const showNeedHelpFor = getOrderStatusIds([
    "Ready_To_Ship",
    "In_Transit",
    "Out_For_Delivery",
    "Completed",
    "Return_To_Origin",
    "Cancelled",
    "Return_Initiated",
    "Return_Completed",
  ]);

  useEffect(() => {
    if (isProductAdded) {
      if (isProductAdded?.status) {
        showSuccess(isProductAdded.message, 3000);
      } else {
        showError(isProductAdded.message, 3000);
      }
      setIsProductAdded(null);
    }
  }, [isProductAdded]);

  useEffect(() => {
    async function fetchData() {
      const orderId = router.query.order;
      if (profile && typeof orderId === "string") {
        const orderApi = new OrderAPI();
        const res = await orderApi.getOrderDetail(profile.id, orderId);
        setOrderInfo(res.data.data);
        getOrderDetailWidgetHttp();
      }
    }
    fetchData();
  }, [profile, router.asPath]);

  useEffect(() => {
    async function fetchData() {
      const orderId = router.query.order;
      if (profile && typeof orderId === "string") {
        const orderApi = new OrderAPI();
        try {
          const res = await orderApi.splitOrder(profile.id, orderId);
          setSplitOrder(res.data?.data?.data);
        } catch (err) {
          console.error("Split Order:", err);
        }
      }
    }

    if (orderInfo?.orderType === 2) {
      fetchData();
      const orderAmount = (orderInfo?.paymentDetails?.grossAmount || 0) - (orderInfo?.paymentDetails?.additionalDiscount || 0);
      let totalAmount = splitOrder?.reduce((accumulator: any, order: any) => {
        const orderAmount = order?.paymentDetails?.orderAmount || 0;
        return accumulator + orderAmount;
      }, 0);
      setTotalOrderPrice((totalAmount || 0) + orderAmount);
    }
  }, [orderInfo, router.asPath]);

  useEffect(() => {
    if (orderInfo) {
      setFreeProducts(
        [
          ...orderInfo.freeProducts,
          ...orderInfo.products
            .filter((prod: any) => typeof prod.freeProducts === "object")
            .map((prod: any) => prod.freeProducts),
        ].flat(1)
      );
    }
  }, [orderInfo]);

  /**
   * @description - get order widget on my order page
   */
  const getOrderDetailWidgetHttp = async () => {
    const widgetApi = new WidgetAPI();
    const widgetResponse = await widgetApi.getWidgets({
      where: {
        slugOrId: "mobile-site-order-details",
      },
    });
    setOrderDetailWidgets(widgetResponse?.data?.data?.data?.widget);
  };

  const retryPayment = async () => {
    setIsRedirecting(true);
    const orderApi = new OrderAPI();
    try {
      const { data } = await orderApi.generateRetryPaymentLink(orderInfo?.id);
      setIsRedirecting(false);
      // setting order data in local storage required for order summary page
      setLocalStorageValue(LOCALSTORAGE.ORDER_DETAILS, data?.data?.orderData, true);
      data?.data?.orderMarkedConfirmed ? router.push("/order-summary?status=success") : router.push(data?.data?.paymentLink);
    } catch (err) {
      console.log(err);
      setIsRedirecting(false);
    }
  };

  /* Adobe - Retry payment button click */
  const adobeRetryPaymentClickEvent = () => {
    (window as any).digitalData = {
      common: {
        assetType: "my orders",
        ctaName: "retry",
        linkName: "web|hamburger|account|my account|my orders|view details|retry",
        linkPageName: "web|hamburger|account|my account|view details",
        platform: ADOBE.PLATFORM,
      },
      user: window.digitalData.user || {},
    };
    Adobe.Click();
  };

  // Adobe Analytics - to capture pending order from experiment bucket
  useEffect(() => {
    if (orderInfo?.meta?.myOrderPagevariant === "1" && orderInfo?.statusId === 11) {
      const digitalData = {
        common: {
          pageName: "web|hamburger|account|my account|my orders|view details",
          newPageName: "view details",
          subSection: "retry",
          assetType: "view details",
          platform: ADOBE.PLATFORM,
          technology: ADOBE.TECHNOLOGY,
        },
      };
      ADOBE_REDUCER.adobePageLoadData = digitalData;
    }
  }, [orderInfo]);

  async function getInvoice() {
    try {
      const orderApi = new OrderAPI();
      const invoiceRes = await orderApi.getOrderInvoice(orderInfo.id, localStorage.getItem("memberId") || "");
      setInvoiceUrl(invoiceRes.data.data.path);
    } catch (error) {
      setInvoiceError(true);
    }
  }

  useEffect(() => {
    if (orderInfo) {
      getInvoice();
    }
  }, [orderInfo]);

  const fetchEditOrderData = async () => {
    const orderApi = new OrderAPI();
    const orderId = router.query.order || "";
    const { memberId } = checkUserLoginStatus() || {};
    try {
      const response = await orderApi.getOrderDetailForShadeChange(orderId, memberId);
      if (response?.data?.code === 200 && response?.data?.data?.orderData) {
        setEditOrderData(response?.data?.data?.orderData);
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (orderInfo?.meta?.orderEditVariant === "1" && orderInfo?.statusId === 12) fetchEditOrderData();
  }, [orderInfo]);

  return (
    <main>
      {orderInfo ? (
        <div className="bg-white p-4">
          {failedPendingExpiredStatus.includes(orderInfo?.statusId) && (
            <div
              className="p-1.5 flex flex-wrap rounded mb-3"
              style={{ background: orderInfo?.statusId === 11 ? "#FFE8D9" : "#FCE6E4" }}
            >
              <div
                className="w-2 h-2 rounded mr-2 mt-1"
                style={{ background: orderInfo?.statusId === 11 ? "#FF6B00" : "#ED5A5A" }}
              />
              <p style={{ fontSize: "11px", color: orderInfo?.statusId === 11 ? "#FF6B00" : "#ED5A5A", fontWeight: "bold" }}>
                {orderInfo?.paymentLabel}
              </p>
              <p
                className="px-4"
                style={{ fontSize: "11px", color: "#5C5C5C" }}
                dangerouslySetInnerHTML={{ __html: orderInfo?.paymentMessage }}
              />
            </div>
          )}
          <DateInfo orderInfo={orderInfo} />
          <div className="mb-4">
            {orderInfo.products.length > 0 &&
              orderInfo.products
                .filter((prod: any) => typeof prod.productId === "string")
                .map((product: any) => (
                  <>
                    <ProductDetailCard
                      key={product.productId}
                      productName={product.name}
                      productImage={product?.imageUrl || product?.shadeImage}
                      showOrderDetailsProductAmount
                      showOrderDetailsProductQuantity
                      orderDetailsProductQuantity={product.quantity}
                      orderDetailsProductAmount={formatPrice(product.offerPrice)}
                      t={t}
                      orderID={orderInfo?.orderId}
                    />
                    <>
                      {/* child product */}
                      {product.childProducts.length > 0 &&
                        product.childProducts
                          .filter((prod: any) => typeof prod.productId === "string")
                          .map((childProd: any, index: number) => (
                            <>
                              <ChildProductCard
                                productName={childProd.name}
                                productImage={childProd.imageUrl}
                                showIcon={product.childProducts.length != index + 1}
                                orderID={orderInfo?.orderId}
                              />
                            </>
                          ))}
                    </>
                  </>
                ))}
            {orderInfo.preProduct?.length > 0 &&
              orderInfo.preProduct.map((product: any) => (
                <ProductDetailCard
                  key={product.productId}
                  productImage={product.imageUrl}
                  productName={product.name}
                  orderDetailsProductAmount={formatPrice(product.offerPrice)}
                  showOrderDetailsProductAmount
                  showOrderDetailsProductQuantity
                  orderDetailsProductQuantity={product.quantity}
                  t={t}
                />
              ))}

            {orderInfo?.miscellaneousProduct?.length > 0 &&
              orderInfo?.miscellaneousProduct.map((product: any) => (
                <ProductDetailCard
                  freeProduct={product?.offerPrice === product?.price}
                  key={product.productId}
                  productImage={product.imageUrl}
                  productName={product.name}
                  orderDetailsProductAmount={formatPrice(product.offerPrice)}
                  showOrderDetailsProductAmount
                  showOrderDetailsProductQuantity
                  orderDetailsProductQuantity={product.quantity}
                  t={t}
                />
              ))}
            {/* show sample products as fallback */}
            {!(
              orderInfo.products.length > 0 ||
              orderInfo.preProduct?.length > 0 ||
              orderInfo?.miscellaneousProduct?.length > 0 ||
              freeProducts.length > 0
            ) &&
              orderInfo?.sampleProducts?.length > 0 &&
              orderInfo?.sampleProducts.map((product: any) => (
                <ProductDetailCard
                  freeProduct={product?.offerPrice === product?.totalPrice}
                  key={product.productId}
                  productImage={product.imageUrl}
                  productName={product.name || product.tagLabel || product.productTag}
                  orderDetailsProductAmount={formatPrice(product.offerPrice)}
                  showOrderDetailsProductAmount
                  showOrderDetailsProductQuantity
                  orderDetailsProductQuantity={product.quantity}
                  t={t}
                />
              ))}

            {freeProducts.length > 0 &&
              freeProducts.map((product: any) => (
                <ProductDetailCard
                  key={product.productId}
                  productName={`${product.name} [FREE]`}
                  productImage={product.imageUrl}
                  freeProduct
                  showOrderDetailsProductAmount
                  showOrderDetailsProductQuantity
                  orderDetailsProductQuantity={product.quantity}
                  orderDetailsProductAmount={formatPrice(product.offerPrice)}
                  t={t}
                />
              ))}
          </div>
          {orderInfo.address?.shippingAddress && <AddressInfo orderInfo={orderInfo} t={t} />}
          <OrderPaymentDetails orderInfo={orderInfo} t={t} invoiceUrl={invoiceUrl} invoiceError={invoiceError} />

          {splitOrder?.length > 0 && (
            <div className="my-4 pt-4 border-y border-themeGray">
              <h3 className="text-sm font-bold text-gray-800">Other Items in this order</h3>
              {/* split product */}
              {splitOrder?.map((products: any, i: number) => {
                const prod = products?.products?.length ? products.products : products.sampleProducts;
                return (
                  <>
                    <p className="text-xs font-normal mt-3 text-gray-400">{`Order ID: ${products?.orderNumber}`}</p>
                    {prod?.length &&
                      prod.map((product: any, index: number) => (
                        <>
                          <ProductDetailCard
                            key={product.productId}
                            productName={product.name}
                            productImage={product?.imageUrl || product?.shadeImage}
                            showOrderDetailsProductAmount
                            showOrderDetailsProductQuantity
                            orderDetailsProductQuantity={product.quantity}
                            orderDetailsProductAmount={formatPrice(product.offerPrice)}
                            t={t}
                            border={index != 0}
                            orderID={products?.orderId}
                          />
                          <>
                            {/* child product in split order */}
                            {product.childProducts.length > 0 &&
                              product.childProducts
                                .filter((prod: any) => typeof prod.productId === "string")
                                .map((childProd: any, index: number) => (
                                  <>
                                    <ChildProductCard
                                      productName={childProd.name}
                                      productImage={childProd.imageUrl}
                                      showIcon={product.childProducts.length != index + 1}
                                      orderID={products?.orderId}
                                    />
                                  </>
                                ))}
                          </>
                        </>
                      ))}
                    {splitOrder?.length > i + 1 && <div className="w-full border-3 mt-5 mb-2 border-themeGray"></div>}
                  </>
                );
              })}
              {
                <div className="mt-4 py-4 border-t border-themeGray gap-1">
                  <div className="flex justify-between">
                    <h3 className="text-sm font-bold capitalize text-gray-800">Total Order Price</h3>
                    <p className="text-sm font-bold capitalize text-gray-800">{formatPrice(totalOrderPrice, true)}</p>
                  </div>
                </div>
              }
            </div>
          )}

          {SHOP.SITE_CODE === "mgp" && orderCancellationMessageStatusFor?.includes(orderInfo?.statusId) && (
            <div className="p-1.5 flex flex-wrap rounded mb-3 space-x-1 items-center pl-3" style={{ background: "#FBE9DB" }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6 0C4.81331 0 3.65328 0.351894 2.66658 1.01118C1.67989 1.67047 0.910851 2.60754 0.456725 3.7039C0.00259971 4.80025 -0.11622 6.00666 0.115291 7.17054C0.346802 8.33443 0.918247 9.40352 1.75736 10.2426C2.59648 11.0818 3.66557 11.6532 4.82946 11.8847C5.99335 12.1162 7.19975 11.9974 8.2961 11.5433C9.39246 11.0891 10.3295 10.3201 10.9888 9.33342C11.6481 8.34672 12 7.18669 12 6C11.997 4.40964 11.3638 2.88529 10.2393 1.76073C9.11471 0.63617 7.59036 0.0030496 6 0ZM5.88462 2.76923C6.02154 2.76923 6.15539 2.80983 6.26924 2.88591C6.38309 2.96198 6.47183 3.0701 6.52423 3.1966C6.57662 3.32311 6.59033 3.46231 6.56362 3.5966C6.53691 3.7309 6.47097 3.85425 6.37415 3.95107C6.27733 4.04789 6.15397 4.11383 6.01968 4.14054C5.88538 4.16726 5.74618 4.15355 5.61968 4.10115C5.49318 4.04875 5.38506 3.96001 5.30898 3.84616C5.23291 3.73231 5.19231 3.59846 5.19231 3.46154C5.19231 3.27793 5.26525 3.10184 5.39508 2.972C5.52491 2.84217 5.70101 2.76923 5.88462 2.76923ZM6.46154 9.23077H6C5.87759 9.23077 5.7602 9.18214 5.67364 9.09559C5.58709 9.00903 5.53846 8.89164 5.53846 8.76923V6C5.41606 6 5.29866 5.95137 5.21211 5.86482C5.12555 5.77826 5.07692 5.66087 5.07692 5.53846C5.07692 5.41605 5.12555 5.29866 5.21211 5.2121C5.29866 5.12555 5.41606 5.07692 5.53846 5.07692H6C6.12241 5.07692 6.2398 5.12555 6.32636 5.2121C6.41291 5.29866 6.46154 5.41605 6.46154 5.53846V8.30769C6.58395 8.30769 6.70134 8.35632 6.7879 8.44287C6.87445 8.52943 6.92308 8.64682 6.92308 8.76923C6.92308 8.89164 6.87445 9.00903 6.7879 9.09559C6.70134 9.18214 6.58395 9.23077 6.46154 9.23077Z"
                  fill="#ED732E"
                />
              </svg>

              <p style={{ fontSize: "10px", color: "#ED732E", fontWeight: "bold" }}>
                {t("orderDetailsCancelOrderAlertMessage") || "Order can be cancelled only before its 'Ready to ship'"}
              </p>
            </div>
          )}
          {SHOP.SITE_CODE === "mgp" && showNeedHelpFor?.includes(orderInfo?.statusId) && (
            <div className="p-1.5 flex flex-wrap rounded mb-3 space-x-1 items-center pl-3" style={{ background: "#1adb800f" }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6 0C4.81331 0 3.65328 0.351894 2.66658 1.01118C1.67989 1.67047 0.910851 2.60754 0.456725 3.7039C0.00259971 4.80025 -0.11622 6.00666 0.115291 7.17054C0.346802 8.33443 0.918247 9.40352 1.75736 10.2426C2.59648 11.0818 3.66557 11.6532 4.82946 11.8847C5.99335 12.1162 7.19975 11.9974 8.2961 11.5433C9.39246 11.0891 10.3295 10.3201 10.9888 9.33342C11.6481 8.34672 12 7.18669 12 6C11.997 4.40964 11.3638 2.88529 10.2393 1.76073C9.11471 0.63617 7.59036 0.0030496 6 0ZM5.88462 2.76923C6.02154 2.76923 6.15539 2.80983 6.26924 2.88591C6.38309 2.96198 6.47183 3.0701 6.52423 3.1966C6.57662 3.32311 6.59033 3.46231 6.56362 3.5966C6.53691 3.7309 6.47097 3.85425 6.37415 3.95107C6.27733 4.04789 6.15397 4.11383 6.01968 4.14054C5.88538 4.16726 5.74618 4.15355 5.61968 4.10115C5.49318 4.04875 5.38506 3.96001 5.30898 3.84616C5.23291 3.73231 5.19231 3.59846 5.19231 3.46154C5.19231 3.27793 5.26525 3.10184 5.39508 2.972C5.52491 2.84217 5.70101 2.76923 5.88462 2.76923ZM6.46154 9.23077H6C5.87759 9.23077 5.7602 9.18214 5.67364 9.09559C5.58709 9.00903 5.53846 8.89164 5.53846 8.76923V6C5.41606 6 5.29866 5.95137 5.21211 5.86482C5.12555 5.77826 5.07692 5.66087 5.07692 5.53846C5.07692 5.41605 5.12555 5.29866 5.21211 5.2121C5.29866 5.12555 5.41606 5.07692 5.53846 5.07692H6C6.12241 5.07692 6.2398 5.12555 6.32636 5.2121C6.41291 5.29866 6.46154 5.41605 6.46154 5.53846V8.30769C6.58395 8.30769 6.70134 8.35632 6.7879 8.44287C6.87445 8.52943 6.92308 8.64682 6.92308 8.76923C6.92308 8.89164 6.87445 9.00903 6.7879 9.09559C6.70134 9.18214 6.58395 9.23077 6.46154 9.23077Z"
                  fill="#1ADB80"
                />
              </svg>

              <p style={{ fontSize: "10px" }}>
                {t("orderDetailsNeedHelpAlertMessage") ||
                  "Need help? Please contact to our Help & Support for further assistance."}
              </p>
            </div>
          )}

          {failedPendingExpiredStatus.includes(orderInfo?.statusId) ? (
            orderInfo?.statusId === 16 || orderInfo?.statusId === 81 ? (
              <button
                className="text-xs leading-none bg-color1 text-white p-3 rounded w-full font-bold mb-3"
                type="button"
                onClick={(e: any) => {
                  if (e) {
                    e.preventDefault();
                  }
                  reOrder(orderInfo, addProduct);
                }}
              >
                {t("reOrderButton")}
              </button>
            ) : (
              <button
                className="text-xs leading-none bg-color1 text-white p-3 rounded w-full font-bold mb-3"
                type="button"
                onClick={(e: any) => {
                  if (e) {
                    e.preventDefault();
                  }
                  if (orderInfo?.statusId === 11) {
                    adobeRetryPaymentClickEvent();
                    retryPayment();
                  }
                }}
              >
                {t("retryPaymentButton") || "Retry Payment"}
              </button>
            )
          ) : (
            <ViewInvoice
              orderInfo={orderInfo}
              t={t}
              showNeedHelpButton={showNeedHelpFor?.includes(orderInfo?.statusId)}
              invoiceUrl={invoiceUrl}
              invoiceError={invoiceError}
              editOrderData={editOrderData}
            />
          )}
          {orderDetailWidgets &&
            orderDetailWidgets?.map((item: any) => {
              if (item?.customParam === "single-banner" && item.multimediaDetails.length > 0) {
                return (
                  <React.Fragment key={item.id}>
                    <Link href={item.multimediaDetails[0].targetLink} aria-label="refre and earn">
                      <ImageComponent
                        style={{ width: "100%" }}
                        src={item.multimediaDetails[0]?.assetDetails?.url}
                        alt="refer and earn"
                      />
                    </Link>
                  </React.Fragment>
                );
              }
              return null;
            })}
        </div>
      ) : (
        <LoadSpinner className="h-screen w-16 mx-auto" />
      )}
      {isRedirecting && <LoadSpinner className="inset-0 fixed h-screen w-16 mx-auto " />}
    </main>
  );
}

OrderDetails.getLayout = (children: ReactElement) => <Layout footer={false}>{children}</Layout>;

export default OrderDetails;
