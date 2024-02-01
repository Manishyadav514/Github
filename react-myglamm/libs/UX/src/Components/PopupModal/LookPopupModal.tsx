import React, { Fragment, useEffect, useState } from "react";

import dynamic from "next/dynamic";

import WidgetAPI from "@libAPI/apis/WidgetAPI";

import { CBWidgetsProps } from "@typesLib/Widgets";

import { checkCBPopupLocally } from "@productLib/pdp/HelperFunc";

import PopupModal from "./PopupModal";

import CrossIcon from "../../../public/svg/cross-icon.svg";

const PhotoSlurpModal = dynamic(
  () => import(/* webpackChunkName: "PhotoSlurpModal" */ "@libComponents/PopupModal/PhotoSlurpModal"),
  { ssr: false }
);

const LookPopupModal = ({ show, hide, widget }: CBWidgetsProps) => {
  const { title, apiUrl, background, imgSrc } = JSON.parse(widget.meta.widgetMeta || "{}");

  const [photoSlurp, setPhotoSlurp] = useState<any>();
  const [showPSModal, setShowPSModal] = useState<boolean | undefined>();

  useEffect(() => {
    if (apiUrl && checkCBPopupLocally("photoslurp")) {
      const widgetApi = new WidgetAPI();
      widgetApi.getPhotoSlurp(apiUrl, 1).then(({ data }) => setPhotoSlurp(data.data?.results?.[0]));
    }
  }, []);

  if (!photoSlurp) {
    return null;
  }

  return (
    <Fragment>
      <PopupModal show={show} onRequestClose={hide} additionClass="w-1/2 lookPopup" type="center-modal">
        <style jsx global>
          {`
            .lookPopup {
              bottom: 4rem;
              right: 1rem;
            }
          `}
        </style>

        <section
          className="border-color1 rounded-md overflow-hidden"
          style={{
            padding: "3px",
            background:
              "linear-gradient(to bottom, #E3251A 0%, #74BD44 25%, #D18537 50%,#4ED8EF 50%, #CB73DF 75%, #D0A660 95%)",
          }}
        >
          <button
            type="button"
            onClick={hide}
            className="bg-white rounded-full w-max absolute -right-1.5 -top-1.5 aspect-square z-10"
          >
            <CrossIcon width={19} height={19} className="w-5" />
          </button>

          <img src={imgSrc} alt="Banner Caption Image" className="absolute w-20 inset-x-0 mx-auto -top-9 z-10" />
          <div
            onClick={() => {
              hide();
              setShowPSModal(true);
            }}
            className="relative"
          >
            <div style={{ background }} className="absolute inset-0 m-auto" />
            <img className="w-full rounded-md" alt={photoSlurp.title} src={photoSlurp.images.medium.url} />

            <p className="leading-tight text-white font-bold capitalize bottom-4 inset-x-4 text-22 absolute">{title}</p>
          </div>
        </section>
      </PopupModal>

      {typeof showPSModal === "boolean" && (
        <PhotoSlurpModal
          show={showPSModal}
          activeSlurpIndex={0}
          photoSlurpData={[photoSlurp]}
          hide={() => setShowPSModal(false)}
        />
      )}
    </Fragment>
  );
};

export default LookPopupModal;
