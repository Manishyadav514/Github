import React, { useState, useEffect, ReactElement } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "react-error-boundary";

import Link from "next/link";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import OrderCard from "@libComponents/MyOrder/OrderCard";

import useTranslation from "@libHooks/useTranslation";
import useAddProduct from "@libHooks/useAddProduct";
import { useSplit } from "@libHooks/useSplit";

import { useSelector } from "@libHooks/useValtioSelector";

import Layout from "@libLayouts/Layout";

import WidgetAPI from "@libAPI/apis/WidgetAPI";
import OrderAPI from "@libAPI/apis/OrderAPI";
import ProductAPI from "@libAPI/apis/ProductAPI";

import OrdersHead from "@libComponents/MyOrder/OrdersHead";
import ErrorFallback from "@libComponents/ErrorBoundary/ErrorFallBack";
import OrdersDisclaimer from "@libComponents/MyOrder/OrdersDisclaimer";
import Widgets from "@libComponents/HomeWidgets/Widgets";

import { showError, showSuccess } from "@libUtils/showToaster";
import { formatPrice } from "@libUtils/format/formatPrice";

import { addWidgetDataInBetween } from "@libServices/PLP/filterHelperFunc";

import { Widget } from "@typesLib/GoodPoints";
import { ValtioStore } from "@typesLib/ValtioStore";
import { LazyLoadComponent } from "react-lazy-load-image-component";
import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import { useRouter } from "next/router";
import { GLAMMCLUB_CONFIG } from "@libUtils/glammClubUtils";
import GlammClubMyOrdersHeader from "@libComponents/MyOrder/GlammClubMyOrdersHeader";

const DynamicTrackModal = dynamic(
  () => import(/* webpackChunkName: "OrderTrackingModal" */ "@libComponents/MyOrder/TrackOrderModal"),
  { ssr: false }
);

const DynamicTrackModalPopup = dynamic(
  () => import(/* webpackChunkName: "OrderTrackingModal" */ "@libComponents/MyOrder/TrackOrderModalPopup"),
  { ssr: false }
);

const DynamicReturnProductModal = dynamic(
  () => import(/* webpackChunkName: "OrderTrackingModal" */ "@libComponents/MyOrder/ReturnProductModal"),
  { ssr: false }
);

const DynamicProductShadeModal = dynamic(
  () => import(/* webpackChunkName: "OrderTrackingModal" */ "@libComponents/MyOrder/ProductShadeModal"),
  { ssr: false }
);

export const reOrder = (orderDetail: any, addProduct: any) => {
  const productsIdArray: any = [];
  let productObj: any = {};

  if (orderDetail.products?.length > 0) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < orderDetail.products?.length; i++) {
      const product = orderDetail.products[i];
      productObj = {
        productId: product.productId,
        quantity: product.quantity,
        type: 1,
        subProductType: product.type || 1,
      };
      productsIdArray.push(productObj);
    }
  }
  if (orderDetail.preProduct.length > 0) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < orderDetail.preProduct.length; i++) {
      const preProduct = orderDetail.preProduct[i];
      productObj = {
        productId: preProduct.productId,
        quantity: preProduct.quantity,
        // type: preProduct.type || 1,
        type: 3,
        subProductType: 1,
      };
      productsIdArray.push(productObj);
    }
  }
  /**
   * @description it is hook which used add product in cart
   */
  addProduct(productsIdArray);
};

