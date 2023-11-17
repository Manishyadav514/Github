import { createSignal } from "solid-js";
import { CommonIcon } from "../CommonIcon";
import { AddressPopup } from "./AddressPopup";
import { PopupModal } from "../common/PopupModal";
import { DeletePopup } from "./DeletePopup";

function AddressCard() {
  const [togglePopup, setTogglePopup] = createSignal(false);
  const [deletePopup, setDeletePopup] = createSignal(false);
  return (
    <>
      <div class="border rounded w-[327px] h-[260px] pl-5 py-7 text-[#202841] overflow-hidden">
        <div class="flex flex-row justify-between pb-4">
          <span class="bg-gray-200 text-gray-400 px-4 flex justify-center items-center">Home</span>
          <div class="pr-1 flex flex-row gap-3 text-primary">
            <span class="cursor-pointer" onClick={() => setTogglePopup(!togglePopup())}>
              <CommonIcon height={20} width={20} icon="ph:pencil-light" />
            </span>
            <span class="cursor-pointer" onClick={() => setDeletePopup(!deletePopup())}>
              <CommonIcon height={20} width={20} icon="ri:delete-bin-6-line" />
            </span>
          </div>
        </div>
        <p class="text-sm text-black font-semibold pb-4">Priyanka</p>
        <p class="text-sm font-normal pb-4">, , , Mumbai, Maharashtra, India, 4000051</p>
        <span class="leading-7 flex flex-row gap-2 items-center text-sm font-normal">
          <CommonIcon height={17} width={17} icon="mdi:email-open-outline" />
          <p>10443@babychakra.com</p>
        </span>
        <span class="leading-7 flex flex-row gap-2 items-center text-sm font-normal">
          <CommonIcon height={17} width={17} icon="circum:mobile-4" />
          <p>9000010443</p>
        </span>
      </div>
      <PopupModal show={togglePopup()} onRequestClose={() => setTogglePopup(!togglePopup())}>
        <AddressPopup onRequestClose={() => setTogglePopup(!togglePopup())} />
      </PopupModal>
      <PopupModal show={deletePopup()} onRequestClose={() => setDeletePopup(!deletePopup())}>
        <DeletePopup onRequestClose={() => setDeletePopup(!deletePopup())} />
      </PopupModal>
    </>
  );
}

export { AddressCard };
