import React from "react";

import useTranslation from "@libHooks/useTranslation";

import ImageComponent from "@libComponents/Common/LazyLoadImage";

import PopupModal from "./PopupModal";

import CloseIcon from "../../../public/svg/group-2.svg";
import { FEATURES } from "@libStore/valtio/FEATURES.store";

interface KitProps {
  show: boolean;
  hide: () => void;
  shades: Array<any>;
  selectShade: (arg1: any) => void;
}

const KitsShadeModal = ({ show, hide, shades, selectShade }: KitProps) => {
  const { t } = useTranslation();

  const headerStyle = { backgroundSize: "100% 62%" };

  return (
    <PopupModal show={show} onRequestClose={hide} type="center-modal">
      <div className="bg-white rounded-lg overflow-hidden mx-5">
        <div className="px-3 pt-4 pb-2 relative">
          <h3 style={headerStyle} className="font-semibold pb-2 pr-1 bg-no-repeat text-18 w-max bg-underline">
            {t("shadeSelection")}
          </h3>
          <p className="text-gray-600 text-sm">{`${t("customizeKitDesc1")} ${t("customizeKitDesc2")}`}</p>
          <CloseIcon className="absolute right-4 top-4" onClick={hide} />
        </div>

        {shades.length > 0 ? (
          /* Shades Grid Listing */
          <div className="flex flex-wrap pb-4 overflow-y-scroll h-auto max-h-75vh">
            {shades.map((prodShade, index) => {
              const { attributes } = prodShade.cms[0] || {};
              return (
                <div
                  key={prodShade.id}
                  role="presentation"
                  onClick={() => selectShade(FEATURES.enableComboV2 ? index : prodShade)}
                  className="border-l border-t border-gray-200 w-1/2 flex justify-between p-2.5 flex-col h-40 items-center"
                >
                  <ImageComponent
                    alt={attributes?.shadeLabel}
                    src={attributes?.shadeThumbnail}
                    className="rounded w-32 h-32 aspect-square"
                  />
                  <p className="text-gray-500 text-sm text-center mt-1">{attributes.shadeLabel}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="font-semibold py-10 px-14 border-t border-gray-200">
            <p className="text-18 text-center mb-10">
              {t("NoShdesText1")}
              <br />
              {t("NoShdesText2")}
            </p>
            <button
              type="button"
              onClick={hide}
              className="bg-ctaImg text-sm text-white outline-none font-semibold m-auto w-full h-10 rounded capitalize"
            >
              {t("close")?.toLowerCase()}
            </button>
          </div>
        )}
      </div>
    </PopupModal>
  );
};

export default KitsShadeModal;
