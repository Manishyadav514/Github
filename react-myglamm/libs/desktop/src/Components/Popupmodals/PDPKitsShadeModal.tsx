import React from "react";

import useTranslation from "@libHooks/useTranslation";

import { FEATURES } from "@libStore/valtio/FEATURES.store";

import PopupModal from "@libComponents/PopupModal/PopupModal";

interface KitProps {
  show: boolean;
  hide: () => void;
  shades: Array<any>;
  selectShade: (arg1: any) => void;
}

const PDPKitsShadeModal = ({ show, hide, shades, selectShade }: KitProps) => {
  const { t } = useTranslation();

  return (
    <PopupModal type="center-modal" show={show} onRequestClose={hide}>
      <section className="rounded-md shadow-md p-4 max-w-screen-lg relative bg-white">
        <button
          type="button"
          onClick={hide}
          style={{ boxShadow: "0 1px 0 #fff" }}
          className="text-5xl font-bold absolute right-4 top-2 opacity-20 text-black hover:opacity-50"
        >
          ×
        </button>

        <div className="pb-8">
          <div className="bg-white rounded-lg overflow-hidden mx-5">
            <div className="px-3 pt-4 pb-2 relative">
              <h3 className="font-semibold mb-2 pr-1 bg-no-repeat text-18 w-max bg-underline">{t("shadeSelection")}</h3>
              <p className="text-gray-600 text-sm">{`${t("customizeKitDesc1")} ${t("customizeKitDesc2")}`}</p>
            </div>
            {shades.length > 0 ? (
              /* Shades Grid Listing */
              <div className="flex flex-wrap p-4 overflow-hidden overflow-y-scroll shadow-inner" style={{ height: "380px" }}>
                {shades.map((prodShade, index) => {
                  const { attributes } = prodShade.cms?.[0] || {};
                  return (
                    <div
                      key={prodShade.id}
                      role="presentation"
                      style={{ height: "115px", width: "105px" }}
                      onClick={() => selectShade(FEATURES.enableComboV2 ? index : prodShade)}
                      className=" hover:underline transition-all text-gray-600 hover:text-rose-300 cursor-pointer border-l border-t border-gray-200 shadow rounded-lg flex items-center justify-center flex-col p-2 mr-5 mb-5 "
                    >
                      <img
                        alt={attributes?.shadeLabel}
                        src={attributes?.shadeThumbnail}
                        className="h-20 w-20 rounded hover:w-16 hover:h-16"
                      />
                      <p className="text-sm text-center m-auto overflow-hidden">{attributes.shadeLabel}</p>
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
        </div>
      </section>
    </PopupModal>
  );
};

export default PDPKitsShadeModal;
