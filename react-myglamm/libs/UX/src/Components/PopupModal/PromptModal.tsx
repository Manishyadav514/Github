import React from "react";

const PromptModal = ({
  title = "",
  subTitle = "",
  onOk,
  onCancel,
}: {
  title: string;
  subTitle: string;
  onOk: any;
  onCancel: () => void;
}) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center top-0 left-0 fixed bg-black/60">
      <div className="rounded-xl bg-white">
        <div className="p-6">
          <p className=" text-18 font-bold text-center">{title}</p>
          <p className="mt-7 mb-4">{subTitle}</p>
        </div>
        <div className="flex items-center justify-between  border-t-2  border-gray-100">
          <button className="py-5 px-10 font-bold" onClick={onCancel}>
            No
          </button>
          <button className="py-5 px-10 font-bold" onClick={onOk}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptModal;
