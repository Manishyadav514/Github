import React from "react";
import Link from "next/link";
import { getStaticUrl } from "@libUtils/getStaticUrl";

const GOOGLE_PLAY = "https://babyc.in/l/YPtM";
const APP_STORE = "https://babyc.in/l/AtPE";

const modalData: any = {
  bookmark: {
    title: "Want to save the article and read it later?",
    subtitle: "Download the app now!",
  },
  like: {
    title: "Love this post?",
    subtitle: "Download the app now! and get thousand more!",
  },
  chat: {
    title: "Want to chat with {authorName} ?",
    subtitle: "Download the app now!",
  },
};
const ArticleDownloadAppModal = ({ onCloseModal, activeModal, authorDetails }: any) => {
  React.useEffect(() => {
    const widthBefore: any = document.body.offsetWidth;
    document.body.style.overflow = "hidden";
    document.body.style.marginRight = `${document.body.offsetWidth - widthBefore}px`;
  }, []);

  const onCloseModalInternal = () => {
    document.body.style.overflow = "auto";
    document.body.style.marginRight = "";
    onCloseModal();
  };

  return (
    <div>
      <div
        className="w-full h-full bg-transparent fixed top-0 left-0 z-[60]"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        onClick={onCloseModalInternal}
      />
      <div className={`fixed left-1/2 -translate-x-1/2 bg-white top-20 w-[300px] z-[70]`}>
        <div
          className={`modal-close-icon absolute w-[15px] h-[15px] rounded-full -top-[19px] right-0 bg-white cursor-pointer after:absolute after:top-1/2 after:left-1/2 after:inline-block after:-translate-x-1/2 after:-translate-y-1/2 after:content-[00d7]`}
          onClick={onCloseModalInternal}
        />
        <>
          <img src={getStaticUrl("/images/bbc-g3/download-app/popup-banner.png")} alt="" />
          <p className="mt-4 mb-2 w-[70%] display-block mx-auto text-base font-semibold text-center text-color1">
            {modalData?.[activeModal]?.title?.replace("{authorName}", authorDetails?.display_name)}
          </p>
          <p className="font-normal text-sm text-center w-[70%] display-block mx-auto">{modalData?.[activeModal]?.subtitle}</p>
          <div className="flex items-center justify-center my-2">
            <Link href={GOOGLE_PLAY} passHref target="_blank" rel="noopener noreferrer" aria-label="app store">
              <img src={getStaticUrl("/images/bbc-g3/download-app/app-store1.png")} alt="app store icon" className="mr-2" />
            </Link>
            <Link href={APP_STORE} passHref target="_blank" rel="noopener noreferrer" aria-label="play store">
              <img src={getStaticUrl("/images/bbc-g3/download-app/google-play.png")} alt="playstore icon" />
            </Link>
          </div>
          <p className="mb-3 text-xs text-center text-gray-500">Available in English, हिंदी, தமிழ் and తెలుగు</p>
        </>
      </div>
    </div>
  );
};
ArticleDownloadAppModal.defaultProps = {
  customClassName: "",
};

export default React.memo(ArticleDownloadAppModal);
