import React, { Fragment } from "react";

import { ValtioStore } from "@typesLib/ValtioStore";

import { SHOP } from "@libConstants/SHOP.constant";

import { useSelector } from "@libHooks/useValtioSelector";

import Logo from "../header/Logo";

import YoutubeIcon from "../../../../../apps/m-web/public/orh/svg/youtube.svg";
import TwitterIcon from "../../../../../apps/m-web/public/orh/svg/twitter.svg";
import FacebookIcon from "../../../../../apps/m-web/public/orh/svg/facebook.svg";
import InstagramIcon from "../../../../../apps/m-web/public/orh/svg/instagram.svg";

const FooterORH = () => {
  const { footer } = useSelector((store: ValtioStore) => store.navReducer);

  const { FACEBOOK, INSTAGRAM, TWITTER, YOUTUBE } = SHOP.SOCIAL || {};

  const SOCIAL_ICONS = [
    { name: "facebook", href: FACEBOOK, ICON: FacebookIcon },
    { name: "instagram", href: INSTAGRAM, ICON: InstagramIcon },
    { name: "youtube", href: YOUTUBE, ICON: YoutubeIcon },
    { name: "twitter", href: TWITTER, ICON: TwitterIcon },
  ];

  return (
    <Fragment>
      <div className="pt-10 pb-5 flex justify-center">
        <Logo />
      </div>

      <div className="flex max-w-screen-xl mx-auto justify-center">
        {footer?.map(({ label, url, child }: any) => (
          <FooterMenu label={label} url={url} child={child} />
        ))}
      </div>

      <div className="mb-5 mx-auto flex justify-center flex-col items-center">
        <ul className="mt-1 mb-2 list-none px-10 flex items-center justify-between" role="list">
          {SOCIAL_ICONS.map(({ href, name, ICON }) => {
            if (!href) return null;

            return (
              <li role="listitem" key={name}>
                <a href={href} rel="nofollow" target="_blank" className="mx-4 block" aria-label={name}>
                  <ICON className="w-8 h-8" role="img" aria-labelledby={name} title={name} />
                </a>
              </li>
            );
          })}
        </ul>

        <p className="font-medium text-center" style={{ color: "#97b147" }}>
          FOLLOW US ON
        </p>
      </div>
      <div className="flex flex-col justify-center items-center pb-8 font-medium">
        <p style={{ color: "#a6aa8f" }}>Organic Harvest {new Date().getFullYear()} © All Rights Reserved</p>
      </div>
    </Fragment>
  );
};

const FooterMenu = ({ label, url, child }: { label: any; url: string; child: any }) => {
  return (
    <ul key={label} className="grow pr-4 last:pr-0 list-none">
      <li className="text-sm font-light mb-1.5">
        <a href={url} role="button" className="relative my-2.5 text-lg text-color3 font-semibold opacity-75 uppercase">
          {label}
        </a>
      </li>
      {child?.length > 1 &&
        child.map((childItems: { label: any; url: string; child?: any }) =>
          childItems?.child?.length >= 1 ? (
            <ul className="list-none">
              <li key={childItems.label} className="text-sm font-light mb-1.5">
                <a
                  href={childItems.url}
                  role="button"
                  className="relative my-2.5 text-sm font-semibold text-color3 opacity-75 uppercase"
                >
                  {childItems.label}
                </a>
              </li>
              {childItems.child.map((subChild: { label: any; url: string }) => (
                <li key={subChild.label} className="text-sm font-light mb-1.5">
                  <a href={subChild.url} style={{ color: "#97b147" }} className="hover:text-color3">
                    {subChild.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <li key={childItems.label} className="text-sm font-light mb-1.5">
              <a href={childItems.url} style={{ color: "#97b147" }} className="hover:text-color3">
                {childItems.label}
              </a>
            </li>
          )
        )}
    </ul>
  );
};

export default FooterORH;
