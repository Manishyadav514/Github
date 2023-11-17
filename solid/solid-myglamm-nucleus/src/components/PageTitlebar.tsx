// import { createSignal, For, Show } from "solid-js";
// import clsx from "clsx";
import { For,  } from "solid-js";
import { CommonButton } from "./CommonButton";
interface PageTilebarProps {
  url?: string;
  addBtnTrigger?: any;
  breadcrumb: any;
  pageTitle?: string;
  ItemCount?: number;
  btnText?: string;
  children?: any;
}

function PageTitlebar(props: PageTilebarProps) {
  return (
    <div class="mb-[21px]">
      {/* breadcrumb */}
      <ul class="breadcrumb m-0 p-0 flex flex-wrap text-[#808593] text-xs">
        <For each={props.breadcrumb}>
          {(breadcrumb: any, i) => (
            <li class="breadcrumb-item first:pl-0 pl-2 first:before:content-[''] first:before:pr-0 before:content-['/'] before:pr-2">
              <a href={breadcrumb.routerLink}>{breadcrumb.name}</a>
            </li>
          )}
        </For>
      </ul>
      <div class="flex flex-wrap items-end">
        {/* Page Title Section */}
        <div class="w-5/12 text-[21px] font-semibold">
          <div>
            {props.pageTitle}
            {props.ItemCount && <span> ({props.ItemCount}) </span>}
          </div>
        </div>
        {/* Add Button */}
        {props.btnText && (
          <div class="w-7/12 flex justify-end items-center ">
            {props.children}
            <CommonButton
              labelText={props.btnText}
              btnType="button"
              btnIcon="material-symbols:add"
              isDisabled={false}
              customClass="mx-3"
              clicked={() => props.addBtnTrigger()}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export { PageTitlebar };
