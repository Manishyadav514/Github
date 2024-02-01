import React, { useState, useEffect } from "react";
import useTranslation from "@libHooks/useTranslation";
import recommendationHelper from "@libUtils/recommendationHelper";

import PersonalisedProduct from "./PersonalisedProduct";
import PersonalisedWidgetLabel from "./PersonalisedWidgetLabel";
import { useInView } from "react-intersection-observer";
import RightArrow from "../../../public/svg/rightArrow.svg";
import useDsAdobe from "@libHooks/useDsAdobe";

const PersonalisedProductGridView = ({ item, icid }: any) => {
  const { t } = useTranslation();
  const [limit, setLimit] = useState(4);
  const [productsData, setProductsData] = useState([]);
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

  const viewMoreProducts = () => {
    const newLimit = limit + 4;
    if (newLimit > productsData.length) {
      setLimit(productsData.length);
    } else {
      setLimit(newLimit);
    }
  };

  return (
    <section className="mt-8 mb-6">
      <PersonalisedWidgetLabel title={item.commonDetails.title} />

      <div className="flex flex-wrap mt-4 mb-2" style={{ padding: "8px 6px 8px 14px", width: "100%" }} ref={dsWidgetRef}>
        {productsData.slice(0, limit).map((product: any, index) => (
          <PersonalisedProduct key={product.id} product={product} width="47.7%" icid={icid} index={index} />
        ))}
      </div>
      {limit < productsData?.length && (
        <button
          type="button"
          className="font-semibold text-center mx-8 p-2 border relative"
          onClick={viewMoreProducts}
          style={{ width: "82%", outline: "none" }}
        >
          {t("viewMore")}
          <RightArrow style={{ position: "absolute", top: "1rem", right: "2rem" }} />
        </button>
      )}
    </section>
  );
};

export default PersonalisedProductGridView;
