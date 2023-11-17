import StatusHandler from "./StatusHandler.jsx";

const CouponCode = ({
  code,
  issuedOn,
  validTill,
  usage,
  discountAmount,
  expired,
}) => {
  const deleteFunction = (e) => {
    e.preventDefault, alert("You clicked on delete!");
  };
  const editFunction = (e) => {
    e.preventDefault, alert("You clicked on edit!");
  };
  const handleStatus = (e) => {
    e.preventDefault, alert(`Changed status to ${e.target.value}`);
  };

  return (
    <div class=" w-[350px] rounded-[3px]  border border-[#e8e9ec] flex flex-col justify-between">
      <div class="h-[160px] p-4 text-slate-100 bg-gradient-to-r from-[#64b3f4] to-[#c2e59c] ">
        <div class=" w-[244px] my-2 mb-2 py-1 px-2 text-lg font-semibold capitalize border-dotted border-2 border-white">
          {code}
        </div>
        <p class="text-[14px]  uppercase">Discount</p>
        <div class="pb-2 text-[21px] font-semibold ">
          ₹ {discountAmount}
        </div>
      </div>
      <div class="h-[150px] p-4">
        <div class="flex flex-row justify-between py-4">
          <div class=" mb-2 text-lg font-semibold capitalize">
            {code}
          </div>
          <p class="text-[#808593] text-sm ml-4">Usage - {usage}</p>
        </div>

        <div class="flex flex-row justify-between pt-1 pb-4">
          <div class="flex flex-col text-left tracking-wide">
            <p class="text-[13px] text-gray-700 ">Validity</p>
            <div class="pb-2 text-[14px]  font-semibold leading-6 text-[#212529]">
              {issuedOn} - {validTill}
            </div>
          </div>
          {expired && (
            <img
              class="w-[67px] h-[40px] -mt-2 mb-2"
              alt="expired-icon"
              src="https://nucleus-alpha.myglamm.net/assets/images/expired-icon.png"
            />
          )}
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

export { CouponCode };
