import { getStaticUrl } from "@libUtils/getStaticUrl";
import React, { useState } from "react";

type CustomTabWithSwipeProps = {
  allElements: any[];
  noOfactiveElementsAtOneTime: number;
  showArrows: boolean;
  activeElement: string;
  callBackOnClickOfTab: (value: string) => void;
};

const CustomTabWithSwipe = ({
  allElements,
  noOfactiveElementsAtOneTime,
  showArrows,
  activeElement,
  callBackOnClickOfTab,
}: CustomTabWithSwipeProps) => {
  const [currentSlot, setCurrentSlot] = useState(allElements.slice(0, noOfactiveElementsAtOneTime));
  const [currentSection, setCurrentSection] = useState(noOfactiveElementsAtOneTime);
  const changeSlot = (startPoint: any) => {
    setCurrentSlot(allElements.slice(startPoint, startPoint + 5));
    callBackOnClickOfTab(allElements[startPoint]);
    setCurrentSection(startPoint + 5);
  };
  return (
    <div>
      <div className="flex justify-between items-center text-center bg-white  lg:hidden">
        {showArrows && (
          <div
            className={`${currentSection > noOfactiveElementsAtOneTime ? "cursor-pointer" : "pointer-events-none opacity-30"} `}
            onClick={() => changeSlot(currentSection - 10)}
          >
            <img src={getStaticUrl("/svg/simple-arrow.svg")} alt="arrow" className={`-rotate-90 transition`} />
          </div>
        )}
        <div className={`grid  grid-cols-5 w-full`}>
          {currentSlot.map(elem => {
            return (
              <div
                key={elem}
                className={`${
                  elem === activeElement ? " border-b-2 border-themePink text-themePink " : "text-gray-400"
                } text-xl cursor-pointer font-semibold mx-4 py-3`}
                onClick={() => callBackOnClickOfTab(elem)}
              >
                {elem}
              </div>
            );
          })}
        </div>
        {showArrows && (
          <div
            className={`${currentSection < allElements.length ? "cursor-pointer" : "pointer-events-none opacity-30"} `}
            onClick={() => changeSlot(currentSection)}
          >
            <img src={getStaticUrl("/svg/simple-arrow.svg")} alt="arrow" className={`rotate-90 transition`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomTabWithSwipe;
