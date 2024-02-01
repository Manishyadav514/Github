import React from "react";

import { GiDownArrowIco } from "@libComponents/GlammIcons";

import Tickmark from "../../../public/svg/check-mark.svg";

export interface Row {
  type: number;
  fill: boolean;
  category: any;
  activeCat: any;
  selectedCats?: Array<string>;
  handleSelect: (arg1: any, arg2: boolean | string) => void;
}

const FilterRows = ({ type, fill, category, activeCat, selectedCats, handleSelect }: Row) => {
  const isParent = type === 1;
  const categoryIsActive = activeCat?.id === category.id;

  const selectedCategories = fill || selectedCats?.find((x: any) => x === category.slug);

  return (
    <div className="flex w-full items-center px-4">
      <Tickmark
        width="15px"
        height="15px"
        fill={fill ? "var(--color1)" : "#ebebeb"}
        onClick={(e: any) => {
          handleSelect(category, isParent || activeCat.slug);
          e.stopPropagation();
        }}
        className={`m-auto ${isParent ? "" : "ml-3"}`}
        role="img"
        aria-labelledby="right tick"
      />
      <button
        key={category.name}
        type="button"
        className={`${selectedCategories ? "font-semibold" : ""} flex items-center w-11/12 outline-none`}
        onClick={() => handleSelect(category, activeCat.slug)}
      >
        <div className="text-left mx-3 py-3 uppercase text-10">
          {category.name}
          <div className="text-gray-500">{category.productCount}</div>
        </div>
      </button>

      {isParent && (
        <GiDownArrowIco
          width="15px"
          height="15px"
          fill="#9ea5ab"
          className="m-auto"
          transform={categoryIsActive ? "rotate(180)" : "rotate(0)"}
          viewBox={categoryIsActive ? "-500 0 1000 1000" : "0 0 1000 1000"}
          role="img"
          aria-labelledby="down arrow"
        />
      )}
    </div>
  );
};

export default FilterRows;
