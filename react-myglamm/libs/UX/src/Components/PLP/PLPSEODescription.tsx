import React, { Fragment, useEffect, useRef, useState } from "react";
import LazyHydrate from "react-lazy-hydration";
import useTranslation from "@libHooks/useTranslation";
import FaqSchema from "./FaqSchema";
import { IS_DESKTOP } from "@libConstants/COMMON.constant";
import styles from "@libStyles/css/sideNav.module.css";

interface PLPSeoProps {
  desc?: string | any;
  faq?: boolean;
  type?: string;
}

const PLPSeoDescritpion = ({ desc, faq, type = "faq" }: PLPSeoProps) => {
  const { t } = useTranslation();

  const readMoreDivRef = useRef<HTMLDivElement>(null);

  const [showReadMore, setShowReadMore] = useState<boolean | undefined>();

  useEffect(() => {
    const tabHtml = readMoreDivRef.current;
    if (tabHtml && tabHtml.scrollHeight <= 450) {
      setShowReadMore(undefined);
    } else {
      setShowReadMore(false);
    }
  }, [desc, readMoreDivRef.current]);

  if (desc) {
    return (
      <LazyHydrate whenVisible>
        <Fragment>
          {type === "seoFaq" ? (
            <>
              <div
                className={`p-2 mb-1 overflow-hidden contentStyle ${
                  IS_DESKTOP ? `${styles["webStyle"]}` : "prose prose-sm"
                } ${showReadMore !== false ? "h-full" : "h-[450px]"}`}
              >
                {desc?.map(({ question, answer }: any) => (
                  <div className=" text-[#212529]  leading-relaxed text-sm">
                    <h3 className="p-2 font-semibold text-sm">{`Q: ${question}`}</h3>
                    <div
                      className="px-2 prose prose-sm prose-a:text-[#337ab7]"
                      dangerouslySetInnerHTML={{ __html: `${answer}` }}
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div
              ref={readMoreDivRef}
              className={`p-4 mb-1 overflow-hidden ${
                IS_DESKTOP ? `${styles["webStyle"]}` : "prose prose-sm"
              } contentStyle ${showReadMore !== false ? "h-full" : "h-[450px]"}`}
              dangerouslySetInnerHTML={{ __html: desc }}
            />
          )}

          {faq && <FaqSchema data={desc} type={type} />}

          {showReadMore !== undefined && (
            <button
              type="button"
              className="font-extrabold text-sm pb-2 outline-none ml-4 text-[#a66262]"
              onClick={() => setShowReadMore(!showReadMore)}
            >
              {showReadMore ? t("readLess") : t("readMore")}
            </button>
          )}
          <style>{`
              .contentStyle a{
                text-decoration: underline;  
                color: blue;
              }
                `}</style>
        </Fragment>
      </LazyHydrate>
    );
  }
  return null;
};

export default PLPSeoDescritpion;
