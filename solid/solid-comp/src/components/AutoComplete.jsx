import { createSignal, For } from "solid-js";
import clsx from "clsx";
function AutoComplete() {
  const [show, setShow] = createSignal(true);
  const change = (e) => {
    console.log(e);
  };
  const focus = (e) => {
    setShow(true);
  };
  const blur = (e) => {
    setShow(false);
  };
  const products = [
    "PopXO Sun Glaze",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
  ];
  return (
    <div class="">
      <div class="relative">
        <div
          class={clsx(
            "rounded flex items-center border bg-white border-gray-300 p-2 h-10 w-full",
            show() ? "border-b-white" : ""
          )}
        >
          <div class="flex items-center  text-xs px-2 text-white h-6 align-middle">
            <div class="bg-[color:var(--primary-light-color)] text-[color:var(--primary-color)] p-1 w-4 flex items-center justify-center mr-0.5">
              x
            </div>
            <span class="bg-[color:var(--primary-light-color)] p-1 text-[color:var(--primary-color)] whitespace-nowrap">
              PoPXo Makeup
            </span>
          </div>
          <input
            class="pl-2 outline-0 w-full"
            placeholder="Search For Product Tags"
            onChange={change}
            onFocus={focus}
            onBlur={blur}
          />
        </div>
        {show() && (
          <div class="absolute w-full h-40 overflow-y-scroll border-l border-r border-gray-300 rounded-b-lg">
            <For each={products}>
              {(p, i) => (
                <div
                  class={clsx(
                    "p-2 bg-white h-10 border-b border-gray-200 hover:text-[color:var(--primary-color)] hover:cursor-pointer hover:bg-[color:var(--primary-light-color)]",
                    i == 0 && "border-t"
                  )}
                >
                  {p}
                </div>
              )}
            </For>
          </div>
        )}
      </div>
    </div>
  );
}

export { AutoComplete };
