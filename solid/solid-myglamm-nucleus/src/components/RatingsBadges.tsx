import { createSignal } from "solid-js";
import { CommonIcon } from "./CommonIcon";

interface badgesPropsType {
  ratingText: string;
  isIcon?: boolean;
  ratingIcon?: any;
  isClicked?: boolean;
  clicked: (isClick: any) => any;
}

export function RatingsBadges({ ratingText, isIcon = false, ratingIcon, isClicked = false, clicked }: badgesPropsType) {
  const [isClick, setIsClick] = createSignal(isClicked);
  return (
    <>
      <div
        class={`my-2 mr-2 py-2 px-4 inline-flex items-center border border-slate-300 rounded-full cursor-pointer duration-300 font-semibold ${
          isClick() ? "bg-pink-400 text-white border-white" : "bg-transparent text-black border-slate-300"
        }`}
        onClick={() => {
          setIsClick(!isClick());
          clicked(isClick());
        }}
      >
        <span class="inline-block mt-1 mr-1 text-sm leading-3">{ratingText}</span>

        {isIcon && (
          <span class={`${isClick() ? "text-[#ffffff]" : "text-[#000000]"}`}>
            <CommonIcon icon={ratingIcon} width={16} height={16} />
          </span>
        )}
      </div>
    </>
  );
}
