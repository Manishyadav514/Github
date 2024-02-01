import { useEffect } from "react";
import { useRouter } from "next/router";

import { SHOP } from "@libConstants/SHOP.constant";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

import { getStaticUrl } from "@libUtils/getStaticUrl";

import { PAYMENT_REDUCER } from "@libStore/valtio/REDUX.store";

export function useFetchRazorPayDetails() {
  const { locale } = useRouter();

  /* Razorpay Instance - Retrieving and Storing all the wallets/banklist associate with Razorpay */
  useEffect(() => {
    if (!SHOP.ENABLE_JUSPAY) {
      /* Remove RZScript/Form if already present in DOM */
      document.getElementById("-RazorPayScript")?.remove();

      /**
       * Create HTML script element for razorpay script
       */
      const RazorpayScript = document.createElement("script");
      RazorpayScript.src = "https://checkout.razorpay.com/v1/razorpay.js";
      RazorpayScript.async = true;
      RazorpayScript.id = "-RazorPayScript";
      RazorpayScript.type = "text/javascript";
      document.body.appendChild(RazorpayScript);

      /**
       * Call Onload event on razorpay script to get wallet and bank list
       */
      RazorpayScript.onload = () => {
        const razorpayInstance = (window as any).Razorpay({
          key: GBC_ENV.NEXT_PUBLIC_RAZORPAY_KEY,
          image: SHOP.LOGO,
          callback_url: `${GBC_ENV.NEXT_PUBLIC_BASE_URL}${getStaticUrl(
            `/api/rzsuccess${locale !== "en-in" ? `?lang=${locale}` : ""}`
          )}`,
          redirect: true,
        });

        razorpayInstance.once("ready", (response: any) => {
          /* response.methods.netbanking contains list of all banks  */
          const rzMethods = response.methods;

          /**
           * Save Razor Pay wallet and Bank list to state
           */
          PAYMENT_REDUCER.razorPayData = {
            RazorBankList: Object.keys(rzMethods.netbanking).map(key => ({
              value: key,
              name: response.methods.netbanking[key],
            })),

            // @ts-ignore
            RazorWallets: Object.keys(rzMethods.wallet).reduce((accState, curState) => {
              if (rzMethods.wallet[curState]) {
                return [
                  ...accState,
                  {
                    value: rzMethods.wallet[curState],
                    name: curState,
                  },
                ];
              }
              return accState;
            }, []),
          };
        });
      };
    }
  }, []);
}
