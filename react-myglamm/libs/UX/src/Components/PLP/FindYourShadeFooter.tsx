import useTranslation from "@libHooks/useTranslation";
import Link from "next/link";
import React from "react";
import { GiDownArrowIco } from "@libComponents/GlammIcons";

const FindYourShadeFooter = ({ slug }: { slug: string }) => {
  const { t } = useTranslation();

  return null;

  if (slug === "/buy/makeup/lips") {
    return (
      <Link
        href="/shade-finder"
        prefetch={false}
        className="flex text-center justify-center flex-col items-center z-40 fixed bottom-0 w-full inset-x-0 bg-cover bg-no-repeat pt-4 h-73px"
        style={{
          backgroundImage: "url(https://files.myglamm.com/site-images/original/shade-finder-btn-sticky.png)",
        }}
        aria-label="shade finder"
      >
        <GiDownArrowIco
          width="20"
          height="20"
          fill="#fff"
          transform="rotate(180)"
          viewBox="0 0 600 600"
          className="mr-2 transform rotate-180"
        />
        <span className="relative text-lg font-semibold text-white justify-center text-center">{t("findYourShade")}</span>
      </Link>
    );
  }
};

export default FindYourShadeFooter;
