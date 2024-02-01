import React from "react";

const PDPIconTag = ({ text, Icon }: any) => {
  return (
    <>
      <div className="bg-color1 pr-2 tag">
        <div className="flex items-center px-px">
          <Icon />
          <div className="text-[9px] text-white">{text}</div>
        </div>
      </div>
      <style>{`
        .tag {
          display: inline-block;
          border-radius: 2px;
          position: relative;
          width: fit-content;
        }
        .tag:before {
          background: var(--color1) radial-gradient(1.5px at 6px 50%, #fff 99%, transparent);
          content: "";
          height: 11px;
          width: 12px;
          position: absolute;
          border-radius: 4px 3px;
          top: 1px;
          transform: rotate(45deg);
          right: -4px;
        }
      `}</style>
    </>
  );
};

export default PDPIconTag;
