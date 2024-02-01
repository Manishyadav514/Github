import React from "react";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";

import Amex from "../../../public/svg/srnamex.svg";
import Visa from "../../../public/svg/srnvisa.svg";
import Rupay from "../../../public/svg/srnrupay.svg";
import MasterCard from "../../../public/svg/srnmastercard.svg";
import FacebookIcon from "../../../public/svg/srnfacebook.svg";
import TwitterIcon from "../../../public/svg/srntwitter.svg";
import InstagramIcon from "../../../public/svg/srninstagram.svg";
import YoutubeIcon from "../../../public/svg/srnyoutube.svg";
import LinkedInIcon from "../../../public/svg/srnlinkedin.svg";

const menuArray1 = [
  { name: "PERIOD CARE", url: "/" },
  { name: "INTIMATE CARE", url: "/" },
  { name: "TOILET CARE", url: "/" },
  { name: "PERSONAL CARE", url: "/" },
  { name: "SEXUAL WELLNESS", url: "/" },
  { name: "CONCERNS", url: "/" },
];

const FooterSRN = () => {
  const { t } = useTranslation();

  const { footer } = useSelector((store: ValtioStore) => store.navReducer);

  return (
    <>
      <div className="max-w-screen-xl mx-auto pt-5">
        <div className="flex flex-wrap justify-evenly justify-items-center items-start mt-10 3b-5 gap-2">
          {!footer && (
            <div className="text-sm flex flex-col">
              <p className="font-semibold mb-3">OUR COLLECTIONS</p>
              {menuArray1.map(mn => {
                return (
                  <a href={mn.url} key={mn.name} className="hover:text-color1 active:text-color1 focus:text-color1 pb-2.5">
                    {mn.name.toUpperCase()}
                  </a>
                );
              })}
            </div>
          )}
          {footer?.map((item: any) => (
            <div className="text-sm flex flex-col" key={item.label}>
              <a href={item.url}>
                <p className="font-semibold mb-3">{item?.label?.toUpperCase()}</p>
              </a>
              {item.child?.length > 1 &&
                item.child.map((childItems: any) => (
                  <div key={childItems.label} className="pb-2.5 max-w-[180px] ">
                    <a href={childItems?.url} className="hover:text-color1 active:text-color1 focus:text-color1 line-clamp-1">
                      {childItems?.label?.toUpperCase()}
                    </a>
                  </div>
                ))}
            </div>
          ))}
          <div className="flex flex-col text-sm">
            <p className="font-semibold mb-3 uppercase">{t("information") || "INFORMATION"}</p>
            <div className="flex flex-wrap justify-start items-start">
              <p className="font-bold">{t("email")}:</p>
              <p className="ml-2">{t("supportEmailId")}</p>
            </div>
            <div className="flex flex-wrap justify-start items-start">
              <p className="font-bold">{t("feedbackQueries")}</p>
              <p className="ml-2">{t("makeupHotline")}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-between items-center mt-10 pb-12">
          <p className="font-medium">© {new Date().getFullYear()} Sirona Hygiene Private Limited</p>
          <div className="flex flex-col justify-start items-start">
            <p className="font-medium">{t("followUs") || "Follow Us"}</p>
            <div className="flex flex-wrap justify-center items-center pt-3">
              <a
                href="https://www.facebook.com/sironahygiene"
                target="_blank"
                className="mr-1.5 rounded-full bg-gray-400 h-8 w-8 flex items-center justify-center"
                rel="noreferrer"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://twitter.com/sironahygiene"
                target="_blank"
                className="mr-1.5 rounded-full bg-gray-400 h-8 w-8 flex items-center justify-center"
                rel="noreferrer"
              >
                <TwitterIcon />
              </a>
              <a
                href="https://instagram.com/sironahygiene"
                target="_blank"
                className="mr-1.5 rounded-full bg-gray-400 h-8 w-8 flex items-center justify-center"
                rel="noreferrer"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://www.youtube.com/sironahygiene"
                target="_blank"
                className="mr-1.5 rounded-full bg-gray-400 h-8 w-8 flex items-center justify-center"
                rel="noreferrer"
              >
                <YoutubeIcon />
              </a>
              <a
                href="https://www.linkedin.com/company/sironahygiene/"
                className="mr-1.5 rounded-full bg-gray-400 h-8 w-8 flex items-center justify-center"
                target="_blank"
                rel="noreferrer"
              >
                <LinkedInIcon />
              </a>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start">
            <p className="font-medium">{t("weAccept") || "We Accept"}</p>
            <div className="flex flex-wrap justify-start items-center">
              <Visa className=" mx-1 rounded-lg" />
              <MasterCard className=" mx-1 rounded-lg" />
              <Amex className=" mx-1 rounded-lg" />

              <img src="https://files.thesirona.com/site-images/original/gpay.png" alt="Google Pay" className="w-12 mx-1" />
              <Rupay className=" mx-1 rounded-lg" />
            </div>
          </div>

          <a
            href="https://api.whatsapp.com/send?text=https%3A%2F%2Fwww.thesirona.com%2F%0A%0AHello!%20I[…]%20few%20questions.%20Can%20you%20help%3F&phone=919718866644"
            target="_blank"
            rel="noreferrer"
          >
            <div
              id="wa-chat-btn-root"
              className="whatsAppBg wa-chat-btn-fixed wa-splmn-chat-btn-offset wa-custom-chat-btn wa-chat-btn-base-icon"
            >
              <div className="wa-chat-btn-icon-image-only wa-custom-icon whatsAppIcon">
                <img
                  src="https://cdn.shopify.com/s/files/1/0265/2572/8803/files/wa-icon.svg?v=1586940530"
                  height="30px"
                  width="30px"
                  alt=""
                />
              </div>
            </div>
          </a>
        </div>
      </div>
      <style>{`
     .iconBgRound {
        background-color:#949494;
        width: 30px;
        border-radius: 30px;
        height: 30px;
        padding: 5px;
      }
      .whatsAppIcon {
        -webkit-mask-size: cover; 
        -webkit-mask-position: center;
      }
      .whatsAppBg {
        background: rgb(34, 206, 90);
      }
      .wa-custom-chat-btn.wa-chat-btn-base-icon, .wa-custom-chat-btn .wa-chat-btn-base-icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .wa-splmn-chat-btn-offset {
        bottom: 20px;
        right: 20px;
        z-index: 99999 !important;
      }
      .wa-chat-btn-fixed {
        position: fixed;
      }
      .wa-splmn-chat-btn-offset {
        bottom: 20px;
        right: 20px;
        z-index: 99999 !important;
      }
      .wa-chat-btn-base-icon {
        text-decoration: none;
        cursor: pointer;
        box-shadow: 0 0 8px #c2c2c2;
        border-radius: 100%;
        -webkit-border-radius: 100%;
        -moz-border-radius: 100%;
        -ms-border-radius: 100%;
        -o-border-radius: 100%;
      }
   `}</style>
    </>
  );
};

export default FooterSRN;
