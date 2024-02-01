import React from "react";

import { FilterRow } from "@typesLib/PLP";

import Tickmark from "../../../public/svg/check-mark.svg";

export interface Row {
  brand: FilterRow;
  handleSelect: (brand: FilterRow) => void;
}

const FilterBrandRow = ({ brand, handleSelect }: Row) => {
  const fill = brand.isSelected;

  return (
    <div className="flex w-full items-center px-4" onClick={() => handleSelect(brand)}>
      <Tickmark
        width="15px"
        height="15px"
        className="m-auto"
        fill={fill ? "var(--color1)" : "#ebebeb"}
        role="img"
        aria-labelledby="right tick"
      />

      <button type="button" className={`${fill ? "font-semibold" : ""} flex items-center w-11/12 outline-none`}>
        <div className="text-left mx-3 py-3 uppercase text-10">
          {brand.name}
          <div className="text-gray-500">{brand.productCount || 0}</div>
        </div>
      </button>
    </div>
  );
};

export default FilterBrandRow;
