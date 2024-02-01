import React from "react";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import useTranslation from "@libHooks/useTranslation";
import { ValtioStore } from "@typesLib/ValtioStore";
import { useSelector } from "@libHooks/useValtioSelector";
import Link from "next/link";
import { GiGiftBoxIco, GiTruckIco, GiRabitIco } from "@libComponents/GlammIcons";
import YoutubeIcon from "../../../public/svg/youtube-icon.svg";
import SocialIcon from "@libComponents/Common/SocialIcon";
import { SHOP } from "@libConstants/SHOP.constant";
import { WEBSITE_NAME } from "@libConstants/SITE_NAME.constant";

const PDPFooterLinks = () => {
  const footerMenus = useSelector((store: ValtioStore) => store.navReducer.footer);
  const { t } = useTranslation();

  return (
    <div className="relative inset-x-0 bottom-0 bg-black py-4 flex flex-col justify-center px-2">
      <div className="mx-4 pt-4">
        {footerMenus &&
          footerMenus?.map((menu: any, index: number) => (
            <div key={index}>
              <Link
                href={menu.url}
                prefetch={false}
                className="text-lg font-extrabold text-white tracking-widest max-w-xs"
                aria-label={menu.label}
              >
                {menu.label}
              </Link>
              <div className="flex flex-wrap mb-6" role="list">
                {menu?.child.map((childItem: any, childIndex: number) => (
                  <div key={childIndex} className="flex py-1" role="listitem">
                    <Link href={childItem.url} aria-label={childItem.label}>
                      <p className="text-xs text-white">{childItem.label}</p>
                    </Link>
                    {childIndex + 1 !== menu?.child?.length && <p className="text-xs text-white mx-1">/</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* ----Social Page Links---- */}
      <div className="flex justify-center pb-6 items-center mb-2" role="list">
        <SocialIcon
          socialLink={SHOP.SOCIAL.FACEBOOK}
          label="Facebook Social Page"
          iconName="fb-ico"
          svgViewBox="-300 0 1000 1000"
        />
        {SHOP.SOCIAL.TWITTER && (
          <SocialIcon socialLink={SHOP.SOCIAL.TWITTER} label="Twitter Account Page" iconName="twitter-ico" />
        )}
        <SocialIcon socialLink={SHOP.SOCIAL.INSTAGRAM} label="Instagram Account Page" iconName="instagram-ico" />
        <div className="w-1/4 h-12 py-5 px-3" role="listitem">
          <a href={SHOP.SOCIAL.YOUTUBE} aria-label="youtube">
            <YoutubeIcon width="50" height="45" viewBox="0 3 31 31" />
          </a>
        </div>
      </div>

      <>
        {/* ---- Mobile App Download Link---- */}
        <div className="flex justify-center pb-6">
          <h2 className="text-white tex-center pt-3">{t("downloadAppText")}</h2>
        </div>
        <div className="flex justify-center mb-4" role="list">
          <a
            href="https://play.google.com/store/apps/details?id=com.myglamm.ecommerce&hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-end w-1/2 h-12 pl-2 pr-1 i-amphtml-sizer-intrinsic"
            role="listitem"
            aria-label="google play"
          >
            <ImageComponent
              delay={6000}
              className="h-10 w-auto"
              src="https://files.myglamm.com/site-images/original/ico-google-app.png"
              alt="Google Play"
            />
          </a>
          <a
            href="https://itunes.apple.com/in/app/myglamm-buy-makeup-products/id1282962703?mt=8"
            target="_blank"
            rel="noopener noreferrer"
            className="w-1/2 h-12 pl-2 pr-1 i-amphtml-sizer-intrinsic"
            role="listitem"
            aria-label="play store"
          >
            <ImageComponent
              delay={6000}
              alt="Appstore"
              className="h-10 w-auto"
              src="https://files.myglamm.com/site-images/original/ico-appstore.png"
            />
          </a>
        </div>

        {/* Footer Offer */}
        <div>
          <div className="flex px-2 pb-20" role="list">
            <div className="w-1/3 h-12" role="listitem">
              <GiRabitIco fill="white" height="100px" width="100px" viewBox="-350 0 1000 1000" />
              <p className="font-thin text-white pl-8 -mt-4 text-11">{t("cruelty")}</p>
            </div>
            <div className="w-1/3 h-12" role="listitem">
              <GiTruckIco fill="white" width="100px" height="100px" viewBox="-300 0 1000 1000" />
              <p className="font-thin text-white pl-6 -mt-4 text-11">{t("freeShip")}</p>
            </div>
            <div className="w-1/3 h-12" role="listitem">
              <GiGiftBoxIco width="100px" height="100px" viewBox="-350 0 1000 1000" fill="white" />
              <p className="font-thin text-center text-white pl-4 -mt-4 text-11">{t("giftPurchase")}*</p>
            </div>
          </div>
        </div>
      </>

      {/* ---- Copyright ----*/}
      <div className="px-4">
        <p className="py-1 flex justify-center text-xxs text-gray-200 border-t border-gray-600">
          &copy; {WEBSITE_NAME ? `Copyright ${WEBSITE_NAME}` : t("copyRight")} {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default PDPFooterLinks;
