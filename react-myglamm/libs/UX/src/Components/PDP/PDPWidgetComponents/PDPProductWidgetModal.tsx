import React, { useEffect, useState } from "react";
import { PDPProd } from "@typesLib/PDP";
import { PDP_STATES } from "@libStore/valtio/PDP.store";
import { PDP_ICID } from "@productLib/pdp/PDP.constant";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import PopupModal from "@libComponents/PopupModal/PopupModal";
import ModuleCarousel5 from "@libComponents/PDPWidgets/ModuleCarouselv5";
import WidgetAPI from "@libAPI/apis/WidgetAPI";
import Image from "next/image";
import useAppRedirection from "@libHooks/useAppRedirection";

interface prodWidget {
  product: PDPProd;
}

const PDPProductWidgetModal = ({ product }: prodWidget) => {
  const [showLoader, setShowLoader] = useState(true);
  const [item, setItem] = useState<any>([]);
  const { widgetShow, widgetVarint } = PDP_STATES.prodWidgetData;
  const showWidget = widgetVarint === "1" && widgetShow;

  useEffect(() => {
    const widgetApi = new WidgetAPI();
    widgetApi
      .getWidgets({ where: { slugOrId: "mobile-site-product-widget-modal" } })
      .then(({ data }) => {
        setItem(data?.data?.data?.widget);
      })
      .catch(e => console.log("Prod Widget Load", e));
  }, [product?.id]);

  const hideModal = () => {
    PDP_STATES.prodWidgetData.widgetShow = false;
  };

  const [loader, setLoader] = useState(false);
  const { redirect } = useAppRedirection();
  const firstImage = product?.assets?.find(product => product.type === "image");

  if (!showWidget) return null;

  return (
    <PopupModal show={widgetShow} onRequestClose={() => hideModal()}>
      <section className="bg-white w-full rounded-t-3xl h-auto">
        <div className="border-b-2 border-gray-100 px-4 pt-6 pb-4 flex flex-row align-middle items-center gap-4">
          <div className="w-16 h-16">
            <Image src={firstImage?.imageUrl?.["200x200"] || ""} width={200} height={200} alt="prod image" />
          </div>
          <div className="h-16 flex align-center text-sm">
            <div className="flex items-center mb-2">
              <div className="h-4 w-4 relative rounded-full bg-green-600 ml-0.5 ticked1">
                <span className="absolute top-1 left-1.5 w-1 h-2 border-r-2 border-b-2 border-white border-solid rotate-45" />
              </div>
              <p className="font-semibold pl-1">Added to the cart</p>
            </div>
          </div>
        </div>

        <div className="min-h-[300px]">
          {showLoader && <LoadSpinner />}
          <div className="pr-4">
            {!!item?.length && (
              <ModuleCarousel5
                item={item[0]}
                icid={PDP_ICID}
                productSKU={product?.sku}
                dsDataLoaded={() => {
                  setShowLoader(false);
                }}
              />
            )}
          </div>
        </div>
      </section>

      <div className={`flex justify-center bg-white relative pb-3 px-4`}>
        <button
          type="button"
          disabled={loader}
          onClick={() => {
            PDP_STATES.prodWidgetData = { ...PDP_STATES.prodWidgetData, widgetLogic: "", widgetShow: false };
            redirect("/shopping-bag");
          }}
          className={`rounded relative border border-color1 w-full py-2`}
        >
          <p className="text-xs font-semibold text-color1 uppercase">SKIP TO CART</p>
        </button>
      </div>
    </PopupModal>
  );
};

export default PDPProductWidgetModal;
