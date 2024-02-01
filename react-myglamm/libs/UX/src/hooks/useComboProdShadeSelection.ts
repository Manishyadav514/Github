import { useEffect, useState } from "react";

import ProductAPI from "@libAPI/apis/ProductAPI";

import { SHOP } from "@libConstants/SHOP.constant";

import { FEATURES } from "@libStore/valtio/FEATURES.store";

import { PDPNewChildProducts, PDPProd, ProductData } from "@typesLib/PDP";
import { adobeClickShadeChange } from "@productLib/pdp/AnalyticsHelper";

const useComboProdShadeSelection = (product: PDPProd, setChildProducts: (arg: ProductData[]) => void) => {
  const enableComboV2 = FEATURES?.enableComboV2;

  const { childProducts, productTag, id } = product;

  const [activeKitProductIndex, setActiveKitProductIndex] = useState(0);
  const [showShadesModal, setShowShadesModal] = useState<boolean | undefined>(undefined);
  const [comboShades, setComboShades] = useState<PDPNewChildProducts | ProductData[]>(enableComboV2 ? [] : childProducts || []);

  /* According to V3 requirement we have to use different state to maintain selected shades productIds */
  const [comboShadesV3, setComboShadeV3] = useState<any>([]);
  const [selectedProdShades, setSelectedProdShades] = useState<Array<any>>([]);

  /* when we use newComboApi on first load we have to get data and use to show shades */
  useEffect(() => {
    if (enableComboV2 && childProducts?.length) {
      const productApi = new ProductAPI();
      productApi.getComboShades(product?.sku, childProducts[0].id).then(({ data: prodRes }) => {
        setComboShades(prodRes?.data);
        const childProd = prodRes?.data
          .filter((product: any) => product.productDetails?.length)
          .map((product: any) => product.productDetails[0]);
        setComboShadeV3(childProd);
        setChildProducts(childProd);
      });
    } else if (!enableComboV2) {
      setChildProducts(childProducts);
    }
  }, [id]);

  /* Call Shades API and open Kits Shade Selection Modal */
  const handleSelectShade = (product: any, index: number) => {
    adobeClickShadeChange(product);

    if (enableComboV2) {
      setSelectedProdShades((comboShades as PDPNewChildProducts)?.[index]?.productDetails);
      setActiveKitProductIndex(index);
      setShowShadesModal(true);
    } else {
      const where = {
        inStock: true,
        id: { nin: comboShades.map((kit: any) => kit.id) },
        productTag: encodeURIComponent(productTag),
        "productMeta.displaySiteWide": true,
      };

      /* For Temporary Purpose removing displaysitwide on mgp for kit's shade selection */
      // @ts-ignore
      if (SHOP.IS_MYGLAMM) delete where["productMeta.displaySiteWide"];

      const include = ["price", "productTag", "cms", "assets", "inStock", "type"];
      const productApi = new ProductAPI();
      productApi.getProductShades("IND", where, 0, include).then(({ data: prodRes }) => {
        setSelectedProdShades(prodRes.data.data);
        setActiveKitProductIndex(index);
        setShowShadesModal(true);
      });
    }
  };

  /* Replace Active Kit Product with User Selected One */
  const changeProductShade = (value: any) => {
    /* In case of enableComboV2 is true value will be index and else it will be shade data  */
    if (enableComboV2) {
      const updateComboShade = comboShades as PDPNewChildProducts;
      const activeShadeIndexDetails = updateComboShade[activeKitProductIndex]?.productDetails;
      activeShadeIndexDetails?.splice(0, 0, activeShadeIndexDetails.splice(value, 1)[0]);
      setComboShades(updateComboShade);
      setChildProducts(updateComboShade.map(product => product.productDetails?.[0]));
      setShowShadesModal(false);
    } else {
      const updatedKitList = comboShades as ProductData[];
      updatedKitList.splice(activeKitProductIndex, 1, value);
      setComboShades(updatedKitList);
      setChildProducts(updatedKitList);
      setShowShadesModal(false);
    }
  };

  /* Replace Active Kit Product with User Selected One in V3  */
  const selectProductShade = (shadeData: any, activeProdIndex: number) => {
    const updatedKitList = comboShadesV3;
    updatedKitList.splice(activeProdIndex, 1, shadeData);
    setComboShadeV3([...updatedKitList]);
    setChildProducts([...updatedKitList]);
    setShowShadesModal(false);
  };

  return {
    activeKitProductIndex,
    selectedProdShades,
    showShadesModal,
    comboShades,
    setShowShadesModal,
    handleSelectShade,
    changeProductShade,
    enableComboV2,
    setActiveKitProductIndex,
    comboShadesV3,
    selectProductShade,
  };
};

export default useComboProdShadeSelection;
