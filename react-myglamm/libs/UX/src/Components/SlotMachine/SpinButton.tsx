import React from "react";

const SpinButton = ({ triggerSlotSpinClick, spins, slotMachineData }: any) => {
  return (
    <div>
      <div className="mb-4 mt-4">
        <div
          className="container flex justify-center"
          style={{
            perspective: "320px",
          }}
        >
          <button
            type="button"
            className={`spinButton uppercase font-bold block border-none text-white text-lg rounded-lg`}
            onClick={() => {
              triggerSlotSpinClick();
            }}
          >
            {slotMachineData.btnCTA || "SPIN"}
          </button>
        </div>

        <p className="flex justify-center text-center text-xs mt-4 text-gray-500">
          <strong>{spins >= 0 ? spins : 0}</strong>/3 Spins Left
        </p>
      </div>
    </div>
  );
};

export default SpinButton;
