import React from "react";
import Image from "next/legacy/image";
import Link from "next/link";
import { getStaticUrl } from "@libUtils/getStaticUrl";

interface PropTypes {
  userImageUrl: string;
  title: string;
  subtitle: string;
  link: string;
  work: string;
}

const AdvisoryCard: React.FC<PropTypes> = ({ userImageUrl, title, subtitle, link, work }) => {
  return (
    <Link href={link || "/advisory-board"} passHref title="advisory board" aria-label="advisory board">
      <div
        className="bg-white text-center p-6 rounded-sm my-8 hover:drop-shadow-xl hover:scale-105 hover:ease-in-out hover:duration-150"
        style={{ boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.15)" }}
      >
        {userImageUrl && (
          <Image alt={title} className="" src={userImageUrl} objectFit="contain" height="105" width="105" priority />
        )}
        <p className="text-lg text-black font-semibold pt-4">{title}</p>
        <p className="text-gray-500 text-base font-500 py-1 truncate">{work}</p>
        <p className="text-sm text-gray-800 pt-1 line-clamp-6 max-w-full text-ellipsis overflow-hidden">{subtitle}</p>

        {link && (
          <span className="pt-6 inline-flex items-center">
            <p className="text-themePink font-bold text-sm uppercase mr-2"> Read More </p>
            <img src={getStaticUrl("/svg/pink-arrow.svg")} alt="arrow" width="11px" height="10px" />
            {/* <span> {"→"} </span> */}
          </span>
        )}
      </div>
    </Link>
  );
};

export default AdvisoryCard;
