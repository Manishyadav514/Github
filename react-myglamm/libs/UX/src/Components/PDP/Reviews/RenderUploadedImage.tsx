import React from "react";
import RemoveIcon from "../../../../public/svg/remove-upload.svg";
import Spinner from "@libComponents/Common/LoadSpinner";

const RenderUploadedImage = ({
  mediaLimit,
  selectedFile,
  isImageSpinnerOn,
  setSelectedFile,
  setUploadImageUrl,
  setMediaLimit,
  uploadImageUrl,
  videoLimit,
  setVideoLimit,
}: any) => (
  <>
    {selectedFile.map((file: any, index: number) => {
      const imgSrc = file.imageSrc;

      const fileType = file.type.slice(0, 5);
      return (
        <li key={imgSrc} className="inline-block mr-2.5 relative">
          <div className="flex items-center justify-center w-16 h-16">
            <>
              {fileType === "image" ? (
                <img
                  src={imgSrc}
                  alt="reviewImg"
                  className={`rounded w-16 h-16 object-cover border border-gray-200 ${
                    index === selectedFile.length - 1 && /*isSpinnerOn*/ isImageSpinnerOn ? "opacity-70" : ""
                  }`}
                />
              ) : (
                <video
                  className={`rounded w-16 h-16 object-cover border border-gray-200 ${
                    index === selectedFile.length - 1 && isImageSpinnerOn ? "opacity-70" : ""
                  }`}
                >
                  <source src={imgSrc} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              {index === selectedFile.length - 1 && isImageSpinnerOn ? (
                <Spinner className="w-6 absolute" />
              ) : (
                <div className="absolute -top-1 -right-1">
                  <RemoveIcon
                    onClick={() => {
                      setSelectedFile([...selectedFile.slice(0, index), ...selectedFile.slice(index + 1)]);
                      setUploadImageUrl([...uploadImageUrl.slice(0, index), ...uploadImageUrl.slice(index + 1)]);
                      setMediaLimit(mediaLimit - 1);
                      if (fileType === "video") {
                        setVideoLimit(videoLimit - 1);
                      }
                    }}
                    className="bg-white rounded-full"
                  />
                </div>
              )}
            </>
          </div>
        </li>
      );
    })}
  </>
);

export default RenderUploadedImage;
