import React from "react";

import useTranslation from "@libHooks/useTranslation";

import ImageComponent from "@libComponents/Common/LazyLoadImage";

import { getAppStoreRedirectionUrl } from "@libUtils/getAppStoreRedirectionUrl";

import MyglammLogo from "../../../public/mgp/svg/myglamm-logo.svg";
import YoutubeIcon from "../../../public/mgp/svg/youtube-black.svg";

const iconSet: any = {
  "fb-ico": {
    path: "M304 418l78 0 0 94-78 0c-60 0-109-49-109-110l0-47-63 0 0-95 63 0 0-251 93 0 0 251 78 0 16 95-94 0 0 47c0 8 7 16 16 16z",
  },
  "instagram-ico": {
    path: "M451 512l-390 0c-34 0-61-27-61-61l0-390c0-34 27-61 61-61l390 0c34 0 61 27 61 61l0 390c0 34-27 61-61 61z m-83-80c0 9 7 16 16 16l48 0c9 0 16-7 16-16l0-48c0-9-7-16-16-16l-48 0c-9 0-16 7-16 16z m-111-78c54 0 98-44 98-99 0-54-44-98-98-98-55 0-99 44-99 98 0 55 44 99 98 99 1 0 1 0 1 0z m207-290c0-9-7-16-16-16l-384 0c-9 0-16 7-16 16l0 240 64 0c-8-12-11-34-11-49 0-86 70-155 156-155 86 0 155 69 155 155 0 15-2 37-12 49l64 0z",
  },
  "twitter-ico": {
    path: "M481 395c-13-18-28-34-46-47 0-3 0-7 0-12 0-25-3-50-11-74-7-25-18-49-33-71-14-23-32-43-52-61-21-17-45-31-74-41-29-11-60-16-92-16-52 0-99 14-142 42 7-1 14-2 22-2 43 0 81 14 115 40-20 0-38 6-54 18-16 12-27 27-33 46 7-1 13-2 18-2 8 0 16 1 24 4-21 4-39 15-53 31-14 17-21 37-21 59l0 1c13-7 27-11 42-11-13 8-23 19-30 32-8 14-11 29-11 44 0 17 4 33 12 47 23-28 51-51 84-68 33-17 69-27 107-29-2 8-3 15-3 22 0 25 9 47 27 65 18 18 40 27 66 27 26 0 49-10 67-29 21 4 40 11 59 22-7-22-21-39-41-51 18 2 35 7 53 14z",
  },
};

const SocialIcon = ({
  socialLink,
  label,
  iconName,
  width = "32px",
  height = "34px",
  fill = "#00000",
  svgViewBox = "-150 0 1000 1000",
}: any) => (
  <div className=" h-12 py-5 px-2">
    <a href={socialLink} rel="noopener noreferrer" target="_blank" aria-label={label}>
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={svgViewBox}>
        <path transform="scale(1,-1) translate(0, -650)" fill={fill} d={iconSet[iconName].path} />
      </svg>
    </a>
  </div>
);

