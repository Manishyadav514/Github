import { CommonIcon } from "./CommonIcon";
import clsx from "clsx";
interface buttonPropsType {
  labelText: string;
  bgWhite?: boolean;
  hoverLightPink?: boolean;
  btnIcon?: any;
  btnType?: any;
  isDisabled?: boolean;
  customClass?: any;
  clicked: (clicked:any) => any;
}

export function CommonButton({
  labelText,
  bgWhite = false,
  hoverLightPink = false,
  btnIcon,
  btnType = "button",
  isDisabled = false,
  customClass,
  clicked
}: buttonPropsType) {
  return (
    <>
      <button
        type={btnType}
        class={clsx(
          `${customClass} py-2.5 px-3 border border-solid rounded text-sm capitalize cursor-pointer inline-flex items-center transition ease-in-out delay-50`,
          `${
            bgWhite
              ? ` bg-white  ${isDisabled && "hover:bg-white hover:text-primary"}           ${
                  hoverLightPink
                    ? `text-[#212529] border-[#dee2e6] hover:text-primary hover:bg-secondary hover:border-secondary`
                    : "border-primary text-primary hover:bg-primary hover:text-white"
                }`
              : `bg-primary text-white`
          }`,
          `${isDisabled && "opacity-60 cursor-not-allowed"} `
        )}
        onClick={() => {
          clicked(true);
        }}
        disabled={isDisabled}
      >
        <span class={`${!bgWhite ? "text-[#ffffff]" : "text-primary"}`}></span>
        <CommonIcon icon={btnIcon} width={16} height={16} />
        <span class={`${btnIcon && " ml-1 mt-0.5"}`}>{labelText}</span>
      </button>
    </>
  );
}
