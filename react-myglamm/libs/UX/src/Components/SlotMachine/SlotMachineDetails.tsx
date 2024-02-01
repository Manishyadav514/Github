import React, { useState } from "react";
import HowItWorks from "@libComponents/PopupModal/HowItWorks";
import { ADOBE } from "@libConstants/Analytics.constant";
import Adobe from "@libUtils/analytics/adobe";

const SlotMachineDetails = ({ widgets }: any) => {
  const [showModal, setShowModal] = useState(false);
  const [slotMachineDetails, setSlotMachineDetails] = useState([]);

  const slotMachineDetailsAdobeClickEvent = (ctaName: string) => {
    (window as any).digitalData = {
      common: {
        linkName: `web|slot|${ctaName}`,
        linkPageName: ADOBE.ASSET_TYPE.SLOT_MACHINE,
        ctaName: ctaName,
        assetType: ADOBE.ASSET_TYPE.SLOT_MACHINE,
        newAssetType: ADOBE.ASSET_TYPE.SLOT_MACHINE,
        newLinkPageName: ADOBE.ASSET_TYPE.SLOT_MACHINE,
        pageLocation: "",
        platform: ADOBE.PLATFORM,
        subSection: ADOBE.ASSET_TYPE.SLOT_MACHINE,
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();
  };

  const getSlotMachineDetails = (widget: any, ctaName: any) => {
    /* Get widgets for how it works and faq */
    setShowModal(true);
    setSlotMachineDetails(widget);
    slotMachineDetailsAdobeClickEvent(ctaName);
  };
  return (
    <>
      <div className="fixed bottom-4 w-full">
        <ul className="flex justify-between list-none px-2">
          <li
            className="w-1/2  border-r border-gray-400 text-sm  text-center font-bold  flex justify-center items-center leading-tight"
            onClick={() => {
              getSlotMachineDetails(widgets[2], "how_it_works");
            }}
          >
            How it works
          </li>
          <li
            className="w-1/2  text-sm  text-center font-bold  flex justify-center items-center leading-tight"
            onClick={() => {
              getSlotMachineDetails(widgets[3], "FAQs");
            }}
          >
            FAQ
          </li>
        </ul>
      </div>
      {showModal && <HowItWorks show={showModal} hide={() => setShowModal(false)} widgets={slotMachineDetails} />}
    </>
  );
};
export default SlotMachineDetails;
