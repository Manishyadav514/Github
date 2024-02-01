import React, { useEffect, useState, ReactElement } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import LoadSpinner from "@libComponents/Common/LoadSpinner";

import { logoutUser } from "@libStore/actions/userActions";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { SHOP } from "@libConstants/SHOP.constant";

// import { fireBaseSignOut } from "@libUtils/firebase";
import { getUserNameEmail } from "@libUtils/getUserNameEmail";

import Layout from "@libLayouts/Layout";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

import FirebaseScript from "@libComponents/FirebaseScript";
import MyProfileHead from "@libComponents/MyProfile/MyProfileHead";

import { ValtioStore } from "@typesLib/ValtioStore";

import TurnOff from "../../public/svg/turn-off.svg";
import MyOrders from "../../public/svg/my-orders.svg";
import CreditCard from "../../public/svg/credit-card.svg";
import SkinPreference from "../../public/svg/skinpref.svg";
import ManageAddress from "../../public/svg/manage-address.svg";
import RightArrowIcon from "../../public/svg/rightArrowProfile.svg";
import NotificationSettings from "../../public/svg/notification-settings.svg";

function MyProfile() {
  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  const { t } = useTranslation();

  const handleLogOut = () => {
    logoutUser();

    // fireBaseSignOut();

    return router.push("/");
  };

  const links = [
    {
      key: "myOrders",
      title: t("myOrders"),
      toLink: "/my-orders",
      svg: MyOrders,
      hide: false,
    },
    {
      key: "manageAddresses",
      title: t("manageAddresses"),
      toLink: "/chooseAddress",
      svg: ManageAddress,
      hide: false,
    },
    {
      key: "notificationSettings",
      title: t("notificationSettings"),
      toLink: "/myaccount/notification",
      svg: NotificationSettings,
      hide: false,
    },
    {
      key: "managePaymentMethod",
      title: t("managePaymentMethod") || "Manage Payment Method",
      toLink: "/manage-payment",
      svg: CreditCard,
      hide: false,
    },
    {
      key: "mySkinPreferences",
      title: t("mySkinPreferences"),
      toLink: "/customer-profile",
      svg: SkinPreference,
      hide: !SHOP.IS_MYGLAMM,
    },
    {
      key: "logout",
      title: t("logout"),
      toLink: "/",
      svg: TurnOff,
      hide: false,
    },
  ];

  useEffect(() => {
    if (!checkUserLoginStatus()) {
      router.replace("/login");
    }
  }, []);

  useEffect(() => {
    if (userProfile) {
      setIsReady(true);
    }
  }, [userProfile]);

  if (!isReady) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadSpinner />
      </div>
    );
  }

  return (
    <div className="h-full mb-6">
      {/* <FirebaseScript /> */}

      <MyProfileHead />

      {/* NAME SECTION  */}
      {userProfile && (
        <React.Fragment>
          <section className="px-4 mt-1 bg-white flex items-center justify-between">
            <div className="py-4 grow">
              <h4 className="font-semibold text-lg">{getUserNameEmail(userProfile)}</h4>
              <h5 className="text-13">{userProfile.phoneNumber}</h5>
              <h6 className="text-13">{getUserNameEmail(userProfile, true)}</h6>
            </div>
          </section>

          {/* LINKS SECTION */}
          <ul className="mt-4 bg-white list-none" role="menu" aria-labelledby="menubutton">
            {links
              .filter(l => !l.hide)
              .map(link => (
                <li key={link.key} role="presentation">
                  <div className="flex items-center pl-4" role="menuitem">
                    <span className="w-10">
                      {React.createElement(link.svg, {
                        width: "25px",
                        height: "25px",
                        role: "img",
                        "aria-labelledby": link.title,
                      })}
                    </span>

                    <div className="flex items-center w-full justify-between p-1 py-3 border-b border-gray-200">
                      {link.key === "logout" ? (
                        <button type="button" className="w-full text-left" onClick={handleLogOut}>
                          {link.title}
                        </button>
                      ) : (
                        <Link href={link.toLink} className="w-full" aria-label={link.title}>
                          {link.title}
                        </Link>
                      )}

                      <RightArrowIcon role="img" aria-labelledby="right arrow" />
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </React.Fragment>
      )}
    </div>
  );
}

MyProfile.getLayout = (children: ReactElement) => <Layout footer={false}>{children}</Layout>;

export default MyProfile;
