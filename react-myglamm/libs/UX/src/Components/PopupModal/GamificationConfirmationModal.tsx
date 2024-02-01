import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import GamificationAPI from "@libAPI/apis/GamificationAPI";

import useTranslation from "@libHooks/useTranslation";

import { showError } from "@libUtils/showToaster";
import { getVendorCode } from "@libUtils/getAPIParams";
import { getCurrencySymbol } from "@libUtils/format/formatPrice";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import { getGamificationRedirectionURL } from "@libComponents/Gamification/getGamificationRedirection";

import { GamificationConfig, PrizeListing } from "@typesLib/Gamification";

import PopupModal from "./PopupModal";

import CrossIcon from "../../../public/svg/group-2.svg";

interface ConfirmationProps {
  show: boolean;
  hide: () => void;
  prizeInfo: PrizeListing;
}

const GamificationConfirmationModal = ({ show, hide, prizeInfo }: ConfirmationProps) => {
  const router = useRouter();

  const { t } = useTranslation();

  const GAMIFICATION_DATA: GamificationConfig = t("gamificationConfig");

  const [loader, setLoader] = useState(false);

  const handleClaimBtn = () => {
    setLoader(true);
    const gamificationApi = new GamificationAPI();

    gamificationApi
      .cliamGamificationReward({
        reward: prizeInfo.eventName,
        key: GAMIFICATION_DATA?.dumpKey,
        identifier: checkUserLoginStatus()?.memberId,
        vendorCode: getVendorCode(),
      })
      .then(() => {
        router.push(getGamificationRedirectionURL(prizeInfo.cta) || "");

        setLoader(false);
        hide();
      })
      .catch(err => {
        setLoader(false);
        console.error(err.response?.data?.message || "Claim button error");
        showError(err.response?.data?.message || "Error");
      });
  };

  return (
    <PopupModal show={show} onRequestClose={hide}>
      <section
        className="bg-no-repeat px-3 pb-6 pt-28 rounded-t-lg relative"
        style={{ backgroundImage: `url(${GAMIFICATION_DATA?.confirmationBgImg})`, backgroundSize: "100% 100%" }}
      >
        <CrossIcon height="25" width="25" onClick={hide} className="absolute right-4 top-3 opacity-30" />

        <p
          className="text-center w-3/4 text-xs mb-4 mx-auto"
          dangerouslySetInnerHTML={{
            __html: GAMIFICATION_DATA?.claimConfirmationText.replace("{{rewardPoints}}", prizeInfo.count.toString()),
          }}
        />

        <div
          className="bg-no-repeat px-4 h-28 mb-4 flex flex-col justify-center"
          style={{ backgroundImage: `url(${GAMIFICATION_DATA?.prizeBackgroundImg})`, backgroundSize: "100% 100%" }}
        >
          <p className="font-semibold text-xs uppercase">{t("getFreeTitle")}</p>
          <p className="text-xs">
            {prizeInfo.subtitle.split(getCurrencySymbol())[0]}&nbsp;
            {prizeInfo.subtitle.includes(getCurrencySymbol()) && (
              <>
                {getCurrencySymbol()}
                <strong>{prizeInfo.subtitle.split(getCurrencySymbol()).pop()}</strong>
              </>
            )}
          </p>
        </div>

        <div className="px-1">
          <button
            type="button"
            disabled={loader}
            onClick={handleClaimBtn}
            className="bg-themePink text-white font-semibold text-sm w-full h-10 mb-5 rounded-md tracking-wide uppercase relative"
          >
            {loader ? <LoadSpinner className="w-8 inset-0 absolute m-auto" /> : "CLAIM"}
          </button>
        </div>

        <Link
          href={getGamificationRedirectionURL(prizeInfo.cta, false) || ""}
          className="text-themePink mx-auto text-11 leading-tight table border-b border-themePink"
          aria-label="View reward details"
        >
          View reward details
        </Link>
      </section>
    </PopupModal>
  );
};

export default GamificationConfirmationModal;
