import * as React from "react";
import { useRouter } from "next/router";

import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";

import BBCServiceDetail from "@libAPI/apis/BBCServiceDetail";

import { showSuccess } from "@libUtils/showToaster";

import PrimaryBtn from "@libComponents/CommonBBC/PrimaryBtn";

import { SHOW_LOGIN_MODAL } from "@libStore/valtioStore";

import { ratingColor } from "@libConstants/RatingConstants";

import { IS_DESKTOP } from "@libConstants/COMMON.constant";

const WriteReview = () => {
  const inputRef: any = React.useRef();
  const { userProfile } = useSelector((store: ValtioStore) => ({
    userProfile: store.userReducer.userProfile,
  }));
  const router = useRouter();
  const [serviceSlug, setServiceSlug] = React.useState("");
  const [ratings, setRatings] = React.useState({
    data: [
      {
        id: 1,
        value: 1,
        isActive: false,
        activeBgColor: ratingColor[1],
      },
      {
        id: 2,
        value: 2,
        isActive: false,
        activeBgColor: ratingColor[2],
      },
      {
        id: 3,
        value: 3,
        isActive: false,
        activeBgColor: ratingColor[3],
      },
      {
        id: 4,
        value: 4,
        isActive: false,
        activeBgColor: ratingColor[4],
      },
      {
        id: 5,
        value: 5,
        isActive: false,
        activeBgColor: ratingColor[5],
      },
    ],
    activeRating: 0,
  });

  React.useEffect(() => {
    getServiceDetails();
  }, []);

  const getServiceDetails = async () => {
    try {
      const bbcServiceDetail = new BBCServiceDetail();
      const response = await bbcServiceDetail.getServiceDetails({ id: router.query.service_id });
      if (response?.data?.data?.data?.[0]) {
        setServiceSlug(response?.data?.data?.data?.[0]?.slug);
      }
    } catch (err) {
      //
    }
  };
  const writeReview = async () => {
    if (!inputRef.current.value) {
      return;
    }
    if (!router.query.service_id) {
      return;
    }
    if (!userProfile?.id) {
      if (IS_DESKTOP) {
        SHOW_LOGIN_MODAL({ show: true });
        return;
      } else {
        SHOW_LOGIN_MODAL({ show: true, hasGuestCheckout: false, onSuccess: () => {} });
        return;
      }
    }
    try {
      const bbcServiceDetail = new BBCServiceDetail();
      const body: any = {
        vendorCode: "bbc",
        country: "IND",
        sourceVendorCode: "bbc",
        entityId: router?.query?.service_id,
        entityType: "bbcservice",
        commentText: inputRef.current.value,
        isAnonymous: false,
      };
      if (ratings.activeRating) {
        body.meta = {
          rating: ratings.activeRating,
        };
      }
      const response = await bbcServiceDetail.createReview(body);
      if (response?.data?.data?.data?.id) {
        showSuccess("Thanks for your review!");
        setTimeout(() => {
          router.push({
            pathname: serviceSlug,
          });
        }, 600);
      }
    } catch (err) {
      //
    }
  };

  const onChangeRating = (activeRatingData: any) => {
    const ratingsCpy = JSON.parse(JSON.stringify(ratings.data));
    const newRatingsData = ratingsCpy.map((rating: any) => {
      if (rating.value <= activeRatingData.value) {
        rating.isActive = true;
      } else {
        rating.isActive = false;
      }
      return rating;
    });
    setRatings({
      data: newRatingsData,
      activeRating: activeRatingData.value,
    });
  };
  return (
    <div className={IS_DESKTOP ? "w-[480px] m-auto border border-gray-300 mt-5" : "mt-3"}>
      <div
        className=" h-60  relative"
        style={{
          backgroundImage: "url(https://files.babychakra.com/site-images/original/group.jpeg) ",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute top-6">
          <p className="text-white text-center font-bold text-2xl mb-3">Your voice matters</p>
          <p className=" text-white text-center text-lg mb-3">
            Thousands of Parents Use Your Reviews to Choose for their Families
          </p>
          <p className=" text-white text-center font-bold text-base">Be Frank. Be Fair. Be Heard.</p>
        </div>
      </div>
      <div className="w-[90%] m-auto my-3">
        <textarea className=" w-full p-3 outline-0" rows={6} placeholder="Tell us more about your experience." ref={inputRef} />
        <div className="mb-4">
          <p className="mb-3">Rate this service</p>
          <div className="flex">
            {ratings?.data?.map(rating => (
              <button
                type="button"
                className="h-9 w-9 mr-2 rounded-sm text-white text-center "
                key={rating.id}
                onClick={() => onChangeRating(rating)}
                style={{
                  backgroundColor: rating.isActive ? rating.activeBgColor : "#e4e4e4",
                }}
              >
                {rating.value}
              </button>
            ))}
          </div>
        </div>
      </div>
      <PrimaryBtn
        buttonName="POST REVIEW"
        customClassName="flex justify-center m-auto mb-4"
        buttonOnClick={() => {
          writeReview();
        }}
      />
    </div>
  );
};

export default WriteReview;
