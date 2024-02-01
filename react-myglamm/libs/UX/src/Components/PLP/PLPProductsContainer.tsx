import React, { useEffect, useState } from "react";
import LazyHydrate from "react-lazy-hydration";
import { useInView } from "react-intersection-observer";

import useTranslation from "@libHooks/useTranslation";
import PLPProdCell from "@libComponents/ProductGrid/PLPProdCell";

import { PLPActions, PLPStates } from "@typesLib/PLP";

import FilterNoProducts from "./FilterNoProducts";
import ConsumerAPI from "@libAPI/apis/ConsumerAPI";
import { getMCVID } from "@libUtils/getMCVID";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import Widgets from "@libComponents/HomeWidgets/Widgets";
import { useOptimize } from "@libHooks/useOptimize";
import { getVendorCode } from "@libUtils/getAPIParams";

import { USER_REDUCER } from "@libStore/valtio/REDUX.store";
import { useRouter } from "next/router";
import { useSplit } from "@libHooks/useSplit";

interface productDivProps {
  PLPSTATE: PLPStates;
  isFiltersActive: boolean;
  products: Array<any>;
  getMoreProducts: () => void;
  PLPDispatch: (action: PLPActions) => void;
}

const PLPProductsContainer = ({ PLPSTATE, products, PLPDispatch, getMoreProducts, isFiltersActive }: productDivProps) => {
  const { t } = useTranslation();
  const { ref, inView } = useInView({ threshold: 0 });

  const { PLPConcernIngredientExpId } = t("abTestExperimentIds")?.[0] || {};

  const router = useRouter();
  const [plpConcernVariant] = useOptimize([PLPConcernIngredientExpId])?.variants ?? [];
  const { plpTagID: variantPLPTag, widgetOnPLP: variant } =
    useSplit({ experimentsList: [{ id: "plpTagID" }, { id: "widgetOnPLP" }], deps: [] }) || {};
  const plpTagsFlag = (products[0]?.meta?.tags?.[0]?.name as string) || "";

  useEffect(() => {
    if (variantPLPTag && variantPLPTag !== "no-variant") {
      (window as any).evars.evar122 = variantPLPTag === "1" ? `true|${plpTagsFlag ? "visible" : "not visible"}` : "false";
    }
  }, [variantPLPTag, plpTagsFlag]);

  useEffect(() => {
    if (variant && variant !== "no-variant") {
      (window as any).evars.evar138 = variant;
    }
  }, [variant]);

  const infinteCategoryRef: Array<{ ref: HTMLDivElement; page: number }> = [];

  const userProfile = useSelector((store: ValtioStore) => store.userReducer.userProfile);

  const [variantNo, setVariantNo] = useState<string>("");

  // A/B For display concern and ingredients if available in user information
  useEffect(() => {
    if (plpConcernVariant) {
      setVariantNo(plpConcernVariant);
      getUserConIng();
    }
  }, [plpConcernVariant]);

  /* LOAD MORE - API CALL */
  useEffect(() => {
    if (inView && PLPSTATE.hasNextPage) {
      getMoreProducts();
    }
  }, [inView]);

  const getMatching = (a: any, b: any) => {
    return a.filter((element: any) => (b || []).includes(element));
  };

  // match PLP first product concern & ingredient data
  const setPLPConcernExpData = (userGuestDump: any = null) => {
    const productWithWidget: any = products?.filter((obj: any) => !obj.customParam);
    const product = productWithWidget?.[0] || [];
    const propductConcerns: [] = product?.concern?.split(",") || [];
    const productredients: [] = product?.ingredient?.split(",") || [];
    let [userConcern, userIngredient]: any[] = [];
    // if user logged in
    if (userProfile?.id) {
      const { attributes } = userProfile.meta || {};
      userConcern = attributes?.userGraphVc?.[getVendorCode()]?.concern || [];
      userIngredient = attributes?.userGraphVc?.[getVendorCode()]?.ingredients || [];
    } else {
      // if guest user
      if (userGuestDump) {
        userConcern = userGuestDump?.userConcern || [];
        userIngredient = userGuestDump?.userIngredient || [];
      }
    }
    let [matchConcerns, matchIngredients] = [[] as any, [] as any];
    matchConcerns = getMatching(propductConcerns, userConcern);
    matchIngredients = getMatching(productredients, userIngredient);
    const matchData = [...matchConcerns, ...matchIngredients];
    if (plpConcernVariant === "1") {
      if (matchData.length > 0) {
        (window as any).evars.evar125 = "True|True";
      } else {
        (window as any).evars.evar125 = "True|False";
      }
    } else {
      if (matchData.length > 0) {
        (window as any).evars.evar125 = "False|True";
      } else {
        (window as any).evars.evar125 = "False|False";
      }
    }
  };

  const getUserConIng = async () => {
    const consumerApi = new ConsumerAPI();
    let [userConcern, userIngredient]: any[] = [];
    if (!userProfile?.id) {
      const MCVID = getMCVID() as string;
      if (MCVID) {
        const { data: res } = await consumerApi.getGuestDump(MCVID);
        userConcern = res?.data?.data?.concern || [];
        userIngredient = res?.data?.data?.ingredients || [];
      }
      setPLPConcernExpData({ userConcern, userIngredient });
      USER_REDUCER.userGuestDump = { userConcern, userIngredient };
    } else {
      setPLPConcernExpData();
    }
  };

  /* Tracking the Active Category in ViewPort and Changing Based on that */
  const getCategoryInViewport = () => {};

  const productCell = (productData: any, index: number, callbackRef: any, productsWithTag: number) => {
    const showTags = productsWithTag > index && router.query.Slug?.[0] != "all" ? true : false;

    return (
      <div
        style={{
          height: "auto",
          width: "50%",
          left: index % 2 ? "50%" : "0",
        }}
        key={`${productData.productId}-${index}`}
        className="p-1"
        ref={callbackRef}
        role="listitem"
      >
        <PLPProdCell
          showTags={showTags}
          concernIngExpVariant={variantNo}
          isPLP
          product={productData}
          forceload={index < 2}
          url={productData.shareURL}
          productRef={(prodRef: HTMLDivElement) => {
            infinteCategoryRef[index] = {
              ref: prodRef,

              page: productData.page,
            };
          }}
          indexProd={index}
          variantPLPTag={variantPLPTag}
        />
      </div>
    );
  };

  if (products.length > 0) {
    let productsWithTag: number = t("tagsLimitPLP") || 4;
    return (
      <div className="w-full flex flex-wrap" role="list">
        {products.map((productData: any, index) => {
          const callBackRef = index > products.length - 3 ? ref : null;
          /* PRODUCT GRIDS */
          if (productData?.customParam) {
            if (variant === "1") {
              if (productsWithTag > index) {
                productsWithTag = productsWithTag + 1;
              }
              return (
                <div className="w-full overflow-hidden my-1" ref={callBackRef} key={index}>
                  <Widgets widgets={[productData]} />
                </div>
              );
            }
            return <div key={index} ref={callBackRef}></div>;
          }
          if (index > 1) {
            return (
              <LazyHydrate key={index} whenVisible>
                {productCell(productData, index, callBackRef, productsWithTag)}
              </LazyHydrate>
            );
          }
          return productCell(productData, index, callBackRef, productsWithTag);
        })}
        {PLPSTATE.hasNextPage && (
          <>
            {[...Array(4).keys()].map((_, index) => (
              <div className="w-1/2 pr-1 pt-1" key={index} role="listitem">
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: "100%",
                    height: "290px",
                    backgroundColor: "#FEFEFE",
                  }}
                >
                  <span className="animate-ping absolute h-3 w-3 inline-flex rounded-full bg-color1" />
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    );
  }

  return <FilterNoProducts t={t} price={PLPSTATE.priceBucket} />;
};

export default PLPProductsContainer;
