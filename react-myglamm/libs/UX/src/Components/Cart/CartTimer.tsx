import React, { useEffect, useState } from "react";
import addMinutes from "date-fns/addMinutes";
import dynamic from "next/dynamic";
import { getLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import differenceInSeconds from "date-fns/differenceInSeconds";
import useTranslation from "@libHooks/useTranslation";
import { useOptimize } from "@libHooks/useOptimize";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";

const CountDownTimer = dynamic(() => import("@libComponents/CountDownTimer"), { ssr: false });

const CartTimer = () => {
  const [offerTime, setOfferTime] = useState<any>(null);
  const { t } = useTranslation();

  const [showTimer, setShowTimer] = useState<boolean>(true);

  const { coupon } = useSelector((store: ValtioStore) => ({
    coupon: store.cartReducer.cart.couponData.couponCode,
  }));

  const experimentIds = t("abTestExperimentIds");

  const { variant } = useOptimize(experimentIds?.[0]?.["enableTimer"]);

  const futureTime = addMinutes(new Date(), 5);

  const restartTimerAfter = 3600; // we need to restart after 1 hr

  const getFutureTime = getLocalStorageValue(LOCALSTORAGE.FUTURE_TIME);

  const futureTimeExpired = differenceInSeconds(new Date(), new Date(getFutureTime));

  const isXOCouponApplied = t("surveyCouponCodes")?.[0]?.includes(coupon);

  useEffect(() => {
    if (variant && variant !== "no-variant") {
      handleCountDownTimer();
    } else {
      dispatchEvent(new CustomEvent("cartTimer"));
    }
  }, []);

  const addAdobeEvar = (isTimerOn: boolean) => {
    if (variant === "0") {
      (window as any).evars.evar111 = variant;
      dispatchEvent(new CustomEvent("cartTimer"));
    } else if (variant === "1") {
      (window as any).evars.evar111 = `experimentVariant:1|timer:${isTimerOn ? true : false}`;
      dispatchEvent(new CustomEvent("cartTimer"));
    } else {
      dispatchEvent(new CustomEvent("cartTimer"));
    }
  };

  const handleCountDownTimer = () => {
    if (!getFutureTime) {
      setLocalStorageValue(LOCALSTORAGE.FUTURE_TIME, futureTime.toISOString());
      setOfferTime(futureTime);
      addAdobeEvar(true);
    } else if (futureTimeExpired > 0) {
      if (futureTimeExpired >= restartTimerAfter) {
        setOfferTime(addMinutes(new Date(), 5));
        setLocalStorageValue(LOCALSTORAGE.FUTURE_TIME, addMinutes(new Date(), 5).toISOString());
        addAdobeEvar(true);
      }
      setOfferTime(null);
      setShowTimer(false);
      addAdobeEvar(false);
    } else {
      setOfferTime(new Date(getFutureTime));
      addAdobeEvar(true);
    }
  };

  if (isXOCouponApplied && variant === "1" && showTimer) {
    return (
      <div className="flex items-center justify-between bg-white relative">
        <img
          width="115"
          height="30"
          src="https://s3.ap-south-1.amazonaws.com/files.myglamm.net/myglamm-alpha/original/Instant-discount.jpg"
        />
        <div className="mt-2">
          <CountDownTimer source="cartProduct" expiryTimestamp={offerTime} callback={() => setShowTimer(false)} />
        </div>
      </div>
    );
  }
  return null;
};

export default CartTimer;
