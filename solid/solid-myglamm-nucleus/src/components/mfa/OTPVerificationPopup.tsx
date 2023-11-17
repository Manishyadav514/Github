import { CommonButton } from "../CommonButton";

interface OTPVerificationProps {
  onRequestClose: () => any;
  resendOTP: () => any;
  verifyOTP: () => any;
  onInputChange: (e: any) => any;
}

function OTPVerificationPopup(props: OTPVerificationProps) {
  return (
    <div class="bg-slate-700/50 w-screen h-screen flex justify-around align-middle items-center ">
      <div class="bg-white w-[498px] rounded-md">
        <div class="flex flex-row justify-between align-middle items-center p-4 border-b">
          <p class="text-base font-bold">OTP Verification </p>
          <span role="presentation" class="text-xl cursor-pointer" onClick={() => props.onRequestClose()}>
            &#10005;
          </span>
        </div>
        <div class="w-full flex flex-col items-center px-8 pt-8 pb-4">
          <div class="text-base text-gray-400">
            <p class="mb-2">Enter Verification Code</p>
            <input
              class="mt-2 bg-white text-center appearance-none border border-[#e8e9ec] rounded w-full py-[6px] px-3 leading-tight focus:outline-none focus:border-primary"
              type="text"
              name="password"
              placeholder="OTP"
              onInput={e => props.onInputChange(e)}
            ></input>
          </div>
          <div class="mt-4 w-full bg-[#ffeeba] text-xs p-1 text-[#856404] text-center">
            <p>
              <strong>Info! :</strong> Token will be valid for 3hrs only.
            </p>
          </div>
        </div>
        <div class="border-t flex justify-end gap-3 p-4">
          <CommonButton labelText="Resend OTP" bgWhite={true} clicked={() => props.resendOTP()} />
          <CommonButton labelText="Verify OTP" clicked={() => props.verifyOTP()} />
        </div>
      </div>
    </div>
  );
}

export { OTPVerificationPopup };
