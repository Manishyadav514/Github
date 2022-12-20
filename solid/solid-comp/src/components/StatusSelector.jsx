import { createSignal, For } from "solid-js";
import clsx from "clsx";
export const StatusSelector = () => {

  return (
    <div class="">
      <div class="relative">
        <div
          class={clsx(
            "rounded flex items-center border bg-white border-gray-300 p-2 h-10 w-full border-b-white"         )}
        >
          StatusSelector
        </div>
      </div>
    </div>
  );
};
