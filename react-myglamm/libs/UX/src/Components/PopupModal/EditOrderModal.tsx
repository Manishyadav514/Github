import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import useTranslation from "@libHooks/useTranslation";

import ProductAPI from "@libAPI/apis/ProductAPI";
import OrderAPI from "@libAPI/apis/OrderAPI";

import { formatPrice } from "@libUtils/format/formatPrice";
import { showError, showCustom } from "@libUtils/showToaster";
import Adobe from "@libUtils/analytics/adobe";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import { UserAddress } from "@typesLib/Consumer";

import ProductDetailCardV2 from "@libComponents/MyOrder/ProductDetailCardV2";
import EditOrderComboProducts from "@libComponents/MyOrder/EditOrderComboProducts";

import { ADOBE } from "@libConstants/Analytics.constant";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import PopupModal from "./PopupModal";
import EditOrderChangeShade from "./EditOrderChangeShade";

import CloseIcon from "../../../public/svg/group-2.svg";

const ChooseAddressModalV2 = dynamic(
  () => import(/* webpackChunkName: "ChooseAddressModal" */ "@libComponents/PopupModal/ChooseAddressModalV2"),
  { ssr: false }
);

type IEditOrderModal = {
  show: boolean;
  hide: () => void;
  orderData: any;
  showShippingAddress?: boolean;
};

