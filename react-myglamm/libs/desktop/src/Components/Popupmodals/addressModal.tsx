import React from "react";

import PopupModal from "@libComponents/PopupModal/PopupModal";

import { UserAddress } from "@typesLib/Consumer";

import ShippingAddress from "../address/shipping-address";

interface AddressModal {
  show: boolean;
  hide: () => void;
  selectedAddress?: UserAddress;
}

const AddressModal = ({ show, hide, selectedAddress }: AddressModal) => (
  <PopupModal type="center-modal" show={show} onRequestClose={hide}>
    <div className="bg-white rounded-lg" style={{ width: "1280px" }}>
      <button onClick={hide} type="button" className="close absolute top-10 right-8 cursor-pointer z-20 text-5xl">
        ×
      </button>

      <div className="pt-0.5">
        <ShippingAddress initialState={selectedAddress} onBack={hide} isAddAddress={!selectedAddress} />
      </div>
    </div>
  </PopupModal>
);

export default AddressModal;
