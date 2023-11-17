import { Accessor, For } from "solid-js";

import { CommonIcon } from "./CommonIcon";

import UtilityAPI from "../services/utility";

import { showError } from "../utils/showToaster";

interface IImageUploaded {
  original: string;
  "50x50": string;
  assetId: string;
  assetName: string;
  "200x200": string;
  "400x400": string;
  "800x800": string;
  "1200x1200": string;
  size: {
    height: number;
    width: number;
  };
}

interface IUploadImage {
  imageRender: [];
  setImageRender: (a: any) => null;
  multipleImage: boolean;
  maxImages: number;
}

function UploadImage(props: IUploadImage) {
  let inputFileRef: HTMLInputElement;

  const handleImageAdded = async (e: any) => {
    const imageFormData = new FormData();
    const uploadFileList = [...e.target?.files];
    if (Array.isArray(uploadFileList) && uploadFileList.length > 0) {
      if (uploadFileList.length + props.imageRender.length > (props.maxImages || 20)) {
        showError(`Sorry you can upload only ${props.maxImages} images`);
        return;
      }
      uploadFileList.forEach((file: any) => {
        if (file.type.match("image")) {
          imageFormData.append("my_file", file, file.name);
        }
      });
    }
    if (uploadFileList.length) {
      const utilityApi = new UtilityAPI();
      try {
        const response = await utilityApi.uploadImage(imageFormData);
        const updatedFiles = [...props.imageRender, ...response.data];
        props.setImageRender([...updatedFiles]);
        inputFileRef.value = "";
      } catch (error: any) {
        showError(error.message);
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const tempImages = [...props.imageRender];
    tempImages.splice(index, 1);
    props.setImageRender(tempImages);
  };

  return (
    <div>
      <p class="text-xs text-gray-400">
        Note: Please upload image in jpg, jpeg, gif, png, webp formats. You can only upload single image here.
      </p>
      <div class="border border-dashed border-primary min-h-48 my-2 py-10 relative cursor-pointer">
        {props.imageRender?.length > 0 ? (
          <div class="flex space-x-4 px-4 flex-wrap">
            <For each={props.imageRender}>
              {(item: IImageUploaded, i: Accessor<number>) => (
                <div class="w-28 h-40 text-center cursor-pointer relative group">
                  <span
                    class="absolute right-0 top-0 invisible group-hover:visible text-primary"
                    onClick={() => handleRemoveImage(i())}
                  >
                    <CommonIcon icon="material-symbols:close" height={16} />
                  </span>
                  <img class="mx-auto h-24 border" alt="image" src={item["original"]} />
                  <span class="text-gray-500 text-xs group-hover:text-primary">{item?.assetName}</span>
                </div>
              )}
            </For>
            {props.multipleImage ? (
              <div
                class="text-primary border border-dotted border-primary rounded-lg w-28 h-28 py-5 text-center"
                onClick={e => inputFileRef?.click()}
              >
                <CommonIcon icon="ic:add-circle-outline" height={40} width={40} />
                <div class=" text-sm">Add Images</div>
              </div>
            ) : null}
          </div>
        ) : (
          <>
            <label for="file_upload" class="text-center py-10">
              <div class="text-center text-primary">
                <CommonIcon icon="ic:round-cloud-upload" height={40} width={40} />
              </div>
              <div> Drag & drop here</div> <div> or</div>
              <div class="text-primary">Browse</div>
            </label>
            {props.multipleImage ? (
              <input
                class="border-dotted absolute top-0 w-full h-full opacity-0 cursor-pointer"
                type="file"
                ref={inputFileRef}
                id="file_upload"
                accept=".png, .jpg, .jpeg, .webp, .gif"
                multiple
                onChange={e => handleImageAdded(e)}
              />
            ) : (
              <input
                class="border-dotted absolute top-0 w-full h-full opacity-0 cursor-pointer"
                type="file"
                ref={inputFileRef}
                id="file_upload"
                accept=".png, .jpg, .jpeg, .webp, .gif"
                onChange={e => handleImageAdded(e)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export { UploadImage };
