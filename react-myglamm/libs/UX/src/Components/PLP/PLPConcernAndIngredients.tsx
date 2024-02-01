import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import { getVendorCode } from "@libUtils/getAPIParams";
import { SEARCH_STATE } from "@libStore/valtio/SEARCH.store";

const PLPConcernAndIngredients = ({ product, concernIngExpVariant }: any) => {
  const router = useRouter();
  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);
  const { userGuestDump } = useSelector((store: ValtioStore) => store.userReducer);

  // Product data sets
  const propductConcerns: [] = product?.concern?.split(",") || [];
  const productredients: [] = product?.ingredient?.split(",") || [];

  const [matchConcIng, setMatchConcIng] = useState<any>([]);

  const [matchConcerns, setMatchConcerns] = useState<any>([]);

  const getMatching = (a: any, b: any) => {
    return a?.filter((element: any) => b?.includes(element));
  };

  useEffect(() => {
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
    setMatchConcerns(matchConcerns);
    matchIngredients = getMatching(productredients, userIngredient);
    const matchData = [...matchConcerns, ...matchIngredients];
    setMatchConcIng(matchData);
  }, [userProfile, userGuestDump]);

  // onclick event for the concerns and ingredients
  const clickTag = (tagValue: any) => {
    const isConcern = matchConcerns.includes(tagValue?.value);
    SEARCH_STATE.products = [];
    SEARCH_STATE.input.value = tagValue?.value;
    SEARCH_STATE.searchType = isConcern ? "Selection | Concern Tag" : "Selection | Ingredients Tag";
    router.push(
      {
        pathname: "/search",
        query: {
          q: tagValue?.value,
        },
      },
      undefined,
      { shallow: false }
    );
  };

  const getCalculatedData = () => {
    let charcount = 0;
    let itemcount = 0;
    const matchData = matchConcIng.map((tag: any, index: any) => {
      if (tag && charcount <= 19) {
        if (!(charcount + tag.toString().length > 19)) {
          charcount += tag.toString().length;
          itemcount = itemcount + 1;
          return { displayValue: tag, value: tag };
        } else if (19 - charcount !== 0) {
          let tagObj = { displayValue: tag, value: tag };
          const isAppend = tag.toString().length <= 25;
          tagObj.displayValue =
            tag.substring(0, (index === 0 ? 25 : 19) - charcount) + `${index === 0 ? (!isAppend ? ".." : "") : ".."}`;
          charcount += tag.toString().length;
          itemcount = itemcount + 1;
          return tagObj;
        }
      } else {
        return null;
      }
    });
    return matchData.filter((obj: any) => obj);
  };

  if (concernIngExpVariant === "1") {
    let match = getCalculatedData();

    return (
      <>
        <div className="my-2.5 pr-5 relative flex items-center min-h-[16px]">
          {match.length > 0 && (
            <ul
              className={`flex list-none leading-none ${
                matchConcIng?.length !== match.length && match.length !== 3 && "overflow-hidden"
              } `}
            >
              {match?.map((tag: any) => {
                return (
                  <li
                    key={tag.value}
                    className="mr-1.5 pl-2.5 relative first:pl-0 first:before:hidden before:w-1 before:h-1 before:rounded-full before:bg-black before:absolute before:top-[7px] before:left-0"
                  >
                    <button
                      className="text-11 capitalize text-black underline leading-3	whitespace-nowrap	overflow-hidden text-ellipsis w-full	text-left"
                      onClick={() => clickTag(tag)}
                    >
                      {tag.displayValue}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {matchConcIng?.length !== match.length && (
            <div className="shrink-0 absolute right-0 w-3.5 h-3.5 bg-slate-200	rounded-full p-0.5 text-[8px] text-black">
              +{matchConcIng?.length - match.length}
            </div>
          )}
        </div>
      </>
    );
  }
  return null;
};

export default PLPConcernAndIngredients;
