import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { PDPProd } from "@typesLib/PDP";

import { useSelector } from "@libHooks/useValtioSelector";

import { getMCVID } from "@libUtils/getMCVID";
import { getVendorCode } from "@libUtils/getAPIParams";

import { ValtioStore } from "@typesLib/ValtioStore";

import ConsumerAPI from "@libAPI/apis/ConsumerAPI";

import ConcernAndIngredientList from "./PDPConcernAndIngredientList";

const PDPConcernAndIngredients = ({ product, variant }: { product: PDPProd; variant: string }) => {
  const router = useRouter();

  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  // Product data sets
  const propductConcerns: string[] = product?.cms[0]?.attributes?.concern?.split(",") || [];
  const productredients: string[] = product?.cms[0]?.attributes?.ingredient?.split(",") || [];

  const [userConcerns, setUserConcerns] = useState([]);
  const [userIngredients, setUserIngredients] = useState([]);

  const getMatching = (a: any, b: any) => {
    return a.filter((element: any) => (b || []).includes(element));
  };

  useEffect(() => {
    const fetchData = async () => {
      const consumerApi = new ConsumerAPI();
      let [userConcern, userIngredient, matchConcerns, matchIngredients]: any[] = [];
      if (userProfile?.id) {
        const { attributes } = userProfile.meta || {};
        userConcern = attributes?.userGraphVc?.[getVendorCode()]?.concern || [];
        userIngredient = attributes?.userGraphVc?.[getVendorCode()]?.ingredients || [];
      } else {
        const MCVID = getMCVID() as string;
        if (MCVID) {
          const { data: res } = await consumerApi.getGuestDump(MCVID);
          userConcern = res?.data?.data?.concern || [];
          userIngredient = res?.data?.data?.ingredients || [];
        }
      }
      matchConcerns = getMatching(propductConcerns, userConcern);
      matchIngredients = getMatching(productredients, userIngredient);
      if (variant === "1") {
        if (matchConcerns.length > 0 || matchIngredients.length > 0) {
          (window as any).evars.evar125 = "True|True";
        } else {
          (window as any).evars.evar125 = "True|False";
        }
      } else {
        if (matchConcerns.length > 0 || matchIngredients.length > 0) {
          (window as any).evars.evar125 = "False|True";
        } else {
          (window as any).evars.evar125 = "False|False";
        }
      }
      setUserConcerns(matchConcerns);
      setUserIngredients(matchIngredients);
    };

    fetchData();
  }, [product.sku]);

  // onclick event for the concerns and ingredients
  const clickTag = (tagValue: string) => {
    (window as any).evars.evar18 = tagValue;
    router.push({
      pathname: "/search",
      query: { q: tagValue },
    });
  };

  if (variant === "1") {
    return (
      <>
        {(userIngredients.length > 0 || userConcerns.length > 0) && (
          <div className="my-2 bg-white flex py-1 px-1.5 pb-2.5">
            {userIngredients.length > 0 && (
              <ConcernAndIngredientList
                isConcern={false}
                ingredientAndConcern={userIngredients}
                clickTag={clickTag}
                title="Ingredients Inside"
              />
            )}
            {userConcerns.length > 0 && (
              <ConcernAndIngredientList
                isConcern={true}
                ingredientAndConcern={userConcerns}
                clickTag={clickTag}
                title="Concern/Applications"
              />
            )}
          </div>
        )}
      </>
    );
  }
  return null;
};

export default PDPConcernAndIngredients;
