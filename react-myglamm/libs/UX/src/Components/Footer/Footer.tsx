import React, { useState, useCallback, Fragment } from "react";
import { useRouter } from "next/router";

import useTranslation from "@libHooks/useTranslation";

import { SHOP } from "@libConstants/SHOP.constant";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import { GiNextIco, GiGiftBoxIco, GiTruckIco, GiAddSlimIco, GiRabitIco } from "@libComponents/GlammIcons";

import { useAmp } from "next/amp";
import FooterMenu from "./FooterMenu";
import FooterSocialLinks from "./FooterSocialLinks";
import FooterAppUrl from "./FooterAppUrl";
import FooterCopyWrite from "./FooterCopyWrite";
import { USER_REDUCER } from "@libStore/valtio/REDUX.store";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";

function Footer({ websiteName }: { websiteName?: string }) {
  const { t } = useTranslation();
  const isAmp = useAmp();
  const Router = useRouter();

  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  const [mobile, setMobile] = useState("");

  const handleJoin = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    USER_REDUCER.userMobileNumber = { number: mobile, isdCode: "" };
    setMobile("");
    Router.push("/login");
  }, []);
  return (
    <footer className="relative inset-x-0 bottom-0 bg-black py-4 flex flex-col justify-center px-2">
      
      {/* {!userProfile && SHOP.IS_MYGLAMM && SHOP.REGION !== "MIDDLE_EAST" && (
        <React.Fragment>
  

          <ImageComponent
            delay={6000}
            alt="glaminsider"
            className="block w-auto px-4 my-0 mx-auto h-20"
            src="https://files.myglamm.com/site-images/original/img-footer-glammInsider.png"
            forceLoad={isAmp}
          />

      
          <div>
            <ImageComponent
              delay={6000}
              alt="Lipstick"
              className="m-auto block w-3.5 h-12"
              src="https://files.myglamm.com/site-images/original/img-footer-lip.png"
              forceLoad={isAmp}
            />
            <div className="flex justify-center pt-4 text-center px-10">
              <p className="text-lg font-extrabold text-center text-white tracking-widest max-w-xs">{t("150TextFooter")}</p>
            </div>
            <GiAddSlimIco
              fill="white"
              height="100px"
              width="100px"
              className="mx-auto"
              viewBox="-250 0 1000 1000"
              role="img"
              aria-labelledby="plus"
            />

            <ImageComponent
              alt="gift"
              delay={6000}
              src="https://files.myglamm.com/site-images/original/img-footer-gift.png"
              className="mx-auto w-8 h-9 -mt-1"
              forceLoad={isAmp}
            />
            <div className="flex justify-center pt-4 pb-4 text-center px-12">
              <p className="text-lg font-black text-center text-white tracking-widest max-w-xs">{t("getGlammpointsOnOrder")}</p>
            </div>
          </div>

    
          {!isAmp && (
            <form onSubmit={handleJoin} className="flex justify-center bg-white mx-4 my-3 rounded flex-row align-middle">
              {/* <DynamicCountryDropDown getData={handleData} /> */}
          {/*    <input
                placeholder={t("enterYourMobileNumber")?.toUpperCase()}
                role="textbox"
                aria-label="enter mobile number for join"
                className="pl-3 w-64 text-light text-xs text-black tracking-wider placeholder-gray-600 outline-none"
                value={mobile}
                onChange={e => setMobile(e.target.value)}
              />
              <button className="flex items-center bg-white rounded w-20 p-2 my-auto pl-4 text-xs" type="submit">
                {t("join")}
                <GiNextIco
                  className="inline"
                  fill="black"
                  height="25px"
                  width="25px"
                  viewBox="-200 -100 500 1000"
                  role="img"
                  aria-labelledby="join us"
                />
              </button>
            </form>
          )}
        </React.Fragment>
      )} */}

      <FooterMenu />

      {/* ----Social Page Links---- */}
      <FooterSocialLinks />

      {SHOP.IS_MYGLAMM && (
        <Fragment>
          {/* ---- Mobile App Download Link---- */}
          {SHOP.REGION !== "MIDDLE_EAST" && (
            <FooterAppUrl
              androidUrl="https://play.google.com/store/apps/details?id=com.myglamm.ecommerce&hl=en"
              iosUrl="https://itunes.apple.com/in/app/myglamm-buy-makeup-products/id1282962703?mt=8"
            />
          )}

          {/* Footer Offer */}
          <div>
            <div className="flex px-2 pb-20" role="list">
              <div className="w-1/3 h-12" role="listitem">
                <GiRabitIco
                  fill="white"
                  height="100px"
                  width="100px"
                  viewBox="-350 0 1000 1000"
                  role="img"
                  aria-labelledby="cruelty free"
                />
                <p className="font-thin text-white pl-8 -mt-4 text-11">{t("cruelty")}</p>
              </div>
              <div className="w-1/3 h-12" role="listitem">
                <GiTruckIco
                  fill="white"
                  width="100px"
                  height="100px"
                  viewBox="-300 0 1000 1000"
                  role="img"
                  aria-labelledby="free shipping"
                />
                <p className="font-thin text-white pl-6 -mt-4 text-11">{t("freeShip")}</p>
              </div>
              <div className="w-1/3 h-12" role="listitem">
                <GiGiftBoxIco
                  width="100px"
                  height="100px"
                  viewBox="-350 0 1000 1000"
                  fill="white"
                  role="img"
                  aria-labelledby="gift with purchase"
                />
                <p className="font-thin text-center text-white pl-4 -mt-4 text-11">{t("giftPurchase")}*</p>
              </div>
            </div>
          </div>
        </Fragment>
      )}

      {/* ---- Copyright ----*/}
      <FooterCopyWrite websiteName={websiteName} />
    </footer>
  );
}

export default Footer;
