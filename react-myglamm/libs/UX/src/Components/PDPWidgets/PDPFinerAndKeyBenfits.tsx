import { decodeHtml } from "@libUtils/decodeHtml";
import { PDPProd } from "@typesLib/PDP";
import clsx from "clsx";
import React from "react";
import CircularProgressBar from "../PDP/PDPWidgetComponents/CircularProgressBar";

const PDPFinerAndKeyDetails = ({
  product,
  type,
}: {
  product: PDPProd;
  type: "finerDetails" | "keyBenefits" | "provenResults";
}) => {
  const details = product.cms?.[0]?.content?.[type];
  const isProverResult: boolean = type === "provenResults";

  if (!details?.description) {
    return null;
  }

  return (
    <section className={`px-4 py-5 bg-white border-themeGray ${type === "finerDetails" ? " border-b" : " border-b-4"}`}>
      <p className="font-bold text-15 m-0 pb-2"> {details?.title || type} </p>
      <div className={clsx(isProverResult && "bg-color2 p-3 rounded-md mt-1")}>
        <div
          className="prose prose-sm prose-img:m-0 prose-a:text-[#337ab7]"
          dangerouslySetInnerHTML={{ __html: decodeHtml(details?.description || details?.content, { stripSlash: true }) }}
        />
        {isProverResult && details?.items?.length > 0 ? (
          <div className="mt-5">
            {details?.items?.slice(0, 5).map((item: any, index: number) => {
              return (
                <div key={item.percentage} className="w-full flex justify-between items-center gap-3 pb-2">
                  <span className="w-14 h-14 pt-1">
                    <CircularProgressBar percentage={item.percentage} />
                  </span>
                  <div
                    className="prose prose-sm prose-a:text-[#337ab7] w-full line-clamp-3 h-12 leading-relaxed text-13 flex items-center"
                    dangerouslySetInnerHTML={{ __html: decodeHtml(item?.title, { stripSlash: true }) }}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <></>
        )}
      </div>
    </section>
  );
};

export default PDPFinerAndKeyDetails;
