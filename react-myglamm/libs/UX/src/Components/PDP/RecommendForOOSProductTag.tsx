import clsx from "clsx";
import StarIcon from "../../../public/svg/star-filled.svg";
import ConfigText from "@libComponents/Common/ConfigText";
import { formatPrice } from "@libUtils/format/formatPrice";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import { SOURCE_STATE } from "@libStore/valtio/SOURCE.store";
import useAddtoBag from "@libHooks/useAddToBag";
import { useState } from "react";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import { showAddedToBagOrWishlist } from "@libUtils/showToaster";
import HomeMiniPDPModal from "@libComponents/PopupModal/HomeMiniPDP";
import useTranslation from "@libHooks/useTranslation";
import { useRouter } from "next/router";

const ProductCell = ({
  products,
  dsRef,
  dsKey,
  isMiniPLP = false,
  partnerShipData,
}: {
  products: any[];
  dsRef?: any;
  dsKey: string;
  isMiniPLP?: boolean;
  partnerShipData?: any;
}) => {
  const [loader, setLoader] = useState<boolean>(false);
  const [productIndex, setProductIndex] = useState<number>();
  const [activeProduct, setActiveProduct] = useState();
  const [showMiniPDPModal, setShowMiniPDPModal] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  const { addProductToCart } = useAddtoBag();

  const handleAddToBag = (product: any, productIndex: number) => {
    if (product?.isShades || product?.shades?.length) {
      setActiveProduct({ ...product, URL: product.slug });
      setProductIndex(productIndex);
      SOURCE_STATE.pdpSource = isMiniPLP ? "mini collection" : dsKey;
      SOURCE_STATE.addToBagSource = isMiniPLP ? "mini collection" : dsKey;
      setShowMiniPDPModal(true);
      return;
    }
    setProductIndex(productIndex);
    setLoader(true);
    SOURCE_STATE.pdpSource = isMiniPLP ? "mini collection" : dsKey;
    SOURCE_STATE.addToBagSource = isMiniPLP ? "mini collection" : dsKey;
    const productWithMeta =
      product?.meta || product?.productMeta
        ? { ...product, widgetName: dsKey }
        : { ...product, widgetName: dsKey, meta: { isPreProduct: false } };

    if (isMiniPLP) {
      (window as any).digitalData.common.bannerSource = "mini collection";
    }

    addProductToCart(productWithMeta, 1).then(res => {
      if (res) {
        showAddedToBagOrWishlist("Added To Cart", 2500);
      }
      setLoader(false);
    });
  };

  return (
    <>
      <ul
        className={
          !isMiniPLP
            ? "overflow-x-auto grid grid-rows-2 grid-flow-col list-none px-2.5 py-2 gap-2.5"
            : "flex flex-wrap list-none mt-2 pt-1"
        }
        dir="ltr"
        style={
          !isMiniPLP
            ? {
                scrollSnapType: "x mandatory",
                ...((products.length === 3 || products.length === 4) && { width: "max-content" }),
              }
            : { maxHeight: "65vh", overflowY: "auto" }
        }
        ref={dsRef}
      >
        {products?.map((product, index) => {
          let couponData: any = {};
          if (isMiniPLP) {
            couponData = partnerShipData?.couponList?.find((data: any) => {
              return data.productId === product.id;
            });
          }
          return (
            <li
              key={product.id}
              className={`h-full rounded-sm bg-white relative ${isMiniPLP && "ml-3 mb-3"}`}
              style={{
                width: !isMiniPLP ? "125px" : "45%",
                minWidth: !isMiniPLP ? "125px" : "45%",
                boxShadow: "0px 0px 3px rgba(0, 0, 0, 0.20)",
                borderRadius: "3px",
                boxSizing: "border-box",
              }}
            >
              <div className="flex justify-center">
                <ImageComponent
                  style={{ width: !isMiniPLP ? "125px" : "100%", height: !isMiniPLP ? "125px" : "100%" }}
                  src={product?.imageURL || product?.assets?.[0]?.url}
                  alt={product?.productName}
                  onClick={() => {
                    if (isMiniPLP) {
                      SOURCE_STATE.pdpSource = isMiniPLP ? "mini collection" : "";
                      router.push(product?.urlManager?.url);
                    }
                  }}
                />
              </div>
              <div className="px-2">
                <p className="text-11 line-clamp-2 leading-tight my-1.5 h-7">{product?.productName || product?.productTag}</p>
                <div className="flex justify-between">
                  {!isMiniPLP ? (
                    <div className="flex items-center mb-1">
                      <p className="font-semibold mr-1.5 text-11">{formatPrice(product?.priceOffer * 100, true)}</p>
                      {product?.priceOffer < product?.priceMRP && (
                        <del className="text-11 text-gray-400 mr-2">{formatPrice(product?.priceMRP * 100, true)}</del>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center mb-1">
                      <p className="font-semibold mr-1.5 text-11">
                        {formatPrice(couponData?.payableAmount || product?.offerPrice || product?.priceOffer, true)}
                      </p>
                      {(couponData?.payableAmount || product?.offerPrice || product?.priceOffer) < product?.price && (
                        <del className="text-11 text-gray-400 mr-2">{formatPrice(product?.price, true)}</del>
                      )}
                    </div>
                  )}
                  <div
                    className={clsx(
                      "border border-gray-200 font-semibold text-10  flex justify-evenly items-center rounded-full w-10 px-1.5 pt-0.5 h-4 ",
                      (product?.rating?.avgRating as number) > 0 ? "" : "opacity-0"
                    )}
                  >
                    {product?.rating?.avgRating?.toFixed(1)}
                    <StarIcon width={9} height={9} className="-mt-0.5 ml-1" role="img" aria-labelledby="product rating" />
                  </div>
                </div>
                <button
                  className="text-color1 flex justify-center items-center w-full mb-2"
                  onClick={() => {
                    handleAddToBag(product, index);
                  }}
                >
                  {loader && productIndex === index ? (
                    <LoadSpinner className="w-4" />
                  ) : (
                    <ConfigText configKey={product?.isShades || product?.shades?.length ? "selectShade" : "addToBag"} fallback="Add to Bag" className="font-bold text-11 uppercase" />
                  )}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      {/* MiniPDP modal  starts */}
      {showMiniPDPModal && (
        <HomeMiniPDPModal
          show={showMiniPDPModal}
          onRequestClose={() => setShowMiniPDPModal(false)}
          product={activeProduct}
          productPosition={productIndex}
          t={t}
          themeColor={"#f88d8d"} //f88d8d
          widgetName={dsKey}
        />
      )}
    </>
  );
};

export default ProductCell;
