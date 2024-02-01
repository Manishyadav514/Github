import clsx from "clsx";
import LazyHydrate from "react-lazy-hydration";
import React, { useCallback, useEffect, useState } from "react";

import { PDPProd } from "@typesLib/PDP";

import useTranslation from "@libHooks/useTranslation";

import { isShadeUIv2 } from "@libUtils/pdpUtils";

import PopupModal from "@libComponents/PopupModal/PopupModal";

import InfoIcon from "../../../public/svg/InfoIcon.svg";

const PDPCupSizeSelector = ({ product }: { product: PDPProd }) => {
  const { shades, id: currentProductId, productTag } = product;

  const [id, setId] = useState(currentProductId);
  const [show, setShow] = useState<boolean | undefined>();

  const { t } = useTranslation();

  const onClick = useCallback((id: string) => {
    try {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch {
      /* NO Response on Failure */
    }
    setId(id);
    return false;
  }, []);

  useEffect(() => {
    setId(currentProductId);
  }, [productTag]);

  const shadeUIData = isShadeUIv2(productTag, t("shadesUIv2") || []);
  const isDuo = shadeUIData?.moreData?.isDuo;

  return (
    <div className="my-2 px-4 py-3 bg-white">
      <div className="mb-4 text-13 font-bold">
        <p onClick={() => setShow(true)} className="flex items-center">
          <span>Select your size</span>
          <span className="px-1 text-color1 text-11">Cup Size Guide?</span>
          <span className="align-top">
            <InfoIcon />
          </span>
        </p>
      </div>
      <div className={isDuo ? "grid grid-cols-2 gap-4" : "grid grid-cols-3 gap-2"}>
        {Array.isArray(shades) &&
          shades.map((shade: any, i: number) => {
            const isPreOrder = shade?.productMeta?.isPreOrder || shade?.meta?.isPreOrder;
            const { shadeImage, shadeLabel } = shade?.cms[0]?.attributes || {};
            const isInStock = !isPreOrder && !shade.inStock;
            return (
              <LazyHydrate key={shade.id} whenIdle>
                <div>
                  <a role="presentation" onClick={() => onClick(shade?.id)}>
                    {isDuo ? (
                      <div
                        role="button"
                        aria-hidden="true"
                        className={clsx(
                          "border rounded-md h-20 p-0.5 text-center",
                          id === shade?.id ? "bg-color3 border-color1" : "border-color2",
                          isInStock && "opacity-30"
                        )}
                      >
                        <img
                          src={shadeUIData?.[shadeLabel?.toLowerCase()]?.img || shadeImage}
                          alt=""
                          className="mx-auto max-h-10 pt-1"
                        />
                        <p className="text-xs font-bold leading-tight pt-2">
                          {shadeUIData?.[shadeLabel?.toLowerCase()]?.subTitle || shadeLabel}
                        </p>
                      </div>
                    ) : (
                      <div
                        role="button"
                        aria-hidden="true"
                        className={clsx(
                          "border rounded-md h-20  p-0.5 text-center",
                          id === shade?.id ? "bg-color3 border-color1" : "border-color2",
                          isInStock && "opacity-30"
                        )}
                      >
                        <img src={shadeUIData?.[shadeLabel?.toLowerCase()]?.img || shadeImage} alt="" className="mx-auto h-9" />
                        <p className="text-xs font-bold leading-tight pt-1">{shadeLabel}</p>
                        <p className="text-gray-500 text-10">{shadeUIData?.[shadeLabel?.toLowerCase()]?.subTitle}</p>
                      </div>
                    )}
                  </a>
                  {isInStock && (
                    <p className="text-xxs text-color1 text-center uppercase font-bold mt-1 leading-normal">Sold Out</p>
                  )}
                </div>
              </LazyHydrate>
            );
          })}
      </div>

      {typeof show === "boolean" && (
        <>
          <PopupModal
            show={show}
            onRequestClose={() => {
              setShow(false);
            }}
            type="center-modal"
          >
            <div className="bg-white rounded-lg border border-color1 mx-4 overflow-hidden pb-2">
              <div className="h-11 bg-color3 flex items-center justify-center relative border-b border-color1">
                <p className="text-center text-base">
                  <span className="text-color1">Menstrual Cup</span>
                  <span> Size Guide</span>
                </p>
                <span
                  onClick={() => setShow(false)}
                  className="px-1 ml-1 text-base  font-bold leading-none absolute top-1.5 right-1.5"
                >
                  x
                </span>
              </div>
              <img src="https://files.myglamm.com/site-images/original/Cup-Size-Guide-X2-1.png" alt="Cup Size Guide" />
            </div>
          </PopupModal>
        </>
      )}
    </div>
  );
};

export default PDPCupSizeSelector;
