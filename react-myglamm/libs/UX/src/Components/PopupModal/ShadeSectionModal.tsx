import ProductAPI from "@libAPI/apis/ProductAPI";
import PriceCard from "@libComponents/CardComponents/PriceCard/PriceCard";
import FlashSaleTicker from "@libComponents/FlashSaleTicker";
import PDPRatingsandShare from "@libComponents/PDP/PDPRatingsandShare";
import PDPTryon from "@libComponents/PDP/PDPTryon";
import ShadePalette from "@libComponents/PDP/shadeSelection/ShadePalette";
import SnapCarousel from "@libComponents/PDP/SnapCarousel";
import { PDP_STATES } from "@libStore/valtio/PDP.store";
import { getStaticUrl } from "@libUtils/getStaticUrl";
import { isClient } from "@libUtils/isClient";
import { getShadesSelectionData } from "@productLib/pdp/HelperFunc";
import { patchCarouselImages } from "@productLib/pdp/pdpUtils";
import { PDPProd } from "@typesLib/PDP";
import React, { useEffect, useState } from "react";
import LazyHydrate from "react-lazy-hydration";
import { useSnapshot } from "valtio";
import PopupModal from "./PopupModal";
import Close from "../../../public/svg/ic-close.svg";

const ShadeSectionModal = ({ productRes, PDPWidgets }: { productRes: PDPProd; PDPWidgets: any }) => {
  const [colorFamily, setColorFamily] = useState<any>({});
  const { modalStates, PDPFreeProductData } = useSnapshot(PDP_STATES);
  const [shades, setShades] = useState(productRes.shades);
  const [activeProduct, setActiveProduct] = useState<any>(productRes);
  const { categories, ratings } = productRes;
  const { cms, assets } = activeProduct;
  const videoStyle = {
    backgroundPosition: " 0 -285px",
    backgroundImage: `url(${getStaticUrl("/global/images/ico-pdp-sprite.png")})`,
    backgroundRepeat: "no-repeat",
    height: "35px",
    width: "35px",
    position: "absolute",
    top: "45%",
  } as React.CSSProperties;

  const carouselStyle = `
  .carousel {
    height: 190px;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
   
  }
  .carousel__item {
    height: 190px;
    flex-shrink: 0;
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }
  .carousel__dots{
    position:absolute;
    bottom:-15px;
  }
  .videoCarouselHeight{
    height:190px;
  }
  
`;

  const priceCardStyle = {
    boxShadow: "0 -4px 4px 0 rgba(0,0,0,.07)",
  } as React.CSSProperties;

  useEffect(() => {
    getShadesSelectionData(productRes.id, productRes.productTag)
      .then((res:any) => {
        setShades([productRes, ...res.shades]);
        setColorFamily(res.aggregatedShades);
      })
      .catch(() => {
        console.error("shade selection api failed");
      });
  }, []);

  return (
    <PopupModal
      show={modalStates.shadeSelectionModal || false}
      onRequestClose={() => (PDP_STATES.modalStates.shadeSelectionModal = false)}
    >
      <>
        <main
          className=" ShadeSelection bg-white flex flex-col"
          style={{ height: isClient() ? window?.document?.documentElement?.clientHeight : "calc(100vh)" }}
        >
          <div className="absolute right-4 top-4 z-10" onClick={() => (PDP_STATES.modalStates.shadeSelectionModal = false)}>
            <Close className="h-4 w-4" />
          </div>
          <div className="relative pt-2">
            {PDPWidgets?.flashSaleWidgetData && <FlashSaleTicker item={PDPWidgets?.flashSaleWidgetData} source="product" />}

            <LazyHydrate whenIdle>
              <SnapCarousel
                title={cms[0]?.content?.name}
                carouselSlides={patchCarouselImages(assets)}
                categoryDetails={categories}
                videoStyle={videoStyle}
                carouselStyle={carouselStyle}
                dimension={190}
              />
            </LazyHydrate>
          </div>

          <LazyHydrate whenIdle>
            <div className="relative">
              <PDPTryon product={productRes} shadeSelection />
              <PDPRatingsandShare product={{...activeProduct,ratings} || {}} showShare={false} />
            </div>
          </LazyHydrate>

          {/* {colorFamily?.data?.length === 0 && (
            <div className="flex p-4 items-center  justify-between w-full">
              <h1 className="font-semibold leading-tight capitalize text-sm">{productRes.cms[0]?.content?.name}</h1>
              <p className="text-gray-400 text-sm leading-none">
                {Array.isArray(productRes.shades) && productRes.shades.length}&nbsp;Shades
              </p>
            </div>
          )} */}

          {productRes?.type !== 2 && (
            <LazyHydrate whenIdle>
              <ShadePalette
                productTag={productRes?.productTag}
                alignShadesLeft={true}
                shadeLabel={productRes?.cms[0]?.attributes?.shadeLabel}
                currentProductId={activeProduct.id}
                shades={shades}
                colorFamily={colorFamily}
                setActiveProduct={setActiveProduct}
              />
            </LazyHydrate>
          )}
          {/* </div> */}

          <LazyHydrate whenIdle>
            <PriceCard
              priceCardStyle={priceCardStyle}
              product={activeProduct}
              preOrder={activeProduct?.productMeta}
              freeProduct={PDPFreeProductData}
              relationalData={{}}
              childProducts={activeProduct.childProducts}
              flashSaleWidgetData={PDPWidgets?.flashSaleWidgetData}
              freeProductsListIds={activeProduct?.freeProducts?.ids}
            />
          </LazyHydrate>
        </main>
      </>
    </PopupModal>
  );
};

export default ShadeSectionModal;
