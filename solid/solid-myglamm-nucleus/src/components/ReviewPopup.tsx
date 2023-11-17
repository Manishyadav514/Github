import { CommonButton } from "./CommonButton";
import { RatingCard, SubRatingCard } from "./CustomerReviewTable";

interface ReviewPopupProps {
  productName: string;
  customerName: string;
  productRating: number;
  date: string;
  country: string;
  comment: string;
  subParameters: any;
  imageSRC: string;
  onRequestClose: () => any;
}

function ReviewPopup({
  productName,
  customerName,
  productRating,
  date,
  country,
  comment,
  subParameters,
  imageSRC,
  onRequestClose,
}: ReviewPopupProps) {
  console.log(subParameters);
  return (
    <div class="bg-slate-700/50 w-screen h-screen flex justify-around align-middle items-center ">
      <div class="bg-white w-[480px] p-4 rounded-md">
        <div class="flex flex-row justify-between align-middle items-center mb-4">
          <p class="text-base">Customer Review </p>
          <span
            role="presentation"
            class="text-xl cursor-pointer"
            onClick={() => onRequestClose()}
          >
            &#10005;
          </span>
        </div>
        <div class="flex flex-col gap-4 py-4">
          <div class="text-base">{productName}</div>
          <div class="flex flex-row align-middle items-center gap-3 capitalize">
            <div class="text-base font-semibold ">{customerName}</div>
            <RatingCard rating={productRating} />
            <div class="text-sm text-[#90929F]">{date}</div>
            <div class="text-sm text-[#90929F]">|</div>
            <div class="text-sm text-[#90929F]">{country}</div>
          </div>
          <div class="text-sm">
            <p>{comment}</p>
          </div>
          <div class="whitespace-nowrap flex flex-row gap-2">
            <SubRatingCard subParameters={subParameters} />
          </div>
          <div>
            <img class="h-24 w-24" alt="image" src={imageSRC}></img>
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-8">
          <CommonButton
            labelText="Approve"
            bgWhite={true}
            btnType="button"
            isDisabled={false}
            // @ts-ignore
            clicked={() => props.onRequestClose()}
          />
          <CommonButton
            labelText="Disapprove"
            bgWhite={true}
            btnType="button"
            isDisabled={false}
            clicked={() => onRequestClose()}
          />
        </div>
      </div>
    </div>
  );
}

export { ReviewPopup };