function MyOrders({ widgetData }: { widgetData: Widget[] }) {
  const [allOrderData, setAllOrderData] = useState<any>();
  const [hasMore, setHasMore] = useState(true);
  const [myOrderWidgets, setMyOrderWidgets] = useState<any>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trackModalData, setTrackModalData] = useState<any>();
  const [showReturnProductModal, setShowReturnProductModal] = useState<boolean>(false);
  const [returnProductModalData, setReturnProductModalData] = useState<any>();
  const [showProductShadeModal, setShowProductShadeModal] = useState(false);
  const [productShadeModalData, setProductShadeModalData] = useState<any>();

  const { profile } = useSelector((store: ValtioStore) => ({
    profile: store.userReducer.userProfile,
  }));

  const { addProduct, isProductAdded, setIsProductAdded } = useAddProduct();
  const { t } = useTranslation();
  const router = useRouter();

  const myOrdersConfig = t("myOrdersConfig");
  const glammClubConfig = GLAMMCLUB_CONFIG() || {};
  const { widgetsOnMyOrders } =
    useSplit({
      experimentsList: [{ id: "widgetsOnMyOrders" }],
      deps: [],
    }) || {};

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
    if (profile) {
      getData();
      getMyOrderWidgetHttp();
    }
  }, [profile]);

  useEffect(() => {
    if (!checkUserLoginStatus()) {
      router.replace("/login");
    }
  }, []);

  async function getData() {
    if (profile) {
      const orderApi = new OrderAPI();
      const { data } = await orderApi.getMyOrders(profile.id);
      // merge widget data with product if experiment is on
      if (widgetsOnMyOrders === "1") {
        const productWithWidget = addWidgetDataInBetween(data.data, widgetData, 1);
        productWithWidget.length >= 1 && setAllOrderData(productWithWidget);
      } else {
        setAllOrderData(data.data);
      }
    }
  }
  /**
   * Fetch Data for all Orders
   */

  const fetchMoreOrdersData = async () => {
    if (profile && allOrderData) {
      const orderApi = new OrderAPI();
      const { data } = await orderApi.getMyOrders(profile.id, allOrderData.length);

      if (data.data.length === 0) {
        setHasMore(false);
      }
      setAllOrderData([...allOrderData, ...data.data]);
    }
  };

  const onRequestClose = () => {
    setIsModalOpen(prevState => !prevState);
  };
  const onRequestCloseReturnProductModal = () => {
    setShowReturnProductModal(prevState => !prevState);
  };

  const onRequestCloseProductshadeModal = () => {
    setShowProductShadeModal(prevState => !prevState);
  };

  const handleReturnProduct = async (
    product: {
      productId?: any;
      productTag: any;
      quantity: number;
      type: number;
      childProducts: [];
      productMeta: any;
      isFree?: boolean;
      isProductFree?: boolean;
      isPreProductFree?: boolean;
      parentId?: string;
      replaceProductType?: any;
    },
    orderId: string
  ) => {
    setShowReturnProductModal(prevState => !prevState);
    const api = new ProductAPI();
    const include = [
      "id",
      "price",
      "sku",
      "brand",
      "products",
      "productMeta",
      "offerPrice",
      "productTag",
      "type",
      "cms",
      "inStock",
    ];
    const shadeWhere = {
      productTag: encodeURIComponent(product.productTag),
      "productMeta.displaySiteWide": true,
    };
    try {
      const result = await api.getProductShades("IND", shadeWhere, 0, include);
      let shades = result.data.data.data;

      if (shades.length > 0) {
        /* Setting the ordered Product Shade to first for Shade Modal */
        const currentProdShade = shades.find((x: any) => x.id === product.productId);
        shades = [currentProdShade, ...shades.filter((x: any) => x.id !== product.productId)];

        setProductShadeModalData({
          orderId,
          product,
          shades,
        });
        setShowProductShadeModal(prevState => !prevState);
      } else {
        const reqProduct: any = {
          productId: product.productId,
          quantity: product.quantity,
          type: product.type,
          subProductType: 1,
          replaceProductSKU: "",
        };
        if (product.isFree) {
          reqProduct.type = product.replaceProductType || 8;
        } else if (product.isProductFree) {
          reqProduct.type = product.replaceProductType || 2;
          reqProduct.parentId = product.parentId;
        } else if (product.isPreProductFree) {
          reqProduct.type = product.replaceProductType || 4;
          reqProduct.parentId = product.parentId;
        } else if (product?.productMeta?.isPreorder) {
          reqProduct.type = product.replaceProductType || 3;
          if (product.childProducts.length > 0) {
            reqProduct.subProductType = 2;
          }
        } else {
          reqProduct.type = product.replaceProductType || 1;
          if (product.childProducts.length > 0) {
            reqProduct.subProductType = 2;
          }
        }
        console.log(reqProduct);
        const productArr = [];
        productArr.push(reqProduct);
        replaceOrderHttp({
          orderId,
          products: productArr,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleShadeProduct = (currentProductId: string, product: any, orderId: string, replaceProductSKU: string) => {
    const reqProduct: any = {
      productId: currentProductId || product.id,
      quantity: product.quantity,
      type: product.type,
      subProductType: 1,
      replaceProductSKU: replaceProductSKU || "",
    };
    if (product.isFree) {
      reqProduct.type = product.replaceProductType || 8;
    } else if (product.isProductFree) {
      reqProduct.type = product.replaceProductType || 2;
      reqProduct.parentId = product.parentId;
    } else if (product.isPreProductFree) {
      reqProduct.type = product.replaceProductType || 4;
      reqProduct.parentId = product.parentId;
    } else if (product?.productMeta?.isPreorder) {
      reqProduct.type = product.replaceProductType || 3;
      if (product.childProducts?.length > 0) {
        reqProduct.subProductType = 2;
      }
    } else {
      reqProduct.type = product.replaceProductType || 1;
      if (product.childProducts?.length > 0) {
        reqProduct.subProductType = 2;
      }
    }
    console.log(reqProduct);
    const productArr = [];
    productArr.push(reqProduct);
    replaceOrderHttp({
      orderId,
      products: productArr,
    });
  };

  /**
   * @description - get order widget on my order page
   */

  const getMyOrderWidgetHttp = async () => {
    const widgetApi = new WidgetAPI();
    const widgetResponse = await widgetApi.getWidgets({
      where: {
        slugOrId: "mobile-site-myorder-widgets",
      },
    });
    setMyOrderWidgets(widgetResponse?.data?.data?.data?.widget);
  };

  const replaceOrderHttp = async (requestPayload: any) => {
    try {
      const orderApi = new OrderAPI();
      const replaceOrderResult = await orderApi.replaceProduct(requestPayload);
      if (!replaceOrderResult.data?.error) {
        showSuccess("Order successfully replaced", 3000);
        getData();
      } else {
        showError(replaceOrderResult.data.message, 3000);
      }
    } catch (error) {
      showError("please try again", 3000);
    }
  };

  return (
    <main className="my-orders">
      <OrdersHead />

      <OrdersDisclaimer />

      <LazyLoadComponent>
        {glammClubConfig?.active && <GlammClubMyOrdersHeader glammClubConfig={glammClubConfig} />}
      </LazyLoadComponent>

      {myOrderWidgets &&
        myOrderWidgets?.map((item: any) => {
          if (item?.customParam === "single-banner" && item.multimediaDetails.length > 0) {
            return (
              <React.Fragment key={item.id}>
                <Link href={item.multimediaDetails[0].targetLink} aria-label="my order">
                  <img
                    src={item.multimediaDetails[0]?.assetDetails?.url}
                    alt={
                      item.multimediaDetails[0]?.imageAltTitle ||
                      item.multimediaDetails[0]?.sliderText ||
                      item.multimediaDetails[0]?.assetDetails?.name
                    }
                    className="w-full"
                    style={{ padding: "6px" }}
                  />
                </Link>
              </React.Fragment>
            );
          }
          return null;
        })}
      {allOrderData ? (
        <InfiniteScroll
          dataLength={allOrderData.length || 0}
          next={fetchMoreOrdersData}
          hasMore={hasMore}
          loader
          endMessage={
            <p style={{ textAlign: "center", margin: "1rem 0" }}>
              <b>{t("yayYouHaveSeenItAll")}</b>
            </p>
          }
        >
          {allOrderData.length > 0 ? (
            allOrderData.map((order: any, index: any) => {
              const subscriptionProductIndex =
                order.products && order.products.findIndex((x: any) => x.productMeta?.isSubscriptionProduct === true);
              if (order?.customParam) {
                if (widgetsOnMyOrders === "1") {
                  return (
                    <div key={order?.customParam} className="w-full overflow-hidden">
                      <Widgets widgets={[order]} />
                    </div>
                  );
                } else {
                  return null;
                }
              }
              return (
                <ErrorBoundary key={order.id} FallbackComponent={ErrorFallback}>
                  <OrderCard
                    order={order}
                    statusId={order.statusId}
                    bagAmount={formatPrice(order.paymentDetails?.orderAmount)}
                    productImage={
                      (order.products &&
                        subscriptionProductIndex !== -1 &&
                        order.products[subscriptionProductIndex]?.imageUrl) ||
                      (order.products && order.products[0]?.imageUrl) ||
                      (order.products && order.products[0]?.freeProducts[0]?.imageUrl) ||
                      (order.preProduct && order.preProduct[0]?.freeProducts[0]?.imageUrl) ||
                      (order.preProduct && order.preProduct[0]?.imageUrl)
                    }
                    productName={
                      (order.products && order.products[0]?.name) ||
                      (order.products && order.products[0]?.freeProducts[0]?.name) ||
                      (order.preProduct && order.preProduct[0]?.freeProducts[0]?.name) ||
                      (order.preProduct && order.preProduct[0]?.name)
                    }
                    isPreOrder={order.statusId === 72}
                    hideMoreProducts
                    hideOrderTracking={[13, 72, 15].includes(order.statusId)}
                    // orderStatusDelivered
                    reOrder={() => reOrder(order, addProduct)}
                    onRequestClose={onRequestClose}
                    setTrackModalData={setTrackModalData}
                    setReturnProductModalData={setReturnProductModalData}
                    onRequestCloseReturnProductModal={onRequestCloseReturnProductModal}
                    callOrderAPI={() => getData()}
                    index={index}
                    recurringSubscriptionProduct={subscriptionProductIndex != -1 && order?.products?.[subscriptionProductIndex]}
                    orderIsInternational={order?.isInternational}
                  />
                </ErrorBoundary>
              );
            })
          ) : (
            <div className="flex flex-col h-screen justify-center items-center text-center">
              <p className="font-bold text-lg">{t("noOrdersPlaced") || "No Orders"}</p>
            </div>
          )}
        </InfiniteScroll>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <LoadSpinner />
        </div>
      )}
      {myOrdersConfig?.newMyOrderTrackingUI ? (
        <DynamicTrackModalPopup
          show={isModalOpen}
          onRequestClose={onRequestClose}
          userId={profile?.id || ""}
          orderId={trackModalData?.id}
          expectedDeliveryDate={trackModalData?.expectedDeliveryDate}
          trackingID={trackModalData?.waybillNumber}
          deliveryPartner={trackModalData?.courier}
          orderPlacedDate={trackModalData?.orderPlaced}
          actualDeliveredDate={trackModalData?.actualDeliveredDate}
        />
      ) : (
        <DynamicTrackModal
          show={isModalOpen}
          onRequestClose={onRequestClose}
          orderId={trackModalData?.id}
          userId={profile?.id || ""}
          expectedDelivery={trackModalData?.expectedDeliveryDate}
          trackingId={trackModalData?.waybillNumber}
        />
      )}
      <DynamicReturnProductModal
        show={showReturnProductModal}
        onRequestClose={onRequestCloseReturnProductModal}
        productList={returnProductModalData?.productList}
        handleReturnProduct={handleReturnProduct}
        orderId={returnProductModalData?.id}
        t={t}
      />
      <DynamicProductShadeModal
        show={showProductShadeModal}
        onRequestClose={onRequestCloseProductshadeModal}
        currentProduct={productShadeModalData?.product}
        shades={productShadeModalData?.shades}
        handleShadeProduct={handleShadeProduct}
        orderId={productShadeModalData?.orderId}
        t={t}
      />
    </main>
  );
}

// ssr for product widget data
MyOrders.getInitialProps = async () => {
  const widgetApi = new WidgetAPI();
  try {
    const { data } = await widgetApi.getWidgets({ where: { slugOrId: "mobile-site-product-widget-on-my-order" } });
    return { widgetData: data?.data?.data?.widget };
  } catch {
    return { widgetData: [] };
  }
};

MyOrders.getLayout = (children: ReactElement) => <Layout footer={false}>{children}</Layout>;

export default MyOrders;
