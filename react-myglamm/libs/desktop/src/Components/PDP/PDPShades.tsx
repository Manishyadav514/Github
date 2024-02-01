import React, { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";

import { PDPProd } from "@typesLib/PDP";

import useTranslation from "@libHooks/useTranslation";

import ImageComponent from "@libComponents/Common/LazyLoadImage";

import DownArrow from "../../../../UX/public/svg/down-arrow.svg";

const PDPShades = ({ product }: { product: PDPProd }) => {
  const { t } = useTranslation();

  const shadesList = useRef([product, ...product.shades]);

  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedShade, setSelectedShade] = useState(shadesList?.current?.[0]);

  return (
    <Fragment>
      <div className="flex items-center">
        <strong className="text-gray-400">{t("shade")}</strong>
        <div className="border-r-2 border-gray-400 h-5 mx-3" />

        <section className="relative">
          <div
            onClick={() => setOpenDropdown(!openDropdown)}
            className="border border-black truncate h-7 w-48 flex items-center px-2 justify-between cursor-pointer"
          >
            {selectedShade.cms?.[0]?.attributes?.shadeLabel}

            <DownArrow className={`opacity-70 transition-all ${openDropdown ? "rotate-180" : ""}`} />
          </div>

          {openDropdown && (
            <div
              style={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,.32)" }}
              className="bg-white overflow-y-auto absolute top-8 left-0 text-xs w-80 max-h-56 z-10"
            >
              {shadesList.current.map(shade => (
                <Link
                  key={shade.id}
                  prefetch={false}
                  href={shade?.urlManager?.url || shade?.urlShortner?.slug}
                  onClick={() => {
                    setOpenDropdown(false);
                    setSelectedShade(shade);
                  }}
                  className={`w-full border-b border-gray-300 p-1.5 px-3 flex items-center hover:bg-gray-300 ${
                    selectedShade.id === shade.id ? "bg-gray-300" : ""
                  }`}
                >
                  <ImageComponent
                    width={24}
                    height={24}
                    src={shade.cms?.[0]?.attributes?.shadeImage}
                    alt={shade.cms?.[0]?.attributes?.shadeLabel}
                  />
                  &nbsp;&nbsp;&nbsp;{shade.cms?.[0]?.attributes?.shadeLabel}
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="flex flex-wrap mt-2">
        {shadesList.current.map(shade => (
          <Link
            key={shade.id}
            style={{ padding: "3px" }}
            href={shade?.urlManager?.url || shade?.urlShortner?.slug}
            className={`border mr-1 mb-1 relative overflow-hidden ${
              selectedShade.id === shade.id ? "border-black" : "border-transparent"
            }`}
          >
            {!shade.inStock && (
              <img
                width={48}
                height={48}
                alt="no stock"
                className="absolute inset-0 m-auto"
                src="https://files.myglamm.com/site-images/original/ico-no-shade.png"
              />
            )}
            <ImageComponent
              width={48}
              height={48}
              onClick={() => setSelectedShade(shade)}
              src={shade.cms?.[0]?.attributes?.shadeImage}
              alt={shade.cms?.[0]?.attributes?.shadeLabel}
            />
          </Link>
        ))}
      </section>
    </Fragment>
  );
};

export default PDPShades;
