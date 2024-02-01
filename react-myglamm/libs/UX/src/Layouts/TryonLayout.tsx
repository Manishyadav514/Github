import React, { Fragment, ReactElement, useState } from "react";
import { useRouter } from "next/router";

import useTranslation from "@libHooks/useTranslation";

import BackBtn from "@libComponents/LayoutComponents/BackBtn";
import BagButton from "@libComponents/Header/BagButton";

import { useSelector } from "@libHooks/useValtioSelector";

import { setTryonLocalImage, setTryonActiveState } from "@libStore/actions/tryonActions";

import GalleryIcon from "../../public/svg/gallery.svg";

import { ValtioStore } from "@typesLib/ValtioStore";

const TryonLayout = ({ children }: { children: ReactElement }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const { tryonActiveState } = useSelector((store: ValtioStore) => ({
    selectedImage: store.tryonReducer.selectedImage,
    tryonActiveState: store.tryonReducer.tryonActiveState,
  }));

  const getBase64 = (file: any) => {
    return new Promise(resolve => {
      let fileInfo;
      let baseURL: any = "";
      let reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };

  const onImageSelect = (e: any) => {
    if (e?.target?.files?.length) {
      const file: any = e.target.files[0];
      getBase64(file)
        .then(result => {
          file["base64"] = result;
          setTryonLocalImage(result);
          setTryonActiveState("image");
        })
        .catch(err => {
          console.error(err);
        });
    }
  };

  const handleBack = () => {
    if (tryonActiveState === "image") {
      setTryonLocalImage("");
      setTryonActiveState("camera");
    } else {
      if (window.history.length > 2) {
        router.back();
      } else {
        router.push("/");
      }
    }
  };

  return (
    <Fragment>
      <header className="flex justify-between w-full items-center sticky h-12 top-0 z-50 bg-white shadow">
        <BackBtn handleBack={handleBack} />
        <p className="flex-1 ml-4 font-semibold">{t("tryon") || "Try it on"}</p>
        {!(tryonActiveState === "image") ? (
          <div className="p-2 flex-end outline-none text-gray-700 cursor-pointer text-2xl text-center">
            <div className="image-upload">
              <label htmlFor="file-input">
                <GalleryIcon role="img" />
              </label>

              <input id="file-input" type="file" className="hidden" onChange={onImageSelect} accept=".png, .jpg" />
            </div>
          </div>
        ) : null}
        <BagButton />
      </header>

      {children}
    </Fragment>
  );
};

export default TryonLayout;
