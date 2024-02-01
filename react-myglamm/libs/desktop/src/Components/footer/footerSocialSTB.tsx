import React from "react";

import useTranslation from "@libHooks/useTranslation";

import YoutubeIcon from "../../../public/svg/youtube.svg";
import FacebookIcon from "../../../public/svg/facebook.svg";
import InstagramIcon from "../../../public/svg/instagram.svg";

const FooterSocial = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full mx-auto flex justify-center gap-44 items-center pb-8 pt-4">
      <ul className="flex items-center justify-between mb-0">
        <li className="px-1.5">
          <label className="text-sm pr-3.5 border-r border-black font-normal">{t("stayConnected")}</label>
        </li>
        <li className="px-1.5">
          <a href="https://www.facebook.com/stbotanicaindia/" target="_blank" rel="noreferrer">
            <FacebookIcon />
          </a>
        </li>

        <li className="px-1.5">
          <a href="https://www.instagram.com/stbotanica.india/" target="_blank" rel="noreferrer">
            <InstagramIcon />
          </a>
        </li>

        <li className="px-1.5">
          <a href="https://www.youtube.com/c/StBotanica/videos" target="_blank" rel="noreferrer">
            <YoutubeIcon />
          </a>
        </li>
      </ul>
      <div>
        <p className="text-base text-center text-black mb-2.5">EXPERIENCE THE ST.BOTANICA MOBILE APP</p>
        <div className="appStores flex justify-between">
          <a href="https://apps.apple.com/in/app/st-botanica/id1616719164" target="_blank" rel="noreferrer">
            <img src="https://files.myglamm.com/site-images/original/iosStore.png" alt="iosStore" className="w-28 h-10" />
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.stbotanica.ecommerce" target="_blank" rel="noreferrer">
            <img src="https://files.myglamm.com/site-images/original/playStore.png" alt="playStore" className="w-28 h-10" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default FooterSocial;
