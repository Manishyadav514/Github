import React, { useState, useEffect } from "react";
import { GiCloseIco } from "@libComponents/GlammIcons";
import useTranslation from "@libHooks/useTranslation";
import PDPShadeGrid from "./PDPShadeGrid";
import GiftBox from "../../../public/svg/gift-box.svg";
import PopupModal from "@libComponents/PopupModal/PopupModal";
import { useRouter } from "next/router";
import { fetchFreeProducts } from "@checkoutLib/Cart/HelperFunc";
import FreeGiftBox from "../../../public/svg/free-gift.svg";
import { formatPrice } from "@libUtils/format/formatPrice";
import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

const PDPOverrideOfferComponent = ({ FreeProducts, freeProductsListIds }: any) => {
  const { t, isConfigLoaded } = useTranslation();
  const router = useRouter();

  const [showFreeProductModal, setFreeProductModal] = useState<boolean>(false);
  const [selectFreeProduct, setSelectedFreeProduct] = useState<number>(0);
  const [freeProductDetails, setFreeProductDetails] = useState(FreeProducts?.data?.data[selectFreeProduct]);

  const [numberOfFreeProduct, setNumberOfFreeProduct] = useState<number>(0);
  const [freeProductsData, setFreeProductsData] = useState(FreeProducts?.data?.data);
  const [shadesList, setShadesList] = useState(FreeProducts.data.data);
  const [PDPOverrideOffer, setPDPOverrideOffer] = useState<any>(null);
  const [modalContainerStyle, setModalContainerStyle] = useState<any>({});

  const freeProductImage = freeProductDetails?.assets?.find((a: any) => a.type === "image");

  useEffect(() => {
    setFreeProductDetails(freeProductsData[selectFreeProduct]);
  }, [selectFreeProduct]);

  useEffect(() => {
    const offer = t("pdpOverideOffer");
    if (!PDPOverrideOffer && offer?.smallIconUrl) {
      setPDPOverrideOffer(offer);
      setModalContainerStyle({
        backgroundImage: `url(${offer.offerImageUrl})`,
        backgroundPosition: "top center",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
      });
    }
  }, [isConfigLoaded, PDPOverrideOffer, t]);

  const handleNext = (nextFreeProductCount: number) => {
    // fetch next free product! Only one free product will be shown at a time
    fetchFreeProducts({ productSlug: router.query.slug, nextFreeProductCount }).then((freeProductResponse: any) => {
      setFreeProductDetails(freeProductResponse?.data.data.data?.[0]);

      setShadesList(freeProductResponse.data.data.data);
      setFreeProductsData(freeProductResponse?.data.data.data);
    });
    setNumberOfFreeProduct(numberOfFreeProduct + 1);
  };

  return (
    <>
      <div className="flex items-center p-2 px-3" onClick={() => setFreeProductModal(true)}>
        <div className="h-12 w-12 border ">
          {freeProductDetails?.assets[0]?.imageUrl["200x200"] ? (
            <img
              src={freeProductDetails?.assets[0]?.imageUrl["200x200"]}
              alt={freeProductDetails?.productTag}
              height="48px"
              width="48px"
              role="presentation"
              className="border-themeGray object-contain"
            />
          ) : PDPOverrideOffer?.smallIconUrl ? (
            <img
              role="presentation"
              className="h-12 object-contain border-themeGray"
              src={PDPOverrideOffer.smallIconUrl}
              alt="offer-icon"
              title={PDPOverrideOffer.smallIconTitle}
            />
          ) : (
            <GiftBox />
          )}
        </div>
        <div className="px-2 py-1 w-5/6">
          <p className=" text-xs font-bold py-1 flex items-center">
            <span className="pr-1">
              <FreeGiftBox />
            </span>
            Here’s your awesome FREE Gift!
          </p>
          {freeProductDetails && (
            <p className="text-xs">
              {`${freeProductDetails?.productTag} worth ${formatPrice(freeProductDetails?.price, true)} with this purchase.`}
            </p>
          )}
        </div>
      </div>
      {/* <div className="w-1/5 pl-1">
      <div className="flex justify-center h-12">
        {PDPOverrideOffer?.smallIconUrl ? (
          <img
            role="presentation"
            className="h-12 object-contain"
            onClick={() => setFreeProductModal(true)}
            src={PDPOverrideOffer.smallIconUrl}
            alt="offer-icon"
            title={PDPOverrideOffer.smallIconTitle}
          />
        ) : (
          <GiftBox onClick={() => setFreeProductModal(true)} />
        )}
      </div>
      <p
        className="text-10 flex justify-center font-semibold text-center items-center text-color1"
        style={{
          lineHeight: "13px",
        }}
      >
        {PDPOverrideOffer?.smallIconTitle
          ? PDPOverrideOffer.smallIconTitle
          : productRes?.data?.discountDetails[productRes.data?.data[0]?.id]?.cms &&
            productRes?.data?.discountDetails[productRes.data?.data[0]?.id]?.cms[0]?.content?.pdpOffersSectionText}
      </p> */}

      {/* FREEPRODUCT MODAL */}
      {showFreeProductModal && (
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
                <GiCloseIco name="close-ico" height="28" width="28" fill="#9b9b9b" />
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
                    src={PDPOverrideOffer?.offerIconUrl || "https://files.myglamm.com/site-images/original/free-gift-icon.png"}
                    alt="free-gift-icon"
                  />
                </div>
              </div>
              <div className="flex justify-start px-2 -mt-5">
                <span className="text-smfont-thin">
                  <b className="font-semibold">
                    {t("worthAmount", [formatPrice(freeProductDetails?.price, true) as string])}
                    &nbsp;
                  </b>
                  {t("withPurchase")}
                </span>
              </div>
            </div>

            <div className="flex py-4 border-dashed border-2 mx-2 p-3" style={{ borderColor: "rgba(229, 123, 123, 0.53)" }}>
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
            {FreeProducts?.data?.data?.length > 1 && FreeProducts?.data?.count > 1 && (
              <>
                {/* Shade Listing */}

                <PDPShadeGrid
                  shadeLabel={freeProductDetails?.cms?.[0]?.attributes?.shadeLabel}
                  currentProductId={freeProductDetails?.id}
                  shades={shadesList}
                  isFreeProduct
                  setActiveShade={(activeShade: any, index: number) => setSelectedFreeProduct(index)}
                />
              </>
            )}

            {freeProductsListIds?.length - 1 !== numberOfFreeProduct && (
              <div className="flex items center border-t border-gray-400 bg-white px-2">
                <div
                  aria-hidden="true"
                  className="w-full uppercase flex items-center justify-center bg-ctaImg content-center text-white text-sm font-semibold rounded my-2 h-10"
                  onClick={() => {
                    handleNext(numberOfFreeProduct + 1);
                  }}
                >
                  Next
                </div>
              </div>
            )}
          </div>
        </PopupModal>
      )}
      {/* </div> */}
    </>
  );
};
export default PDPOverrideOfferComponent;
