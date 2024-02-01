import React from "react";
import dynamic from "next/dynamic";
import useTranslation from "@libHooks/useTranslation";
import { getAppStoreRedirectionUrl } from "@libUtils/getAppStoreRedirectionUrl";

const PopupModal = dynamic(() => import("./PopupModal"), {
  ssr: false,
});

function TryOnModal({ show, onRequestClose, shortUrl }: any) {
  const { t } = useTranslation();

  return (
    <PopupModal show={show} onRequestClose={onRequestClose}>
      <section className="p-4 rounded-t-xl">
        {/* Close Btn */}
        <div className="flex justify-end items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="25px"
            height="25px"
            viewBox="0 -100 1000 1000"
            onClick={onRequestClose}
            role="img"
            aria-labelledby="close modal"
          >
            <path
              transform="scale(1,-1) translate(0, -650)"
              fill="#000"
              d="M434 35c13 0 24 3 33 11 9 8 14 17 14 27 0 8-3 15-10 22l-159 174 149 163c6 7 9 14 9 21 0 9-4 17-13 24-8 7-18 11-29 11-13 0-24-6-33-16l-134-148-134 146c-11 12-23 18-37 18-13 0-24-4-33-12-9-8-13-17-13-28 0-8 3-15 9-22l146-159-163-177c-6-6-8-12-8-19 0-10 4-18 13-25 9-8 19-11 31-11 12 0 22 5 31 15l147 162 148-161c9-11 22-16 36-16z"
            />
          </svg>
        </div>

        {/* Header */}
        <div className="flex justify-center items-center">
          <h1
            className="font-bold mx-3 mb-4"
            style={{
              backgroundImage: "linear-gradient(180deg,transparent 77%,#ffc0c0 0)",
              backgroundSize: "100% 86%",
              backgroundRepeat: "no-repeat",
              transition: "background-size .4s",
              display: "inline-block",
              padding: " 0 2px",
              fontSize: "30px",
              fontStretch: "normal",
              fontStyle: "normal",
              lineHeight: 1.1,
              letterSpacing: "normal",
              textAlign: "center",
            }}
          >
            {t("virtualTryOn")}
          </h1>
        </div>

        {/* Subtitle */}
        <div className="flex items-center text-center py-2 px-10">
          <h1
            className="text-lg font-bold"
            style={{
              lineHeight: 1.28,
              color: "#494949",
            }}
          >
            {t("nowYouCanTryalltheShades")}
          </h1>
        </div>

        {/* Image */}
        <div className="flex justify-center mx-auto py-4">
          <img
            src="https://files.myglamm.com/site-images/original/tryon-banner_2.png"
            alt="tryonBanner"
            style={{
              height: "250px",
              width: "250px",
            }}
          />
        </div>

        {/* Download Text */}
        <div className="flex justify-center items-center py-2">
          <p>{t("downloadTheAppToUse")}</p>
        </div>

        {/* Button */}
        <a
          className="flex justify-center items-center text-white font-bold"
          style={{
            height: "41px",
            borderRadius: "2px",
            backgroundImage: "linear-gradient(to left, rgb(0, 0, 0), rgb(69, 69, 69))",
            fontSize: "14px",
            lineHeight: 1.43,
          }}
          href={getAppStoreRedirectionUrl(shortUrl)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("tryNow")}
        >
          {t("tryNow")}
        </a>
      </section>
    </PopupModal>
  );
}

export default TryOnModal;
