import { createSignal } from "solid-js";
import clsx from "clsx";

interface RadioButtonProps {
  labelText: string;
  id: string;
  isDisabled?: boolean;
  isChecked: boolean;
  checked: (isCheck: boolean) => any;
  customText?: string;
}

export function RadioButton({
  labelText,
  id,
  isDisabled = false,
  isChecked,
  checked,
  customText,
}: RadioButtonProps) {
  const [isCheck, setIsCheck] = createSignal(isChecked);
  return (
    <>
      <div class="mr-4 inline-flex items-center">
        <div
          class={clsx(
            "w-[18px] h-[18px] border-[2px] rounded-full relative before:-top-[0.5px] before:-left-[0.5px] before:w-[15px] before:h-[15px] before:rounded-full before:border-[4px] before:border-white before:absolute",
            isCheck()
              ? ` bg-primary border-primary ${
                  isDisabled && "opacity-50"
                }`
              : `bg-white border-slate-300 before:opacity-0 ${
                  isDisabled && " bg-slate-200"
                }`
          )}
        >
          <input
            type="radio"
            class="w-full h-full absolute top-0 left-0 opacity-0 cursor-pointer z-10"
            checked={isCheck()}
            onclick={() => {
              setIsCheck(!isCheck());
              checked(!isCheck());
            }}
            id={id}
            disabled={isDisabled}
          />
        </div>
        <label
          for={id}
          class={`${customText} ml-2 mt-0.5 relative text-sm leading-4	capitalize cursor-pointer`}
        >
          {labelText}
        </label>
      </div>
    </>
  );
}
