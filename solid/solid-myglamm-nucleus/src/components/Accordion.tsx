import { createSignal, For, Show } from "solid-js";
import clsx from "clsx";
import { CommonIcon } from "./CommonIcon";
function Accordion({ isProduct = false, accordionData, defaultOpenIndex = undefined }: any) {
  const setAccordionData = (dataArray: any) => {
    return dataArray.map((x: any, index: number) => {
      if (defaultOpenIndex && typeof defaultOpenIndex === "number" && defaultOpenIndex === index + 1) {
        return true;
      } else {
        return false;
      }
    });
  };

  const [isActive, setIsActive] = createSignal(setAccordionData(accordionData));
  const accOpen = (targetIndex: any) => {
    let updatedArray = [...isActive()];
    updatedArray[targetIndex] = !isActive()[targetIndex];
    setIsActive(updatedArray);
  };

  if (!isProduct) {
    return (
      <>
        <div class="accordian">
          <For each={accordionData}>
            {(d: any, i) => (
              <div class="accordian-item border mb-4" onClick={() => accOpen(i())}>
                <div class={clsx("accordian-title flex  p-3 cursor-pointer", isActive()[i()] ? "border-b" : "")}>
                  <div class="mr-auto">{d.title} </div> <span class="text-lg font-semibold">{isActive()[i()] ? "-" : "+"}</span>
                </div>
                {isActive()[i()] && <div class="accordian-content p-4"> {d.content}</div>}
              </div>
            )}
          </For>
        </div>
      </>
    );
  }
  // for product preview
  else if (isProduct) {
    return (
      <>
        <div class="accordian">
          <For each={accordionData}>
            {(d: any, i) => (
              <div class="accordian-item" onClick={() => accOpen(i())}>
                <div class={clsx("accordian-title flex cursor-pointer")}>
                  <div class="mr-auto mb-4 text-base	font-semibold text-black">{d.title} </div>{" "}
                  <span class="leading-[0px] text-[#000000]">
                    {isActive()[i()] ? (
                      <CommonIcon icon="material-symbols:keyboard-arrow-up-rounded" />
                    ) : (
                      <CommonIcon icon="material-symbols:keyboard-arrow-down-rounded" />
                    )}
                  </span>
                </div>
                {isActive()[i()] && <div class="accordian-content mb-4"> {d.content}</div>}
              </div>
            )}
          </For>
        </div>
      </>
    );
  }
}

export { Accordion };
