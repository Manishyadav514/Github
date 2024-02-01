import React from "react";
import useTranslation from "@libHooks/useTranslation";
import { WEBSITE_NAME } from "@libConstants/SITE_NAME.constant";
import { SHOP } from "@libConstants/SHOP.constant";
import FooterMenu from "./FooterMenu";
import { useAmp } from "next/amp";
import { getStaticUrl } from "@libUtils/getStaticUrl";

const STBFooter = () => {
  const { t } = useTranslation();
  const isAmp = useAmp();
  return (
    <>
      <footer className="bg-white relative pb-16">
        {/* ---- Mobile App Download Link---- */}
        <div style={{ backgroundColor: "#212f60" }} className="w-full h-44 px-5">
          <p className="text-white pt-10 font-bold">Download St.Botanica App</p>
          <div className="flex justify-between pt-4" role="list">
            <a
              href="https://play.google.com/store/apps/details?id=com.stbotanica.ecommerce"
              role="listitem"
              aria-label="google play"
            >
              <img className="" src={getStaticUrl("/svg/playstoreIcon.svg")} alt="Google Play" />
            </a>
            <a
              href="https://apps.apple.com/in/app/st-botanica/id1616719164"
              className="ml-3"
              role="listitem"
              aria-label="play store"
            >
              <img alt="Appstore" src={getStaticUrl("/svg/appstoreIcon.svg")} />
            </a>
          </div>
        </div>

        {SHOP.ENABLE_G3_LOYALTY_PROGRAM && (
          <>
            {/* ----- Benefits Detail ------- */}
            <div className="grid grid-cols-2 py-5" role="list">
              <div className="h-28 flex justify-center items-center" role="listitem">
                <div className="flex flex-col justify-center items-center">
                  <img src={getStaticUrl("/svg/Group.svg")} width={31} height={31} alt="" />
                  <span className="text-center mt-2" style={{ fontSize: "10px" }}>
                    <p>100% Pure</p>
                    <p>Organic & Natural</p>
                  </span>
                </div>
              </div>
              <div className="h-28  flex justify-center items-center" role="listitem">
                <div className="flex flex-col justify-center items-center">
                  <img src={getStaticUrl("/svg/Group 13095.svg")} width={31} height={31} alt="" />
                  <span className=" text-center mt-2" style={{ fontSize: "10px" }}>
                    <p>Earn Good Points</p>
                    <p>on every purchase</p>
                  </span>
                </div>
              </div>
              <div className="h-28  flex justify-center items-center" role="listitem">
                <div className="flex flex-col justify-center items-center">
                  <img src={getStaticUrl("/svg/Group 8847.svg")} width={31} height={31} alt="" />
                  <span className="text-center mt-2" style={{ fontSize: "10px" }}>
                    <p>Free Shipping</p>
                    <p>(On Purchase of 199 & above)</p>
                  </span>
                </div>
              </div>
              <div className="h-28 flex justify-center items-center" role="listitem">
                <div className="flex flex-col justify-center items-center">
                  <img src={getStaticUrl("/svg/Group 8848.svg")} width={31} height={31} alt="" />
                  <span className="text-center mt-2" style={{ fontSize: "10px" }}>
                    <p>Secure </p>
                    <p>(100% secure payments)</p>
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* -----Footers Links ------- */}
        <FooterMenu textStyle="text-black" />

        {/* ----Social Page Links---- */}
        <div className=" mx-5 pt-5">
          <p className="text-lg font-extrabold tracking-widest max-w-xs">Connect With Us</p>
          <div className="SOCIAL LINKS flex py-3" role="list">
            <a href={SHOP.SOCIAL.FACEBOOK} className="pr-3" role="listitem" aria-label="facebook">
              <img src={getStaticUrl("/svg/Facebook.svg")} alt="Facebook" />
            </a>
            <a href={SHOP.SOCIAL.INSTAGRAM} className="pr-3" role="listitem" aria-label="instagram">
              <img src={getStaticUrl("/svg/Instagram.svg")} alt="Instagram" />
            </a>
            {SHOP.SOCIAL.WHATSAPP && (
              <a href={SHOP.SOCIAL.WHATSAPP} className="pr-3" role="listitem" aria-label="whatsapp">
                <img src={getStaticUrl("/svg/whatsapp.svg")} alt="Whatsapp" />
              </a>
            )}

            {SHOP.SOCIAL.PINTEREST && (
              <a href={SHOP.SOCIAL.WHATSAPP} className="pr-3" role="listitem" aria-label="pinterest">
                <img src={getStaticUrl("/svg/Pinterest.svg")} alt="Pinterest" />
              </a>
            )}
            <a href={SHOP.SOCIAL.YOUTUBE} className="pr-3" role="listitem" aria-label="youtube">
              <img src={getStaticUrl("/svg/YouTube.svg")} alt="Youtube" />
            </a>

            {SHOP.SOCIAL.TWITTER && (
              <a href={SHOP.SOCIAL.WHATSAPP} className="pr-3" role="listitem" aria-label="twitter">
                <img src={getStaticUrl("/svg/Twitter.svg")} alt="Twitter" />
              </a>
            )}
          </div>
        </div>

        {/* ----- Border Line ----- */}
        <div className="px-4 pb-4">
          <hr />
        </div>

        {/* ---- Copyright ----*/}
        <div className="pb-5">
          <div className="px-4">
            <p className="py-1 flex justify-center text-xxs text-gray-500">
              &copy; {WEBSITE_NAME ? `Copyright ${WEBSITE_NAME}` : t("copyRight")} {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default STBFooter;
