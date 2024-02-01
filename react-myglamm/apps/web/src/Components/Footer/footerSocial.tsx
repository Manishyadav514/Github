import React from "react";

import useTranslation from "@libHooks/useTranslation";

import TwitterIcon from "../../../../../../libs/desktop/public/svg/twitter.svg";
import YoutubeIcon from "../../../../../../libs/desktop/public/svg/youtube.svg";
import InstagramIcon from "../../../../../../libs/desktop/public/svg/instagram.svg";
import PinterestIcon from "../../../../../../libs/desktop/public/svg/pinterest.svg";

const FooterSocial = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full mx-auto max-w-screen-xl">
      <div className="flex justify-between sub-offer">
        <form>
          <h5 className="w-max text-black text-base mt-5 mb-4 leading-none">SUBSCRIBE FOR MYGLAMM EMAILS</h5>
          <div className="form-group pull-left float-left mb-3.5">
            <div className="input-group table relative border-separate">
              <input
                type="email"
                placeholder={t("validationValidEmailId")}
                className="w-72 shadow-none	border border-solid border-black relative float-left bg-white px-3 font-extralight h-10"
              />

              <button type="button" className="h-10 px-3.5 text-sm text-white bg-ctaImg">
                <span className="hide-in-mob">{t("subscribe")}</span>
                <span className="show-for-mob">
                  <i className="icon icon-paper-plane" />
                </span>
              </button>

              <span className="error-msg mb-1 h-3	pt-2" />
            </div>
          </div>
          <ul className="float-left ml-9 my-2.5">
            <li className="float-left px-1.5">
              <label className="text-sm pr-3.5 border-r border-black font-normal">{t("stayConnected")}</label>
            </li>

            <li className="float-left px-1.5">
              <a href="https://www.instagram.com/myglamm/" target="_blank" rel="noreferrer">
                <InstagramIcon />
              </a>
            </li>

            <li className="float-left px-1.5">
              <a href="https://twitter.com/MyGlamm" target="_blank" rel="noreferrer">
                <TwitterIcon />
              </a>
            </li>

            <li className="float-left px-1.5">
              <a href="https://www.pinterest.com/myglamm/" target="_blank" rel="noreferrer">
                <PinterestIcon />
              </a>
            </li>

            <li className="float-left px-1.5">
              <a href="https://www.youtube.com/channel/UCrUxV9rsE-ivYxrgwkQhrjQ/featured" target="_blank" rel="noreferrer">
                <YoutubeIcon />
              </a>
            </li>
          </ul>
        </form>
        <div className="py-6">
          <p className="text-base text-center text-black mb-2.5">EXPERIENCE THE MYGLAMM MOBILE APP</p>
          <div className="appStores flex justify-between">
            <a href="https://apps.apple.com/in/app/myglamm-beauty-shopping-app/id1282962703" target="_blank" rel="noreferrer">
              <img src="https://files.myglamm.com/site-images/original/iosStore.png" alt="iosStore" className="w-28 h-10" />
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.myglamm.ecommerce" target="_blank" rel="noreferrer">
              <img src="https://files.myglamm.com/site-images/original/playStore.png" alt="playStore" className="w-28 h-10" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterSocial;
