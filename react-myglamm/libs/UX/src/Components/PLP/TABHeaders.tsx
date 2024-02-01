import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { ArrayOfTABS } from "@typesLib/PLP";
import useTranslation from "@libHooks/useTranslation";

interface TABProps {
  activeTab: number;
  navTabs: ArrayOfTABS;
  onTabChange: (arg: number) => void;
}

const TABHeaders = ({ navTabs, activeTab, onTabChange }: TABProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  const [activeSlug] = router.query.Slug || [];
  const TABRef: Array<HTMLAnchorElement | HTMLHeadElement | null> = [];

  /* Moving Tabs to Center onChange of Active Tab - Categories */
  useEffect(() => {
    if (TABRef) {
      let leftVal = 0;
      const activeIndex = activeTab + 1;
      const parentTab = TABRef[activeIndex]?.parentElement;

      /* Calculating the position of active tab from left */
      TABRef.slice(0, activeIndex).forEach((ele: HTMLAnchorElement | HTMLHeadElement | null) => {
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
        parentTab.scrollLeft = leftVal;
      }
    }
  }, [activeTab]);

  return (
    <div className="overflow-y-hidden flex flex-nowrap overflow-x-auto mx-3.5 pt-2 pb-2">
      {activeSlug === "all" && (
        <h3
          className="capitalize mr-5 flex-shrink-0 border-b-4 border-color1 text-13 font-semibold"
          ref={r => {
            TABRef[0] = r;
          }}
        >
          {t("all")}
        </h3>
      )}

      {navTabs.map((category: any, index: number) => (
        <a
          href={navTabs[index].url}
          key={category.label}
          role="presentation"
          onClick={e => {
            onTabChange(index);
            e.preventDefault();
          }}
          className={`capitalize mr-5 flex-shrink-0 border-b-3 mb-1 ${
            activeTab === index && activeSlug !== "all"
              ? "border-color1 text-xs font-semibold"
              : "opacity-60 text-xs border-transparent"
          }`}
          ref={r => {
            TABRef[index + 1] = r;
          }}
          aria-label={category.label}
        >
          {category.label}
        </a>
      ))}
    </div>
  );
};

export default TABHeaders;
