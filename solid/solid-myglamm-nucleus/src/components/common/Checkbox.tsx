import { createSignal } from "solid-js";

interface checkboxPropsType {
  labelText: string;
  id: string;
  isDisabled?: boolean;
  isChecked?: boolean;
  checked: (isCheck: boolean) => any;
  customText?:string;
}

export function Checkbox({
  labelText,
  id,
  isDisabled = false,
  isChecked = false,
  checked,
  customText
}: checkboxPropsType) {
  const [isCheck, setIsCheck] = createSignal(isChecked);
  return (
    <>
      <div class="mr-4 inline-flex items-center">
        <div
          class={
            "mr-2 w-5 h-5 border border-solid border-slate-300 rounded relative before:w-1.5 before:h-3 before:border-2 before:border-solid before:border-white before:border-t-0 before:border-l-0 before:absolute before:top-0.5 before:left-1.5 before:block before:rotate-45" +
            (isCheck()
              ? ` bg-primary border-primary before:opacity-100 ${
                  isDisabled && " bg-primary opacity-50"
                }`
              : ` before:opacity-0 ${isDisabled && " bg-slate-200"}`)
          }
        >
          <input
            type="checkbox"
            class="w-full h-full absolute top-0 left-0 opacity-0 cursor-pointer z-10"
            checked={isCheck()}
            onInput={() => {
              setIsCheck(!isCheck());
              checked(isCheck());
            }}
            id={id}
            disabled={isDisabled}
          />
        </div>
        <label
          for={id}
          class={`${customText} mt-0.5 relative text-sm leading-4	capitalize cursor-pointer`}
        >
          {labelText}
        </label>
      </div>
    </>
  );
}
