import React, { useRef, useState, useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useSelector } from "@libHooks/useValtioSelector";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import parse from "html-react-parser";

import UploadImage from "../../../../public/svg/upload.svg";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import Spinner from "@libComponents/Common/LoadSpinner";
import ErrorComponent from "@libPages/_error";

import ContestApi from "@libAPI/apis/ContestAPI";
import ProductAPI from "@libAPI/apis/ProductAPI";

import { IContest } from "@typesLib/Contest";
import { ValtioStore } from "@typesLib/ValtioStore";

import { showError, showSuccess } from "@libUtils/showToaster";
import { getLanguageCode, getVendorCode } from "@libUtils/getAPIParams";

import useTranslation from "@libHooks/useTranslation";
import BBCBlogHTMLCss from "@libComponents/CommonBBC/BBCBlogHTMLCss";
import { getStaticUrl } from "@libUtils/getStaticUrl";

import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

const LoginModal = dynamic(() => import(/* webpackChunkName: "LoginModal" */ "@libComponents/Auth/Login.Modal"), {
  ssr: false,
});

interface ContestPropTypes {
  currentContest: IContest;
  isError?: boolean;
}

const ContestSubmission = ({ currentContest, isError }: ContestPropTypes) => {
  const { userProfile } = useSelector((store: ValtioStore) => ({
    userProfile: store.userReducer.userProfile,
  }));
  const [loginModal, setLoginModal] = useState(false);
  const { t } = useTranslation();
  const { formState, register, handleSubmit, setValue, reset } = useForm();
  const { errors } = formState;
  const [images, setImages] = useState<Array<any>>([]);
  const imageRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const contestEndDate = currentContest?.endTime ? new Date(currentContest?.endTime).toISOString() : "";
  const currentDate = new Date().toISOString();

  const submitHandler = (data: any) => {
    if (images.length >= currentContest?.minimumImageCount) {
      const imageURLs = images.map((i: any) => i.original);
      data.image = imageURLs;
      data.contestId = currentContest.id;
      data.vendorCode = getVendorCode();
      data.languages = [getLanguageCode()];
      data.phone = userProfile?.phoneNumber;
      data.statusId = 1;
      const contestApi = new ContestApi();
      contestApi
        .submitContestEntry(data)
        .then(res => {
          showSuccess("Entry Submitted Successfully");
          reset();
          setImages([]);
          setTimeout(() => {
            router.push(`/contest/contest-entry/${res?.data?.data?.data?.id}`);
          }, 2000);
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      showError(`Please upload atleast ${currentContest.minimumImageCount} picture`);
      // set error to upload pic
    }
  };

  const handleImageAdded = (e: any) => {
    setLoader(true);
    const productAPI = new ProductAPI();
    const imageFormData = new FormData();
    const uploadFileList = [...e.target.files];
    if (uploadFileList.length + images.length > currentContest.imageCount) {
      showError("Upload Limit Reached");
      setLoader(false);
      return;
    }
    if (Array.isArray(uploadFileList) && uploadFileList.length > 0) {
      uploadFileList.forEach((file: any) => {
        if (file.type.match("image")) {
          imageFormData.append(`my_file`, file);
        }
      });
    }
    productAPI
      .uploadImage(imageFormData)
      .then((response: any) => {
        const newImages = [...images, ...response.data];
        setImages(newImages);
        setLoader(false);
      })
      .catch((error: any) => {
        setLoader(false);
        console.warn(error);
      });
  };

  const handleRemoveImage = (index: number) => {
    const allImages = [...images];
    allImages.splice(index, 1);
    setImages(allImages);
  };

  useEffect(() => {
    if (userProfile && userProfile?.firstName)
      setValue("participantsName", `${userProfile?.firstName} ${userProfile?.lastName}`);
  }, [userProfile]);

  if (isError) {
    return <ErrorComponent statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>{currentContest?.contestName}</title>
        <meta name="title" key="title" content={`${currentContest?.contestName} |  Contest Post Submission`} />
        <meta property="og:title" key="og:title" content={`${currentContest?.contestName} |  Contest Post Submission`} />
        <meta
          name="description"
          key="description"
          content={`${currentContest?.contestName} |  Submit your post and participate in ${currentContest?.contestName} contest`}
        />
        <meta
          property="og:description"
          key="og:description"
          content={`${currentContest?.contestName} |  Submit your post and participate in ${currentContest?.contestName} contest`}
        />
        <link
          rel="canonical"
          key="canonical"
          href={`${GBC_ENV.NEXT_PUBLIC_DOMAIN_URL}/contest/post-submission/${currentContest?.contestUrl}`}
        />
      </Head>

      <img
        src={currentContest?.bannerImage}
        alt={currentContest?.contestName}
        loading="eager"
        className="mx-auto"
        title={currentContest?.contestName}
      />
      <div className="bg-white p-4 text-xl my-2 font-medium">
        <p className="pb-1">{currentContest?.contestName}</p>
        <BBCBlogHTMLCss staticHtml={parse(currentContest?.contestDescription)} additionalClass="my-2" />
      </div>
      {currentContest?.statusId && contestEndDate >= currentDate ? (
        <div className="bg-white px-4">
          {userProfile?.id ? (
            <div>
              <div className="mx-auto text-center text-lg py-4 font-bold">Post your Photos Now!</div>
              <form onSubmit={handleSubmit(submitHandler)}>
                <div className="flex w-full flex-col ">
                  <input
                    className={`border focus:border-color3 outline-none px-2 py-2 rounded-lg ${
                      errors?.participantsName ? "border-red-500 border-2" : ""
                    }`}
                    {...register("participantsName", { required: true })}
                    placeholder={t("Enter your name") || "Enter your name"}
                  />
                </div>
                <div className="border border-dashed border-color3 h-40 mt-4 mb-1 py-10 relative cursor-pointer rounded-lg ">
                  <label htmlFor="file_upload" className="text-center py-10">
                    <div className="text-center mx-auto">
                      <UploadImage className="mx-auto" />
                    </div>
                    {loader ? (
                      <Spinner className="w-6 mx-auto text-center" />
                    ) : (
                      <>
                        <div className="font-bold"> Tap to upload photo</div>
                        <div className="text-gray-800">
                          Min {currentContest?.minimumImageCount}, Max {currentContest?.imageCount} images
                        </div>
                      </>
                    )}
                  </label>
                  <input
                    className="border-dotted absolute top-0 w-full h-full opacity-0 cursor-pointer"
                    type="file"
                    id="file_upload"
                    ref={imageRef}
                    accept="images/*"
                    multiple
                    onChange={e => handleImageAdded(e)}
                  />
                </div>
                <div className="flex flex-wrap space-x-1">
                  {images?.map((image, i) => {
                    return (
                      <div className="flex relative mb-5" key={image["200x200"]}>
                        <ImageComponent src={image["200x200"]} alt="selected-img" width="100" height="100" />
                        <div onClick={() => handleRemoveImage(i)} className="absolute">
                          <ImageComponent
                            alt="close button"
                            src={getStaticUrl("/images/bbc-g3/ico-close-popup.png")}
                            width="20"
                            height="20"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                {currentContest?.titleEnabled ? (
                  <div className="flex flex-col py-2 space-y-1">
                    <label className="text-sm font-semibold" htmlFor="title">
                      Give an interesting caption
                    </label>
                    <input
                      id="title"
                      className={`border focus:border-color3 outline-none px-2 py-2 rounded-lg ${
                        errors?.title ? "border-red-500 border-2" : ""
                      }`}
                      {...register("title", { required: false })}
                      placeholder="Enter Caption"
                    />
                  </div>
                ) : null}
                {currentContest?.descriptionEnabled ? (
                  <div className="flex flex-col py-2 space-y-1">
                    <label className="text-sm font-semibold" htmlFor="description">
                      {currentContest?.questionText || "Say Something"}
                    </label>
                    <textarea
                      id="description"
                      className={`border focus:border-color3 outline-none px-2 py-2 h-20 rounded-lg ${
                        errors?.description1 ? "border-red-500 border-2" : ""
                      }`}
                      {...register("description1", { required: false })}
                      placeholder="Write some description"
                    />
                  </div>
                ) : null}

                {currentContest?.videoLinkEnabled ? (
                  <div className="flex flex-col py-2 space-y-1">
                    <label className="text-sm font-semibold" htmlFor="videoLink">
                      Post Youtube Video Link
                    </label>
                    <input
                      id="videoLink"
                      className={`border focus:border-color3 outline-none px-2 py-2 rounded-lg ${
                        errors?.videoLink ? "border-red-500 border-2" : ""
                      }`}
                      {...register("videoLink", { required: false })}
                      placeholder="Youtube video link"
                    />
                  </div>
                ) : null}
                <button type="submit" disabled={loader} className="bg-color1 text-white font-bold p-3 rounded-full w-full my-2">
                  Submit
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="font-bold pb-4">Login to participate in the contest</p>
              <button className="bg-color1 text-white rounded-lg p-3 font-bold px-10" onClick={() => setLoginModal(true)}>
                Login
              </button>
              <LoginModal show={loginModal} onRequestClose={() => setLoginModal(false)} hasGuestCheckout={false} />
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-4 text-center text-xl">Ooops you are late, looks like the contest has ended</div>
      )}
    </>
  );
};

ContestSubmission.getInitialProps = async (ctx: any) => {
  const contestApi = new ContestApi();
  try {
    const { data } = await contestApi.getContestBySlug(ctx?.query?.slug);
    if (data?.data?.data?.length > 0) {
      const contestData = data?.data?.data?.[0];
      return {
        currentContest: contestData,
      };
    }
    return { isError: true };
  } catch (error: any) {
    return { currentContest: null, isError: true };
  }
};

export default ContestSubmission;
