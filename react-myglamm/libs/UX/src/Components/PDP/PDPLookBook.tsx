import React, { useEffect, useState } from "react";

import Link from "next/link";
import { ErrorBoundary } from "react-error-boundary";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import ErrorFallback from "@libComponents/ErrorBoundary/ErrorFallBack";

import useTranslation from "@libHooks/useTranslation";

import { getLooksData } from "@productLib/pdp/HelperFunc";

import PDPLabel from "./PDPLabel";

const PDPLookBook = ({ id, icid }: any) => {
  const [Looks, setLooks] = useState<any[]>([]);

  const { t } = useTranslation();

  useEffect(() => {
    getLooksData(id)
      .then(data => setLooks(data))
      .catch(err => {
        console.error("In PDp Lookbook ", err);
      });
  }, [id]);

  return Looks?.length > 0 ? (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="GetLooks bg-white mt-2 pt-3">
        <PDPLabel label={t("getTheLook")} />
        <div
          className="ml-4 overflow-x-scroll overflow-y-hidden"
          style={{
            scrollBehavior: "smooth",
            scrollSnapType: "x mandatory",
            whiteSpace: "nowrap",
          }}
        >
          {Looks?.map((look: any, index: number) => {
            const customICID = !icid
              ? undefined
              : `${icid}_multiple-lookbook-carousel_get the look_1_${look.cms[0]?.content?.name.toLowerCase()}_${index + 1}`;

            const asset = look.assets.find((a: any) => a.type === "image");

            return (
              <div
                className="inline-block bg-white shadow mr-4 mb-4 w-40"
                style={{
                  height: "13rem",
                }}
                key={look.id}
              >
                <Link
                  href={!customICID ? look.urlManager.url : `${look.urlManager.url}?icid=${customICID}`}
                  className="w-full h-full rounded-sm"
                  aria-label={look.cms[0]?.content?.name}
                >
                  <ImageComponent
                    style={{
                      width: "10rem",
                      height: "10rem",
                      borderRadius: "0.2rem 0.2rem 0 0",
                      whiteSpace: "unset",
                    }}
                    src={asset?.imageUrl?.["400x400"]}
                    alt={asset?.name}
                  />
                  <p
                    className="text-sm p-1 flex uppercase"
                    style={{
                      whiteSpace: "normal",
                    }}
                  >
                    {look.cms[0]?.content?.name}
                  </p>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </ErrorBoundary>
  ) : null;
};

export default PDPLookBook;
