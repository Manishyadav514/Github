import { createSignal } from "solid-js";
import { PageTitlebar } from "@components/PageTitlebar";
import { LinkGenerator } from "@components/LinkGenerator";
import { CommonIcon } from "@components/CommonIcon";
import { LinkBuildLog } from "@components/LinkBuildLog";

export const CRBreadcrumb = [
  {
    name: "Home",
    routerLink: "/",
  },
  {
    name: "Link Builder",
    routerLink: ["/link-builder"],
  },
  {
    name: "Edit Link",
  },
];

export default function LinkBuilder() {
  const [showLog, setShowLog] = createSignal(false);

  return (
    <div>
      <PageTitlebar breadcrumb={CRBreadcrumb} pageTitle="Edit Link" />
      <div class="flex justify-end">
        {showLog() ? (
          <></>
        ) : (
          <button
            class="py-2 px-3 rounded border border-[#dee2e6] text-[#212529] bg-white hover:bg-primary hover:text-white hover:border-primary transition ease-in-out delay-75 flex items-center align-middle"
            onclick={() => {
              setShowLog(!showLog());
            }}
          >
            <span class="text-[#212529]"></span>
            <CommonIcon icon="ic:baseline-remove-red-eye" height={17} width={17} />
            <span class="ml-2 text-sm text-center">Log</span>
          </button>
        )}
        {/* <CommonButton
            labelText="log"
            bgWhite={true}
            btnIcon="ic:baseline-remove-red-eye"
            btnType="button"
            isDisabled={false}
            // @ts-ignore
            clicked={() => {
              setShowLog(!showLog());
            }}
          /> */}
      </div>
      <div class="bg-white pt-4">
        {showLog() ? (
          <div class="p-4 ">
            <div class="mb-4">
              <button
                class="py-2 px-3 rounded border border-[#dee2e6] text-[#212529] bg-white hover:bg-primary hover:text-white hover:border-primary transition ease-in-out delay-75 flex items-center align-middle"
                onclick={() => {
                  setShowLog(!showLog());
                }}
              >
                <span class="#212529"></span>
                <CommonIcon icon="ic:round-arrow-back" height={17} width={17} />
                <span class="ml-2 text-sm text-center">Back to edit</span>
              </button>
            </div>
            <LinkBuildLog />
          </div>
        ) : (
          <LinkGenerator />
        )}
      </div>
    </div>
  );
}
