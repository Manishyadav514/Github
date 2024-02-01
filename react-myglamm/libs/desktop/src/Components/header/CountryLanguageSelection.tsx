import React, { useEffect, useState } from "react";
import Link from "next/link";

import { ValtioStore } from "@typesLib/ValtioStore";

import { useSelector } from "@libHooks/useValtioSelector";

import { handleLanguageChange } from "@libUtils/layoutUtils";

import { SHOP } from "@libConstants/SHOP.constant";

import DownArrow from "../../../public/svg/down-arrowAddress.svg";

const CountryLanguageSelection = () => {
  const { countryConstants } = useSelector((store: ValtioStore) => store.constantReducer);

  const [showCountryList, setShowCountryList] = useState(false);

  const SELECTED_COUNTRY = countryConstants?.find(x => x.isSelected);
  const UN_SELECTED_LANGUAGE = SELECTED_COUNTRY?.languages?.find(x => !x.isSelected);

  useEffect(() => {
    const CLOSE_POPUP = (e: any) => {
      if (e.target.id !== "countrySelection") {
        setShowCountryList(false);
      }
    };

    window.addEventListener("click", CLOSE_POPUP);
    return () => window.removeEventListener("click", CLOSE_POPUP);
  }, []);

  if (!SELECTED_COUNTRY || !countryConstants) {
    return null;
  }

  return (
    <div className="flex items-center">
      {SHOP.ENABLE_COUNTRY_SELECTION && (
        <>
          <div
            id="countrySelection"
            onClick={() => setShowCountryList(!showCountryList)}
            className="flex items-center relative pr-3 text-sm font-semibold cursor-pointer z-10"
          >
            <img
              src={SELECTED_COUNTRY.countryFlag}
              alt={SELECTED_COUNTRY.selectionLabel}
              className="rounded-full w-6 h-6 mr-1"
            />
            {SELECTED_COUNTRY.selectionLabel}
            <DownArrow className="inset-y-0 my-auto right-0 absolute" />
            {/* List Of Other Countries Possible for the Vendor */}
            {showCountryList && (
              <ul className="bg-white shadow-lg absolute list-none top-10 border w-max">
                {countryConstants.map(country => (
                  <a href={`/${country.languages[country.languages.findIndex(x => x.default)].urlLang?.replace("en-in", "")}`}>
                    <li className="flex items-center font-normal h-10 hover:bg-gray-200 hover:font-semibold pl-3 pr-10 py-2">
                      <img src={country.countryFlag} alt={country.selectionLabel} className="rounded-full w-6 h-6 mr-2" />
                      <p className="w-full mb-0">{country.selectionLabel}</p>
                    </li>
                  </a>
                ))}
              </ul>
            )}
          </div>

          <div className="border-r h-8 border-gray-300 mx-6" />
        </>
      )}

      {/* SHOW ONLY IN CASE SECONDARY LANGUAGE PRESENT */}
      {UN_SELECTED_LANGUAGE && (
        <>
          <Link
            href="/"
            locale={UN_SELECTED_LANGUAGE.urlLang}
            className="text-sm font-semibold"
            onClick={() => handleLanguageChange(UN_SELECTED_LANGUAGE)}
          >
            {UN_SELECTED_LANGUAGE.translatedLabel}
          </Link>

          <div className="border-r h-8 border-gray-300 mx-6" />
        </>
      )}
    </div>
  );
};

export default CountryLanguageSelection;
