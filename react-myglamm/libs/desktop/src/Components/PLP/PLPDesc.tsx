import React, { useEffect, useState, useRef, RefObject } from "react";
import { useRouter } from "next/router";

import useTranslation from "@libHooks/useTranslation";

const PLPDesc = ({ pageDescription }: any) => {
  const { t } = useTranslation();
  const router = useRouter();
  const myRef: RefObject<HTMLDivElement> | undefined = useRef(null);

  const [showReadMore, setShowReadMore] = useState<boolean | undefined>(false);
  const [showMetaFooter, setShowMetaFooter] = useState(true);

  useEffect(() => {
    const tabHtml = myRef.current as HTMLDivElement;
    if (tabHtml?.scrollHeight < 421) {
      setShowReadMore(undefined);
    } else {
      setShowReadMore(false);
    }
  }, []);

  useEffect(() => {
    if (router.asPath.includes("page")) {
      const pageNo = router.asPath.split("page=")[1];
      if (+pageNo > 1) {
        setShowMetaFooter(false);
      }
    }
  }, [router]);

  return (
    <>
      {showMetaFooter && (
        <>
          {pageDescription && (
            <div
              style={{
                borderTop: "1px solid #ddd",
                padding: "20px 145px",
                lineHeight: "2",
                color: "black",
                height: showReadMore || showReadMore === undefined ? "100%" : "420px",
                overflow: "hidden",
              }}
              className="footerStyle"
              ref={myRef}
              dangerouslySetInnerHTML={{
                __html: pageDescription,
              }}
            />
          )}
          {pageDescription && showReadMore !== undefined && (
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
                  setShowReadMore(!showReadMore);
                }}
              >
                <strong>{showReadMore ? t("readLess") : t("readMore")}</strong>
              </button>
            </div>
          )}
        </>
      )}
      <style>
        {`
        .footerStyle ul,
        .footerStyle li,
        .footerStyle ol {
          list-style: inside;
        }
        .footerStyle a {
          text-decoration: underline;
          color: blue;
        }
        .footerStyle table,
        .footerStyle th,
        .footerStyle td {
          border: 1px solid;
          padding:4px;
          width: auto !important;
        }
        `}
      </style>
    </>
  );
};

export default PLPDesc;
