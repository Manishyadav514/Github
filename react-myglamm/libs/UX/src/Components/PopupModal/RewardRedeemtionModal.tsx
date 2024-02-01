import React from "react";

import PopupModal from "@libComponents/PopupModal/PopupModal";

import { SingleReward } from "@typesLib/GoodPoints";

import RewardRedeem from "@libComponents/GoodPoints/RewardRedeem";

interface RwdRedeemProps {
  show: boolean;
  hide: () => void;
  rewardData: SingleReward;
}

const RewardRedeemtionModal = ({ show, hide, rewardData }: RwdRedeemProps) => {
  const brand = rewardData.vendorData[rewardData.reward.discountCodeVendor || "mgp"];

  return (
    <PopupModal show={show} onRequestClose={hide}>
      <section className="rounded-t-3xl px-4 pt-7 pb-5 text-center">
        <img alt={brand.name} className="mb-4 mx-auto" style={{ maxWidth: "120px" }} src={brand.brandImage.frontendLogo} />

        <p className="font-semibold mb-8 w-3/5 mx-auto">
          {rewardData?.reward?.discountDescription || rewardData.reward.subTitle}
        </p>

        <RewardRedeem cta="Order Now" reward={rewardData.reward} brandData={brand} />
      </section>
    </PopupModal>
  );
};

export default RewardRedeemtionModal;
