import React, { useState, useEffect } from "react";
import recommendationHelper from "@libUtils/recommendationHelper";

import PersonalisedProduct from "./PersonalisedProduct";
import PersonalisedWidgetLabel from "./PersonalisedWidgetLabel";
import RecentlyViewedProduct from "./RecentlyViewedProduct";
import PersonalisedTwinProduct from "./PersonalisedTwinProduct";
import useDsAdobe from "@libHooks/useDsAdobe";

const PersonalisedProductCarousel = ({ item, icid }: any) => {
  const [productsData, setProductsData] = useState([]);
  const isTwinWidget = item.customParam === "module-grid-2";
  const [dsWidgetType, setDsWidgetType] = useState("");

  useEffect(() => {
    recommendationHelper(item.meta?.widgetMeta, item.commonDetails).then((res: any) => {
      setProductsData(res.products);
      setDsWidgetType(res.dsWidgetType);
    });
  }, []);

  const { dsWidgetRef } = useDsAdobe({
    title: item.commonDetails.title,
    dsWidgetType: dsWidgetType,
    products: productsData,
  });

  return (
    <section className="mb-8">
      <PersonalisedWidgetLabel title={item.commonDetails.title} />

      <div
        className={`py-2 mt-4 overflow-x-auto flex ${isTwinWidget ? "flex-wrap flex-col" : "flex-no-wrap"}`}
        style={{
          height: isTwinWidget ? "15.5rem" : "auto",
          paddingLeft: "14px",
        }}
        ref={dsWidgetRef}
      >
        {productsData.map((product: any, index) => {
          switch (item.customParam) {
            case "module-carousel-2": {
              return <PersonalisedProduct key={product.id} product={product} width="180px" icid={icid} index={index} />;
            }
            case "module-carousel-3": {
              return <RecentlyViewedProduct key={product.id} product={product} icid={icid} index={index} />;
            }
            case "module-grid-2": {
              return <PersonalisedTwinProduct key={product.id} product={product} icid={icid} index={index} />;
            }
            default: {
              return null;
            }
          }
        })}
      </div>
    </section>
  );
};

export default PersonalisedProductCarousel;
