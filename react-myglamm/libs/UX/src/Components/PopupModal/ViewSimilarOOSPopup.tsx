import SearchLabel from "@libComponents/Search/SearchLabel";
import ProductCell from "@libComponents/PDP/RecommendForOOSProductTag";
import React, { useEffect, useState } from "react";
import PopupModal from "./PopupModal";
import useTranslation from "@libHooks/useTranslation";
import PDPTagsFilters from "@libComponents/PDP/PDPTagsFilters";
import { filterProductsOnTag } from "@libUtils/widgetUtils";

const ViewSimilarOOSPopup = ({ show, onRequestClose, products, dsRef }: any) => {
  const { t } = useTranslation();
  const { title, subTitle } = t("viewSimilarOOSTitles") || { title: "Don't Miss Out", subTitle: "Shop from similar products" };
  const [productData, setProductData] = useState(products?.value?.products);

  useEffect(() => {
    if (show) {
      (window as any).evars.evar170 = products?.value?.variantValue ?? "default";
    }
  }, [show]);

  const handleFilterProduct = (tags: string) => {
    const filterProducts = filterProductsOnTag(products?.value?.products, tags);
    setProductData(filterProducts);
  };

  return (
    <PopupModal show={show} onRequestClose={onRequestClose} type="bottom-modal">
      <div className="bg-white w-full rounded-t-3xl pt-3 px-1" style={{ minHeight: "500px" }}>
        <>
          <SearchLabel label={title} color="color1" textSize="text-base capitalize" />
          <p className="text-xs px-3 -mt-3"> {subTitle} </p>
          {products?.value?.globalTags?.length && (
            <div className="mt-2 -ml-1">
              <PDPTagsFilters
                dsKey={products?.key}
                tags={products?.value?.globalTags}
                handleFilterProduct={handleFilterProduct}
              />
            </div>
          )}
          <div>
            <ProductCell products={productData} dsRef={dsRef} dsKey={products?.key} />
          </div>
        </>
      </div>
    </PopupModal>
  );
};

export default ViewSimilarOOSPopup;
