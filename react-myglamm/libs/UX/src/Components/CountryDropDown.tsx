import React, { useState, useEffect } from "react";
import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";

// import { FixedSizeList as List } from "react-window";

export type CountryData = {
  countryName: string;
  abbreviation: string;
  countryCode: string;
  sort: string | null;
};

export type CountryDropDownProps = {
  getData: (data: CountryData) => void;
};

const countryRow = ({ data, index, style }: any) => {
  const { countryData, handleCountryCodeChange } = data;
  return (
    <option style={style} onClick={handleCountryCodeChange} value={countryData[index].countryName} className="p-2">
      {countryData[index].countryLabel} + {countryData[index].countryCode}
    </option>
  );
};

const CountryDropDown = (props: CountryDropDownProps) => {
  const [toggle, setToggle] = useState(false);
  const [mobileCode, setMobileCode] = useState("IN +91");
  const { mobileNumber, countryData } = useSelector((store: ValtioStore) => ({
    mobileNumber: store.userReducer.userMobileNumber,
    countryData: store.constantReducer.countryCodes,
  }));

  useEffect(() => {
    if (countryData && mobileNumber.isdCode?.length > 0) {
      const getIndex = countryData.findIndex((country: CountryData) => country.countryCode === mobileNumber.isdCode);
      if (getIndex) {
        setMobileCode(`${countryData[getIndex].countryName}  +${countryData[getIndex].countryCode}`);
      }
    }
  }, [mobileNumber, countryData]);

  const handleCountryCodeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setToggle(!toggle);
    const index = countryData.findIndex((obj: CountryData) => obj.countryName === event.target.value);
    setMobileCode(`${countryData[index].countryName}  +${countryData[index].countryCode}`);
    props.getData(countryData[index]);
  };

  return (
    <button
      type="button"
      className="w-1/2 flex-grow bg-white relative rounded w-40 text-center px-2 outline-none"
      onClick={() => setToggle(!toggle)}
      onBlur={() => {
        if (toggle) {
          setToggle(!toggle);
        }
      }}
    >
      {mobileCode}

      <svg
        className="inline-block ml-2"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="25px"
        height="25px"
        viewBox="-100 -50 1000 1000"
      >
        <path transform="scale(1,-1) translate(0, -650)" fill="black" d="M500 346l-55 56-181-180-181 180-55-56 236-236z" />
      </svg>

      {/* {countryData && toggle && (
        <List
          itemData={{ countryData, handleCountryCodeChange }}
          height={300}
          width={300}
          itemCount={countryData.length}
          itemSize={25}
          className="w-full h-full bg-white mt-10 z-50"
          style={{ position: "absolute", top: "0" }}
        >
          {countryRow}
        </List>
      )} */}
    </button>
  );
};

export default CountryDropDown;
