function CouponCode({ code, generated, validTill, usage, discountAmount }) {
  return (
    <div className=" w-[350px]  rounded-[3px]  border border-[#e8e9ec]">
      <div className="h-[160px] p-4 text-slate-100 bg-gradient-to-r from-[#64b3f4] to-[#c2e59c] ">
        <div className="my-2 mb-2 py-1 px-2 text-[18px] font-semibold capitalize border-dotted border-2 border-white">
          {code}
        </div>
        <p className="text-[14px]  uppercase">Discount</p>
        <div className="pb-2 text-[21px] font-semibold ">
          ₹ {discountAmount}
        </div>
      </div>
      <div className="h-[150px] p-4">
        <div className="flex flex-row justify-between py-4">
          <div className=" mb-2 text-[18px] font-semibold capitalize">
            {code}
          </div>
          <p className="text-[#808593] text-sm ml-4">Usage-{usage}</p>
        </div>

        <div className="flex flex-row justify-between py-4">
          <div className="flex flex-col">
            <p className="text-[12px] text-gray-700 ">Validity</p>
            <div className="pb-2 text-sm font-normal text-gray-700">
              {generated} - {validTill}
            </div>
          </div>
          <img
            className="relaitve -mt-4 mb-2"
            alt="expired-icon"
            src="https://nucleus-alpha.myglamm.net/assets/images/expired-icon.png"
          />
        </div>
      </div>
    </div>
  );
}

export { CouponCode };
