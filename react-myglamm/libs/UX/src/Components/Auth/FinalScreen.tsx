import React from "react";

type FinalScreenProps = {
  t: (value: string) => string;
  redirect: any;
};
function FinalScreen({ t, redirect }: FinalScreenProps) {
  return (
    <div className="flex justify-center h-auto px-4 pt-2">
      <div className="w-full h-full">
        <img src={t("registrationRewardImage")} alt="rewards" className="rewards-image" />
        <h2
          className="font-bold text-lg mt-2 text-center"
          style={{
            fontSize: "24px",
          }}
        >
          {t("congratulationsNormal")}
        </h2>
        <p className="text-center mb-8 mt-4 text-lg">{t("registrationSuccessMsg")}</p>
        <button
          type="button"
          style={{
            backgroundImage: "linear-gradient(to left, #000000, #454545)",
            borderRadius: "2px",
          }}
          onClick={() => redirect(t("registrationRewardButtonCTAMweb") || "/buy/brands")}
          className="mx-auto mb-8 flex uppercase py-3 items-center text-white text-sm w-full h-full justify-center relative"
        >
          {t("registrationRewardCTAName")}
        </button>
        <div className="mx-auto mb-8 bg-white earn-glammpoints py-2 items-center text-white w-full text-sm w-3/4 h-full relative">
          <div>
            <a href={t("registrationRewardItemCTAMweb") || "/customer-profile"} aria-label={t("registrationRewardSubtitle")}>
              <div className="flex ml-2 p-3" style={{ alignItems: "center" }}>
                <div>
                  <img
                    alt="coin"
                    width="28"
                    height="28"
                    className="mr-4 mt-1"
                    src="https://files.myglamm.com/site-images/original/coin.png"
                  />
                </div>
                <figcaption className="text-black">
                  <strong className="text-sm">
                    {t("registrationRewardTitle")?.replace("{{glammPoints}} {{glammCurrency}}", t("customerPrefGlammpoints"))}
                  </strong>
                  <p className="text-xs" style={{ color: "#888888" }}>
                    {t("registrationRewardSubtitle")}
                  </p>
                </figcaption>
                <div className="absolute" style={{ right: "8px" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="32px"
                    height="32px"
                    viewBox="-1000 -100 1000 1000"
                  >
                    <path transform="scale(1,1) rotate(90)" fill="black" d="M500 346l-55 56-181-180-181 180-55-56 236-236z" />
                  </svg>
                </div>
              </div>
            </a>
          </div>
        </div>
        <button
          type="button"
          onClick={() => redirect("/")}
          className="mx-auto mb-8 flex py-2 items-center text-sm w-3/4 h-full justify-center relative  capitalize outline-none"
        >
          {t("continue")}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="20"
            height="20"
            viewBox="0 -50 1000 1000"
            style={{ marginLeft: "10px", marginTop: "3px" }}
          >
            <path
              transform="scale(1,-1) translate(0, -650)"
              fill="#000"
              d="M396 219l-121-125c-12-13-13-34-1-46 11-12 31-11 44 2l184 191c13 14 14 34 2 46l-170 177c-12 12-32 11-45-2-12-13-13-34-1-46l124-129-379 0c-19 0-33-15-33-34 0-18 15-34 33-34l363 0z m76 57l1 1 0-1c0 0-1 0-1 0l0 0z"
            />
          </svg>
        </button>
      </div>
      <style jsx>
        {`
          .rewards-image {
            padding: 23px;
          }
          .earn-glammpoints {
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06);
          }
        `}
      </style>
    </div>
  );
}

export default FinalScreen;
