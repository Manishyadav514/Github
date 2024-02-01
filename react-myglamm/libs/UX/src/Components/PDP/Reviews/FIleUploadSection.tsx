import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import ProductAPI from "@libAPI/apis/ProductAPI";
import useTranslation from "@libHooks/useTranslation";
import { SHOW_LOGIN_MODAL } from "@libStore/valtioStore";
import React, { useEffect, useState } from "react";
import UploadIcon from "../../../../public/svg/upload-image.svg";
import Spinner from "@libComponents/Common/LoadSpinner";
import RenderUploadedImage from "./RenderUploadedImage";

const FIleUploadSection = ({ uploadImageUrl, setUploadImageUrl }: any) => {
  const { t } = useTranslation();
  const [isSpinnerOn, setisSpinnerOn] = useState(false);
  const [isImageSpinnerOn, setisImageSpinnerOn] = useState(false);
  const [videoLimit, setVideoLimit] = useState<number>(0);
  const [mediaLimit, setMediaLimit] = useState<number>(0);
  const [isFilePicked, setFilePicked] = useState(false);
  const [selectedFile, setSelectedFile] = useState<Array<any>>([]);

  const reviewPoints: Array<string> = t("reviewsPoints") || [
    "Get 25% discount Coupon for next purchase for Writing Review and additional 5% for uploading Photos",
    "Stand a chance to get featured with the product and become an inspiration for millions of customers.",
  ];

  const attachBlob = (files: any) =>
    files.map((s: any) => {
      if (!s.imageSrc) {
        const imgSrc = URL.createObjectURL(s);
        s.imageSrc = imgSrc;
      }
      return s;
    });

  const changeHandler = (event: any) => {
    let duplicate = false;
    const fileType = event?.target?.files[0]?.type?.slice(0, 5);
    if (videoLimit > 0 && fileType === "video") {
      return alert("Video Limit Reached");
    }
    selectedFile?.map((val: any) => {
      if (val.name === event.target.files[0].name) {
        duplicate = true;
      }
    });

    if (checkUserLoginStatus()) {
      if (!duplicate) {
        setisSpinnerOn(true);
        setisImageSpinnerOn(true);
        setSelectedFile(attachBlob([...selectedFile, ...event.target.files]));
        setFilePicked(true);

        // const formData = new FormData();
        const imageFormData = new FormData();
        const uploadFileList = [...event.target.files];
        const imageUrls: any[] = [];

        if (Array.isArray(uploadFileList) && uploadFileList.length > 0) {
          setMediaLimit(mediaLimit + 1);
          setVideoLimit(fileType === "video" ? videoLimit + 1 : videoLimit + 0);
          uploadFileList.forEach((file: any, index: number) => {
            imageFormData.append(`my_file`, file);
            // formData.append(`my_file`, file);
          });
        }

        const api = new ProductAPI();

        if (fileType === "image") {
          api
            .uploadImage(imageFormData)
            .then((res: any) => {
              if (res?.data) {
                res.data.forEach((image: any) => {
                  imageUrls.push(image.original);
                });
                setUploadImageUrl([...uploadImageUrl, ...imageUrls]);
                setisSpinnerOn(false);
                setisImageSpinnerOn(false);
              }
            })
            .catch((error: any) => {
              setisSpinnerOn(false);
              setisImageSpinnerOn(false);
            });
        } else {
          api
            .uploadVideo(imageFormData)
            .then((res: any) => {
              if (res?.data) {
                res.data.forEach((image: any) => {
                  imageUrls.push(image.original);
                });
                setUploadImageUrl([...uploadImageUrl, ...imageUrls]);
                setisSpinnerOn(false);
                setisImageSpinnerOn(false);
              }
            })
            .catch((error: any) => {
              setisSpinnerOn(false);
              setisImageSpinnerOn(false);
            });
        }
      } else {
        alert("File already exist");
      }
      event.target.value = "";
    } else {
      SHOW_LOGIN_MODAL({ type: "onlyMobile", show: true, onSuccess: () => changeHandler(event) });
    }
  };

  useEffect(() => {
    return () => {
      setisSpinnerOn(false);
      setisImageSpinnerOn(false);
      setMediaLimit(0);
      setUploadImageUrl([]);
      setVideoLimit(0);
      setFilePicked(false);
      setSelectedFile([]);
    };
  }, []);

  return (
    <div className="px-4 pt-4 bg-color2">
      <div>
        <p className="uppercase font-bold text-sm pb-1">{t("uploadPhotos") || "Upload Photos"}</p>
        <ul className=" text-gray-500 text-11 ml-4 pb-4">
          {reviewPoints?.map((point: any) => {
            return <li className="pt-2" key={point}>{point}</li>;
          })}
        </ul>
      </div>
      <ul className="mb-3 pl-4">
        {mediaLimit > 2 && !isSpinnerOn && <li className="text-red-600  text-xs">Media limit reached</li>}

        {videoLimit > 0 && <li className="text-red-600 text-xs">Video limit reached</li>}
      </ul>

      <div>
        <div className="w-full mr-2 font-semibold rounded-sm outline-none relative">
          <input
            id="upload_image"
            type="file"
            name="file"
            onChange={changeHandler}
            accept="image/*,video/mp4"
            //multiple
            hidden
            disabled={isImageSpinnerOn || mediaLimit > 2}
          />
          <label
            htmlFor="upload_image"
            className={` flex gap-3 items-center px-5 py-2 border border-gray-200 bg-white font-semibold capitalize rounded text-gray-600 ${
              isImageSpinnerOn || (mediaLimit > 2 && "opacity-50")
            }  `}
          >
            <>
              {isImageSpinnerOn ? (
                <>
                  <div className="mx-auto">
                    <Spinner className="w-5 inline-flex mr-2 relative" />
                    <span className="text-xs relative mt-1">{t("uploading") || `Uploading ...`}</span>
                  </div>
                </>
              ) : (
                <>
                  <UploadIcon />
                  <p className="text-11 font-normal">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: t("uploadText") || "Add Photos or Videos <br/> Click here or drag to upload",
                      }}
                    />
                  </p>
                </>
              )}
            </>
          </label>
        </div>

        {isFilePicked && Array.isArray(selectedFile) ? (
          <>
            <div className="overflow-y-scroll">
              <ul className="mt-2.5 inline-flex gap-1">
                <RenderUploadedImage
                  mediaLimit={mediaLimit}
                  selectedFile={selectedFile}
                  isImageSpinnerOn={isImageSpinnerOn}
                  setSelectedFile={setSelectedFile}
                  setUploadImageUrl={setUploadImageUrl}
                  setMediaLimit={setMediaLimit}
                  uploadImageUrl={uploadImageUrl}
                  videoLimit={videoLimit}
                  setVideoLimit={setVideoLimit}
                />
              </ul>
            </div>
          </>
        ) : (
          <p className="hidden">Select a file to show details</p>
        )}
      </div>
    </div>
  );
};

export default FIleUploadSection;
