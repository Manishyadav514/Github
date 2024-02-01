import React from "react";
import useTranslation from "@libHooks/useTranslation";
import { useRouter } from "next/router";

const PaymentLinkExpired = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="bg-white h-screen">
      <div className="flex flex-col justify-center items-center text-center h-5/6 space-y-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 32 32">
          <path d="M 16 4 C 11.83293 4 8.1532881 6.11172 6 9.34375 L 6 6 L 4 6 L 4 12 L 4 13 L 5 13 L 11 13 L 11 11 L 7.375 11 C 9.1031378 8.0195513 12.297704 6 16 6 C 21.534534 6 26 10.465466 26 16 C 26 21.534534 21.534534 26 16 26 C 10.465466 26 6 21.534534 6 16 L 4 16 C 4 22.615466 9.3845336 28 16 28 C 22.615466 28 28 22.615466 28 16 C 28 9.3845336 22.615466 4 16 4 z M 15 8 L 15 16 L 15 17 L 16 17 L 22 17 L 22 15 L 17 15 L 17 8 L 15 8 z" />
        </svg>
        <p className="font-semibold text-lg">{t("paymentLinkExpiredText") || "Oops! Payment Link Has Expired"}</p>
        <button
          className="mt-3 text-sm flex relative items-center text-white font-semibold uppercase py-3.5 px-4 justify-evenly bg-color1 rounded w-5/6"
          onClick={() => router.push("/")}
        >
          {t("goToHomePage") || "Go To Homepage"}
        </button>
      </div>
    </div>
  );
};

export default PaymentLinkExpired;
