import React, { useEffect } from "react";
import { useRouter } from "next/router";

import clsx from "clsx";
import ReactDOM from "react-dom";
import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";

import Adobe from "@libUtils/analytics/adobe";
import { isClient } from "@libUtils/isClient";
import { isWebview } from "@libUtils/isWebview";
import { setSessionStorageValue } from "@libUtils/sessionStorage";

import { REGEX } from "@libConstants/REGEX.constant";
import { ADOBE } from "@libConstants/Analytics.constant";
import { SESSIONSTORAGE } from "@libConstants/Storage.constant";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import Link from "next/link";

const BottomNav = ({ themed }: { themed?: boolean }) => {
  const { asPath } = useRouter();
  const bottomNav = useSelector((store: ValtioStore) => store.navReducer.bottomNav);

  const filteredNav = bottomNav?.filter(x => x.visibility !== (checkUserLoginStatus() ? "guest" : "login")) || [];

  const ROUTE = asPath.split("?")[0];

  const handleClick = (label: string) => {
    adobeTriggerClickEvent(label);
    if (label !== "COMMUNITY") return;
    setSessionStorageValue(SESSIONSTORAGE.COMMUNITY_TAB_CLICK, "1");
  };

  /* ADOBE EVENT - CLICK - Bottom Nav Click */
  const adobeTriggerClickEvent = (ctaName: string) => {
    const currentRoute = isClient() ? location.href : "/";

    (window as any).digitalData = {
      common: {
        ctaName,
        linkName: `web|${currentRoute}`,
        linkPageName: currentRoute,
        newLinkPageName: currentRoute,
        subSection: currentRoute,
        assetType: "Bottom nav",
        newAssetType: "Navigation",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();
  };

  useEffect(() => {
    return () => {
      sessionStorage.setItem("giftBoxAnimation", "true");
      (document.getElementById("bottom-nav") as HTMLElement)?.classList.remove("extraSpace");
    };
  }, []);

  if (
    filteredNav?.length &&
    !isWebview() &&
    ROUTE.match(
      `/${filteredNav
        ?.map(x => x.url.substring(1))
        .join(
          "$|"
        )}$|good-points$|test|learn|category|baby-name|ovulation-calculator|live-doctor-chat|become-a-creator|toxins-to-avoid|change-makers|community/`
    ) &&
    !ROUTE.match(REGEX.HIDE_BOTTOM_NAV)
  ) {
    (document.getElementById("bottom-nav") as HTMLElement)?.classList.add("extraSpace");

    return ReactDOM.createPortal(
      <section
        style={{ boxShadow: "0px -1px 4px rgba(0, 0, 0, 0.15)" }}
        className={`flex items-center justify-evenly h-16 inset-x-0 fixed bottom-0 z-30 ${themed ? "bg-color1" : "bg-white"}`}
      >
        {filteredNav.map((nav, index) => {
          const SELECTED_ROUTE = ROUTE === nav.url;
          const isMiddleIcon = filteredNav?.length % 2 !== 0 && (filteredNav?.length - 1) / 2 === index;
          const src = SELECTED_ROUTE ? nav.selectedImage || nav.image : nav.image || nav.selectedImage;
          return (
            <Link
              prefetch={false}
              href={nav.url}
              key={nav.label}
              onClick={() => handleClick(nav.label)}
              className={clsx(
                isMiddleIcon
                  ? "bg-color1 rounded-full w-14 h-14 flex items-center justify-center"
                  : "text-10 flex flex-col items-center w-16"
              )}
              aria-Label={nav.label}
            >
              <>
                <img alt={nav.label} className={clsx(isMiddleIcon ? "h-9" : `${nav.class || "h-4"}`)} src={src} />
                {!isMiddleIcon &&
                  (themed ? (
                    <span
                      className={`mt-1 tracking-wider text-center text-color2 ${
                        SELECTED_ROUTE ? "font-semibold" : "opacity-60"
                      }`}
                    >
                      {nav.label}
                    </span>
                  ) : (
                    // change text color text-color1 to text-[#262626] for sufficient color contrast
                    <span
                      className={`mt-1 tracking-wider text-center ${
                        SELECTED_ROUTE ? "text-[#262626] font-semibold" : "opacity-60"
                      }`}
                    >
                      {nav.label}
                    </span>
                  ))}
              </>
            </Link>
          );
        })}
      </section>,
      document.getElementById("bottom-nav") as HTMLElement
    );
  }

  (document.getElementById("bottom-nav") as HTMLElement)?.classList.remove("extraSpace");
  return null;
};

export default BottomNav;
