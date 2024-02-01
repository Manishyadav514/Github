import React, { useState } from "react";
import dynamic from "next/dynamic";

const SignupMiniPDPModal = dynamic(
  () => import(/* webpackChunkName: "SignupMiniPDPModal" */ "@libComponents/PopupModal/SignupMiniPDPModal"),
  { ssr: false }
);

type SignupFreeLipstickProps = {
  t: (value: string) => string;
  redirect: any;
};

function SignupFreeLipstickThankyou({ t, redirect }: SignupFreeLipstickProps) {
  const [showMiniPDPModal, setShowMiniPDPModal] = useState(false);

  return (
    <div className="flex justify-center h-auto px-8 pt-2">
      <div className=" h-full">
        <img
          alt="Sign up for a free lipstick"
          className="block my-10 mx-auto h-64"
          src="https://files.myglamm.com/site-images/original/Signupfreelipstick-congratulations.png"
        />
        <p className="text-center mb-8">
          Get Your <b>FREE</b> LIT Liquid Matte Lipstick by MyGlamm worth Rs 395.
        </p>
        <button
          type="button"
          style={{
            backgroundImage: "linear-gradient(to left, #000000, #454545)",
            borderRadius: "2px",
          }}
          onClick={() => {
            setShowMiniPDPModal(true);
          }}
          className="mx-auto mb-8 flex uppercase py-2 items-center text-white text-sm w-3/4 h-full justify-center relative"
        >
          GET FREE LIPSTICK
        </button>
        <button
          type="button"
          onClick={() => redirect("/glamm-insider")}
          className="mx-auto mb-8 flex uppercase py-2 items-center text-sm w-3/4 h-full justify-center relative"
        >
          Continue
          <img src="https://files.myglamm.com/site-images/original/continue.png" alt="Continue" className="pl-2 block" />
        </button>
      </div>

      {/* MINI PDP MODAL */}
      {t("surveyRewards")?.length > 0 &&
        // @ts-ignore
        t("surveyRewards")[0]?.couponURL1?.split("?")[0] && (
          <SignupMiniPDPModal
            show={showMiniPDPModal}
            hide={() => setShowMiniPDPModal(false)}
            productSlug={
              // @ts-ignore
              t("surveyRewards")[0].couponURL1.split("?")[0]
            }
          />
        )}
    </div>
  );
}

export default SignupFreeLipstickThankyou;