const EditOrderModal = ({ show, hide, orderData, showShippingAddress }: IEditOrderModal) => {
  const [showMiniPDP, setShowMiniPDP] = useState(false);
  const [productList, setProductList] = useState<any>([]);
  const [availableShades, setAvailableShades] = useState<any>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>();
  const [showConfirmOrderBtn, setShowConfirmOrderBtn] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [updatedShadesPayLoad, setUpdatedShadesPayLoad] = useState<any>([]);
  const [comboProductParentSKUs, setComboProductParentSKUs] = useState<any>([]);
  const [shadeAssetsLoading, setShadeAssetsLoading] = useState<boolean>(false);
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const [activeAddress, setActiveAddress] = useState<any>(null);
  const [updatedAddressPayLoad, setUpdatedAddressPayLoad] = useState<any>(null);

  const router = useRouter();
  const { t } = useTranslation();

  const isPreorder = (product: any): boolean => !!product.productMeta.isPreOrder;

  useEffect(() => {
    if (orderData?.address?.shippingAddress?.addressId) {
      setActiveAddress(orderData?.address?.shippingAddress);
    }
  }, [orderData]);

  useEffect(() => {
    if (showAddressModal) {
      adobeOrderClickEvent("Change Address", "Order");
    }
  }, [showAddressModal]);

  useEffect(() => {
    /* store required product data in state */
    let productArray: any = [];

    /* Normal Products */
    orderData?.products?.length > 0 &&
      orderData?.products
        .filter((prod: any) => typeof prod?.productId === "string")
        .map((product: any) => {
          /* skip in case of combo product */
          !product?.childProducts?.length &&
            productArray.push({
              productId: product?.productId,
              name: product?.name,
              shadeLabel: product?.shadeLabel,
              shadeImage: product?.shadeImage,
              totalPrice: product?.totalPrice,
              price: product?.price,
              imageUrl: product?.imageUrl,
              shadeChangeOption: product?.shadeChangeOption,
              sku: product?.sku,
              freeProducts: product?.freeProducts,
              childProducts: product?.childProducts,
              productTag: product?.productTag,
              productMeta: product?.productMeta,
              ...(product?.shadeChangeOption && product?.shades?.length > 0 && { shades: product?.shades }),
              type: isPreorder(product) ? 3 : 1,
            });
        });

    /* PWP Products */
    orderData?.products?.length > 0 &&
      orderData?.products
        .filter((parentProduct: any) => typeof parentProduct?.productId === "string")
        .map((parentProduct: any) => {
          parentProduct?.freeProducts?.length > 0 &&
            parentProduct?.freeProducts?.forEach((freeProduct: any) => {
              productArray?.push({
                productId: freeProduct?.productId,
                name: freeProduct?.name,
                shadeLabel: freeProduct?.shadeLabel,
                shadeImage: freeProduct?.shadeImage,
                totalPrice: freeProduct?.totalPrice,
                price: freeProduct?.price,
                imageUrl: freeProduct?.imageUrl,
                shadeChangeOption: freeProduct?.shadeChangeOption,
                sku: freeProduct?.sku,
                freeProducts: freeProduct?.freeProducts,
                childProducts: freeProduct?.childProducts,
                productTag: freeProduct?.productTag,
                productMeta: freeProduct?.productMeta,
                ...(freeProduct?.shadeChangeOption && freeProduct?.shades?.length > 0 && { shades: freeProduct?.shades }),
                parentId: parentProduct?.productId,
                type: isPreorder(freeProduct) ? 4 : 2,
              });
            });
        });

    /* GWP Products */
    orderData?.freeProducts?.length > 0 &&
      orderData?.freeProducts
        .filter((freeproduct: any) => typeof freeproduct?.productId === "string")
        .map((freeproduct: any) => {
          productArray?.push({
            productId: freeproduct?.productId,
            name: freeproduct?.name,
            shadeLabel: freeproduct?.shadeLabel,
            shadeImage: freeproduct?.shadeImage,
            totalPrice: freeproduct?.totalPrice,
            price: freeproduct?.price,
            imageUrl: freeproduct?.imageUrl,
            shadeChangeOption: freeproduct?.shadeChangeOption,
            sku: freeproduct?.sku,
            freeProducts: freeproduct?.freeProducts,
            childProducts: freeproduct?.childProducts,
            productTag: freeproduct?.productTag,
            productMeta: freeproduct?.productMeta,
            ...(freeproduct?.shadeChangeOption && freeproduct?.shades?.length > 0 && { shades: freeproduct?.shades }),
            type: 8,
          });
        });

    /* Combo Products */
    let comboProductSKUs: any = [];
    orderData?.products?.length > 0 &&
      orderData?.products
        .filter((parentProduct: any) => typeof parentProduct?.productId === "string")
        .map((parentProduct: any) => {
          parentProduct?.childProducts?.length > 0 &&
            parentProduct?.childProducts?.forEach((childProduct: any) => {
              productArray?.push({
                productId: childProduct?.productId,
                name: childProduct?.name,
                shadeLabel: childProduct?.shadeLabel,
                shadeImage: childProduct?.shadeImage,
                totalPrice: childProduct?.totalPrice,
                price: childProduct?.price,
                imageUrl: childProduct?.imageUrl,
                shadeChangeOption: childProduct?.shadeChangeOption,
                sku: childProduct?.sku,
                productTag: childProduct?.productTag,
                productMeta: childProduct?.productMeta,
                ...(childProduct?.shadeChangeOption && childProduct?.shades?.length > 0 && { shades: childProduct?.shades }),
                quantity: childProduct?.quantity,
                parentProductId: parentProduct?.productId,
                parentProductSku: parentProduct?.sku,
                parentProductName: parentProduct?.name,
                isPartOfComboProduct: true,
                type: isPreorder(childProduct) ? 3 : 1, // confirm this with backend
              });
              /* Push Combo Product SKUs to separate array for custom UI */
              !comboProductSKUs.includes(parentProduct?.sku) && comboProductSKUs?.push(parentProduct?.sku);
            });
        });

    setComboProductParentSKUs(comboProductSKUs);
    setProductList(productArray);
  }, [orderData]);

  useEffect(() => {
    /* Adobe Page Load Event - Order Edit Modal */
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: `web|order edit`,
        newPageName: `order edit`,
        subSection: "order edit",
        assetType: "order edit",
        newAssetType: "order edit",
        platform: ADOBE.PLATFORM,
        pageLocation: "order details",
        technology: ADOBE.TECHNOLOGY,
      },
    };
  }, []);

  // order edit click event
  const adobeOrderClickEvent = (linkName: string, linkPageName: string) => {
    (window as any).digitalData = {
      common: {
        linkName: `web|Order edit screen|${linkName}`,
        linkPageName: `web|${linkPageName} edit screen|${linkName}`,
        ctaName: `${linkName}`,
        newLinkPageName: "order edit screen",
        platform: ADOBE.PLATFORM,
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();
  };

  /* To show product assets in miniPDP make a separate call */
  const loadProductShades = async (product: any) => {
    if (product?.shadeChangeOption && product?.shades?.length > 0) {
      /* include ordered shade in allowed shades */
      let shadeIds: Array<string> = [product?.productId];
      product?.shades?.forEach((shade: any) => {
        shadeIds = [...shadeIds, shade?.productId];
      });

      const include = ["assets", "cms", "id", "sku", "type", "productTag"];
      const shadeWhere = {
        inStock: true,
        id: {
          inq: shadeIds,
        },
      };
      const api = new ProductAPI();
      setShadeAssetsLoading(true);
      const result = await api.getProductShades("IND", shadeWhere, 0, include);
      result?.data?.data?.data.length > 0 && setAvailableShades(result?.data?.data?.data?.reverse());
      setShowMiniPDP(true);
      setShadeAssetsLoading(false);
    }
  };

  /* Store user's updated selection in state */
  const storeNewSelectedShade = (activeShade: any) => {
    setProductList(
      productList.map((product: any) => {
        if (product?.productId === selectedProduct?.productId) {
          return {
            ...product,
            imageUrl: activeShade?.assets[0]?.imageUrl?.["200x200"],
            shadeImage: activeShade?.cms?.[0]?.attributes?.shadeImage,
            shadeLabel: activeShade?.cms?.[0]?.attributes?.shadeLabel,
          };
        } else {
          return product;
        }
      })
    );
    setShowConfirmOrderBtn(true);

    adobeOrderClickEvent("Change Shade", "Order");

    /* custom payload for update shade api call */
    const newlySelectedShadeDetails = {
      type: selectedProduct?.type,
      ...(selectedProduct?.isPartOfComboProduct && { bundleProductId: selectedProduct?.parentProductId }),
      ...(selectedProduct?.isPartOfComboProduct && { bundleProductSku: selectedProduct?.parentProductSku }),
      productid: selectedProduct?.productId,
      sku: selectedProduct?.sku,
      newProductId: activeShade?.id,
      newSku: activeShade?.sku,
      subType: selectedProduct?.isPartOfComboProduct ? 2 : 1,
    };
    /* Find shade if user is changing his selection before confirming */
    const getShadeIndex = (payloadArray: any, selectedProduct: any) => {
      return payloadArray?.findIndex((element: any) => element?.productid === selectedProduct?.productId);
    };
    const shadeIndex = getShadeIndex(updatedShadesPayLoad, selectedProduct);

    /* If user is selecting a shade for the first time */
    if (shadeIndex === -1) {
      if (activeShade?.id !== selectedProduct?.productId) {
        setUpdatedShadesPayLoad((prevShade: any) => [...prevShade, newlySelectedShadeDetails]);
      }
    } else {
      /* If user selects a shade & then again changes the shade */
      const shadeChangeArray = [...updatedShadesPayLoad];
      shadeChangeArray[shadeIndex] = newlySelectedShadeDetails;

      /* Remove if same product is selected */
      const filteredShadeChangeArray = shadeChangeArray?.filter(shade => shade?.productid !== shade?.newProductId);
      setUpdatedShadesPayLoad(filteredShadeChangeArray);
    }
  };

  /* Adobe On Click Event - Post Order - Shade Edit Confirm Order */
  const adobeClickEventShadeEditConfirmOrder = (ctaName: string) => {
    (window as any).digitalData = {
      common: {
        linkName: `web|shade edit screen|Confirm`,
        linkPageName: `web|shade edit screen|Confirm`,
        newLinkPageName: "shade edit screen",
        assetType: "",
        newAssetType: "",
        subSection: "",
        platform: ADOBE.PLATFORM,
        ctaName,
        pageLocation: "Order Details",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();
  };

  const handleConfirmOrder = async () => {
    let payload = {};
    if (updatedAddressPayLoad) {
      const {
        id: addressId,
        zipcode,
        phoneNumber,
        email,
        countryName,
        cityName,
        cityId,
        addressNickName,
        stateName,
        countryId,
        location,
        stateId,
        identifier,
        name: consumerName,
        societyName,
        flatNumber,
        buildingNumber,
        landmark,
      } = updatedAddressPayLoad || {};

      payload = {
        ...payload,
        addressChange: {
          identifier,
          shippingAddress: {
            addressId,
            cityId,
            cityName,
            email,
            phoneNumber,
            consumerName,
            stateName,
            stateId,
            countryName,
            countryId,
            addressNickName,
            landmark,
            societyName,
            flatNumber,
            buildingNumber,
            location,
            zipcode,
            identifier,
          },
        },
      };
    }

    if (updatedShadesPayLoad) {
      payload = {
        ...payload,
        replaceShade: updatedShadesPayLoad,
      };
    }

    if (!(updatedAddressPayLoad || updatedShadesPayLoad)) {
      return;
    }

    setIsSubmitting(true);
    const orderAPI = new OrderAPI();
    const orderId = router.query.order || "";
    const { memberId } = checkUserLoginStatus() || {};
    adobeClickEventShadeEditConfirmOrder("Confirm");
    try {
      const orderUpdated = await orderAPI.updateOrderShadeAndAddress(orderId, memberId, payload);
      if (orderUpdated?.data?.code === 200 && orderUpdated?.data?.data?.id) {
        showCustom(t("orderUpdatedSuccessText") || "Order has been updated successfully!", 3000);
        setTimeout(() => {
          router.push({ pathname: "/my-orders" });
        }, 800);
      }
    } catch (error: any) {
      setIsSubmitting(false);
      console.error(error);
      showError(error.response?.data?.message || "Oops something went wrong!");
    }
    adobeOrderClickEvent("Confirm Order", "shade");
  };

  return (
    <>
      <PopupModal show={show} onRequestClose={hide}>
        <div className="bg-white">
          <div className="flex flex-col h-screen overflow-y-auto">
            <div className="flex items-center border-b border-gray-100 pb-2 mb-4 px-3 py-4">
              <div className="w-4/5">
                <div className="flex items-center">
                  <CloseIcon onClick={hide} />
                  <span className="font-semibold ml-2">{t("editOrder") || "Edit Order"}</span>
                </div>
              </div>

              <div className="flex flex-col w-1/5 items-end">
                <p className="text-xs text-black">{t("bagAmount") || "Bag Amount"}</p>
                <p className="text-sm text-black font-bold">
                  {" "}
                  {formatPrice(orderData?.paymentDetails?.grossAmount - orderData?.paymentDetails?.additionalDiscount, true)}
                </p>
              </div>
            </div>

            {showShippingAddress && activeAddress && (
              <div className="flex flex-col space-y-4 pb-3">
                <span className="text-gray-400 px-4 font-bold">{t("shippingAddress") || "Shipping Address"}</span>
                <div className="flex flex-col mx-3 pt-1 pb-3 pr-3 border border-gray-200 rounded-lg space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
                        <g
                          style={{
                            stroke: "none",
                            strokeWidth: 0,
                            strokeDasharray: "none",
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 10,
                            fill: "none",
                            fillRule: "nonzero",
                            opacity: 1,
                          }}
                          transform="matrix(-.24 0 0 .24 28.688 7.088)"
                        >
                          <circle
                            cx={45}
                            cy={45}
                            r={45}
                            style={{
                              stroke: "none",
                              strokeWidth: 1,
                              strokeDasharray: "none",
                              strokeLinecap: "butt",
                              strokeLinejoin: "miter",
                              strokeMiterlimit: 10,
                              fill: "#ffebeb",
                              fillRule: "nonzero",
                              opacity: 1,
                            }}
                          />
                          <path
                            d="M41.771 19.957c-12.274 0-22.224 9.95-22.224 22.224 0 5.48 1.992 10.488 5.28 14.362L41.771 76.5l16.944-19.956a22.12 22.12 0 0 0 5.28-14.362c.001-12.275-9.95-22.225-22.224-22.225zm0 30.599a9.14 9.14 0 0 1-9.14-9.14c0-5.048 4.092-9.14 9.14-9.14s9.14 4.092 9.14 9.14a9.14 9.14 0 0 1-9.14 9.14z"
                            style={{
                              stroke: "none",
                              strokeWidth: 1,
                              strokeDasharray: "none",
                              strokeLinecap: "butt",
                              strokeLinejoin: "miter",
                              strokeMiterlimit: 10,
                              fill: "#ffebeb",
                              fillRule: "nonzero",
                              opacity: 1,
                            }}
                          />
                          <path
                            d="M45.229 16.5c-12.274 0-22.224 9.95-22.224 22.224 0 5.48 1.992 10.488 5.28 14.362l16.944 19.956 16.944-19.956a22.12 22.12 0 0 0 5.28-14.362c0-12.274-9.95-22.224-22.224-22.224zm0 30.599a9.14 9.14 0 0 1-9.14-9.14c0-5.048 4.092-9.14 9.14-9.14a9.14 9.14 0 1 1 0 18.28z"
                            style={{
                              stroke: "none",
                              strokeWidth: 1,
                              strokeDasharray: "none",
                              strokeLinecap: "butt",
                              strokeLinejoin: "miter",
                              strokeMiterlimit: 10,
                              fill: "#ff9797",
                              fillRule: "nonzero",
                              opacity: 1,
                            }}
                          />
                        </g>
                      </svg>
                      <span className="text-sm">{t("deliveryAt") || "Delivery at"} </span>
                      <span className="text-sm text-color1 pl-1">{orderData?.address?.shippingAddress?.addressNickName}</span>
                    </div>
                    <span
                      className="underline underline-offset-2 text-color1 text-10"
                      onClick={() => {
                        setShowAddressModal(true);
                      }}
                    >
                      {t("changeShade") || "Change Address"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 pl-3">
                    <div className="flex flex-col">
                      <span>
                        {activeAddress?.location},{activeAddress?.landmark}
                      </span>
                      <span>
                        {activeAddress?.cityName},{activeAddress?.stateName}, {activeAddress?.zipcode}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="px-3 grow">
              <p className="text-gray-400 font-bold px-2">{t("yourItems") || "Your Items"}</p>
              <div className="flex flex-col mt-2 p-2 border border-gray-300/75 rounded overflow-auto">
                {productList.map(
                  (product: any, index: number) =>
                    !product?.isPartOfComboProduct && (
                      <ProductDetailCardV2
                        key={product.productId}
                        product={product}
                        setSelectedProduct={setSelectedProduct}
                        loadProductShades={loadProductShades}
                        isLastProductInList={index === productList?.length - 1}
                        isFreeProduct={product?.type === 2 || product?.type === 4 || product?.type === 8}
                        shadeAssetsLoading={selectedProduct?.productId === product?.productId ? shadeAssetsLoading : false}
                      />
                    )
                )}

                {comboProductParentSKUs?.length > 0 &&
                  comboProductParentSKUs?.map((parentSKU: any, index: number) => (
                    <EditOrderComboProducts
                      key={index}
                      products={productList?.filter((product: any) => product?.parentProductSku === parentSKU) || {}}
                      setSelectedProduct={setSelectedProduct}
                      loadProductShades={loadProductShades}
                    />
                  ))}
              </div>
            </div>
            {showConfirmOrderBtn && (updatedShadesPayLoad?.length || updatedAddressPayLoad?.id) && (
              <div className="p-3">
                <button
                  className="text-center text-white font-bold uppercase px-2 py-4 mt-2 rounded bg-color1 w-full"
                  onClick={handleConfirmOrder}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : t("confirmOrder") || "Confirm Order"}
                </button>
              </div>
            )}
          </div>
        </div>
      </PopupModal>
      {showMiniPDP && (
        <EditOrderChangeShade
          shades={availableShades}
          showModal={show}
          setShowModal={() => setShowMiniPDP(false)}
          variant={t("newShade") || "New Shade"}
          shadeObject
          setSelectedShadeObject={storeNewSelectedShade}
        />
      )}

      <ChooseAddressModalV2
        show={showAddressModal}
        hide={() => setShowAddressModal(false)}
        shippingAddress={activeAddress}
        handleChangeAddressCallback={(address: UserAddress) => {
          setActiveAddress(address);
          setUpdatedAddressPayLoad(address);
          setShowConfirmOrderBtn(true);
          setShowAddressModal(false);
        }}
      />
    </>
  );
};

export default EditOrderModal;
