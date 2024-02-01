/* eslint-disable no-nested-ternary */
import React, { useEffect, useState, ReactElement } from "react";
import format from "date-fns/format";

import Router from "next/router";

import PopupModal from "@libComponents/PopupModal/PopupModal";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import Adobe from "@libUtils/analytics/adobe";
import { formatPrice } from "@libUtils/format/formatPrice";

import { ADOBE } from "@libConstants/Analytics.constant";

import Layout from "@libLayouts/Layout";

import { ValtioStore } from "@typesLib/ValtioStore";

import ConsumerAPI from "@libAPI/apis/ConsumerAPI";

import { CONFIG_REDUCER, ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

function Dashboard() {
  const [referData, setReferData] = useState<any>();
  const [couponData, setCouponData] = useState<any>();
  const [copyCode, setCopyCode] = useState<boolean>(false);
  const [showTab, setShowTab] = useState(1);
  const profile = useSelector((store: ValtioStore) => store.userReducer.userProfile);

  const DATEFORMAT = "do MMM, yyyy";

  const { t } = useTranslation();

  const handleShareNEarn = () => {
    CONFIG_REDUCER.shareModalConfig = {
      shareUrl: profile?.shareUrl,
      module: "page",
    };
  };

  const copyButton = (code: any) => {
    navigator.clipboard.writeText(code);
    setCopyCode(true);
  };
  const redeemNow = () => {
    Router.push("/buy/makeup/lips");
  };
  useEffect(() => {
    if (profile) {
      const consumerApi = new ConsumerAPI();
      const referUsedData = async () => {
        const { data } = await consumerApi.getConsumerDashBoard(profile.id);
        setReferData(data?.data);
        triggerAdobePageLoad(1, data?.data);
      };
      referUsedData();
      const referCoupones = async () => {
        const { data } = await consumerApi.getRefferralCoupons(profile.id);
        setCouponData(data?.data?.data);
      };
      referCoupones();
    }
  }, [profile]);

  // #region // Adobe Analytics[41]-Page Load-refer and earn - Dashboard
  const handleTabClick = (intTabNumber = 1) => {
    if (showTab !== intTabNumber) {
      triggerAdobePageLoad(intTabNumber, referData);
    }
  };

  const triggerAdobePageLoad = (intTabNumber: number, registrationData: any) => {
    const digitalDataLayer: any = {
      common: {
        pageName: "web|rewards|refer and earn|dashboard|",
        newPageName: "refer and earn dashboard",
        subSection: "refer and earn dashboard",
        assetType: ADOBE.ASSET_TYPE.REWARD_REFERRAL,
        newAssetType: "referral dashboard",
        pageLocation: "",
        platform: ADOBE.PLATFORM,
        technology: ADOBE.TECHNOLOGY,
      },
      user: Adobe.getUserDetails(profile),
    };

    if (intTabNumber === 1) {
      digitalDataLayer.common.pageName += "registered";
      digitalDataLayer.common.newPageName += " registered";
      if (registrationData?.totalRegistered > 0) {
        digitalDataLayer.referAndEarn = {
          referFlags: "registered-yes",
        };
      } else {
        digitalDataLayer.referAndEarn = {
          referFlags: "registered-no",
        };
      }
    } else {
      digitalDataLayer.common.pageName += "free makeup";
      digitalDataLayer.common.newPageName += " free makeup";
    }

    (window as any).digitalData = digitalDataLayer;
    Adobe.PageLoad();
  };
  // #endregion

  // #region // Adobe Analytics[35]-Click Event-refer and earn - Dashboard - Remind
  const triggerAdobeRemindClick = () => {
    (window as any).digitalData = {
      common: {
        assetType: ADOBE.ASSET_TYPE.REWARD_REFERRAL,
        ctaName: "remind",
        linkName: "web|refer and earn|registered|remind",
        linkPageName: "web|refer and earn|dashboard",
        newAssetType: "referral dashboard",
        newLinkPageName: "refer and earn dashboard",
        platform: ADOBE.PLATFORM,
        subSection: "refer and earn dashboard",
        pageLocation: "referral dashboard",
      },
      user: Adobe.getUserDetails(profile),
    };
    Adobe.Click();
  };
  // #endregion

  // #region // Adobe Analytics[36]-Click Event-refer and earn - Dashboard - Free Makeup - Copy Code
  const triggerAdobeFreeMakeupCopyCoupon = () => {
    (window as any).digitalData = {
      common: {
        assetType: ADOBE.ASSET_TYPE.REWARD_REFERRAL,
        ctaName: "copy code",
        linkName: "web|refer and earn|free makeup|copy code",
        linkPageName: "web|refer and earn|dashboard",
        newAssetType: "referral dashboard",
        newLinkPageName: "refer and earn dashboard",
        platform: ADOBE.PLATFORM,
        subSection: "refer and earn dashboard",
        pageLocation: "referral dashboard",
      },
      user: Adobe.getUserDetails(profile),
    };
    Adobe.Click();
  };
  // #endregion

  // #endregion Adobe Analytics[56]-Click Event-refer and earn - Dashboard - Start Referring
  const triggerAdobeStartReferringClick = () => {
    (window as any).digitalData = {
      common: {
        assetType: ADOBE.ASSET_TYPE.REWARD_REFERRAL,
        ctaName: "start referring",
        linkName: "web|rewards|refer and earn|dashboard|start referring now",
        linkPageName: "web|rewards|refer and earn|dashboard",
        newAssetType: "referral dashboard",
        newLinkPageName: "refer and earn dashboard",
        platform: ADOBE.PLATFORM,
        subSection: "refer and earn dashboard",
        pageLocation: "referral dashboard",
      },
      user: Adobe.getUserDetails(profile),
    };
    Adobe.Click();
  };
  // #endregion

  return (
    <div className="bg-gradient-to-b from-color2 to-white">
      <style>
        {`.registerOn {
            &::before {
              content: "";
              position: absolute;
              left: 1.25rem;
              top: 3.7rem;
              height: 2rem;
              width: 2px;
              border-left: 1px dashed #d8d8d8;
            }
          }

          .freeMake {
            &::before {
              content: "";
              position: absolute;
              left: 1.25rem;
              top: 3.5rem;
              height: 2rem;
              width: 2px;
              border-left: 1px dashed #d8d8d8;
            }
          }`}
      </style>

      <div className="p-2 mb-2 w-full text-center flex">
        <div className="w-1/3 py-4 px-2">
          <div className="font-bold text-2xl">{referData?.totalRegistered}</div>
          <span className="text-xs">{t("totalRegistered")}</span>
        </div>
        <div className="w-1/3 py-4 px-2">
          <div className="font-bold text-2xl">{referData?.purchased}</div>
          <span className="text-xs">{t("purchased")}</span>
        </div>
        <div className="w-1/3 py-4 px-2">
          <div className="font-bold text-2xl">{referData?.onlyRegistered}</div>
          <span className="text-xs">{t("onlyRegistered")}</span>
        </div>
      </div>

      <div className="m-2 p-2 rounded-lg shadow bg-white mb-5">
        <div className="flex justify-around pb-3 pt-2 ">
          <div
            className="flex w-1/2 justify-center items-center text-center pb-3"
            style={{
              borderBottom: showTab === 1 ? "3px solid pink" : "3px solid rgb(241, 241, 241)",
            }}
          >
            <button
              type="button"
              style={{
                outline: "none",
              }}
              onClick={() => {
                setShowTab(1);
                handleTabClick(1);
              }}
            >
              {t("registered")}{" "}
            </button>
          </div>
          <div
            className="flex w-1/2 justify-center items-center text-center pb-3"
            style={{
              borderBottom: showTab === 2 ? "3px solid pink" : "3px solid rgb(241, 241, 241)",
            }}
          >
            <button
              type="button"
              className="outline-none"
              onClick={() => {
                setShowTab(2);
                handleTabClick(2);
              }}
            >
              {t("freeMakeup")}
            </button>
          </div>
        </div>
        {showTab === 1 &&
          (referData?.onlyRegisteredConsumers?.length > 0 ? (
            <div>
              <h3 className="mb-1 px-3 font-semibold text-lg">{t("myRegisteredReferrals")}</h3>
              <p className="mb-6 px-3 text-sm">{t("remindFriends")}</p>
              {referData.onlyRegisteredConsumers.map((refer: any) => (
                <div className="w-full py-5 px-3 flex border-t border-gray-200 relative">
                  <div className="w-2/3">
                    <h4 className="font-bold text-sm">
                      {refer.firstName} {refer.lastName}
                    </h4>
                    <div className="registerOn mb-4">
                      <span
                        className="w-4 h-4 relative z-10 mr-2 mt-2 float-left"
                        style={{
                          background: "url(https://files.myglamm.com/site-images/original/refer-sprite.png) 3px 0 no-repeat",
                        }}
                      />
                      <span className="text-xs font-semibold opacity-50" style={{ fontSize: "0.6rem" }}>
                        {t("registeredOn")} {refer.createdAt && format(new Date(refer.createdAt), DATEFORMAT)}
                      </span>
                    </div>
                    <div className="flex">
                      <span className=" border border-gray-400 z-10 bg-white mt-1 mr-2 ml-1 flex h-2 w-2 rounded-full">
                        <strong
                          className="rounded-full h-1 w-1 flex absolute bg-gray-400"
                          style={{ left: "1.15rem", top: "5.41rem" }}
                        />
                      </span>
                      <span className="font-base text-xs opacity-50">{t("purchasePending")}</span>
                    </div>
                  </div>
                  <div className="w-1/3 text-right mt-6 pt-1">
                    <a
                      className="uppercase text-sm font-semibold pl-5 ml-8 float-right"
                      style={{
                        color: "#fab6b5",
                        background: "url(https://files.myglamm.com/site-images/original/refer-sprite.png) 0px -88px no-repeat",
                      }}
                      href={`https://api.whatsapp.com/send?phone=+91${refer.mobileNumber}&text=Hey!%20Don%27t%20forget,%20you%20can%20save%20%E2%82%B9150%20when%20you%20buy%20statement-making,%20cruelty-free,%20European%20makeup%20at%20MyGlamm.%20Shop%20NOW!%22https://s.mygl.in/SALM7831%22`}
                      onClick={() => {
                        triggerAdobeRemindClick();
                      }}
                      aria-label={t("remind")}
                    >
                      {t("remind")}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm pb-8 p-2 pt-4">
              <strong>{t("refer")}</strong> {t("friendsEarnMakeup")}
            </p>
          ))}{" "}
        {showTab === 2 && couponData?.length ? (
          <div>
            <h2 className="font-semibold px-2 text-3xl" style={{ color: "#fab6b5" }}>
              {t("congratulations")}
            </h2>
            <p className="px-2 text-xs mb-6">
              {t("friendsPuchaseText")} <br /> {t("getFreeMakeupNow")}
            </p>
            {couponData.map((coupons: any) => (
              <div className="w-full py-4 px-3 flex border-t border-gray-200 relative" key={coupons.memberId}>
                <div className="w-2/3">
                  <h4 className="font-bold text-sm">{coupons.childName}</h4>
                  <div className="registerOn mb-4">
                    <span
                      className="w-4 h-4 relative z-10 mr-2 mt-2 float-left"
                      style={{
                        background: "url(https://files.myglamm.com/site-images/original/refer-sprite.png) 3px 0 no-repeat",
                      }}
                    />
                    <span className="font-semibold opacity-50" style={{ fontSize: "0.6rem" }}>
                      {t("registeredOn")} {format(new Date(coupons.childRegisteredOn.split("T")[0]), DATEFORMAT)}
                    </span>
                  </div>
                  <div className="flex mb-4">
                    <span
                      className=" h-4 w-4 mr-2 relative z-10"
                      style={{
                        background: "url(https://files.myglamm.com/site-images/original/refer-sprite.png) 0 -60px no-repeat",
                      }}
                    />
                    <span className="font-base text-xs opacity-50">
                      {t("puchaseOn")} {format(new Date(coupons.orderPurchased.split("T")[0]), DATEFORMAT)}
                    </span>
                  </div>
                  <strong className="text-xs pt-8 mt-8 relative tracking-wide">
                    {t("payByCreditCardBin", [formatPrice(coupons.amount).toString()])}
                  </strong>
                </div>
                <div className="w-1/3 text-right mr-0 mt-4">
                  <label className="m-0 block pr-5" style={{ fontSize: "0.57rem" }}>
                    {t("useCode")}
                  </label>
                  <span className="uppercase text-sm font-semibold mr-2 tracking-tight">{coupons.couponCode}</span>
                  <button
                    type="button"
                    className="uppercase border-dotted border text-sm font-semibold text-4 w-2/3 float-right mt-3"
                    style={{
                      borderColor: "#fab6b5",
                      color: "#fab6b5",
                      padding: "6px 10px 4px 30px",
                      background: "url(https://files.myglamm.com/site-images/original/refer-sprite.png) 10px -22px no-repeat",
                    }}
                    onClick={() => {
                      copyButton(coupons.couponCode);
                      triggerAdobeFreeMakeupCopyCoupon();
                    }}
                  >
                    {t("copy")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm pb-8 p-2 pt-4">
            {t("noRegisteredPurchase")}
            <strong> {t("Remind Now")} </strong>
          </p>
        )}
      </div>

      <div className="p-2 mb-1">
        <img alt="Share" src={t("referEarnOfferDescImgUrl")} />
      </div>
      <div className="p-2">
        <button
          className="uppercase bg-black text-white p-3 w-full text-sm"
          type="button"
          onClick={() => {
            handleShareNEarn();
            triggerAdobeStartReferringClick();
          }}
        >
          {t("startReferring")}
        </button>
      </div>

      <PopupModal show={copyCode} onRequestClose={() => setCopyCode(false)}>
        <section style={{ width: "92%", margin: "26px auto", display: "block" }}>
          <div className="flex justify-center m-5">
            <img
              src="https://files.myglamm.com/site-images/original/ico-tick.png"
              alt="tick Icon"
              style={{ width: "30px", height: "30px" }}
            />
            <p className="font-bold text-xl ml-3">{t("codeCopiedToClipBoard")}</p>
          </div>
          <button className="bg-black text-white p-3 text-sm w-full" type="button" onClick={redeemNow}>
            {t("redeemNow")}
          </button>
        </section>
      </PopupModal>
    </div>
  );
}

Dashboard.getLayout = (children: ReactElement) => <Layout footer={false}>{children}</Layout>;

export default Dashboard;
