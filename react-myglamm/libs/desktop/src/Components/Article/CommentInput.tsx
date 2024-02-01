import React, { RefObject } from "react";

import { useSelector } from "@libHooks/useValtioSelector";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import ProfilePlaceholder from "@libComponents/CommonBBC/ProfilePlaceholder";

import { ValtioStore } from "@typesLib/ValtioStore";

import ProductAPI from "@libAPI/apis/ProductAPI";

import { SHOW_LOGIN_MODAL } from "@libStore/valtioStore";

interface PropTypes {
  articleId: string;
  postArticleComments: any;
}

const CommentInput = (props: PropTypes) => {
  const { userProfile } = useSelector((store: ValtioStore) => ({
    userProfile: store.userReducer.userProfile,
  }));

  const { articleId, postArticleComments } = props;
  const inputEl: RefObject<HTMLInputElement> = React.useRef(null);
  const hiddenFileInput: RefObject<HTMLInputElement> = React.useRef(null);
  const [selectedFile, setSelectedFile] = React.useState<any>(null);

  const postCommentAPICall = async (meta = null) => {
    const { value } = inputEl.current as HTMLInputElement;
    if (!value) {
      return;
    }
    const data = {
      articleId,
      answer: value,
    };
    postArticleComments(data, meta);
    (inputEl.current as HTMLInputElement).value = "";
    setSelectedFile(null);
  };
  const onSendComment = async () => {
    if (!userProfile?.id) {
      SHOW_LOGIN_MODAL({ show: true, hasGuestCheckout: false, onSuccess: () => {} });
      return;
    }
    if (selectedFile) {
      const productAPI = new ProductAPI();
      const formData = new FormData();
      formData.append("my_file", selectedFile.originalFile);
      productAPI.uploadImage(formData).then((response: any) => {
        const meta = {
          image: {
            original: response?.data?.[0]?.original,
            assetId: response?.data?.[0]?.assetId,
            assetName: response?.data?.[0]?.assetName,
          },
        };
        postCommentAPICall(meta as any);
      });
    } else {
      postCommentAPICall();
    }
  };

  const handleClick = () => {
    (hiddenFileInput.current as HTMLInputElement).click();
  };

  const handleFileChange = (event: any) => {
    if (event?.target?.files?.[0]) {
      const reader = new FileReader();
      const originalFile = event.target.files[0];
      if (originalFile.type.split("/")[0] === "image") {
        reader.onload = (e: any) => {
          setSelectedFile({
            originalFile,
            parsedFile: e.target.result,
          });
        };
        reader.readAsDataURL(event.target.files[0]);
      }

      (hiddenFileInput.current as HTMLInputElement).value = "";
    }
  };

  return (
    <div>
      <div className="flex center mb-3">
        {userProfile?.meta?.profileImage?.original ? (
          <div className="w-[40px] h-[40px] rounded-full flex items-center justify-center">
            <img src={userProfile?.meta?.profileImage?.original} alt="" className="rounded-full" />
          </div>
        ) : (
          <ProfilePlaceholder letter={userProfile?.firstName?.charAt(0)} />
        )}

        <div
          className="relative  px-4"
          style={{
            width: "calc(100% - 80px)",
          }}
        >
          <input
            placeholder="Write comment here…"
            className=" h-12 outline-0 border-solid border border-gray-200 text-xs text-stone-700 w-full bg-neutral-50 pr-12 pl-2 pt-3 pb-3.5"
            ref={inputEl}
          />
          <div className="absolute right-6 w-6 h-6 top-1/2 -translate-y-1/2" onClick={handleClick}>
            <ImageComponent src="/images/bbc-g3/gallery.svg" alt="gallery" width="100%" height="100%" />
            <input type="file" ref={hiddenFileInput} onChange={handleFileChange} accept="image/*" style={{ display: "none" }} />
          </div>
        </div>
        <div className="w-10 h-10 relative cursor-pointer flex items-center" onClick={onSendComment}>
          <ImageComponent src="/images/bbc-g3/desktop-send.svg" alt="send-btn" width="100%" height="100%" />
        </div>
      </div>
      {selectedFile?.parsedFile ? (
        <div className="flex justify-between mb-5">
          <ImageComponent src={selectedFile?.parsedFile} alt="selected-img" width="100" height="100" />
          <div onClick={() => setSelectedFile(null)}>
            <ImageComponent alt="close button" src="/images/bbc-g3/ico-close-popup.png" width="20" height="20" />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default React.memo(CommentInput);
