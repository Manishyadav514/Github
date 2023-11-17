import { obsv$ } from "@/services/loader.service";
import { createSignal } from "solid-js";

export function Spinner() {
  obsv$.subscribe(res => {
    setLoaderData(res);
  });

  const [loaderData, setLoaderData] = createSignal<{ isVisible: boolean; message?: string }>();

  return (
    <>
      {loaderData()?.isVisible && (
        <div class="bg-black/30 fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center">
          <div class="flex flex-col items-center">
            <div class="border-4 border-solid border-[var(--primary-color)] rounded-full border-b-transparent w-[75px] h-[75px] animate-[spin_.8s_linear_infinite;]"></div>
            <p class="mt-1 text-white text-center text-base">{loaderData()?.message}</p>
          </div>
        </div>
      )}
    </>
  );
}
