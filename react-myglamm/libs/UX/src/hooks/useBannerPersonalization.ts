import { useEffect, useState } from "react";
import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";
import { Multimedia } from "@typesLib/Widgets";

import { getMCVID } from "@libUtils/getMCVID";
import { getVendorCode } from "@libUtils/getAPIParams";

import ConsumerAPI from "@libAPI/apis/ConsumerAPI";

import useTranslation from "./useTranslation";

export function useBannerPersonalization(widget: any) {
  const { t } = useTranslation();

  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  const [personalisedBanners, setPersonalisedBanners] = useState<Multimedia[]>(widget.multimediaDetails);

  const SCORE_TABLE = t("userBannerExactScoring");
  const PD_SCORE_TABLE = t("userBannerFuzzyScoring");
  const WEIGHTAGE_TABLE = t("affinityWeightageTable");

  const MANUAL_WEIGHTAGE = widget.meta.manualWeightage || 100;

  const USER_AFFINITIES = userProfile?.meta?.attributes?.userGraphVc?.[getVendorCode()];

  /* To Trigger Personalised Logic user should be registered and widget should have atleast some personalised % */
  useEffect(() => {
    if (USER_AFFINITIES && MANUAL_WEIGHTAGE !== 100 && personalisedBanners && personalisedBanners.length > 1) {
      calcEachBannerScore();
    } else if (MANUAL_WEIGHTAGE !== 100 && !userProfile) {
      const MCVID = getMCVID() as string;

      if (MCVID) {
        const consumerApi = new ConsumerAPI();
        consumerApi
          .getGuestDump(getMCVID() as string)
          .then(({ data: res }) => {
            if (res?.data?.data) {
              dispatchEvent(new CustomEvent("homePageLoad", { detail: "True-v2" }));
              calcEachBannerScore(res.data.data);
            } else {
              fallbackGuestPersonalisation();
            }
          })
          .catch(fallbackGuestPersonalisation);
      } else fallbackGuestPersonalisation();
    } else {
      // if no change still reset the banners in fallback as there can be changes due to reinit of widgets call for loggedin users
      setPersonalisedBanners(widget.multimediaDetails);
    }
  }, [widget.multimediaDetails]);

  /* Fallback is V1 guest */
  const fallbackGuestPersonalisation = () => {
    dispatchEvent(new CustomEvent("homePageLoad", { detail: "True-v1" }));
    calcEachBannerScoreGuest(); // Fallback if no data present for guest mcvid
  };

  /* Patching Keys and making similar to widget to make the generic logic possible */
  const getUserAffinities = (affinity: any): any => {
    const AFFINITIES = affinity || USER_AFFINITIES;
    try {
      return Object.keys(AFFINITIES).reduce((prev, curr) => {
        const patchedKey = curr
          .replace("Affinity", "")
          .replace("price", "priceAffinity")
          .replace("discount", "discountAffinity");

        return { ...prev, [patchedKey]: AFFINITIES[curr] };
      }, {});
    } catch {
      return {};
    }
  };

  /* Mutiplying By Weightage from config and diving to get the actual Weightage of Banner */
  const getWieghtage = (key: string, value: number) => (value * (WEIGHTAGE_TABLE[key] || 0)) / 100 || 0;

  const calcEachBannerScore = (affinity?: any) => {
    /* Filtering Fixed and Non-fixed banners out */
    const fixedBanners = personalisedBanners.filter(x => x.meta.fixed);
    const normalBanners = personalisedBanners.filter(x => !x.meta.fixed);

    try {
      const userAffinities = getUserAffinities(affinity);

      /* Calulating Banner level score based on the affinity recieved in profile api */
      normalBanners.forEach((banner, index) => {
        let bannerScore = 0;

        Object.keys(banner.meta)
          .filter(x => x !== "fixed")
          .forEach(key => {
            const userAffinityVal = userAffinities[key];
            const bannerAffinityVal = banner.meta[key];

            if (key.match(/price|discount/)) {
              bannerScore += getWieghtage(key, PD_SCORE_TABLE[bannerAffinityVal]?.[userAffinityVal] || 0);
              return;
            }

            if (!userAffinityVal || userAffinityVal?.length === 0 || bannerAffinityVal?.length === 0) {
              bannerScore += getWieghtage(key, SCORE_TABLE.bannerGeneric);
              return;
            }

            if (userAffinityVal.length) {
              let foundMatch = false;
              for (var i = 0; i < userAffinityVal.length; i++) {
                if (bannerAffinityVal.includes(userAffinityVal[i])) {
                  bannerScore += getWieghtage(key, SCORE_TABLE.match);
                  foundMatch = true;
                  break;
                }
              }

              if (foundMatch) return;
              bannerScore += getWieghtage(key, SCORE_TABLE.noMatch);
            }
          });

        normalBanners[index].score = parseFloat(
          (bannerScore + (banner.bannerScore || 0) * (WEIGHTAGE_TABLE?.bannerScore || 0)).toFixed(2)
        );
      });
    } catch (err) {
      console.error({ err }, "Personlisation Failed");
      // Personlisation Failed
    }

    calculateLastScore(normalBanners, fixedBanners);
  };

  /* Calulation of Score for Guest with no affinity - Personalisation Guest v1 */
  const calcEachBannerScoreGuest = () => {
    /* Filtering Fixed and Non-fixed banners out */
    const fixedBanners = personalisedBanners.filter(x => x.meta.fixed);
    const normalBanners = personalisedBanners.filter(x => !x.meta.fixed).reverse();

    calculateLastScore(normalBanners, fixedBanners);
  };

  /* Common Logic For Calulating and Setting the banners Sorting for Logined/Guest */
  const calculateLastScore = (normalBanners: Multimedia[], fixedBanners: Multimedia[]) => {
    /* Sorting Banners based on score calulated above - Personalised Banners */
    const updatedBanners = normalBanners.sort((a, b) => (b.score || b.bannerScore) - (a.score || a.bannerScore));

    /* Comparison Manual Postion with Personalised and calulating a score */
    updatedBanners.forEach(
      (banner, i) => (updatedBanners[i].score = (banner.position * MANUAL_WEIGHTAGE + (100 - MANUAL_WEIGHTAGE) * (i + 1)) / 100)
    );

    /* Sorting again based on the new score */
    updatedBanners.sort((a, b) => a.score - b.score);

    /* In case of fixed banners insert them at the right position */
    if (fixedBanners.length) {
      fixedBanners.forEach(banner => updatedBanners.splice(banner.position - 1, 0, banner));
    }

    setPersonalisedBanners(updatedBanners);
  };

  /* Incase a max no of banners key is provided */
  const maxLimit = widget.meta.maxBannerLimit;

  return { personalisedBanners: maxLimit ? personalisedBanners.slice(0, maxLimit) : personalisedBanners };
}
