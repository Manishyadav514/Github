import React, { useEffect, useState } from "react";
import { formatPrice } from "@libUtils/format/formatPrice";
import ConsumerAPI from "@libAPI/apis/ConsumerAPI";
import useTranslation from "@libHooks/useTranslation";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { differenceInDays } from "date-fns";
import ArrowPink from "../../../public/svg/right-pink.svg";
import PopupModal from "@libComponents/PopupModal/PopupModal";
import Close from "../../../public/svg/ic-close.svg";
import useAddToBag from "@libHooks/useAddToBag";
import { useRouter } from "next/router";
import { getLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";
import FreeProductModal2 from "@libComponents/PopupModal/FreeProductModal2";
import PaymentSkeleton from "@libComponents/Skeleton/PaymentSkeleton";
import PriceStrip from "@libComponents/PDP/PriceStrip";
import PDPCouponExpireTime from "@libComponents/PDP/PDPCouponExpireTime";
import NewBestPrice from "@libComponents/PDP/NewBestPrice";

interface couponState {
  couponCode: string;
  couponDescription: string;
  couponOfferType: string;
  payableAmount: number;
  discountAmount: number;
  endDate: string;
  offerText: string;
}

const PDPBestPrice = ({
  product,
  childProducts,
  freeProduct,
  relationalData,
  productId,
  isPDP,
}: {
  product: any;
  childProducts: any;
  freeProduct: any;
  relationalData: any;
  productId: string;
  isPDP?: boolean;
}) => {
  const router = useRouter();
  const { t, isConfigLoaded } = useTranslation();
  const { isPreOrder } = product.productMeta;
  const isAddable = (childProducts?.length && childProducts.every((x: any) => x.inStock)) || (!isPreOrder && product.inStock);
  const [couponList, setCouponList] = useState<couponState[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const [showFreeProductModal, setFreeProductModal] = useState(false);
  const [selectFreeProduct, setSelectedFreeProduct] = useState(0);
  const [isCouponApplicable, setIsCouponApplicable] = useState<boolean | undefined>();
  const isDiscountedPercentage = product?.price !== product?.offerPrice;
  const isGlammPointsApplicable = false;
  const addToCartType = isAddable ? 1 : isPreOrder ? 3 : 0;

  const { addProductToCart } = useAddToBag(relationalData, {
    freeProduct: freeProduct?.data?.data,
  });

  // calculating the discount percentage w.r.t the decreased price
  const discountPercentage = (actualPrice: number, offerPrice: number) => {
    try {
      let discountedPrice = actualPrice - offerPrice;
      let discountedPercentage = (discountedPrice / actualPrice) * 100;
      return Math.round(discountedPercentage);
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const onAddToCart = (type: number) => {
    /* Passing Child Products Id inCase of Shade Change in Makeup-Kits */
    let childProductsId: Array<string> | undefined;
    if (childProducts?.length) {
      childProductsId = childProducts.map((x: any) => x.id);
    }

    return addProductToCart(product, type, undefined, childProductsId).then(isProductAdded => {
      /* After Product is Added to Cart */
      if (isProductAdded) {
        if (freeProduct?.data.data.length > 1) {
          return setFreeProductModal(true);
        }
        return noThanks();
      }
    });
  };

  const noThanks = () => {
    setFreeProductModal(false);
    router.push("/shopping-bag");
  };

  /** API CALL FOR PDP DYNAMIC COUPON OFFER */
  useEffect(() => {
    if (t("isDynamicOfferOnPDP")) {
      const consumerAPI = new ConsumerAPI();
      const memberId = getLocalStorageValue(LOCALSTORAGE.MEMBER_ID) || "";
      consumerAPI.dynamicOffer(productId, memberId).then(({ data: res }: any) => {
        setCouponList(res.data.couponList);
        setIsCouponApplicable(res?.data?.couponList.length > 0 ? true : false);
      });
    }
  }, [isConfigLoaded]);

  if (isCouponApplicable !== undefined) {
    return (
      <>
        <section className={`bg-white pt-3 ${isPDP && "px-3"} pb-2`}>
          <div
            className="border border-color1 border-dashed rounded-lg flex justify-around py-3 px-4"
            style={{ backgroundColor: "#FFF5F5" }}
          >
            <NewBestPrice
              endDate={couponList?.[0]?.endDate}
              productPrice={product?.price}
              productOfferPrice={product?.offerPrice}
              coupon={couponList?.[0]}
              isGlammPointsApplicable={isGlammPointsApplicable}
              isCouponApplicable={isCouponApplicable}
              isDiscountedPercentage={isDiscountedPercentage}
              discountPercentage={discountPercentage}
              onAddToCart={onAddToCart}
              isAddable={isAddable}
              isPreOrder={isPreOrder}
              formatPrice={formatPrice}
            />
          </div>

          {isCouponApplicable && couponList.length > 1 && (
            <div className="flex justify-end mt-1.5">
              <button onClick={() => setShow(true)} className="font-bold text-color1 text-xs flex items-center">
                <span> More Offers </span>
                <span className="font-bold h-5 w-5">
                  <ArrowPink role="img" aria-labelledby="more offers" title="more offers" />
                </span>
              </button>
            </div>
          )}
        </section>

        {/* Offers Modal */}
        {show && (
          <PopupModal show={show} onRequestClose={() => setShow(false)}>
            <section
              className="bg-white rounded-t-lg relative overflow-y-auto"
              style={{ maxHeight: "calc(100vh - 15vh)", minHeight: "60vh" }}
            >
              <div className="bg-white flex justify-between mb-2 py-3 p-4 sticky top-0">
                <p className="text-md font-bold leading-none"> More Offers </p>
                <button className="text-xl leading-none px-2" onClick={() => setShow(false)}>
                  <Close role="img" aria-labelledby="close modal" />
                </button>
              </div>
              {couponList.slice(1).map((coupon, i) => {
                const dayRemains = differenceInDays(new Date(coupon?.endDate), new Date());
                return (
                  <>
                    {/* List of all the available coupon for the product */}
                    <div className="px-4 border border-gray-200 py-2 border-b-0 border-l-0 border-r-0">
                      <PriceStrip
                        productPrice={product?.price}
                        productOfferPrice={coupon?.payableAmount}
                        isCouponApplicable={isCouponApplicable}
                        isDiscountedPercentage={isDiscountedPercentage}
                        formatPrice={formatPrice}
                      />
                      <p className="text-xs mt-1">{coupon?.couponDescription}</p>
                      <div className="my-2 flex justify-between items-end">
                        <div>
                          <div className="text-center truncate px-2 text-xs w-24 py-1.5 bg-color2 border border-color1 border-dashed">
                            {coupon?.couponCode}
                          </div>
                          <button
                            // Will auto apply the existing coupon and redirects the user to the cart
                            onClick={() => {
                              if (addToCartType === 1) {
                                setLocalStorageValue(LOCALSTORAGE.COUPON, coupon?.couponCode);
                                onAddToCart(addToCartType);
                              }
                            }}
                            className={` ${
                              addToCartType !== 1 && "hidden"
                            } font-bold text-white text-xs w-24 py-1.5 mt-2 bg-color1`}
                          >
                            APPLY
                          </button>
                        </div>
                        {dayRemains < 16 && <PDPCouponExpireTime dayRemains={dayRemains} />}
                      </div>
                    </div>
                  </>
                );
              })}
            </section>
          </PopupModal>
        )}

        {showFreeProductModal && freeProduct?.data && (
          <FreeProductModal2
            show={!!freeProduct}
            showFreeProductModal={showFreeProductModal}
            setFreeProductModal={setFreeProductModal}
            selectFreeProduct={selectFreeProduct}
            setSelectedFreeProduct={setSelectedFreeProduct}
            isPreOrder={isPreOrder}
            freeProduct={freeProduct}
            product={product}
            noThanks={noThanks}
            addProductToCart={addProductToCart}
          />
        )}
      </>
    );
  } else {
    return (
      <div className="h-20">
        <PaymentSkeleton />;
      </div>
    );
  }
};

export default PDPBestPrice;