function TVCFooter() {
  const { t } = useTranslation();

  return (
    <footer className="relative inset-x-0 bottom-0  pt-8 flex flex-col justify-center" style={{ background: "#fdf4eb" }}>
      {/* ----Social Page Links---- */}

      <div className="flex justify-center pb-2 pt-2 items-center mx-auto">
        <a href="/about-us" className="text-xs" aria-label="About Us">
          About Us<span className="px-4">|</span>
        </a>
        <a href="/glamm-insider" className="text-xs" aria-label={t("myglammINSIDER")}>
          {t("myglammINSIDER")}
          <span className="px-4">|</span>
        </a>
        <a className="text-xs" href="/refer" aria-label={t("referEarn")}>
          {t("referEarn")}
        </a>
      </div>

      {/* ----Social Page Links---- */}

      <div className="flex justify-center pb-6 items-center  mx-auto">
        <SocialIcon
          socialLink="https://www.facebook.com/myGlamm/"
          label="Facebook Social Page"
          iconName="fb-ico"
          svgViewBox="-300 0 1000 1000"
        />

        <SocialIcon socialLink="https://www.instagram.com/myglamm/" label="Instagram Account Page" iconName="instagram-ico" />
        <div className="h-12 py-5 px-2">
          <a href="https://www.youtube.com/channel/UCrUxV9rsE-ivYxrgwkQhrjQ" aria-label="youtube">
            <YoutubeIcon width="27" height="30" viewBox="0 3 31 31" />
          </a>
        </div>
        <SocialIcon socialLink="https://twitter.com/MyGlamm" label="Twitter Account Page" iconName="twitter-ico" />

        <div className=" h-12 py-6 px-2">
          <a href="https://www.pinterest.com/myglamm/" aria-label="pinterest">
            <img
              src="https://files.myglamm.com/site-images/original/pinterest-logo.png"
              width="20"
              height="25"
              alt="pinterest"
            />
          </a>
        </div>
      </div>

      {/* ---- Mobile App Download Link---- */}
      <div className="flex justify-center pb-2">
        <h2 className="text-black text-center tracking-widest text-10" style={{ letterSpacing: "3.5px" }}>
          {t("downloadAppText")}
        </h2>
      </div>
      <div className="flex justify-center mb-4" role="list">
        <a
          href="https://play.google.com/store/apps/details?id=com.myglamm.ecommerce&hl=en"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12"
          role="listitem"
          aria-label="goole play"
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
          className="h-12"
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

      <div className="flex justify-center text-center pb-8">
        <div className="px-4 text-center">
          <span className="block">
            {" "}
            <img src="https://files.myglamm.com/site-images/original/rabit.png" alt="rabit" className="mb-2 h-6 inline-block" />
          </span>

          <p className="font-thin text-black mb-1  text-center text-11">{t("cruelty")}</p>
        </div>
        <div className="px-4 text-center">
          <span className="block">
            {" "}
            <img src="https://files.myglamm.com/site-images/original/truck.png" alt="truck" className="mb-2 h-6 inline-block" />
          </span>
          <p className="font-thin text-black mb-1  text-center text-11">{t("freeShip")}</p>
        </div>
        <div className="px-4 text-center">
          <span className="block">
            <img
              src="https://files.myglamm.com/site-images/original/gift-box.png"
              alt="gift-box"
              className="mb-2 h-6 inline-block"
            />
          </span>
          <p className="block text-11 mb-1 text-center text-black">{t("giftPurchase")}*</p>
        </div>
      </div>

      <div className="flex text-gray-700  text-center pb-8 justify-center items-center outline-none" aria-label="Home Page">
        <MyglammLogo />
      </div>

      <div className="bg-white pb-4 flex flex-col justify-center">
        <p className="text-2xl text-center pt-6 pb-4 semi-bold " style={{ color: "#aa7736" }}>
          Don't Miss Out!
        </p>
        <h2 className="text-black text-center  capitalize text-sm" style={{ letterSpacing: "2px" }}>
          Download the MyGlamm APP Now
        </h2>

        <div className="flex justify-center mt-2 mb-4">
          <a href="https://myglamm.in/e27jJl7Ihib" target="_blank" rel="noopener noreferrer" aria-label="Google Play">
            <ImageComponent
              delay={200}
              className="w-32"
              src="https://files.myglamm.com/site-images/original/play-store-white.jpg"
              alt="Google Play"
            />
          </a>
          <a href="https://myglamm.in/e27jJl7Ihib" target="_blank" rel="noopener noreferrer" aria-label="Appstore">
            <ImageComponent
              delay={200}
              alt="Appstore"
              className="w-32"
              src="https://files.myglamm.com/site-images/original/apple-store-white.jpg"
            />
          </a>
        </div>

        <p className="text-13 text-center text-black pb-2 px-6">
          {t("appInstallDescription") ||
            "For app-exclusive deals & discounts,virtual try-ons, makeup masterclasses from our Glamm MyglammXO Experts, & so much more!"}
        </p>
        <div className="flex justify-center items-center pb-4">
          <a
            href={getAppStoreRedirectionUrl("https://myglamm.in/EYoWab2BP0")}
            className="text-white  text-center font-semibold bg-black outline-none w-auto text-13 px-10 tracking-widest uppercase py-3 mt-5 mb-4"
            aria-label={t("installNow") || "INSTALL NOW"}
          >
            {t("installNow") || "INSTALL NOW"}
          </a>
        </div>
      </div>
    </footer>
  );
}

export default TVCFooter;
