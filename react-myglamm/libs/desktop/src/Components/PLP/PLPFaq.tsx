import React, { useState, useEffect, useRef, RefObject } from "react";

import useTranslation from "@libHooks/useTranslation";

import FaqSchema from "@libComponents/PLP/FaqSchema";

const PLPFaq = ({ faq, type = "faq" }: any) => {
  const { t } = useTranslation();
  const faqRef: RefObject<HTMLDivElement> | undefined = useRef(null);

  const [showFaqMore, setShowFaqMore] = useState<boolean | undefined>(false);

  useEffect(() => {
    const faqHtml = faqRef.current as HTMLDivElement;

    if (faqHtml?.scrollHeight < 421) {
      setShowFaqMore(undefined);
    } else {
      setShowFaqMore(false);
    }
  }, []);

  return (
    <>
      {faq && (
        <>
          {type === "seoFaq" ? (
            <>
              <div
                className={`border-t border-[#ddd] py-[20px] px-[145px] mb-1 overflow-hidden ${
                  showFaqMore || showFaqMore === undefined ? "h-full" : "h-[200px]"
                }`}
              >
                {faq?.map(({ question, answer }: any) => (
                  <div className="pb-8 text-[#212529] text-base">
                    <p>
                      <strong>{`Q: `}</strong>
                      {question}
                    </p>
                    <p>
                      <strong>{`A: `}</strong>
                      {answer}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div
              style={{
                borderTop: "1px solid #ddd",
                padding: "20px 145px",
                lineHeight: "2",
                color: "black",
                height: showFaqMore || showFaqMore === undefined ? "100%" : "420px",
                overflow: "hidden",
              }}
              ref={faqRef}
              dangerouslySetInnerHTML={{
                __html: faq,
              }}
            />
          )}
          <FaqSchema data={faq} type={type} />
        </>
      )}
      {faq && showFaqMore !== undefined && (
        <div>
          <button
            type="button"
            className="font-extrabold pb-2"
            style={{
              color: "#fab6b5",
              outline: "none",
              backgroundColor: "transparent",
              padding: "10px 145px",
            }}
            onClick={() => {
              setShowFaqMore(!showFaqMore);
            }}
          >
            <strong>{showFaqMore ? t("readLess") : t("readMore")}</strong>
          </button>
        </div>
      )}
    </>
  );
};

export default PLPFaq;
