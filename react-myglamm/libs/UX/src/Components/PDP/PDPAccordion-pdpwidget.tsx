import React, { useState, useRef, useEffect, RefObject } from "react";
import clsx from "clsx";

import useTranslation from "@libHooks/useTranslation";

import { decodeHtml } from "@libUtils/decodeHtml";

import FaqSchema from "@libComponents/PLP/FaqSchema";

import { PDPProd } from "@typesLib/PDP";

import { readMoreAdobeClickEvent, TabToggleAdobeClickEvent } from "@productLib/pdp/AnalyticsHelper";
import { PDP_INFO_TABS } from "@productLib/pdp/PDP.constant";
import format from "date-fns/format";

const PDPAccordion = ({ product }: { product: PDPProd }) => {
  const [showReadMore, setShowReadMore] = useState<boolean | undefined>(false);

  const myRef: RefObject<HTMLDivElement | null> = useRef(null);

  const { t } = useTranslation();

  const { content } = product.cms?.[0] || {};
  const { childCategoryName, subChildCategoryName } = product?.categories;
  const checkSeoFaq = content.seoFaq?.[0].question;

  const ACCORDION_TABS = PDP_INFO_TABS(t, checkSeoFaq).map((data, i) => ({ ...data, state: !i }));

  useEffect(() => {
    if ((myRef.current as HTMLDivElement)?.scrollHeight < 451) {
      setShowReadMore(undefined);
    }
  }, [product.id]);

  const toggleAccordion = (tabeLabel: string) => {
    const tabIndex = ACCORDION_TABS.findIndex(x => x.label === tabeLabel);

    const currentTabState = ACCORDION_TABS[tabIndex]?.state;
    if (typeof currentTabState === "boolean") {
      ACCORDION_TABS[tabIndex].state = !ACCORDION_TABS[tabIndex]?.state;

      return TabToggleAdobeClickEvent(product, tabeLabel, ACCORDION_TABS[tabIndex]?.state);
    }

    return console.error("Unidentified Tab Label passed");
  };

  return (
    <div className="text-sm PDPAccordion mt-2 cv-auto bg-white">
      {product?.cms?.[0]?.content?.whatIsIt && (
        <details className="border-b-2 border-gray-100" open>
          <summary
            className="flex justify-between items-center p-5 outline-none"
            onClick={() => toggleAccordion(t("whatItIs"))}
          >
            <h2 className="text-sm font-bold uppercase">{t("whatItIs")}</h2>
          </summary>
          <div className="px-5 pb-1">
            <div
              id="product"
              style={{
                color: "#212529",
                height: showReadMore || showReadMore === undefined ? "100%" : t("PDPAccordingHeight") || "450px",
              }}
              className={clsx(
                showReadMore ? "" : "line-clamp-10 leading-relaxed overflow-hidden mb-1",
                "prose prose-sm prose-a:text-[#337ab7]"
              )}
              ref={myRef as RefObject<HTMLDivElement>}
              dangerouslySetInnerHTML={{ __html: decodeHtml(content.whatIsIt, { stripSlash: true }) }}
            />
            {showReadMore !== undefined && (
              <button
                type="button"
                className="font-extrabold text-sm text-color1 outline-none"
                onClick={() => {
                  if (!showReadMore) {
                    readMoreAdobeClickEvent(childCategoryName, subChildCategoryName);
                  }
                  setShowReadMore(prevValue => !prevValue);
                }}
              >
                {showReadMore ? t("readLess") : t("readMore")}
              </button>
            )}
          </div>
        </details>
      )}

      {ACCORDION_TABS.filter(x => x.key !== "whatIsIt").map(accordion => {
        if ((content as any)[accordion.key] && accordion.label) {
          return (
            <details key={accordion.key} className="border-b-2 border-gray-100">
              <summary
                onClick={() => toggleAccordion(accordion.label)}
                className="flex justify-between items-center p-5 outline-none"
              >
                <h2 className="text-sm font-bold uppercase">{accordion.label}</h2>
              </summary>
              <div className="px-5 pb-1">
                {accordion.key !== "seoFaq" ? (
                  <div
                    style={{ color: "#212529" }}
                    className="p-2 leading-relaxed prose prose-sm prose-a:text-[#337ab7]"
                    dangerouslySetInnerHTML={{
                      __html: decodeHtml((content as any)[accordion.key]?.trim(), { stripSlash: true }),
                    }}
                  />
                ) : (
                  <>
                    {content[accordion.key]?.map(({ question, answer }: any) => (
                      <div>
                        <h3 className="text-md p-2 font-semibold">{`Q: ${question}`}</h3>
                        <div
                          className="p-2 leading-relaxed text-[#212529] prose prose-sm prose-a:text-[#337ab7]"
                          dangerouslySetInnerHTML={{ __html: answer }}
                        />
                      </div>
                    ))}
                  </>
                )}

                {(accordion.key === "faq" || accordion.key === "seoFaq") && (
                  <FaqSchema data={checkSeoFaq ? content.seoFaq : content.faq} type={`${checkSeoFaq ? "seoFaq" : "faq"}`} />
                )}
              </div>
            </details>
          );
        }

        return null;
      })}
      {product?.productMeta?.expiryDate && (
        <details className="border-b-2 border-gray-100">
          <summary
            className="flex justify-between items-center p-5 outline-none"
            onClick={() => toggleAccordion(t("info") || "info")}
          >
            <h2 className="text-sm font-bold uppercase">{t("expiryDate") || "info"}</h2>
          </summary>
          <div className="px-5 pb-1">
            <div
              id="product"
              className={clsx(
                showReadMore ? "" : "p-2 line-clamp-10 leading-relaxed overflow-hidden mb-1",
                "prose prose-sm prose-a:text-[#337ab7]"
              )}
              ref={myRef as RefObject<HTMLDivElement>}
            >
              <p className="flex flex-row gap-4">
                <strong>Expiry Date</strong>
                {format(new Date(product.productMeta.expiryDate), "do MMM yyyy")}
              </p>
            </div>
          </div>
        </details>
      )}
    </div>
  );
};

export default PDPAccordion;
