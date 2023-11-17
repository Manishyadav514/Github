import { createSignal } from "solid-js";
import { CommonButton } from "../CommonButton";
import { CommonIcon } from "../CommonIcon";
import { Checkbox } from "../common/Checkbox";

interface ReviewPopupProps {
  onRequestClose: () => any;
}

function DeletePopup(props: ReviewPopupProps) {
  return (
    <div class="bg-slate-700/50 w-screen h-screen flex justify-around align-middle items-center">
      <div class="flex flex-col gap-4 justify-center items-center bg-white w-full max-w-[527px] p-6 rounded-md">
        <div class="w-32 h-32">
          <img src="https://nucleus-alpha.myglamm.net/assets/images/alert/warn.gif" alt="alert"></img>
        </div>
        <p class="text-base text-[#ffc021]">Delete Address</p>
        <p class="text-sm text-black">Are you sure you want to delete selected address?</p>
        <div class="flex justify-center gap-1 items-center pt-3">
          <CommonButton labelText="Yes" clicked={() => props.onRequestClose()} />
          <CommonButton labelText="No" clicked={() => props.onRequestClose()} />
        </div>
      </div>
    </div>
  );
}

export { DeletePopup };
