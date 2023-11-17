import { createSignal } from "solid-js";
import { CommonIcon } from "../CommonIcon";
import { PopupModal } from "../common/PopupModal";
import { AddressCard } from "./AddressCard";
import { AddressPopup } from "./AddressPopup";

function Address() {
  const [togglePopup, setTogglePopup] = createSignal(false);
  return (
    <>
      <div>
        <div class="flex justify-end text-primary text-sm font-normal cursor-pointer">
          <button class="flex justify-center" onClick={() => setTogglePopup(!togglePopup())}>
            <CommonIcon height={17} width={17} icon="ic:outline-plus" />
            <span>Add New Address</span>
          </button>
        </div>
        <AddressCard />
      </div>
      <PopupModal show={togglePopup()} onRequestClose={() => setTogglePopup(!togglePopup())}>
        <AddressPopup onRequestClose={() => setTogglePopup(!togglePopup())} />
      </PopupModal>
    </>
  );
}

export { Address };
