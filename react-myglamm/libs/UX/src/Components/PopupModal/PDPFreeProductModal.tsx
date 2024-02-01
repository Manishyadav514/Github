import React, { useEffect, useState } from "react";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import { GiCloseIco } from "@libComponents/GlammIcons";
import useAddtoBag from "@libHooks/useAddToBag";
import PDPShadeGrid from "@libComponents/PDP/PDPShadeGrid";
import PopupModal from "./PopupModal";
import { formatPrice } from "@libUtils/format/formatPrice";
import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

const PDPFreeProductModal = ({ product, freeProduct, isPreOrder, showPDPOverRideOffer, hide, show, t }: any) => {
  const [loader, setLoader] = useState(false);
  const [selectFreeProduct, setSelectedFreeProduct] = useState(0);
  const [PDPOverrideOffer, setPDPOverrideOffer] = useState<any>(null);
  const [modalContainerStyle, setModalContainerStyle] = useState<any>({});
  const freeProductDetails = freeProduct?.data?.data[selectFreeProduct];
  const freeProductImage = freeProductDetails?.assets?.find((a: any) => a.type === "image");
  const { addProductToCart } = useAddtoBag();

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
  }, [t]);
  return (
    <PopupModal show={show} onRequestClose={hide}>
      <div
        className="bg-white h-full"
        style={
          showPDPOverRideOffer
            ? {
                borderTopRightRadius: "15px",
                borderTopLeftRadius: "15px",
                ...modalContainerStyle,
              }
            : { borderTopRightRadius: "15px", borderTopLeftRadius: "15px" }
        }
      >
        <div aria-hidden="true" className="flex justify-end" onClick={() => hide()}>
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
                src={
                  (showPDPOverRideOffer && PDPOverrideOffer?.offerIconUrl) ||
                  "https://files.myglamm.com/site-images/original/free-gift-icon.png"
                }
                alt="free-gift-icon"
              />
            </div>
          </div>
          <div className="flex justify-start px-2 -mt-5">
            <span className="text-smfont-thin">
              <b className="font-semibold">{t("worthAmount", [formatPrice(freeProductDetails?.price, true)])}&nbsp;</b>
              {t("withPurchase")}
            </span>
          </div>
        </div>

        <div className="flex my-4 border-dashed border-2 mx-2 p-3" style={{ borderColor: "rgba(229, 123, 123, 0.53)" }}>
          <div className="w-1/3">
            <img
              style={{ maxHeight: "76px" }}
              alt={freeProductImage?.name || "Free Product"}
              src={freeProductImage?.imageUrl["400x400"] || DEFAULT_IMG_PATH()}
            />
          </div>
          <div>
            <h2 className="text-base font-semibold">{freeProductDetails?.cms[0]?.content?.name}</h2>
            <p className="text-smfont-thin">{freeProductDetails?.cms[0]?.content?.subtitle}</p>
            <div className="my-1 flex items-center">
              <span className="text-lg text-red-600 font-semibold">{t("free")}</span>
              <span className="text-lg text-gray-600 line-through font-thin mx-1">
                {formatPrice(freeProductDetails?.price, true)}
              </span>
            </div>
          </div>
        </div>

        {freeProduct && freeProduct.data?.data?.length > 1 && (
          <>
            {/* Shade Listing */}

            <PDPShadeGrid
              shadeLabel={freeProductDetails.cms[0]?.attributes?.shadeLabel}
              currentProductId={freeProductDetails?.id}
              shades={freeProduct.data.data}
              isFreeProduct
              setActiveShade={(activeShade: any, index: number) => setSelectedFreeProduct(index)}
            />

            <div className="flex items center border-t border-gray-400 bg-white px-2">
              <button
                type="button"
                disabled={loader}
                className="outline-none w-full uppercase flex items-center justify-center bg-ctaImg content-center text-white text-sm font-semibold rounded my-2 h-10"
                onClick={() => {
                  setLoader(true);
                  addProductToCart(freeProductDetails, isPreOrder ? 4 : 2, product.id).then(() => {
                    setLoader(false);
                  });
                }}
              >
                {loader ? <LoadSpinner className="inset-0 w-8 h-8 p-1 mx-auto" /> : t("proceedToCart") || "Proceed To Cart"}
              </button>
            </div>
          </>
        )}
      </div>
    </PopupModal>
  );
};

export default PDPFreeProductModal;
