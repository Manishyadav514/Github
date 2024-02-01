import React, { useState, useEffect } from "react";

import useTranslation from "@libHooks/useTranslation";
import { GiCloseIco } from "@libComponents/GlammIcons";
import MyglammXOWidgets from "@libComponents/MyGlammXO/MyglammXOWidgets";
import PopupModal from "./PopupModal";

interface SlotMachineDetailsProps {
  show: boolean;
  hide: () => void;
  widgets: any;
}

const HowItWorks = ({ show, hide, widgets }: SlotMachineDetailsProps) => {
  const { t } = useTranslation();

  return (
    <PopupModal show={show} onRequestClose={hide}>
      <section className="px-4 py-6 relative rounded-t-md" style={{ background: "#fff5f1" }}>
        <GiCloseIco
          height="25"
          width="25"
          fill="#000000"
          onClick={hide}
          className="absolute right-1 top-3"
          role="img"
          aria-labelledby="close modal"
        />
        {widgets && <MyglammXOWidgets widget={widgets} />}
      </section>
    </PopupModal>
  );
};

export default HowItWorks;
