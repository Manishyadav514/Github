import React from "react";
import ConcernIcon from "../../../public/svg/concern.svg";
import IngredientIcon from "../../../public/svg/ingredients-inside.svg";

const PDPConcernAndIngredientList = ({ isConcern, ingredientAndConcern, clickTag, title }: any) => {
  return (
    <div className="flex w-1/2 mt-1 mr-0.5 border-r border-solid border-white grow">
      <div className="mr-2">{isConcern ? <ConcernIcon /> : <IngredientIcon />}</div>
      <div>
        <h6 className="mb-2 mt-0.5 text-xs font-bold text-black capitalize">{title}</h6>
        {ingredientAndConcern?.map((data: any) => {
          return (
            <button
              key={data}
              className="mr-1.5 mb-1 px-1.5 py-1 pr-5 inline-block text-xs capitalize text-black bg-pdpConcern rounded-sm relative after:p-0.5 after:border after:border-t-0 after:border-l-0 after:border-solid after:border-black after:-rotate-45 after:absolute after:top-[9px] after:right-2.5"
              onClick={() => clickTag(data)}
            >
              {data}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PDPConcernAndIngredientList;
