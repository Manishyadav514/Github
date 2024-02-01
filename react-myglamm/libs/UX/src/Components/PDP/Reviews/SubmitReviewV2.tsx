import React, { useEffect, useRef, useState } from "react";
import useTranslation from "@libHooks/useTranslation";
import { ADOBE } from "@libConstants/Analytics.constant";
import { useSelector } from "@libHooks/useValtioSelector";
import dynamic from "next/dynamic";
import Spinner from "@libComponents/Common/LoadSpinner";

import { getVendorCode } from "@libUtils/getAPIParams";

import { ValtioStore } from "@typesLib/ValtioStore";
import { useForm } from "react-hook-form";

const HorizontalRating = dynamic(
  () => import(/* webpackChunkName: "HorizontalRating" */ "@libComponents/PDP/Reviews/HorizontalRatingV2"),
  {
    ssr: false,
  }
);

import ProductAPI from "@libAPI/apis/ProductAPI";
import { showSuccess } from "@libUtils/showToaster";
import Image from "next/legacy/image";
import PopupModal from "@libComponents/PopupModal/PopupModal";
import { PDP_STATES } from "@libStore/valtio/PDP.store";
import { PDPProd } from "@typesLib/PDP";
import { SHOW_LOGIN_MODAL } from "@libStore/valtioStore";
import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import ReviewStarsV2 from "./ReviewStarsV2";
import { adobeSubmitReview, prepareWebengageSubmitReviewDataLayer } from "@productLib/pdp/AnalyticsHelper";
import FIleUploadSection from "./FIleUploadSection";
import { getLocalStorageValue } from "@libUtils/localStorage";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";

interface ReviewModalProps {
  product: PDPProd;
  reviewFormModal: boolean;
  hideReviewFormModal?: () => void;
}

