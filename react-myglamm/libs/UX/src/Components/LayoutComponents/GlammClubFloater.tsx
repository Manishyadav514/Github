import React from "react";

import Link from "next/link";

import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";

const GlammClubFloater = ({ adobeTriggerClickEvent, glammClubConfig }: any) => {
  const { slug, active, glammClubFloaterIconV2, glammClubFloaterIcon }: any = glammClubConfig || {};

  /* To show user specific floater based on glamm club membership e.g. star, vip, legend */
  const { userProfile } = useSelector((store: ValtioStore) => ({
    userProfile: store.userReducer.userProfile,
  }));

  const personalisedFloater = glammClubFloaterIconV2
    ? glammClubFloaterIconV2[(userProfile?.memberType?.levelName as string) || "Guest"]
    : glammClubFloaterIcon;

  if (active && slug && personalisedFloater) {
    return (
      <Link
        href={slug}
        aria-hidden
        prefetch={false}
        style={{ zIndex: 55 }}
        className={`right-0 fixed text-white text-xs font-bold flex items-center rounded-l-full bottom-24`}
        aria-label="glamm club floater"
        onClick={adobeTriggerClickEvent}
      >
        <img className="pl-0.5 w-28" src={personalisedFloater} alt="floater" />
      </Link>
    );
  }

  return null;
};

export default GlammClubFloater;
