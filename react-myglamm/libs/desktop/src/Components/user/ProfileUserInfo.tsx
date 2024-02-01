import React, { useState } from "react";

import { ValtioStore } from "@typesLib/ValtioStore";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";
import useEffectAfterRender from "@libHooks/useEffectAfterRender";

import { isNumber } from "@libUtils/validation";

import ProductAPI from "@libAPI/apis/ProductAPI";
import ConsumerAPI from "@libAPI/apis/ConsumerAPI";

import { REGEX } from "@libConstants/REGEX.constant";

import LoadSpinner from "@libComponents/Common/LoadSpinner";

import { addLoggedInUser } from "@libStore/actions/userActions";

enum CTA {
  NORMAL = 0,
  DISABLED = 1,
  LOADING = 2,
}

const ProfileUserInfo = () => {
  const { t } = useTranslation();
  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  const [CTAState, setCTAState] = useState<CTA>(CTA.DISABLED);

  const [profileImg, setProfileImg] = useState<File>();
  const [userInfo, setUserInfo] = useState({
    firstName: userProfile?.firstName,
    lastName: userProfile?.lastName || " ",
    mobile: userProfile?.phoneNumber,
    email: userProfile?.email,
    meta: { profileImage: userProfile?.meta?.profileImage },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    if (name === "username") {
      const [firstName, lastName] = value.split(" ") || [];

      console.log({ firstName, lastName });

      setUserInfo({ ...userInfo, firstName, lastName: lastName || "" });
    } else {
      setUserInfo({ ...userInfo, [name]: value });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setCTAState(CTA.LOADING);

    const tempInfo = userInfo;

    try {
      if (profileImg) {
        // incase profile img needs to be updated
        const formData = new FormData();
        formData.append("my_file", profileImg);
        const productApi = new ProductAPI();
        const { data } = await productApi.uploadImage(formData);
        const { original, assetId, assetName } = data[0] || {};
        tempInfo.meta.profileImage = { original, assetId, assetName };
      }

      const consumerApi = new ConsumerAPI();
      await consumerApi.updateProfilePatch(userProfile?.id as string, tempInfo);
      const { data: profile } = await consumerApi.getProfile(userProfile?.id as string);

      addLoggedInUser(profile.data);
      setCTAState(CTA.NORMAL);
    } catch (err) {
      setCTAState(CTA.NORMAL);
    }
  };

  useEffectAfterRender(() => {
    setCTAState(CTA.NORMAL);

    // validations
    if (
      !userInfo.firstName ||
      !userInfo.email ||
      !userInfo.mobile ||
      !REGEX.EMAIL.test(userInfo.email) ||
      userInfo.mobile?.length < 10
    ) {
      setCTAState(CTA.DISABLED);
    }
  }, [userInfo, profileImg]);

  console.log({ profileImg }, profileImg && URL.createObjectURL(profileImg));

  return (
    <section className="flex mt-6">
      <div className="relative px-4 h-max shrink-0">
        <img
          width={160}
          height={160}
          className="aspect-square rounded-full"
          src={
            (profileImg && URL.createObjectURL(profileImg)) ||
            userInfo?.meta.profileImage?.original ||
            "https://files.myglamm.com/site-images/original/no-user-yellow.png"
          }
        />

        <label
          htmlFor="gallery"
          className="bg-white rounded-full h-11 w-11 absolute bottom-4 right-0 shadow-shadowCmn flex items-center justify-center cursor-pointer"
        >
          <img src="https://files.myglamm.com/site-images/original/dslr-camera.png" width={20} alt="camera" />
          <input
            hidden
            type="file"
            id="gallery"
            accept=".png, .jpg, .jpeg"
            onChange={e => setProfileImg(e.target.files?.[0])}
          />
        </label>
      </div>

      <form className="pl-8 flex flex-col w-full" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          onChange={handleInputChange}
          defaultValue={`${userInfo.firstName} ${userInfo.lastName}`}
          className="bg-themeGray h-14 px-4 w-3/5 rounded-sm hover:shadow-shadowCmn mb-4"
        />

        <input
          type="tel"
          name="mobile"
          maxLength={10}
          onKeyPress={isNumber}
          value={userInfo?.mobile}
          onChange={handleInputChange}
          className="bg-themeGray h-14 px-4 w-2/5 rounded-sm hover:shadow-shadowCmn mb-4"
        />

        <input
          type="email"
          name="email"
          value={userInfo?.email}
          onChange={handleInputChange}
          className="bg-themeGray h-14 px-4 w-3/5 rounded-sm hover:shadow-shadowCmn mb-4"
        />

        <button
          type="submit"
          disabled={CTAState === CTA.DISABLED || CTAState === CTA.LOADING}
          className="bg-ctaImg text-white tracking-wide font-bold capitalize w-2/5 rounded-sm h-12 relative"
        >
          {CTA.LOADING === CTAState && <LoadSpinner className="w-10 inset-0 absolute m-auto" />}
          {t("save")}
        </button>
      </form>
    </section>
  );
};

export default ProfileUserInfo;
