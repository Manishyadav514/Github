import React, { useEffect, useState } from "react";
import Link from "next/link";
import format from "date-fns/format";

import Adobe from "@libUtils/analytics/adobe";
import { ADOBE } from "@libConstants/Analytics.constant";

import useTranslation from "@libHooks/useTranslation";

import OrderStatus from "./orderStatus";
import { formatPrice } from "@libUtils/format/formatPrice";
import { useRouter } from "next/router";
import { SHOP } from "@libConstants/SHOP.constant";
import OrderAPI from "@libAPI/apis/OrderAPI";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import { setLocalStorageValue } from "@libUtils/localStorage";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

function OrderCard(props: any) {
  const {
    productImage,
    productName,
    hideOrderTracking,
    statusId,
    isPreOrder,
    hideMoreProducts,
    orderStatusDelivered,
    order,
    reOrder,
    onRequestClose,
    setTrackModalData,
    setReturnProductModalData,
    onRequestCloseReturnProductModal,
    callOrderAPI,
    bagAmount,
    index,
    recurringSubscriptionProduct,
    orderIsInternational,
  } = props;

  const deliveredAndCancelledStatus = [15, 13, 19, 17, 18, 82];
  const reOrderButton = [13, 15, 16, 17, 18, 81, 82];
  const returnStatusMsg: any = {
    17: `${order.replace ? "Replace" : "Return"} Initiated on`,
    18: "Return Completed",
    82: "Replaced on",
    19: "Return to Origin",
  };
  const DELIVERY_FREQUENCY: any = { QUARTERLY: "once in 3 months", MONTHLY: "once every month", ONE_TIME: "once" };
  const failedPendingExpiredStatus = [11, 16, 81];
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { t } = useTranslation();
  const [exchangeProductExist, setExchangeProductExist] = useState(false);
  const [isValidForExchange, setIsValidForExchange] = useState(false);
  const [productList, setProductList] = useState<any>([]);
  const router = useRouter();
  const returnProductObj = t("returnProductConfig");
  const checkCount = (() => {
    let count = 0;
    const simpleProduct = order?.products;
    if (simpleProduct?.length > 0) {
      count += simpleProduct.length;
      for (let i = 0; i < simpleProduct.length; i += 1) {
        if (simpleProduct[i]?.freeProducts?.productId) {
          count += 1;
        }
      }
    }
    if (order?.products && order?.products[0]?.freeProducts.length) {
      count += order?.products[0]?.freeProducts.length;
    }
    if (order?.products && order?.miscellaneousProduct?.length) {
      count += order?.miscellaneousProduct?.length;
    }
    return count - 1;
  })();

  const handleTrackModal = (e: any) => {
    if (e) {
      e.preventDefault();
    }
    setTrackModalData({
      id: order.id,
      expectedDeliveryDate: order.expectedDeliveryDate,
      waybillNumber: order.waybillNumber,
      courier: order.courier,
      orderPlaced: order.orderPlaced,
      actualDeliveredDate: order.actualDeliveredDate,
    });

    onRequestClose();
  };

  const handleReturnProductModal = (e: any) => {
    if (e) {
      e.preventDefault();
    }
    setReturnProductModalData({
      id: order.id,
      productList,
    });
    onRequestCloseReturnProductModal();
    exchangeProductAdobeClick();
  };

  const handleNeedHelpButtonClick = (e: any) => {
    if (e) {
      e.preventDefault();
    }
    router.push(`/chat-with-us?flow=MyOrder&orderNumber=${order.orderNumber}`);
  };

  const freeProdImage = order?.freeProducts?.filter((p: any) => p.productId)?.[0];
  const ProductImage = order?.products?.filter((p: any) => p.productId)?.[0];
  const prodImage = ProductImage?.imageUrl || ProductImage?.shadeImage || freeProdImage?.imageUrl || freeProdImage?.shadeImage;

  const orderDetailsAdobeClick = () => {
    (window as any).digitalData = {
      common: {
        assetType: "my order",
        ctaName: "view order details",
        linkName: "web|hamburger|account|my account|my orders|order details",
        linkPageName: "web|hamburger|account|my account|my orders",
        newAssetType: "my account",
        newLinkPageName: "my order",
        pageLocation: "",
        platform: ADOBE.PLATFORM,
        subSection: "order details",
      },
      user: window.digitalData.user || {},
    };
    Adobe.Click();
  };

  const orderTrackAdobeClick = () => {
    (window as any).digitalData = {
      common: {
        assetType: "my order",
        ctaName: "track order",
        linkName: "web|hamburger|account|my account|my orders|track order",
        linkPageName: "web|hamburger|account|my account|my orders",
        newAssetType: "my account",
        newLinkPageName: "my order",
        pageLocation: "home",
        platform: ADOBE.PLATFORM,
        subSection: "track order",
      },
      user: window.digitalData.user || {},
    };
    Adobe.Click();
  };

  const reOrderAdobeClick = () => {
    (window as any).digitalData = {
      common: {
        assetType: "my order",
        ctaName: "reorder",
        linkName: "web|hamburger|account|my account|my orders|reorder",
        linkPageName: "web|hamburger|account|my account|my orders",
        newAssetType: "my account",
        newLinkPageName: "my order",
        pageLocation: "home",
        platform: ADOBE.PLATFORM,
        subSection: "my order",
      },
      user: window.digitalData.user || {},
    };
    Adobe.Click();
  };

  // Adobe Analytics(122) - Add trigger when user clicks Replace  on My Order Page
  const exchangeProductAdobeClick = () => {
    (window as any).digitalData = {
      common: {
        assetType: "my order",
        ctaName: "replace",
        linkName: "web|hamburger|account|my account|my orders",
        linkPageName: "web|hamburger|account|my account|my orders",
        newAssetType: "my account",
        newLinkPageName: "my order",
        pageLocation: "",
        platform: ADOBE.PLATFORM,
        subSection: "my order",
      },
      user: window.digitalData.user || {},
    };
    Adobe.Click();
  };

  const adobeClickEventViewPlan = (ctaName: string) => {
    // On Click - My Orders View Plan for Subscription product
    (window as any).digitalData = {
      common: {
        linkName: `web|My Plan| View plan`,
        linkPageName: `Subscription`,
        newLinkPageName: "My Orders",
        assetType: "My orders my plan",
        newAssetType: "My orders my plan ",
        subSection: "My orders my plan ",
        platform: ADOBE.PLATFORM,
        ctaName,
        pageLocation: "My Plan",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();
  };

  const retryPayment = async () => {
    setIsRedirecting(true);
    const orderApi = new OrderAPI();
    try {
      const { data } = await orderApi.generateRetryPaymentLink(order?.id);
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
        assetType: "my order",
        ctaName: "retry",
        linkName: "web|hamburger|account|my account|my order|retry",
        linkPageName: "web|hamburger|account|my account|myorder",
        platform: ADOBE.PLATFORM,
      },
      user: window.digitalData.user || {},
    };
    Adobe.Click();
  };

  const handleInternationalOrder = (e: any) => {
    if (e) {
      e.preventDefault();
    }

    if (order?.meta?.trackingUrl) {
      window.location.href = order?.meta?.trackingUrl;
    }
  };

  useEffect(() => {
    if (order?.products) {
      let productArr: any[] = [];
      if (order.products.length > 0) {
        // eslint-disable-next-line no-plusplus
        for (let k = 0; k < order.products.length; k++) {
          const element = order.products[k];
          productArr.push(element);
          if (element.freeProducts.length > 0) {
            element.freeProducts.map((freeProd: any) => {
              freeProd.isProductFree = true;
              freeProd.parentId = element.productId;
              return freeProd;
            });
            // adding/merging product free product to the array
            productArr = productArr.concat(element.freeProducts);
          }
        }
      }

      if (order.preProduct?.length > 0) {
        // eslint-disable-next-line no-plusplus
        for (let k = 0; k < order.products.length; k++) {
          const element = order.products[k];
          productArr.push(element);
          if (element.freeProducts.length > 0) {
            element.freeProducts.map((freeProd: any) => {
              freeProd.isPreProductFree = true;
              freeProd.parentId = element.productId;
              return freeProd;
            });
            // adding/merging product free product to the array
            productArr = productArr.concat(element.freeProducts);
          }
        }
      }
      if (order.freeProducts) {
        order.freeProducts.map((freeP: any) => {
          freeP.isFree = true;
          return freeP;
        });
        productArr = productArr.concat(order.freeProducts);
      }
      // Create ProductList for selected return product
      if (!returnProductObj?.returnAllProductFlag) {
        let exchangeProductExistCount = 0;
        const productListArr: Array<any> = [];
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < productArr.length; i++) {
          const element = productArr[i];
          // check productTag name for which we have to allow return product feature
          if (returnProductObj?.returnProductTag.includes(element.productTag)) {
            if (exchangeProductExistCount === 0) {
              setExchangeProductExist(returnProductObj?.returnProductTag.includes(element.productTag));
              exchangeProductExistCount = +1;
            }
            // exclude free product from productList as it is not required for exchange
            if (element.replaceProductType !== 2 && element.replaceProductType !== 4 && element.replaceProductType !== 8) {
              productListArr.push(element);
            }
            // break;
          }
        }
        setProductList(productListArr);
      } else {
        // show return product button for all delivered orders
        const productListArr: Array<any> = [];
        for (let j = 0; j < productArr.length; j++) {
          const element = productArr[j];
          // exclude free product from productList as it is not required for exchange
          if (element.replaceProductType !== 2 && element.replaceProductType !== 4 && element.replaceProductType !== 8) {
            productListArr.push(element);
            setExchangeProductExist(true);
          }
        }
        setProductList(productListArr);
      }
      const orderCreatedDate = new Date(order.createdAt);
      orderCreatedDate.setDate(orderCreatedDate.getDate() + 7);
      if (new Date() <= orderCreatedDate) {
        setIsValidForExchange(true);
      }
    }
  }, [order]);

  // Adobe Analytics - to capture the 1st pending order from the experiment bucket
  useEffect(() => {
    const timer = setTimeout(() => {
      if (index === 0 && order?.meta?.myOrderPagevariant === "1" && order?.statusId === 11) {
        const digitalData = {
          common: {
            pageName: "web|hamburger|account|my account|my orders|retry",
            newPageName: "my orders",
            subSection: "retry",
            assetType: "my orders",
            platform: ADOBE.PLATFORM,
            technology: ADOBE.TECHNOLOGY,
          },
        };
        ADOBE_REDUCER.adobePageLoadData = digitalData;
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <React.Fragment>
      <Link href={`/order-details/${order.id}`} aria-label="order detail">
        <div className="bg-white my-1" style={{ boxShadow: "0 0 3px 0 rgba(0,0,0,.19)" }}>
          <div className="flex justify-between" style={{ padding: "12px 12px 0" }}>
            <div className="text-xs">
              <p className="mb-1">{format(new Date(order.orderPlaced), "do MMM, yyyy")}</p>
              <p
                className="text-xs"
                style={{
                  color: "#939393",
                }}
              >
                {t("orderId")}: {order.orderNumber}
              </p>
            </div>
            <div>
              <p className="text-xs">{t("amountPayable")}</p>
              <p className="text-right font-bold">{formatPrice(order.paymentDetails?.orderAmount, true)}</p>
            </div>
          </div>

          <div className="flex" style={{ marginTop: "0.63rem" }}>
            <div className="text-center" style={{ width: "17.2413vw" }}>
              <img src={productImage || prodImage} alt="product" style={{ width: "44px", display: "inline-block" }} />
            </div>
            <div
              className="flex items-center justify-between"
              style={{
                width: "82.7587vw",
              }}
            >
              {recurringSubscriptionProduct ? (
                <div className="flex flex-col">
                  {recurringSubscriptionProduct?.productMeta?.recurringSubscriptionDetails?.statusId && (
                    <div className="flex space-x-2 items-center mb-2">
                      <div
                        className={`${
                          recurringSubscriptionProduct?.productMeta?.recurringSubscriptionDetails?.statusId === 1
                            ? "bg-[#50AD8C]"
                            : "bg-gray-400"
                        }  rounded-full max-w-fit px-3 py-1 text-xs text-white font-bold`}
                      >
                        {recurringSubscriptionProduct?.productMeta?.recurringSubscriptionDetails?.statusId === 1
                          ? "ACTIVE"
                          : "CANCELLED"}
                      </div>
                    </div>
                  )}
                  <h6 className="text-xs mb-1" style={{ width: "100%", paddingRight: "36px" }}>
                    {productName}
                  </h6>
                  {recurringSubscriptionProduct?.productMeta?.decoyPricingDetails?.quantity &&
                    recurringSubscriptionProduct?.productMeta?.recurringSubscriptionDetails?.frequency && (
                      <>
                        <div className="text-10 text-gray-400 font-medium">
                          PACK OF {recurringSubscriptionProduct?.productMeta?.decoyPricingDetails?.quantity} • Delivered{" "}
                          {
                            DELIVERY_FREQUENCY[
                              recurringSubscriptionProduct?.productMeta?.recurringSubscriptionDetails?.frequency
                            ]
                          }
                        </div>
                        <p
                          className="text-xs text-color1 underline my-1"
                          onClick={e => {
                            e.preventDefault();
                            adobeClickEventViewPlan("View My Plan");
                            router.push("/my-plan");
                          }}
                        >
                          View My Plan
                        </p>
                      </>
                    )}
                </div>
              ) : (
                <h6 className="text-xs mb-3" style={{ width: "100%", paddingRight: "36px" }}>
                  {productName}
                </h6>
              )}

              {hideMoreProducts && checkCount > 0 && (
                <h6 className="text-xs font-semibold text-black">
                  +{checkCount} {t("more")}
                </h6>
              )}
            </div>
          </div>

          {statusId === 15 && order.expectedDeliveryDate && (
            <div className="p-3 flex items-center">
              <div className="w-2 h-2 rounded mr-2" style={{ background: "#5aed82" }} />
              <p style={{ fontSize: "11px", color: "#939393" }}>
                {t("deliveredOn")}{" "}
                <span className="font-bold" style={{ color: "#181717" }}>
                  {format(new Date(order.updatedAt), "E, do MMM, yyyy")}
                </span>
              </p>
            </div>
          )}
          {deliveredAndCancelledStatus.includes(statusId, 1) && (
            <div className="p-3 flex items-center">
              <div className="w-2 h-2 rounded mr-2" style={{ background: "#ed5a5a" }} />
              <p style={{ fontSize: "11px", color: "#939393" }}>
                {statusId === 13 && order?.isCancellationProgress ? (
                  "Cancellation In Progress"
                ) : (
                  <>
                    {returnStatusMsg[statusId] || t("cancelledOn")}{" "}
                    <span className="font-bold" style={{ color: "#181717" }}>
                      {format(new Date(order.updatedAt), "E, do MMM, yyyy")}{" "}
                    </span>
                  </>
                )}
              </p>
            </div>
          )}

          <div className="" style={{ padding: "0 0 10px" }}>
            {isPreOrder ||
              (!deliveredAndCancelledStatus.includes(statusId) && !failedPendingExpiredStatus.includes(statusId) && (
                <div className="w-full" style={{ padding: "10px 0" }}>
                  <OrderStatus
                    order={order}
                    estDeliveryDate={order.expectedDeliveryDate}
                    statusId={statusId}
                    orderDelivered={orderStatusDelivered}
                  />
                </div>
              ))}
            {failedPendingExpiredStatus.includes(statusId) && (
              <div
                className="p-1.5 flex flex-wrap rounded mx-1.5 mb-3 mt-3"
                style={{ background: statusId === 11 ? "#FFE8D9" : "#FCE6E4" }}
              >
                <div className="w-2 h-2 rounded mr-2 mt-1" style={{ background: statusId === 11 ? "#FF6B00" : "#ED5A5A" }} />
                <p style={{ fontSize: "11px", color: statusId === 11 ? "#FF6B00" : "#ED5A5A", fontWeight: "bold" }}>
                  {order?.paymentLabel}
                </p>
                <p
                  className="px-4"
                  style={{ fontSize: "11px", color: "#5C5C5C" }}
                  dangerouslySetInnerHTML={{ __html: order?.paymentMessage }}
                />
              </div>
            )}
            <div className={`p-3 flex items-center justify-end gap-4`}>
              {isPreOrder && <p className="px-4 text-sm mr-4 text-color1">{t("preordered")}</p>}

              {!SHOP.DISABLE_NEED_HELP_VERLOOP && (
                <button
                  className="text-xs leading-none font-bold bg-transparent p-3 rounded border border-color1 text-color1"
                  type="button"
                  onClick={handleNeedHelpButtonClick}
                >
                  {t("needHelpButton") || "Need Help ?"}
                </button>
              )}

              {exchangeProductExist && isValidForExchange && statusId === 15 ? (
                <button
                  className="text-xs leading-none font-bold bg-transparent p-3 rounded border border-color1 text-color1"
                  type="button"
                  onClick={handleReturnProductModal}
                >
                  {t("exchangeProduct")}
                </button>
              ) : (
                <button
                  className="text-xs leading-none font-bold bg-transparent p-3 rounded border border-color1 text-color1"
                  type="button"
                  onClick={orderDetailsAdobeClick}
                >
                  {t("viewDetails")}
                </button>
              )}

              {reOrderButton.includes(statusId) ? (
                <button
                  className="text-xs leading-none bg-color1 text-white p-3 rounded"
                  type="button"
                  onClick={(e: any) => {
                    if (e) {
                      e.preventDefault();
                    }
                    reOrder(order);
                    reOrderAdobeClick();
                  }}
                >
                  {t("reOrderButton")}
                </button>
              ) : (
                <>
                  {!hideOrderTracking && !isPreOrder && !failedPendingExpiredStatus.includes(statusId) && (
                    <button
                      className="text-xs leading-none bg-color1 text-white p-3 rounded"
                      type="button"
                      onClick={e => {
                        if (orderIsInternational) {
                          handleInternationalOrder(e);
                        } else {
                          handleTrackModal(e);
                          orderTrackAdobeClick();
                        }
                      }}
                    >
                      {t("trackOrder")}
                    </button>
                  )}
                </>
              )}
              {statusId === 11 && (
                <button
                  className="text-xs leading-none bg-color1 text-white p-3 rounded"
                  type="button"
                  onClick={(e: any) => {
                    if (e) {
                      e.preventDefault();
                    }
                    if (statusId === 11) {
                      adobeRetryPaymentClickEvent();
                      retryPayment();
                    }
                  }}
                >
                  {t("retryPaymentButton") || "Retry Payment"}
                </button>
              )}
              {isRedirecting && <LoadSpinner className="inset-0 fixed h-screen w-16 mx-auto " />}
            </div>
          </div>
        </div>
      </Link>
    </React.Fragment>
  );
}

export default OrderCard;
