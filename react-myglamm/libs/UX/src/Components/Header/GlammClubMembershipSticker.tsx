import React from "react";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import { getMembershipIcon } from "@libUtils/glammClubUtils";
import useTranslation from "@libHooks/useTranslation";
import { GLAMMCLUB_CONFIG } from "@libUtils/glammClubUtils";

const GlammClubMembershipSticker = () => {
  const { userProfile } = useSelector((store: ValtioStore) => ({
    userProfile: store.userReducer.userProfile,
  }));

  const { t } = useTranslation();
  const glammClubConfig = GLAMMCLUB_CONFIG() || {};

  if (userProfile?.memberType?.levelName && glammClubConfig?.glammClubMemberShipLevels) {
    return (
      <img
        src={getMembershipIcon(userProfile?.memberType?.levelName as string, glammClubConfig)}
        alt={userProfile?.memberType?.levelName || ""}
        className="ml-2 h-4"
      />
    );
  }

  return null;
};

export default GlammClubMembershipSticker;
