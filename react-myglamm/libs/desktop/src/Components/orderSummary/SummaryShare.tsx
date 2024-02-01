import React from "react";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";

import { showSuccess } from "@libUtils/showToaster";

const SummaryShare = () => {
  const { t } = useTranslation();

  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  const handleCopy = () => {
    navigator.clipboard.writeText(userProfile?.shareUrl || "");
    showSuccess("Copied");
  };

  return (
    <div
      style={{
        backgroundSize: "100%",
        background: "url(https://files.myglamm.com/site-images/original/order-confirm-makeup.jpg) no-repeat 0",
      }}
      className="px-5 py-6 border border-gray-200 rounded shadow mb-6 mt-4 text-center w-1/2"
    >
      <h3 className="text-2xl font-bold mt-2 mb-8">{t("shareFreeMakeup")}</h3>

      <p className="text-sm uppercase mb-5">{t("startReferring")}</p>

      <div className="flex items-center justify-center">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?quote=You+know+we+can+never+have+enough+makeup%21%21+Have+you+heard+about+these+European+makeup+products+from+MyGlamm%3F+I+am+obsessed+with+their+brand+new+Spotlight+Strobing+Liquid.+You+must+try+their+products.+Click+here+to+check+them+out${encodeURIComponent(
            userProfile?.shareUrl || ""
          )}&amp&u=${encodeURIComponent(userProfile?.shareUrl || "")}`}
          target="_blank"
          title="Facebook"
          rel="noreferrer"
          style={{ backgroundColor: "#507cc0" }}
          className="cleavertap rounded-full w-14 h-14 flex items-center justify-center p-1 mr-5"
        >
          <img
            alt="facebook"
            className="h-9"
            src="https://files.myglamm.com/site-images/original/pngfindcom-thomas-the-dank-engine-6738833.png"
          />
        </a>

        <a
          href={`https://twitter.com/home?status=Have+you+heard+about+these+European+makeup+products+from+MyGlamm%3FYou+must+try+their+products.+check+them+out+here%3A${encodeURIComponent(
            userProfile?.shareUrl || ""
          )}`}
          title="Twitter"
          target="_blank"
          rel="noreferrer"
          style={{ backgroundColor: "#64ccf1" }}
          className="cleavertap rounded-full w-14 h-14 flex items-center justify-center p-1 mr-5"
        >
          <img alt="facebook" className="h-9" src="https://files.myglamm.com/site-images/original/twitter-48.png" />
        </a>

        <a onClick={handleCopy} className="cleavertap rounded-full w-14 h-14 flex items-center justify-center p-1 bg-black">
          <img alt="facebook" className="h-8" src="https://files.myglamm.com/site-images/original/icons8-link-52.png" />
        </a>
      </div>
    </div>
  );
};

export default SummaryShare;
