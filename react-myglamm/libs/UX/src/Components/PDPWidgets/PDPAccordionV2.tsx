import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";

import useTranslation from "@libHooks/useTranslation";

import { decodeHtml } from "@libUtils/decodeHtml";

import { PDPProd } from "@typesLib/PDP";

import { readMoreAdobeClickEvent, TabToggleAdobeClickEvent } from "@productLib/pdp/AnalyticsHelper";

const PDPAccordionV2 = ({ product }: { product: PDPProd }) => {
  const [showReadMore, setShowReadMore] = useState<boolean>(false);

  const activeLineRef = useRef<HTMLSpanElement | null>(null);
  const productDetailsRef = useRef<HTMLSelectElement | null>(null);

  const [active, setActive] = useState<number>(0);

  const { t } = useTranslation();

  const { content } = product.cms?.[0] || {};

  const { childCategoryName, subChildCategoryName } = product?.categories;

  const details = content?.productDetails?.items?.filter((x: any) => x?.description);

  useEffect(() => {
    setShowReadMore(false);
    const productDetailElement = document.getElementById(`productDetails-${active}`) as HTMLDivElement;
    if (productDetailElement && productDetailElement.scrollHeight > 451) {
      productDetailElement.style.height = "450px";
      productDetailElement.classList.add("line-clamp-10", "leading-relaxed", "overflow-hidden", "mb-1");
      (document.getElementById(`readMore-${active}`) as HTMLButtonElement).style.display = "block";
    }
  }, [active]);

  const onTabChange = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number, tabLabel: string) => {
    if (activeLineRef?.current) {
      activeLineRef.current.style.width = `${e.currentTarget.offsetWidth}px`;
      activeLineRef.current.style.left = `${e.currentTarget.offsetLeft}px`;
    }
    setActive(index);
    TabToggleAdobeClickEvent(product, tabLabel, false);
  };

  const handleReadMore = () => {
    if (!showReadMore) {
      readMoreAdobeClickEvent(childCategoryName, subChildCategoryName);
    }
    setShowReadMore(!showReadMore);
    const productDetailElement = document.getElementById(`productDetails-${active}`) as HTMLDivElement;
    productDetailElement.style.height = showReadMore ? "450px" : "auto";
    if (productDetailsRef?.current && showReadMore) {
      productDetailsRef?.current.scrollIntoView({
        behavior: "smooth",
        block: "start", // Scroll to the top of the element
      });
    }
  };

  useEffect(() => {
    if (details?.length === 2) {
      if (activeLineRef?.current) {
        const activeElement = document.getElementById(`activeButtonId-0`) as HTMLButtonElement;
        activeLineRef.current.style.width = `${activeElement.offsetWidth}px`;
        activeLineRef.current.style.left = `${activeElement.offsetLeft}px`;
      }
    }
  }, []);

  if (!details?.length) {
    return null;
  }

  return (
    <>
      <section className="px-4 pt-5 bg-white border-b-4 border-themeGray" ref={productDetailsRef}>
        <p className="font-bold text-15 m-0"> {details?.title || "Product Details"} </p>
        <div className="relative">
          <div
            className={clsx(
              "mt-3 w-full border-b border-gray-200 pb-2 flex justify-between",
              details?.length === 2 && "justify-evenly"
            )}
          >
            {details?.map((data: any, index: number) => (
              <button
                key={data?.title + index}
                id={`activeButtonId-${index}`}
                className={clsx(
                  "relative z-10 capitalize font-bold rounded-md  text-sm cursor-pointer select-none focus:outline-none overflow-hidden text-center line-clamp-1 w-24",
                  active === index ? "active text-color1" : ""
                )}
                onClick={e => {
                  onTabChange(e, index, data?.title || "");
                }}
              >
                {data?.title}
              </button>
            ))}
          </div>
          <span
            ref={activeLineRef}
            className="bg-color1 absolute top-7 left-0  w-24 rounded-md transition-all duration-300 ease-in-out"
            style={{ height: "1px" }}
          />
          {details?.map((detail: any, index: number) => {
            return (
              <div
                key={detail?.title}
                className={`${active === index ? "block" : "hidden"} ease-in-out transition-all duration-300`}
              >
                <div
                  id={`productDetails-${index}`}
                  className="prose prose-sm prose-a:text-[#337ab7] pt-3.5 pb-5 prose-img:m-0 overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: decodeHtml(detail?.description || detail?.content, { stripSlash: true }) }}
                />
                <button
                  type="button"
                  id={`readMore-${index}`}
                  className="font-bold w-full text-sm text-color1 text-center outline-none hidden h-14 uppercase -mt-5  relative"
                  onClick={handleReadMore}
                  style={{ backgroundImage: "linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, #FFF 100%)" }}
                >
                  {showReadMore ? t("readLess") : t("readMore")}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default PDPAccordionV2;
