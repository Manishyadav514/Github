import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { ValtioStore } from "@typesLib/ValtioStore";
import { useSelector } from "@libHooks/useValtioSelector";
import { useFetchCart } from "@libHooks/useFetchCart";
import useTranslation from "@libHooks/useTranslation";
import PaymentSpinner from "@libComponents/Payments/PaymentSpinner";
import { getShippingAddress } from "@checkoutLib/Payment/HelperFunc";
import { useCreateOrder } from "@checkoutLib/Payment/useCreateOrder";
import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

import Truck from "../../../public/svg/45904.svg";
import Cross from "../../../public/svg/crossRed.svg";

const OrderFailed = ({ orderAmount }: { orderAmount: number }) => {
  const router = useRouter();

  const { t } = useTranslation();

  useFetchCart();

  const [time, setTime] = useState(10);
  const [sliderText, setSliderText] = useState("SWIPE TO TRY AGAIN");

  const slider = useRef<any>();
  const sliderContainer = useRef<any>();
  const [rzError, setRzError] = useState<any>();

  const { isCodEnable, isPaymentProcessing, codEnabledForSubscription } = useSelector((store: ValtioStore) => ({
    isCodEnable: store.paymentReducer.isCodEnable,
    isPaymentProcessing: store.paymentReducer.isPaymentProcessing,
    codEnabledForSubscription: store.cartReducer.cart.codEnabledForSubscription,
  }));

  const { handleCreateOrder } = useCreateOrder();

  /* Get Shipping Address for Loginned Users to check for isCOD Enable or not */
  useEffect(() => {
    if (checkUserLoginStatus()) {
      getShippingAddress();
    }
  }, []);

  let redirectTimer: NodeJS.Timer;
  useEffect(() => {
    /* Slider - For Retry Payment */
    if (sliderContainer?.current) {
      sliderContainer.current.addEventListener("touchmove", onDrag);
      sliderContainer.current.addEventListener("touchend", stopDrag);
    }

    /* Setting Timer for redirection to payment page */
    let count = 10;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    redirectTimer = setInterval(() => {
      setTime(state => state - 1);
      count -= 1;
      if (count <= 0) {
        clearInterval(redirectTimer);
        router.push("/payment");
      }
    }, 1000);

    if (orderAmount < 200) {
      localStorage.setItem("enableCOD", "true");
    }

    const cookieValue = getCookieValue("rzError");
    const decodedErrorValue = base64_decode(cookieValue);
    if (cookieValue) {
      setRzError(JSON.parse(decodedErrorValue));
      delete_cookie("rzError");
    }

    return () => clearInterval(redirectTimer);
  }, []);

  /* Reading value from cookie */
  const getCookieValue = (name: any) => document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`)?.pop() || "";

  /*  Decoding base64 value */
  const base64_decode = (s: any) => decodeURIComponent(escape(atob(s)));

  const delete_cookie = (name: any) => {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  };

  /* Slider Handling Events */
  const onDrag = (e: any) => {
    const containerWidth = sliderContainer.current?.clientWidth + 17;

    if (e.touches?.length && slider.current) {
      const left = Math.min(Math.max(0, e.touches[0].clientX), containerWidth);
      const pixelVal = left - 80;
      if (pixelVal > 4) {
        slider.current.style.left = `${pixelVal}px`;
      }
    }
  };

  const stopDrag = () => {
    const containerWidth = (sliderContainer.current?.clientWidth - 13) * 0.75;
    const fromLeft = parseInt(slider.current?.style.left, 10);

    if (fromLeft > containerWidth) {
      setSliderText("REDIRECTING...");
      router.push("/payment");
    } else if (slider.current) {
      slider.current.style.left = "4px";
    }
  };

  const handleCOD = () => {
    /* In-case COD stop the redirection timer */
    clearInterval(redirectTimer);

    handleCreateOrder("cash");
  };

  /* Loader On Clicking of COD */
  if (isPaymentProcessing) {
    return <PaymentSpinner />;
  }

  return (
    <div className="flex flex-col text-center bg-darkpink pt-8">
      <div className="bg-white rounded-full mx-auto mb-3 p-4">
        <Cross />
      </div>
      <h2 className="font-bold text-xl mb-4">Payment Failed !</h2>
      {rzError?.title?.length > 0 ? (
        <p className="mb-6 text-sm">{rzError?.title}</p>
      ) : (
        <p className="mb-6 text-sm">Sorry but your transaction couldn&apos;t go through :(</p>
      )}
      {rzError?.suggestions?.length > 0 && (
        <div style={{ backgroundColor: "#ffd6d6" }} className="p-4 w-11/12 h-1/3 text-left rounded-lg mx-auto">
          <p className="font-semibold mt-2.5 items-center text-sm px-4">{t("suggestions") || "Suggestions:"}</p>
          <ul className="mt-2.5 items-center text-sm px-4">
            {rzError?.suggestions.map((text: any) => (
              <li className=" mr-1.5 mt-2" key={text}>
                <div className="text-sm">{text}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-t-2xl bg-white py-24 px-11 mt-8" style={{ height: "60vh" }}>
        <div
          ref={sliderContainer}
          className="rounded-md font-semibold bg-gray-200 w-full border border-gray-400 text-left relative px-1 py-9 swiperContianer"
        >
          <p className="text-gray-600 text-sm absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
            {sliderText}
          </p>
          <button
            ref={slider}
            type="button"
            className="text-white text-5xl px-5 py-2 rounded-md absolute bg-ctaImg top-1 outline-none"
          >
            &raquo;
          </button>
        </div>

        <p className="text-sm mt-5 mb-8">
          Redirecting to payment page in <strong className="text-red-600">{time.toString().padStart(2, "0")}</strong> seconds
        </p>

        {!codEnabledForSubscription && (isCodEnable || orderAmount < 200) && (
          <>
            <p className="mt-10 opacity-50">Or</p>
            <button
              type="button"
              onClick={handleCOD}
              className="rounded-md font-semibold px-6 w-full py-6 mt-5 border border-gray-400 text-sm flex text-left outline-none uppercase"
            >
              <Truck className="mr-6 ml-1" />
              {t("cod")}
            </button>
          </>
        )}
      </div>
      <img src="https://files.myglamm.com/site-images/original/100Secure.png" alt="secure-payment" className="w-full" />
    </div>
  );
};

export default OrderFailed;
