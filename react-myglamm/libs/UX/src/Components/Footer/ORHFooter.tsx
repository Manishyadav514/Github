import React from "react";

import { SHOP } from "@libConstants/SHOP.constant";

import { getStaticUrl } from "@libUtils/getStaticUrl";

import useTranslation from "@libHooks/useTranslation";

import FooterMenu from "./FooterMenu";

import InstagramIcon from "../../../../../apps/m-web/public/orh/svg/instagram.svg";
import FacebookIcon from "../../../../../apps/m-web/public/orh/svg/facebook.svg";
import YoutubeIcon from "../../../../../apps/m-web/public/orh/svg/youtube.svg";
import TwitterIcon from "../../../../../apps/m-web/public/orh/svg/twitter.svg";
import PhoneIcon from "../../../../../apps/m-web/public/orh/svg/phone.svg";
import MailIcon from "../../../../../apps/m-web/public/orh/svg/mail.svg";

const ORHFooter = () => {
  const { t } = useTranslation();

  const { FACEBOOK, INSTAGRAM, TWITTER, YOUTUBE } = SHOP.SOCIAL || {};

  const SOCIAL_ICONS = [
    { name: "facebook", href: FACEBOOK, ICON: FacebookIcon },
    { name: "instagram", href: INSTAGRAM, ICON: InstagramIcon },
    { name: "youtube", href: YOUTUBE, ICON: YoutubeIcon },
    { name: "twitter", href: TWITTER, ICON: TwitterIcon },
  ];

  return (
    <>
      <div className=" bg-color2">
        <div className="flex justify-center items-center">
          <a href="https://www.organicharvest.in" aria-label="Organic Harvest">
            <img
              alt="Organic Harvest"
              style={{ height: "120px", width: "100px" }}
              src="https://files.myglamm.com/site-images/original/Transparent-background-1.png"
            />
          </a>
        </div>
        <ul className="mt-1 list-none px-10 py-0 flex items-center justify-around" role="list">
          {SOCIAL_ICONS.map(({ href, name, ICON }) => {
            if (!href) return null;

            return (
              <li role="listitem" key={name}>
                <a href={href} rel="nofollow" target="_blank" className="mr-2" aria-label={name}>
                  <ICON className="w-8 h-8" role="img" aria-labelledby={name} title={name} />
                </a>
              </li>
            );
          })}
        </ul>

        {SHOP.REGION === "INDIA" && (
          <>
            <p className="mt-8 mx-2 mb-3 text-sm font-extrabold text-black uppercase text-center">
              Download The Organic harvest APP Now
            </p>
            <ul className="mb-6 mx-5 list-none flex justify-center" role="list">
              <li className="mr-4 w-40" role="listitem">
                <a
                  href="https://play.google.com/store/apps/details?id=com.organicharvest&hl=en_IN&gl=US"
                  target="_blank"
                  className="flex items-center justify-center py-3 px-5 bg-[#16381F] rounded h-full"
                  aria-label="Playstore"
                >
                  <img src={getStaticUrl("/svg/playstore.svg")} alt="playstore" className="mr-4 inline-block" />
                  <span className="mt-0.5 text-xs font-bold tracking-widest uppercase text-white">Playstore</span>
                </a>
              </li>
              <li className="w-40" role="listitem">
                <a
                  href="https://apps.apple.com/in/app/organic-harvest-beauty-shop/id1625099447"
                  target="_blank"
                  className="flex items-center justify-center py-3 px-5 bg-[#16381F] rounded h-full"
                  aria-label="Appstore"
                >
                  <img src={getStaticUrl("/svg/appstore.svg")} alt="appstore" className="mr-4 inline-block" />
                  <span className="mt-1 text-xs font-bold tracking-widest uppercase text-white">Appstore</span>
                </a>
              </li>
            </ul>
          </>
        )}

        {/* <div className="mb-2 flex justify-center items-center">
        <img className="w-16 h-16 mx-2" src="https://files.organicharvest.in/site-images/original/ecoorganic.png" />
        <img className="w-16 h-16 mx-2" src="https://files.organicharvest.in/site-images/original/gmo.png" />
        <img className="w-16 h-16 mx-2" src="https://files.organicharvest.in/site-images/original/vegan.png" />
        <img className="w-16 h-16 mx-2" src="https://files.organicharvest.in/site-images/original/gluten.png" />
      </div> */}

        {/* change text color text-color1 to text-lime-950 for sufficient color contrast  */}
        <FooterMenu textStyle="text-lime-950" />
        <div className="flex justify-center items-center pt-12">
          {t("supportPhoneNo") && (
            <>
              <PhoneIcon role="img" aria-labelledby="phone" title="phone" />
              <a
                href="tel:+919211238795"
                className="mx-3 font-normal"
                // change text color #a6aa8f to #656857 for sufficient color contrast
                style={{ color: "#656857", fontFamily: "Montserrat" }}
                aria-label="phone"
              >
                +91-9211238795
              </a>
            </>
          )}

          <MailIcon role="img" aria-labelledby="email" title="email" />
          {/* change text color #a6aa8f to #656857 for sufficient color contrast */}
          <a
            href={`mailto:${t("supportEmailId")}`}
            className="ml-3 font-normal"
            style={{ color: "#656857" }}
            aria-label="email"
          >
            {t("supportEmailId")}
          </a>
        </div>
        {/* change text color #a6aa8f to #656857 for sufficient color contrast */}
        <p className="text-sm text-center pt-2 pb-5 font-normal" style={{ color: "#656857" }}>
          Organic Harvest {new Date().getFullYear()} © All Rights Reserved
        </p>
      </div>
    </>
  );
};

export default ORHFooter;
