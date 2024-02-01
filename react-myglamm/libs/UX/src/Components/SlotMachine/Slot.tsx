import React from "react";

const Slot = (props: any) => {
  const { index, items } = props;
  if (!items) return null;

  return (
    <div className="slot grow translate-y-0 overflow-y-scroll">
      <div className="slotItemsContainer">
        {items?.map((i: any, idx: any) => {
          return (
            <div key={`s-${index}-${idx}`} className="slotItem flex text-center items-center justify-center">
              <img src={i.image} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Slot;
