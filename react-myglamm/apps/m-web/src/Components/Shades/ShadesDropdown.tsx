import React, { useState, useEffect, memo } from "react";
import { GiDownArrowIco } from "@libComponents/GlammIcons";
import useTranslation from "@libHooks/useTranslation";

function ShadesDropdown({
  data,
  defaultValue,
  getDropdownData,
  reset,
  handleReset,
  dropDownA,
  dropDownB,
  handleDropDown,
  closeDropDown,
}: any) {
  const [currentValue, setCurrentValue] = useState(defaultValue || "Default");
  const { t } = useTranslation();

  useEffect(() => {
    if (reset) {
      setCurrentValue(defaultValue);
    }
  }, [reset]);

  const handleSelect = (event: any) => {
    setCurrentValue(event.target.innerText);
  };

  return (
    <div
      aria-hidden
      className={`w-1/2 flex justify-around tracking-tight border border-black py-1 pl-4 pr-0 ${data[0].colour && "border"}`}
      onClick={() => {
        handleReset();
      }}
    >
      <button
        type="button"
        data-value={defaultValue}
        onClick={handleDropDown}
        className="uppercase text-base font-semibold text-left"
      >
        {currentValue}
      </button>
      <GiDownArrowIco name="down-arrow-ico" width="2rem" className="inline-block mt-2" />

      {(defaultValue === t("selectColor") ? dropDownA : dropDownB) && (
        <ul
          className="list-none absolute z-40 h-auto w-1/2 shadow-lg overflow-y-scroll bg-white"
          style={data[0].colour ? { left: "0", maxHeight: "16rem" } : { right: "0", maxHeight: "16rem" }}
        >
          {data?.map((item: any) => (
            <li
              className="mt-1 text-center"
              key={item.id || item.name}
              style={
                item.colour
                  ? {
                      background: `${item.hashCode ? item.hashCode : "#541254"}`,
                    }
                  : { backgroundImage: `url(${item.image})` }
              }
            >
              <a
                aria-hidden
                onClick={event => {
                  handleSelect(event);
                  getDropdownData(event);
                  closeDropDown();
                }}
                className=" block text-white text-xs px-4 py-2 "
                aria-label={item.colour ? item.colour : item.name}
              >
                {item.colour ? item.colour : item.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default memo(ShadesDropdown);
