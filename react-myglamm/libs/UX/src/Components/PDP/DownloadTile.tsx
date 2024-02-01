import React from "react";
import useTranslation from "@libHooks/useTranslation";
import { GiDownloadIco } from "@libComponents/GlammIcons";
import { useRouter } from "next/router";
import { getAppStoreRedirectionUrl } from "@libUtils/getAppStoreRedirectionUrl";

const DownloadTile = ({ redirectionURL }: any) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { discountCode } = router.query;

  if (discountCode && redirectionURL) {
    return (
      <section className="w-full min-h-[100px] bg-white p-4 my-2">
        <div className="flex justify-between min-h-[72px] bg-color2 rounded border border-color1 border-dashed">
          <div className="flex items-center px-2.5 py-2">
            <p className="text-sm font-medium leading-4">
              {t("DonwloadAppMessage") || "Download the Myglamm App now and get more exciting offers and discounts!"}
            </p>
          </div>
          <div className="flex items-center">
            <button
              className="w-28 flex items-center justify-center bg-color1 mr-3 px-1 py-0.5"
              onClick={() => {
                return (location.href = getAppStoreRedirectionUrl(redirectionURL, t("trackingChannel") || "dsappinstall", discountCode));
              }}
            >
              <span className="mb-1.5">
                <GiDownloadIco width="15" height="15" fill="white" viewBox="0 0 650 650" />
              </span>
              <p className="text-white font-bold text-11 capitalize pl-1">download app</p>
            </button>
          </div>
        </div>
      </section>
    );
  } else {
    return null;
  }
};

export default DownloadTile;
