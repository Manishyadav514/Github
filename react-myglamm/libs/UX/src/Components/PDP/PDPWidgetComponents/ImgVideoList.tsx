import Image from "next/image";
import Link from "next/link";
import React from "react";

const ImgVideoList = ({
  review,
  productTag,
  value,
  index,
  totalCount,
  handleReviewImgClick,
}: {
  review: any;
  productTag: string;
  value: string;
  index: number;
  handleReviewImgClick: any;
  totalCount?: number;
}) => {
  const fileType = value.substr(value?.length - 3);
  const isLastAndMore = totalCount ? index === 4 && totalCount > 5 : false;

  const handleClick = () => {
    handleReviewImgClick({ ...review, image: value, filetype: fileType, greenRating: true }, index);
  };

  if(!value){
    return null
  }

  if (fileType === "mp4") {
    return (
      <div
        className="relative mr-2"
        key={value}
        onClick={() => {
          if (!isLastAndMore) {
            handleClick();
          }
        }}
      >
        <div
          className="absolute w-16 h-16 top-0 left-0 flex items-center justify-center overflow-hidden"
          style={{ background: "rgba(0,0,0,0.7)" }}
        >
          {isLastAndMore ? (
            <Link href={`${productTag}/allImages`}>
              <p className="text-white text-xs font-bold"> +{totalCount} </p>
            </Link>
          ) : (
            <img
              alt="Play Button"
              className=" m-auto w-5 h-5"
              src="https://files.myglamm.com/site-images/original/playbutton.png"
            />
          )}
        </div>
        <video src={value} className="w-16 h-16 object-center" preload="metadata"></video>
      </div>
    );
  }

  return (
    <div
      key={value}
      className="relative"
      onClick={() => {
        if (!isLastAndMore) {
          handleClick();
        }
      }}
    >
      {isLastAndMore && (
        <div
          className="absolute w-16 h-16 top-0 left-0 flex items-center justify-center overflow-hidden"
          style={{ background: "rgba(0,0,0,0.7)" }}
        >
          <Link href={`${productTag}/allImages`}>
            <p className="text-white text-xs font-bold"> +{totalCount}</p>
          </Link>
        </div>
      )}
      <Image height={64} width={64} src={value} alt="review image" className="w-16 h-16 object-center mr-2" />
    </div>
  );
};

export default ImgVideoList;
