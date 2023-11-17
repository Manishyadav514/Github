import { CommonButton } from "../CommonButton";

interface ReviewPopupProps {
  onRequestClose: () => any;
}

function SecureLoginPopup(props: ReviewPopupProps) {
  return (
    <div class="bg-slate-700/50 w-screen h-screen flex justify-around align-middle items-center ">
      <div class="bg-white w-[539px] rounded-md">
        <div class="flex flex-row justify-between align-middle items-center p-4 border-b">
          <p class="text-base font-bold">Secure Login </p>
        </div>
        <div class="w-fullbg-cyan-100 flex flex-col items-center p-8">
          <div class="text-center max-w-[250px]">
            <p>
              <strong>Secure token</strong> required for this module. Please login to continue.
            </p>
          </div>
          <div class="w-full rela flex justify-center mt-8">
            <CommonButton labelText="Login" clicked={() => props.onRequestClose()} />
          </div>
        </div>
      </div>
    </div>
  );
}

export { SecureLoginPopup };
