import React, { useState } from "react";
import { useRouter } from "next/router";

import RawBtn from "@libComponents/CommonBBC/RawBtn";

import { ALPHABETS, LAST_TWO_ALPHABETS } from "@libConstants/BabyNamesConstants";

const AlphabetSelector = () => {
  const [selectedAlphabet, setSelectedAlphabet] = useState<string>("");
  const router = useRouter();
  return (
    <div className="bg-gradient-to-r from-blue-100 p-4 my-4 to-rose-200  lg:text-center lg:py-8">
      <div className="px-8 py-6 rounded-lg bg-white lg:w-[94%] lg:mx-auto">
        <p className="text-grey4  pb-4">Baby Names Starting With Alphabet</p>
        <div className="lg:flex items-center  lg:flex-col ">
          <div className="grid lg:grid lg:justify-center grid-cols-6 lg:grid-cols-12 gap-3 ">
            {ALPHABETS.map(alpha => (
              <span
                key={alpha}
                className={`${
                  alpha === selectedAlphabet ? " bg-rose-300 text-white" : "bg-rose-100"
                }  w-[37px] h-[37px] text-center py-2.5 rounded-md cursor-pointer`}
                onClick={() => {
                  if (alpha === selectedAlphabet) {
                    setSelectedAlphabet("");
                  } else {
                    setSelectedAlphabet(alpha);
                  }
                }}
              >
                {alpha}
              </span>
            ))}
          </div>
          <div className="flex justify-center mx-auto  py-3 space-x-4 lg:space-x-3">
            {LAST_TWO_ALPHABETS.map(alpha => (
              <span
                key={alpha}
                className={`${
                  alpha === selectedAlphabet ? " bg-rose-300 text-white" : "bg-rose-100"
                }  w-[37px] h-[37px] text-center py-2.5 rounded-md cursor-pointer`}
                onClick={() => setSelectedAlphabet(alpha)}
              >
                {alpha}
              </span>
            ))}
          </div>
        </div>

        <div className="mx-auto text-center pt-8">
          <RawBtn
            buttonName="Find Names"
            isNavigation
            customClassName={`${
              !selectedAlphabet ? "bg-gray-300 pointer-events-none" : "bg-themePink"
            } text-base font-bold  uppercase font-bold  py-2 px-8 rounded text-white w-full lg:w-[350px] mx-auto`}
            isButtonDisabled={!selectedAlphabet}
            navigationUrl={`/baby-names/${router?.query?.slug?.[0]}${`/starting-with-${selectedAlphabet.toLocaleLowerCase()}`}`}
          />
        </div>
      </div>
    </div>
  );
};

export default AlphabetSelector;
