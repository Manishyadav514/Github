import React, { useState, useEffect } from "react";
import PopupModal from "@libComponents/PopupModal/PopupModal";
import PDPShadeGrid from "@libComponents/PDP/PDPShadeGrid";
import { GiCloseIco } from "@libComponents/GlammIcons";
import useTranslation from "@libHooks/useTranslation";
import { useRouter } from "next/router";
import { fetchFreeProducts } from "@checkoutLib/Cart/HelperFunc";
import { formatPrice } from "@libUtils/format/formatPrice";
import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";
//@ts-ignore
import { ShadesContainer } from "@libStyles/css/miniPDP.module.css";

const FreeProductModal2 = ({
  showFreeProductModal,
  setFreeProductModal,
  selectFreeProduct,
  setSelectedFreeProduct,
  freeProduct,
  noThanks,
  addProductToCart,
  isPreOrder,
  product,
  freeProductsListIds,
}: any) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [PDPOverrideOffer, setPDPOverrideOffer] = useState<any>(null);
  const [modalContainerStyle, setModalContainerStyle] = useState<any>({});

  const [numberOfFreeProduct, setNumberOfFreeProducts] = useState(0);
  const [freeProductDetails, setFreeProductDetails] = useState(freeProduct?.data?.data[selectFreeProduct]);
  const [listOfFreeProducts, setListOfFreeProducts] = useState<any>([]);
  const [shadesList, setShadesList] = useState(freeProduct.data.data);
  const [freeProductsData, setFreeProductsData] = useState(freeProduct?.data?.data);

  const freeProductImage = freeProductDetails?.assets?.find((a: any) => a.type === "image");

  useEffect(() => {
    setFreeProductDetails(freeProductsData[selectFreeProduct]);
  }, [selectFreeProduct]);

  useEffect(() => {
    const offer = t("pdpOverideOffer");
    if (!PDPOverrideOffer && offer?.smallIconUrl) {
      setPDPOverrideOffer(offer);
      setModalContainerStyle({
        backgroundImage: `url("${offer.offerImageUrl}")`,
        backgroundPosition: "top center",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
      });
    }
  }, [t]);

  const addFreeProducts = (freeProducts: any) => {
    // add all the free products to the cart
    const freeList = [...listOfFreeProducts, freeProducts];
    const filterInStockProducts = freeList.filter((freeProduct: any) => freeProduct?.inStock === true);
    // only filter products which are in stock
    addProductToCart(filterInStockProducts, isPreOrder ? 4 : 2, product.id);
  };

  const handleNext = (nextFreeProductCount: number, freeProductDetails: any) => {
    // fetch next free product! Only one free product will be shown at a time
    fetchFreeProducts({ productSlug: router.query.slug, nextFreeProductCount }).then((freeProductResponse: any) => {
      setFreeProductDetails(freeProductResponse?.data.data.data?.[0]);
      setShadesList(freeProductResponse.data.data.data);
      setFreeProductsData(freeProductResponse?.data.data.data);
    });
    setNumberOfFreeProducts(numberOfFreeProduct + 1);
    setListOfFreeProducts([...listOfFreeProducts, freeProductDetails]);
  };

  return (
    <PopupModal show={showFreeProductModal} onRequestClose={() => setFreeProductModal(false)}>
      <div
        className="bg-white h-full"
        style={{
          borderTopRightRadius: "15px",
          borderTopLeftRadius: "15px",
          ...modalContainerStyle,
        }}
      >
        <div aria-hidden="true" className="flex justify-end" onClick={() => setFreeProductModal(false)}>
          <span className="m-3 mr-1">
            <GiCloseIco height="28" width="28" fill="#9b9b9b" />
          </span>
        </div>
        <div>
          <div className="flex justify-start px-2 -mt-8">
            <h5
              className="text-xl text-transparent font-bold border-solid border-b-8 mb-1"
              style={{
                fontSize: "19px",
                borderColor: "#ffb4b4",
                borderBottomWidth: "6px",
              }}
            >
              {t("heresWhatYou")}
            </h5>
          </div>
          <div className="flex justify-start pl-2">
            <h5
              className="text-xl text-black font-bold mb-4"
              style={{
                fontSize: "18px",
                marginTop: "-1.7rem",
              }}
            >
              {t("heresWhatYou")}
            </h5>
            <div
              style={{
                boxSizing: "border-box",
                width: "50px",
                marginLeft: "1.85rem",
                marginTop: "-1.75rem",
              }}
            >
              <img
                className="w-16"
                alt="free-gift-icon"
                src={PDPOverrideOffer?.offerIconUrl || "https://files.myglamm.com/site-images/original/free-gift-icon.png"}
              />
            </div>
          </div>
          <div className="flex justify-start px-2 -mt-5">
            <span className="text-smfont-thin">
              <b className="font-semibold">
                {t("worthAmount", [formatPrice(freeProductDetails?.price, true) as string])}&nbsp;
              </b>
              {t("withPurchase")}
            </span>
          </div>
        </div>

        <div className="flex my-4 border-dashed border-2 mx-2 p-3" style={{ borderColor: "rgba(229, 123, 123, 0.53)" }}>
          <div className="w-1/3">
            <img
              style={{ maxHeight: "76px" }}
              src={freeProductImage?.imageUrl["400x400"] || DEFAULT_IMG_PATH()}
              alt={freeProductImage?.name || "Free Product"}
            />
          </div>
          <div>
            <h2 className="text-base font-semibold">{freeProductDetails?.cms?.[0]?.content?.name}</h2>
            <p className="text-smfont-thin">{freeProductDetails?.cms?.[0]?.content?.subtitle}</p>
            <div className="my-1 flex items-center">
              <span className="text-lg text-red-600 font-semibold">{t("free")}</span>
              <span className="text-lg text-gray-600 line-through font-thin mx-1">
                {formatPrice(freeProductDetails?.price, true)}
              </span>
            </div>
          </div>
        </div>

        {freeProduct?.data?.data.length && (
          <>
            {/* Shade Listing */}

            {shadesList.length > 1 && (
              <section className={ShadesContainer} style={{ maxHeight: "30vh" }}>
                <PDPShadeGrid
                  shadeLabel={freeProductDetails?.cms?.[0]?.attributes?.shadeLabel}
                  currentProductId={freeProductDetails?.id}
                  shades={shadesList}
                  isFreeProduct
                  setActiveShade={(activeShade: any, index: number) => setSelectedFreeProduct(index)}
                />
              </section>
            )}

            <div className="flex items center border-t border-gray-400 bg-white px-2">
              <div
                aria-hidden="true"
                className="w-1/2 flex items-center justify-centerfont-thin text-sm text-gray-500 hidden"
                onClick={() => noThanks()}
              >
                {t("noThanks")}
              </div>
              {freeProductsListIds?.length - 1 === numberOfFreeProduct ? (
                <div
                  aria-hidden="true"
                  className="w-full uppercase flex items-center justify-center bg-ctaImg content-center text-white text-sm font-semibold rounded my-2 h-10"
                  onClick={() => addFreeProducts(freeProductDetails)}
                >
                  {t("proceedToCart") || "Proceed To Cart"}
                </div>
              ) : (
                <div
                  aria-hidden="true"
                  className="w-full uppercase flex items-center justify-center bg-ctaImg content-center text-white text-sm font-semibold rounded my-2 h-10"
                  onClick={() => {
                    handleNext(numberOfFreeProduct + 1, freeProductDetails);
                  }}
                >
                  Next
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </PopupModal>
  );
};
export default FreeProductModal2;
