import React from "react";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";

import Mada from "../../../public/svg/mada.svg";
import Visa from "../../../public/svg/srnvisa.svg";
import MasterCard from "../../../public/svg/srnmastercard.svg";

const menuArray1 = [
  { name: "PERIOD CARE", url: "/" },
  { name: "INTIMATE CARE", url: "/" },
  { name: "TOILET CARE", url: "/" },
  { name: "PERSONAL CARE", url: "/" },
  { name: "SEXUAL WELLNESS", url: "/" },
  { name: "CONCERNS", url: "/" },
];

const FooterSRNME = () => {
  const { t } = useTranslation();

  const { footer } = useSelector((store: ValtioStore) => store.navReducer);

  return (
    <>
      <div className="row pt-5 max-w-screen-xl mx-auto">
        <div className="flex flex-wrap justify-evenly justify-items-center items-start mt-10">
          {!footer && (
            <div className="text-15 flex flex-col">
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
            <div className="text-15 flex flex-col" key={item.label}>
              <a href={item.url}>
                <p className="font-semibold mb-3">{item?.label?.toUpperCase()}</p>
              </a>
              {item.child?.length > 1 &&
                item.child.map((childItems: any) => (
                  <div key={childItems.label} className="pb-2.5 max-w-[180px] truncate">
                    <a href={childItems?.url} className="hover:text-color1 active:text-color1 focus:text-color1">
                      {childItems?.label?.toUpperCase()}
                    </a>
                  </div>
                ))}
            </div>
          ))}
          <div className="flex flex-col text-15">
            <p className="font-semibold mb-3 uppercase">{t("information") || "INFORMATION"}</p>
            <div className="flex flex-wrap justify-start items-start">
              <p className="font-bold">{t("email")}:</p>
              <p className="ml-2">{t("supportEmailId")}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-between items-center mt-10 pb-12">
          <p className="font-medium">
            © {new Date().getFullYear()} {t("companyName") || "Sanghvi Beauty Cosmetics Trading LLC"}
          </p>
          <div className="flex flex-col justify-start items-start">
            <p className="font-medium">{t("weAccept") || "We Accept"}</p>
            <div className="flex flex-wrap justify-start items-center">
              <Visa className=" mx-1 rounded-lg" />
              <MasterCard className=" mx-1 rounded-lg" />
              <Mada className=" mx-1 rounded-lg" />
            </div>
          </div>
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

export default FooterSRNME;
