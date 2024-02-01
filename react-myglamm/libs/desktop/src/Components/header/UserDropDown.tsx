import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";
import { useCallonRouteChange } from "@libHooks/useCallonRouteChange";

import { ValtioStore } from "@typesLib/ValtioStore";

import { logoutUser } from "@libStore/actions/userActions";

import DownArrow from "../../../../UX/public/svg/down-arrow.svg";

const UserDropDown = () => {
  const { t } = useTranslation();

  const { push } = useRouter();

  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  const [showDropDown, setShowDropDown] = useState(false);

  const dropDownEle = [
    { title: t("profile") || "My Profile", url: "/my-profile" },
    { title: t("myOrders"), url: "/my-orders" },
  ];

  const handleLogOut = () => {
    logoutUser();
    push("/");
  };

  const revertState = () => setShowDropDown(prevState => !prevState);

  useCallonRouteChange(() => setShowDropDown(false));

  return (
    <div className="list-none relative">
      <button
        type="button"
        onClick={revertState}
        data-toggle="dropdown"
        className="dropdown-toggle flex items-center justify-between"
      >
        <img
          alt="user"
          className="h-10 w-10 rounded-full"
          src={userProfile?.meta?.profileImage?.original || "https://files.myglamm.com/site-images/original/no-user-yellow.png"}
        />
        <span className="text-sm w-14 pl-1 truncate block">{`${userProfile?.firstName} ${userProfile?.lastName}`.trim()}</span>
        <DownArrow className={`h-2 w-2 transition-all ${showDropDown ? "rotate-180" : ""}`} />
      </button>

      {showDropDown && (
        <ul
          style={{ zIndex: "51", boxShadow: "0 6px 12px rgba(0,0,0,.175)" }}
          className="px-4 py-5 absolute top-11 w-40 right-0 bg-white rounded"
        >
          {dropDownEle.map(items => (
            <Link key={items.url} href={items.url} className="mb-3.5 hover:font-bold capitalize text-sm flex">
              <li key={items.url}>{items.title}</li>
            </Link>
          ))}

          <button
            onClick={handleLogOut}
            className="text-sm mt-1 bg-gray-200 rounded-md hover:font-bold text-center w-full py-1"
          >
            {t("logout")}
          </button>
        </ul>
      )}
    </div>
  );
};

export default UserDropDown;
