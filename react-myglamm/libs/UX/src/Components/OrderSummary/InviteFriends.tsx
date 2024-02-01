import React from "react";
import GamificationShare from "@libComponents/Gamification/GamificationShare";
import useTranslation from "@libHooks/useTranslation";

const InviteFriends = ({ variant }: { variant?: string }) => {
  const { t } = useTranslation();
  const orderSuccessObj = t("orderSuccessGamificationObj");

  return (
    <div>
      <img alt="mgxo background" className="mx-auto my-2 p-4" src={orderSuccessObj?.inviteFriendsImg} />

      <div className="px-4">
        <GamificationShare variant={variant} />
      </div>
    </div>
  );
};

export default InviteFriends;
