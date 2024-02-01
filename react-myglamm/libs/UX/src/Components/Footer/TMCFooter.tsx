import React from "react";

import { getStaticUrl } from "@libUtils/getStaticUrl";

const TMCFooter = () => {
  return (
    <footer className="px-5 py-6 bg-white">
      <ul className="list-none px-5 py-0 flex items-center justify-between" role="list">
        <li role="listitem">
          <a href="https://www.facebook.com/TheMomsCo" target="_blank" aria-label="facebook">
            <img loading="lazy" src={getStaticUrl("/svg/facebook.svg")} alt="facebook" />
          </a>
        </li>
        <li role="listitem">
          <a href="https://www.instagram.com/TheMomsCo/" target="_blank" aria-label="instagram">
            <img loading="lazy" src={getStaticUrl("/svg/insta.svg")} alt="insta" />
          </a>
        </li>
        <li role="listitem">
          <a href="https://www.youtube.com/channel/UCV0wtCows-JFIGk_xk2trag" target="_blank" aria-label="youtube">
            <img loading="lazy" src={getStaticUrl("/svg/youtube.svg")} alt="youtube" />
          </a>
        </li>
        <li role="listitem">
          <a href="https://twitter.com/themomsco?t=xTGiV3-F0bREjJIL5InBHw&s=09" target="_blank" aria-label="twitter">
            <img loading="lazy" src={getStaticUrl("/svg/twitter.svg")} alt="twitter" />
          </a>
        </li>
      </ul>
      <p className="mt-8 mb-3.5 text-sm font-extrabold text-black uppercase text-center">Download The MOMS co APP Now</p>
      <ul className="list-none flex justify-between" role="list">
        <li className="mr-4 grow" role="listitem">
          <a
            href="https://p0ljg.app.link/8SFdqu7Gdrb?_p=c41d29c19c1c61f4fc1e88"
            target="_blank"
            className="flex items-center justify-center py-3 px-5 bg-black rounded h-full"
            aria-label="playstore"
          >
            <img loading="lazy" src={getStaticUrl("/svg/playstore.svg")} alt="playstore" className="mr-4 inline-block" />
            <span className="mt-0.5 text-xs font-bold tracking-widest uppercase text-white">Playstore</span>
          </a>
        </li>
        <li className="grow" role="listitem">
          <a
            href="https://p0ljg.app.link/8SFdqu7Gdrb?_p=c41d29c19c1c61f4fc1e88"
            target="_blank"
            className="flex items-center justify-center py-3 px-5 bg-black rounded h-full"
            aria-label="appstore"
          >
            <img loading="lazy" src={getStaticUrl("/svg/appstore.svg")} alt="appstore" className="mr-4 inline-block" />
            <span className="mt-1 text-xs font-bold tracking-widest uppercase text-white">Appstore</span>
          </a>
        </li>
      </ul>
      <ul className="my-6 list-none flex justify-between" role="list">
        <li role="listitem">
          <img loading="lazy" src={getStaticUrl("/svg/paraben.svg")} alt="paraben" className="grayscale" />
        </li>
        <li role="listitem">
          <img loading="lazy" src={getStaticUrl("/svg/toxins.svg")} alt="toxins" className="grayscale" />
        </li>
        <li role="listitem">
          <img loading="lazy" src={getStaticUrl("/svg/sulphate.svg")} alt="sulphate" className="grayscale" />
        </li>
        <li role="listitem">
          <img loading="lazy" src={getStaticUrl("/svg/harmful-chemicals.svg")} alt="harmful-chemicals" className="grayscale" />
        </li>
      </ul>
      <p className="pt-3.5 border-t border-solid	border-[#6C727F] text-[10px] leading-[14px] text-black capitalize text-center">
        <img loading="lazy" src={getStaticUrl("/svg/copyright.svg")} alt="copyright" className="mr-1 inline-block" /> Copyright
        The Mom’s Co {new Date().getFullYear()}
      </p>
    </footer>
  );
};

export default TMCFooter;
