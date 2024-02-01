import React from "react";

import { BabyNamesObject } from "@typesLib/babyNamesTypes";
import { KEYS_TO_BE_SHOWN } from "@libConstants/BabyNamesConstants";
import { getStaticUrl } from "@libUtils/getStaticUrl";

import { IS_DESKTOP } from "@libConstants/COMMON.constant";

type PropTypes = {
  babyNameData: BabyNamesObject;
};

const BabyNameMeaningWrapper = ({ babyNameData }: PropTypes) => {
  if (!babyNameData) {
    return <span />;
  }
  const babyNameValidKeys = Object.entries(babyNameData).filter(obj => KEYS_TO_BE_SHOWN.includes(obj?.[0]));
  return (
    <>
      <div className="rounded-lg bg-cyan-100 p-4 space-y-2 my-5 lg:w-[75%] lg:mx-auto">
        {babyNameValidKeys?.map(items => {
          return (
            <div className="grid grid-cols-12" key={items?.[0]}>
              <p className="col-span-4 capitalize">{items?.[0]}</p>
              <p className="col-span-1">:</p>
              <p className="col-span-7 capitalize">
                {items?.[1]?.length === 2 ? (Array.isArray(items?.[1]) ? items?.[1]?.join(", ") : items?.[1]) : items?.[1]}{" "}
              </p>
            </div>
          );
        })}
      </div>
      <div className="text-center lg:w-[20%] lg:mx-auto">
        <a
          title="Share on whatsapp"
          href={`https://api.whatsapp.com/send?text=Check out this name https://babychakra.com/baby-names/${babyNameData?.name.toLocaleLowerCase()}-meaning`}
        >
          <button
            type="button"
            className=" text-sm font-semibold  rounded bg-themePink text-white uppercase px-8 py-2 w-full flex items-center justify-center space-x-3"
          >
            <img
              src={IS_DESKTOP ? getStaticUrl("/svg/whatsapp-white.svg") : getStaticUrl("/images/bbc-g3/whatsapp-white.svg")}
              alt="whatsapp-icon"
            />
            <p className="font-semibold text-white"> Share Now</p>
          </button>
        </a>
      </div>
    </>
  );
};

export default BabyNameMeaningWrapper;
