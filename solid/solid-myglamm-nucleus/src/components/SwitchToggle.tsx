import { createSignal } from "solid-js";

interface checkboxPropsType {
  isChecked: any;
  checked: (isCheck: any) => any;
}

export function SwitchToggle({
  isChecked = false,
  checked,
}: checkboxPropsType) {
  const [isCheck, setIsCheck] = createSignal(isChecked);
  return (
    <>
      <div class="flex w-48 h-10 bg-slate-200 rounded-sm relative">
        <input
          type="checkbox"
          class="w-full h-full absolute top-0 left-0 opacity-0 cursor-pointer z-10"
          checked={isCheck()}
          onInput={() => {
            setIsCheck(!isCheck());
            checked(isCheck());
          }}
        />
        <span
          class={
            "w-24 h-full flex items-center justify-center text-sm text-white duration-[.4s]" +
            (isCheck()
              ? " bg-lime-500 translate-x-24"
              : " bg-red-600 translate-x-0")
          }
        >
          {isCheck() ? "Active" : "Inactive"}
        </span>
      </div>
    </>
  );
}
