import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import useTranslation from "@libHooks/useTranslation";

const ColorTabHeaders = ({ colorFamily, activeTab, onTabChange, tabIndex, setTabIndex }: any) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [shadesList, setShadesList] = useState<any>([]);
  const TABRef: Array<HTMLHeadingElement | null> = [];
  const container = useRef<any>(null);
  const [noArrow, setNoArrow] = useState(false);

  /* Moving Tabs to Center onChange of Active Tab - Categories */
  useEffect(() => {
    const shades = [...colorFamily.data];
    shades.unshift({ name: "ALL", productCount: 1 });
    setShadesList(shades);
  }, []);

  /* Moving Tabs to Center onChange of Active Tab - Categories */
  useEffect(() => {
    if (TABRef) {
      let leftVal = 0;
      const activeIndex = tabIndex + 1;
      const parentTab = TABRef[activeIndex]?.parentElement;

      /* Calculating the position of active tab from left */
      TABRef.slice(0, activeIndex).forEach((ele: HTMLHeadingElement | null) => {
        if (ele) {
          leftVal += ele.offsetWidth + parseInt(window.getComputedStyle(ele).marginRight, 10);
        }
      });

      /* In-Case of First 3 Tabs setting scroll-left to Zero */
      if (activeIndex < 4 && TABRef[1]?.parentElement) {
        TABRef[1].parentElement.scrollLeft = 0;
      } else if (parentTab && TABRef) {
        /* Calculating device and header width to get the center of tabs */
        leftVal -= (parentTab.offsetWidth - (TABRef[activeIndex]?.clientWidth || 0)) / 2;
        parentTab.scrollLeft = leftVal + 1;
      }
    }
  }, [tabIndex]);

  useEffect(() => {
    if (container.current) {
      const { scrollWidth } = container.current;
      const { innerWidth } = window;

      if (scrollWidth < innerWidth) {
        setNoArrow(false);
      } else if (scrollWidth > innerWidth) {
        setNoArrow(true);
      }
    }
  }, [container, tabIndex, shadesList]);

  const ShadeArrow = ({ prevArrow, nextArrow }: any) => {
    return (
      <div className="p-2">
        {noArrow && (
          <>
            {tabIndex !== 0 && prevArrow && (
              <div
                onClick={e => {
                  setTabIndex(tabIndex - 1);
                  onTabChange(tabIndex - 1, shadesList[tabIndex - 1]);
                }}
              >
                <img src="https://files.myglamm.com/site-images/original/prevArrow.png" alt="prev arrow" className="w-2.5" />
              </div>
            )}
            {tabIndex !== shadesList.length - 1 && nextArrow && (
              <div
                onClick={e => {
                  setTabIndex(tabIndex + 1);
                  onTabChange(tabIndex + 1, shadesList[tabIndex + 1]);
                }}
              >
                <img src="https://files.myglamm.com/site-images/original/nextArrow.png" alt="next arrow" className="w-2.5" />
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <section className="sticky z-50 mt-2 bg-white top-12 border-t border-b border-gray-200">
      <div className="flex justify-start  items-center relative px-1">
        <ShadeArrow prevArrow={true} />
        <div className="flex overflow-x-auto mx-1" ref={container}>
          {shadesList.map((color: any, index: number) => (
            <h3
              key={color.name}
              role="presentation"
              onClick={() => onTabChange(index, color)}
              className={`uppercase mx-4 flex-shrink-0 border-b-2  pt-3  pb-2 text-sm
              ${
                tabIndex === index
                  ? "border-b-2 border-color1 text-color1 font-semibold text-sm"
                  : "opacity-60  border-transparent"
              }`}
              ref={r => {
                TABRef[index + 1] = r;
              }}
            >
              {color.name}
            </h3>
          ))}
        </div>
        <ShadeArrow nextArrow={true} />
      </div>
    </section>
  );
};

export default ColorTabHeaders;
