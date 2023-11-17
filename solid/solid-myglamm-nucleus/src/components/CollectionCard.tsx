import { CommonIcon } from "./CommonIcon";
import StatusHandler from "./StatusHandler.jsx";
import clsx from "clsx";
interface CollectionProps {
  title: string;
  tag: string;
  redirectURL: string;
  language: string;
  productAvailable: number;
}

const CollectionCard = ({ title, tag, redirectURL, language, productAvailable }: CollectionProps) => {
  const deleteFunction = (e: any) => {
    e.preventDefault, alert("delete!");
  };
  const editFunction = (e: any) => {
    e.preventDefault, alert("edit!");
  };
  const handleStatus = (e: any) => {
    e.preventDefault, alert(` to ${e.target.value}`);
  };

  return (
    <div class="rounded-[3px] w-[260px] border border-[#e8e9ec] flex flex-col justify-between">
      <div class="h-[260px] w-full">
        <img
          class="h-full w-full"
          alt="image"
          src="https://s3.ap-south-1.amazonaws.com/files.myglamm.net/myglamm-alpha/1200x1200/Feed-01_2.jpg"
        ></img>
      </div>

      <div class="w-full px-4 py-5">
        <div class="mb-3 text-lg font-semibold capitalize text-ellipsis overflow-hidden whitespace-nowrap">{title}</div>
        <div class="w-36 bg-[var(--primary-light-color)] text-primary capitalize font-normal text-[14px] p-2 mb-3">
          {tag}
        </div>
        <div class="flex flex-row gap-3 text-primary">
          <CommonIcon icon="ic:baseline-link" rotate="90deg" />
          <div class="text-[15px] leading-6  mb-1 text-ellipsis overflow-hidden whitespace-nowrap">{redirectURL}</div>
        </div>
        <div class="flex flex-row justify-between">
          <p class="text-[14px] text-[#808593] uppercase ">{language}</p>
          <span
            class={clsx(
              "text-[14px] flex justify-center align-middle items-center gap-2 cursor-pointer",
              productAvailable === 0 ? "text-red-600" : "text-[#808593]"
            )}
          >
            {`${productAvailable} Products`}
          </span>
        </div>
      </div>
      <StatusHandler
        deleteFunction={deleteFunction}
        editFunction={editFunction}
        handleStatus={handleStatus}
        currentStatus={true}
      />
    </div>
  );
};

export { CollectionCard };