const SubmitReviewV2 = ({ product, reviewFormModal, hideReviewFormModal }: ReviewModalProps) => {
  const { categories, ratings } = product;

  const [subRatingHeaders, setSubRatingHeaders] = useState<Array<any>>([]);
  const [starsSelected, setSelected] = useState<any>(5);

  const [uploadImageUrl, setUploadImageUrl] = useState<Array<any>>([]);

  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const [disableSubmit, setDisableSubmit] = useState(false);

  const [showReviewQue, setShowReviewQue] = useState<any>([]);
  const [defaultAns, setDefaultAns] = useState<Array<{ answer: Array<string>; questionId: string }>>([]);
  const { register, handleSubmit, setValue, getValues, reset } = useForm();

  const qusAnsRef = useRef<HTMLDivElement | null>(null);

  let invalidRating = "";

  const { t } = useTranslation();
  const profile = useSelector((store: ValtioStore) => store.userReducer.userProfile);



  const handleStarIcon = (starSelected: number) => {
    setSelected(starSelected);
  };

  const validateSubRating = (subRatingStarValue: any) => {
    if (subRatingStarValue?.length) {
      let tempRating = subRatingStarValue.find((rating: any) => {
        return rating.value === 0;
      });
      invalidRating = tempRating?.title || "";
      return !tempRating;
    }
    return true;
  };

  const validateQuestionAns = (enableScroll: boolean = true) => {
    const isValid = defaultAns.every(ans => ans?.answer?.length);
    if (!isValid && qusAnsRef?.current && enableScroll) {
      qusAnsRef.current.scrollTop = 850;
      setDisableSubmit(true);
    } else if (isValid) {
      setDisableSubmit(false);
    }
    return isValid;
  };

  const onSubmitReview = (data: any) => {
    if (checkUserLoginStatus()) {
      let localProfile: any = {};
      if (!profile?.id) {
        localProfile = getLocalStorageValue(LOCALSTORAGE?.PROFILE, true);
      }
      if (validateSubRating(data?.subRatingStarValue) && validateQuestionAns()) {
        let subRating = {};
        if (data?.subRatingStarValue) {
          subRating = data?.subRatingStarValue.reduce(
            (obj: any, item: any) => Object.assign(obj, { [item.title]: parseInt(item.value) }),
            {}
          );
        }
        setIsSubmittingReview(true);
        const payload = {
          reviewContent: data?.reviewText,
          reviewerId: profile?.id || localProfile?.id,
          reviewTitle: data?.reviewTitle,
          reviewerInfo: {
            firstName: profile?.firstName || localProfile?.firstName,
            lastName: profile?.lastName || localProfile?.lastName,
            email: profile?.email || localProfile?.email,
            mobile: profile?.phoneNumber || localProfile?.phoneNumber,
            additional: {
              sku: product.sku,
            },
          },
          itemId: product?.id,
          itemType: product?.urlShortner?.type,
          rating: parseInt(starsSelected, 10),
          subRating,
          meta: {
            productName: product?.cms[0]?.content?.name,
            images: uploadImageUrl || [],
          },
          userAgent: window.navigator.userAgent,
          vendorCode: getVendorCode(),
          questionAnswers: defaultAns,
        };
        const api = new ProductAPI();
        console.log({ payload });
        api
          .createReviews(payload)
          .then(() => {
            adobeSubmitReview(product, categories, ratings);
            prepareWebengageSubmitReviewDataLayer(product, payload, categories);
            setIsSubmittingReview(false);
            showSuccess("Review submitted successfully");
            setSelected(5);
            hideModal();
            reset();
          })
          .catch((error: any) => {
            setIsSubmittingReview(false);
            alert(error);
          });
      }
    } else {
      SHOW_LOGIN_MODAL({
        type: "onlyMobile",
        show: true,
        onSuccess: () =>
          onSubmitReview(data),
      });
    }
  };

  const getSubRatingHeadersAndQuestions = async () => {
    const api = new ProductAPI();
    const productTag = encodeURIComponent(product.productTag);
    const payload = {
      order: ["createdAt DESC", "rating DESC"],
      limit: 1,
      skip: 0,
      where: {
        itemTag: productTag,
        itemType: "product",
      },
    };

    const [subRatingsResponse, reviewQuestionsResponse, userAttributesResponse] = await Promise.allSettled([
      api.getsubRatings(product.id),
      api.getReviewQuestions(),
      checkUserLoginStatus()?.memberId ? api.getReviews(payload) : Promise.resolve(),
    ]);

    //@ts-ignore
    const subRatingsData = subRatingsResponse?.value?.data?.data[0]?.subRatings || [];
    //@ts-ignore
    const reviewQuestionsData = reviewQuestionsResponse?.value?.data?.data?.data || [];
    //@ts-ignore
    const loggedInUserAttributes = userAttributesResponse?.value?.data?.data?.loggedInUserAttributes || [];

    const getQuestionAnswers = (data: any) => {
      return data.map((item: any) => ({
        answer: item?.meta?.defaultOptions || item?.answer || [],
        questionId: item?._id || item?.questionId,
      }));
    };

    let defaultAnswers = [];
    let showReviewQuestions = [];

    if (subRatingsData.length > 0) {
      setSubRatingHeaders(subRatingsData);
      const subRatingHeaders = subRatingsData.map((rating: any) => ({ title: rating, value: 5 }));
      setValue("subRatingStarValue", subRatingHeaders);
    }

    if (loggedInUserAttributes.length > 0) {
      const questionAnswersUser = getQuestionAnswers(loggedInUserAttributes);

      if (reviewQuestionsData.length > loggedInUserAttributes.length) {
        const questionAnswersDefault = getQuestionAnswers(reviewQuestionsData);
        const mergedQuestionAnswers = [...questionAnswersUser, ...questionAnswersDefault];

        const uniqueQuestionAnswers = mergedQuestionAnswers.reduce((unique, currentData) => {
          const existingQuesId = unique.find((x: any) => x.questionId === currentData.questionId);
          if (!existingQuesId) {
            unique.push(currentData);
          }
          return unique;
        }, []);

        defaultAnswers = uniqueQuestionAnswers;
        showReviewQuestions = reviewQuestionsData;
      } else {
        defaultAnswers = questionAnswersUser;
        showReviewQuestions = reviewQuestionsData;
      }
    } else if (reviewQuestionsData.length > 0) {
      defaultAnswers = getQuestionAnswers(reviewQuestionsData);
      showReviewQuestions = reviewQuestionsData;
    }

    setDefaultAns(defaultAnswers);
    setShowReviewQue(showReviewQuestions);
  };

  useEffect(() => {
    getSubRatingHeadersAndQuestions();
    return () => {
      reset();
    };
  }, []);

  useEffect(() => {
    validateQuestionAns(false);
  }, [defaultAns]);

  const handleSubRatingStarIcon = (key: any, value: any) => {
    const subRatingStarValueForm = getValues("subRatingStarValue");
    const elementsIndex = subRatingStarValueForm.findIndex((element: any) => element.title == key);
    let newArray = [...subRatingStarValueForm];
    newArray[elementsIndex] = {
      ...newArray[elementsIndex],
      value,
    };

    setValue("subRatingStarValue", newArray);
  };

  const hideModal = () => {
    if (hideReviewFormModal) return hideReviewFormModal();
  };

  return (
    <PopupModal show={reviewFormModal} onRequestClose={hideModal}>
      <div className="bg-white rounded-t-xl overflow-scroll" ref={qusAnsRef} style={{ maxHeight: "92vh" }}>
        <div>
          <div className=" bg-white sticky top-0 z-10">
            <div className="px-4 py-2.5  border-b border-themeGray  bg-white">
              <h1 className="text-sm font-bold mb-0.5">{t("writeReview")}</h1>
              <p className="text-xs leading-none text-red-500"> {t("allFieldsMandatory") || "*All fields are mandatory"} </p>
            </div>
            <div className="flex items-center px-4 py-3 shadow-sm">
              <div>
                <Image
                  height={76}
                  width={76}
                  alt={product?.assets?.[0]?.name}
                  src={product?.assets?.[0]?.imageUrl?.["200x200"]}
                />
              </div>
              <div className="pl-3">
                <p className="text-sm font-bold">{product?.cms?.[0].content?.name}</p>

                <div className="flex  -ml-1">
                  <ReviewStarsV2
                    adobeAssetType={ADOBE.ASSET_TYPE.PDP}
                    getSelectedStars={handleStarIcon}
                    size="20px"
                    star={ratings?.avgRating}
                    preSelectedStart={starsSelected}
                    reset={true}
                    resetValue={5}
                  />
                </div>
              </div>
            </div>
          </div>

          <FIleUploadSection uploadImageUrl={uploadImageUrl} setUploadImageUrl={setUploadImageUrl} />

          {/* Form Start Here */}
          <form onSubmit={handleSubmit(onSubmitReview)}>
            <p className="pt-3 pb-3 font-bold text-sm uppercase px-4 bg-color2">{t("lblWriteReviewHere")}</p>
            <div className="bg-color2 px-4 pb-2 mb-4">
              <input
                type="text"
                placeholder={t("addATitle") || "Add a title"}
                className="review w-full px-2 py-2 border border-gray rounded-3 outline-none placeholder-gray-500 text-sm mb-3 placeholder:text-xs focus:border-color1"
                role="textbox"
                aria-label="review title"
                {...register("reviewTitle", { required: true })}
              />
              <textarea
                rows={4}
                placeholder={t("writeYourExperience") || `Write something about your experience`}
                className="review w-full px-2 py-1 border border-gray rounded-3 outline-none placeholder-gray-500 text-sm resize-none placeholder:text-xs focus:border-color1"
                {...register("reviewText", { required: true })}
              />
            </div>
            {subRatingHeaders.length > 0 && (
              <div className="border-b border-themeGray pb-4">
                <div className="flex justify-start px-5">
                  <div className="relative text-sm text-black font-bold uppercase">
                    {t("pdpHorizontailReviewTitle") || `Tell us what you think`}
                  </div>
                </div>
                <div className="px-5">
                  {subRatingHeaders.length > 0 &&
                    subRatingHeaders.map((subRating: any, index: number) => {
                      return (
                        <HorizontalRating
                          key={index}
                          size="16px"
                          t={t}
                          title={subRating}
                          handleSubRatingStarIcon={handleSubRatingStarIcon}
                          reset={true}
                          newPDP={true}
                        />
                      );
                    })}
                </div>
              </div>
            )}

            <div ref={qusAnsRef} className="px-4 pt-4">
              {showReviewQue?.map((data: any, index: number) => {
                const defaultAnsIndex = defaultAns?.findIndex(x => x.questionId === data?._id);
                return (
                  <div key={data?.question} className="pb-3">
                    <p className="text-sm pb-2">{data?.question}</p>
                    <div className="flex flex-wrap gap-1">
                      {data?.choices?.map((value: any) => {
                        const isDefault = defaultAns[defaultAnsIndex]?.answer?.includes(value?.choice);
                        return (
                          <span
                            className={`text-11 px-2.5 py-1 border border-themeGray rounded-full mb-1 ${
                              isDefault ? "bg-color1 text-white" : "bg-gray-50"
                            } `}
                            key={value?.label}
                            onClick={() => {
                              if (data?.type === "singleselect") {
                                const tempAnsArray: any = [...defaultAns];
                                tempAnsArray[defaultAnsIndex].answer = [value?.choice];
                                setDefaultAns(tempAnsArray);
                              } else if (data?.type === "multiselect") {
                                const tempAnsArray: any = [...defaultAns];
                                tempAnsArray[defaultAnsIndex].answer.push(value?.choice);
                                setDefaultAns(tempAnsArray);
                              }
                            }}
                          >
                            {value?.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className="px-5 flex justify-between sticky bottom-0 py-4 bg-white"
              style={{ boxShadow: "0px 0px 10px rgba(0,0,0,.1)", background: "rgba(255,255,255,0.9)" }}
            >
              <button
                type="button"
                onClick={hideModal}
                disabled={isSubmittingReview}
                className="w-full mr-2 py-2 text-color1 font-semibold rounded-sm outline-none relative capitalize"
              >
                {t("cancel")?.toLowerCase()}
              </button>
              <button
                type="submit"
                disabled={isSubmittingReview || disableSubmit}
                className="w-full py-2 text-white font-semibold uppercase bg-ctaImg rounded-md outline-none relative"
              >
                <span className="text-sm">{t("submitReview") || `Submit Review`}</span>
                {isSubmittingReview && <Spinner className="absolute inset-0 w-8 mx-auto inline-flex" />}
              </button>
            </div>
          </form>
          {/* Form End Here */}
        </div>
      </div>
    </PopupModal>
  );
};

export default SubmitReviewV2;
