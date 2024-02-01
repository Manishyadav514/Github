import React, { useEffect, useState } from "react";

import PDPRecommendedProduct from "@libComponents/PDP/PDPRecommendedProduct";

import { PDPProd } from "@typesLib/PDP";

import { PDP_STATES, PDP_VARIANTS } from "@libStore/valtio/PDP.store";

import { PDP_ICID } from "@productLib/pdp/PDP.constant";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import PopupModal from "@libComponents/PopupModal/PopupModal";
import ModuleCarousel5 from "@libComponents/PDPWidgets/ModuleCarouselv5";
import WidgetAPI from "@libAPI/apis/WidgetAPI";
import { useSnapshot } from "valtio";
import { SLUG } from "@libConstants/Slug.constant";
import clsx from "clsx";

interface SimilarProdProps {
  similarProductModal: boolean;
  product: PDPProd;
}

const PDPSimilarProductsModalV2 = ({ similarProductModal, product }: SimilarProdProps) => {
  const [showLoader, setShowLoader] = useState(true);
  const [item, setItem] = useState<Array<any>>([]);
  const [activeTab, setActiveTab] = useState<number>(0);

  const { pdpMultiWidgetPopupVariant } = useSnapshot(PDP_VARIANTS);

  useEffect(() => {
    const widgetApi = new WidgetAPI();
    widgetApi
      .getWidgets({
        where: {
          slugOrId: pdpMultiWidgetPopupVariant === "1" ? SLUG().PDP_MULTI_WIDGET_ICON : SLUG().PDP_VIEW_SIMILAR_ICON,
        },
      })
      .then(({ data }) => {
        setItem(data?.data?.data?.widget);
      })
      .catch(() => null);
  }, [product?.id]);

  const hideModal = () => {
    PDP_STATES.modalStates.similarProductModal = false;
  };

  useEffect(() => {
    setActiveTab(0);
    setShowLoader(true);
  }, [similarProductModal]);

  return (
    <PopupModal show={similarProductModal} onRequestClose={hideModal}>
      <div className="rounded-t-3xl overflow-y-scroll  bg-white" style={{ minHeight: "324px", maxHeight: "450px" }}>
        {showLoader && <LoadSpinner />}

        <div className="bg-white">
          {!!item.length && (
            <>
              {pdpMultiWidgetPopupVariant === "1" ? (
                <>
                  <div className="px-2 bg-themeGray">
                    <div className=" flex items-center overflow-x-auto">
                      {item.map((data, i) => {
                        return (
                          <>
                            <span
                              className="px-3 flex-sliderChild bg-themeGray font-bold text-13 text-center capitalize"
                              onClick={() => setActiveTab(i)}
                              style={{ paddingTop: "13px" }}
                            >
                              <p
                                className={clsx(
                                  "pb-2.5 border-b-3",
                                  activeTab === i ? "text-color1  border-color1" : "border-themeGray"
                                )}
                              >
                                {data?.commonDetails?.title}
                              </p>
                            </span>
                            {item.length - 1 !== i && <span className="h-7 w-0.5 border-l border-gray-300 mt-1"></span>}
                          </>
                        );
                      })}
                    </div>
                  </div>
                  {item.map((data, i) => {
                    return (
                      <div key={data.id} className={clsx(activeTab === i ? "block" : "hidden", "w-full")}>
                        <ModuleCarousel5
                          item={data}
                          icid={PDP_ICID}
                          productSKU={product?.sku}
                          dsDataLoaded={() => {
                            if (i === 0) {
                              setShowLoader(false);
                            }
                          }}
                          disableTitle={true}
                        />
                      </div>
                    );
                  })}
                </>
              ) : (
                <ModuleCarousel5
                  item={item[0]}
                  icid={PDP_ICID}
                  productSKU={product?.sku}
                  dsDataLoaded={() => {
                    setShowLoader(false);
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </PopupModal>
  );
};

export default PDPSimilarProductsModalV2;
