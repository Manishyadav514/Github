import React, { useEffect, useState } from "react";
import PopupModal from "@libComponents/PopupModal/PopupModal";
import WidgetLabel from "@libComponents/HomeWidgets/WidgetLabel";
import { GiCloseIco } from "@libComponents/GlammIcons";
import OffersLogo from "../../../public/svg/offers-discount.svg";
import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import { fetchAllJuspayOffers } from "@libStore/actions/paymentActions";
import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

const AvailableOffers = () => {
  const { t } = useTranslation();
  const [showAllOffers, setShowAllOffers] = useState<boolean>(false);

  const { profile, payableAmount, vendorMerchantId, allJuspayOffers } = useSelector((store: ValtioStore) => ({
    profile: store.userReducer.userProfile,
    payableAmount: store.cartReducer.cart.payableAmount,
    vendorMerchantId: store.paymentReducer.vendorMerchantId,
    allJuspayOffers: store.paymentReducer.allJuspayOffers,
  }));

  useEffect(() => {
    if (checkUserLoginStatus()) {
      fetchAllJuspayOffers({ profile, payableAmount, vendorMerchantId });
    }
  }, []);

  if (!allJuspayOffers) {
    return null;
  }

  return (
    <React.Fragment>
      <AllOffers show={showAllOffers} onRequestClose={() => setShowAllOffers(!showAllOffers)} offersList={allJuspayOffers} />
      <div
        className="bg-white"
        style={{
          margin: "0 0 9px",
          boxShadow: "0 0 3px 0 rgba(0,0,0,.19)",
        }}
      >
        <div className="px-4 py-2 w-full text-left">
          <div className="flex justify-between items-center my-2 ">
            <div className="flex items-center">
              <OffersLogo />
              <div className="text-xs font-semibold ml-3">{t("availableOffers") || "Available Offers"}</div>
            </div>
            <button
              onClick={() => setShowAllOffers(true)}
              type="button"
              className="flex justify-content items-center text-xs text-color1"
            >
              <span className="ml-1">{t("viewAll")}</span>
            </button>
          </div>
          <ul>
            <li className="ml-6" style={{ color: "#d8d8d8" }}>
              <span className="text-sm text-gray-800 ml-2">
                {allJuspayOffers?.eligible.length
                  ? allJuspayOffers?.eligible?.[0]?.offer_description.description
                  : allJuspayOffers?.ineligible?.[0]?.offer_description.description}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </React.Fragment>
  );
};

const AllOffers = ({ show, onRequestClose, offersList }: any) => {
  // Merge all offers and display it together
  const allOffers = offersList ? [...offersList.eligible, ...offersList.ineligible] : [];

  return (
    <PopupModal show={show} onRequestClose={onRequestClose} type="bottom-modal">
      <div className="rounded-t-lg bg-white pt-0">
        <div aria-hidden="true" className="flex justify-end" onClick={onRequestClose}>
          <span className="pt-2 mr-1">
            <GiCloseIco name="close-ico" height="28" width="28" fill="#9b9b9b" />
          </span>
        </div>
        <div className="-mt-2.5 px-2">
          <WidgetLabel title="Available Offers" />
        </div>
        <div className="p-1.5">
          <ul>
            {allOffers?.length
              ? allOffers.map((offers: any) => (
                  <li className="ml-8" style={{ color: "#d8d8d8" }} key={offers.offer_id}>
                    <span className="text-sm text-gray-800">{offers.offer_description.description}</span>
                  </li>
                ))
              : []}
          </ul>
        </div>
      </div>
    </PopupModal>
  );
};

export default AvailableOffers;
