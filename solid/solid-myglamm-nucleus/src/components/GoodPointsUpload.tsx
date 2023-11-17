import { For, createEffect, createSignal } from "solid-js";
import { CommonIcon } from "./CommonIcon.js";
import { CommonButton } from "./CommonButton.jsx";
import { RadioButton } from "../components/common/RadioButton";
import { UploadImage } from "./UploadImage.jsx";

const ManualUploadForm = ({ setIsBulkUpload, isBulkUpload }: any) => {
  return (
    <form class="w-full max-w-[800px]">
      <div class="mb-4 mt-2">
        <div class="mb-4 mt-2 flex flex-row justify-between gap-4">
          <div class="w-1/2">
            <label class=" text-sm font-medium text-[#808593] after:content-['*'] after:ml-2 after:text-red-500" for="password">
              Event Name
            </label>
            <input
              class="mt-2 bg-white text-sm text-[#202841] appearance-none border border-[#e8e9ec] rounded w-full py-[6px] px-3 leading-tight focus:outline-none focus:border-primary"
              id="desktop"
              type="text"
              placeholder=""
            ></input>
          </div>
          <div class="w-1/2">
            <label class="text-sm font-medium text-[#808593] after:content-['*'] after:ml-2 after:text-red-500" for="password">
              Transaction Amount
            </label>
            <input
              class="mt-2 bg-white text-sm text-[#202841] appearance-none border border-[#e8e9ec] rounded w-full py-[6px] px-3 leading-tight focus:outline-none focus:border-primary"
              id="desktop"
              type="text"
              placeholder=""
            ></input>
          </div>
        </div>

        <div class="mb-4 mt-2 flex flex-row justify-between gap-4">
          <div class="w-1/2">
            <label class=" text-sm font-medium text-[#808593]" for="password">
              Transaction Type
            </label>
            <div class="w-full relative inline-flex self-center">
              <select class="mt-2 w-full py-[6px] px-3 text-sm font-medium text-[#808593] capitalize border border-[#e8e9ec] bg-white focus:outline-none appearance-none">
                <option>Credit</option>
                <option>Debit</option>
              </select>
              <span class="h-full flex align-middle items-center justify-center text-black absolute top-0 right-0 pointer-events-none">
                <CommonIcon icon="material-symbols:arrow-drop-down" />
              </span>
            </div>
          </div>
          <div class="w-1/2">
            <label class="text-sm font-medium text-[#808593]" for="password">
              Expiry Date
            </label>
            <input
              class="mt-2 bg-white text-sm text-[#202841] appearance-none border border-[#e8e9ec] rounded w-full py-[6px] px-3 leading-tight focus:outline-none focus:border-primary"
              id="desktop"
              type="text"
              placeholder=""
            ></input>
          </div>
        </div>

        <div class="mb-4 mt-2 flex flex-row justify-between gap-4">
          <div class="w-1/2">
            <label class=" text-sm font-medium text-[#808593] after:content-['*'] after:ml-2 after:text-red-500" for="password">
              Comments
            </label>
            <input
              class="mt-2 bg-white text-sm text-[#202841] appearance-none border border-[#e8e9ec] rounded w-full py-[6px] px-3 leading-tight focus:outline-none focus:border-primary"
              id="desktop"
              type="text"
              placeholder=""
            ></input>
          </div>
          <RadioButton
            labelText="Bulk"
            id="default-radio-1"
            checked={e => {
              console.log(!isBulkUpload(), "!isBulkUpload");
              setIsBulkUpload(!isBulkUpload());
            }}
            isChecked={isBulkUpload()}
          />
          <RadioButton
            labelText="Manual"
            id="default-radio-1"
            checked={e => {
              console.log(!isBulkUpload(), "!isBulkUpload");
              setIsBulkUpload(!isBulkUpload());
            }}
            isChecked={!isBulkUpload()}
          />
        </div>

        <div class="mb-4 mt-2 flex flex-row justify-between gap-4">
          <div class="w-full">
            <label class=" text-sm font-medium text-gray-700 after:content-['*'] after:ml-2 after:text-red-500" for="password">
              Search and Add Members in glammPOINTS List
            </label>
            <div class="mt-2 w-full relative inline-flex self-center">
              <select class="w-full py-[6px] px-3 text-sm font-medium text-[#808593] capitalize border border-[#e8e9ec] bg-white focus:outline-none appearance-none">
                <option>Enter to match</option>
                <option>cancelled</option>
              </select>
              <span class="h-full flex align-middle items-center justify-center text-black absolute top-0 right-0 pointer-events-none">
                <CommonIcon icon="material-symbols:arrow-drop-down" />
              </span>
            </div>
          </div>
          <div class="flex justify-center items-end">
            <CommonButton
              labelText="Add"
              bgWhite={false}
              btnType="button"
              isDisabled={false}
              // @ts-ignore
              customClass="h-8"
              clicked={() => true}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

const BulkUploadForm = ({ setIsBulkUpload, isBulkUpload }: any) => {
  return (
    <form class="w-full max-w-[800px]">
      <div class="mb-4 mt-2">
        <div class="mb-4 mt-2 flex flex-row justify-between gap-4">
          <div class="w-1/2">
            <label class=" text-sm font-medium text-[#808593] after:content-['*'] after:ml-2 after:text-red-500" for="password">
              Event Name
            </label>
            <input
              class="mt-2 bg-white text-sm text-[#202841] appearance-none border border-[#e8e9ec] rounded w-full py-[6px] px-3 leading-tight focus:outline-none focus:border-primary"
              id="desktop"
              type="text"
              placeholder=""
            ></input>
          </div>
          <div class="w-1/2">
            <label class="text-sm font-medium text-[#808593] after:content-['*'] after:ml-2 after:text-red-500" for="password">
              Transaction Amount
            </label>
            <input
              class="mt-2 bg-white text-sm text-[#202841] appearance-none border border-[#e8e9ec] rounded w-full py-[6px] px-3 leading-tight focus:outline-none focus:border-primary"
              id="desktop"
              type="text"
              placeholder=""
            ></input>
          </div>
        </div>

        <div class="mb-4 mt-2 gap-4">
          <RadioButton
            labelText="Bulk"
            id="default-radio-1"
            checked={e => {
              console.log(!isBulkUpload(), "!isBulkUpload");
              setIsBulkUpload(!isBulkUpload());
            }}
            isChecked={isBulkUpload()}
          />
          <RadioButton
            labelText="Manual"
            id="default-radio-1"
            checked={e => {
              console.log(!isBulkUpload(), "!isBulkUpload");
              setIsBulkUpload(!isBulkUpload());
            }}
            isChecked={!isBulkUpload()}
          />
        </div>

        <div class="mb-4 mt-2 flex flex-row justify-between gap-4">
          <a
            href="/csv/bulk-glammPoint-upload-format.csv"
            download="/csv/bulk-glammPoint-upload-format.csv"
            class="flex flex-row gap-3 py-[10px] px-[20px] rounded border border-[#ebedf2]"
          >
            <img src="/images/svg/files-icon-xls.svg" alt="xlsx"></img>
            <p class="text-sm font-normal text-grey-900">Download a sample file</p>
            <span class="text-[#202841]">
              <CommonIcon icon="ph:download-simple-fill" width={17} height={17} />
            </span>
          </a>
        </div>
        <div class="mb-4 mt-2 flex flex-row justify-between gap-4">
          <UploadImage />
        </div>
      </div>
    </form>
  );
};

const UploadedMember = ({ uploadedMember }: any) => {
  return (
    <>
      <div class="mt-8 mb-2 text-sm text-gray-700 font-medium">List of Members in glammPOINTS ( 2 Members)</div>
      <table class="min-w-full">
        <thead>
          <tr class="bg-white border">
            <For each={["First Name", "Last Name", "Action"]}>
              {(item, i) => <td class="text-sm text-[#908F97] font-light px-6 py-4 whitespace-nowrap">{item}</td>}
            </For>
          </tr>
        </thead>
        <tbody>
          <For each={uploadedMember}>
            {(item: any, i) => (
              <tr class="bg-white border border-t-none">
                <td class="text-sm text-[#272841] font-light px-6 py-4 whitespace-nowrap">{item.firstName}</td>
                <td class="text-sm text-[#272841] font-light px-6 py-4 whitespace-nowrap">{item.lastName}</td>
                <td>
                  {" "}
                  <div class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="cursor-pointer"
                      // onClick={(e) => deleteFunction(e)}
                    >
                      <CommonIcon icon="ri:delete-bin-6-line" width={17} height={17} />
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </>
  );
};

const GoodPointsUpload = () => {
  const [isBulkUpload, setIsBulkUpload] = createSignal(true);
  console.error("isBulkUpload()", isBulkUpload());
  createEffect(() => {}, [isBulkUpload()]);

  const dummyMmeber = [
    {
      firstName: "Ramesh",
      lastName: "Shetty",
    },
    {
      firstName: "Test",
      lastName: "Shetty",
    },
  ];

  return (
    <>
      <div class="p-5">
        {isBulkUpload() ? (
          <BulkUploadForm setIsBulkUpload={setIsBulkUpload} isBulkUpload={isBulkUpload} />
        ) : (
          <ManualUploadForm setIsBulkUpload={setIsBulkUpload} isBulkUpload={isBulkUpload} />
        )}
        {/* <UploadedMember uploadedMember={dummyMmeber} /> */}
        <div class="pt-4 flex justify-end">
          <CommonButton
            labelText="Save"
            bgWhite={false}
            btnType="button"
            isDisabled={false}
            // @ts-ignore
            clicked={() => {
              navigator;
            }}
          />
        </div>
      </div>
    </>
  );
};

export { GoodPointsUpload };
