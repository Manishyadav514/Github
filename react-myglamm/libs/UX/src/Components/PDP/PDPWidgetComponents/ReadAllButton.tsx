import Link from "next/link";
import React from "react";
import RightArrow from "../../../../public/svg/rightArrow2.svg";

const ReadAllButton = ({
  ctaText,
  link,
  visible = true,
  onClick,
}: {
  ctaText: string;
  link: string;
  visible?: boolean;
  onClick?: any;
}) => {
  if (!visible) {
    return null;
  }

  if (onClick) {
    return (
      <button
        type="button"
        className="font-bold w-full text-sm text-color1 text-center outline-none h-14 uppercase relative bg-white flex items-center justify-center gap-1"
        onClick={onClick}
      >
        {ctaText} <RightArrow height="10px" width="10px" />
      </button>
    );
  }

  return (
    <Link
      className="font-bold w-full text-sm text-color1 text-center outline-none h-14 uppercase relative bg-white flex items-center justify-center gap-1"
      href={link}
    >
      {ctaText} <RightArrow height="10px" width="10px" />
    </Link>
  );
};

export default ReadAllButton;
