import React, { useState, useEffect, ReactElement } from "react";
import { useRouter } from "next/router";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { GiBackIco } from "@libComponents/GlammIcons";
import LazyLoadImage from "@libComponents/Common/LazyLoadImage";

import { ADOBE } from "@libConstants/Analytics.constant";

import { ValtioStore } from "@typesLib/ValtioStore";

import ConsumerAPI from "@libAPI/apis/ConsumerAPI";

import { CONFIG_REDUCER, ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

function CustomerProfile() {
  const [sectionNumber, setSectionNumber] = useState(0);

  const { profile } = useSelector((store: ValtioStore) => ({
    profile: store.userReducer.userProfile,
  }));

  const [questions, setQuestions] = useState<any>();

  const [skinTypeData, setskinTypeData] = useState<any>();

  const [skinType, setSkinType] = useState<any>({
    oily: false,
    dry: false,
    normal: false,
    sensitive: false,
    combination: false,
  });
  const router = useRouter();
  const { t } = useTranslation();

  const [isSkinTypeValid, setisSkinTypeValid] = useState(false);

  const [skinTone, setSkinTone] = useState<any>(3);

  const skinTones = [t("light"), t("light"), t("wheatish"), t("wheatish"), t("dusky"), t("dusky")];

  const [userInfo, setuserInfo] = useState<any>();

  const [skinToneText, setSkinToneText] = useState<any>(skinTones[0]);

  const [comfortLevel, setComfortLevel] = useState<any>(1);

  const comfortLevels = [t("notAtAll"), t("average"), t("amazing")];

  const [comfortLevelText, setComfortLevelText] = useState<any>(comfortLevels[0]);

  const [makeupProducts, setMakeupProducts] = useState<any>({
    face: false,
    eyes: false,
    lips: false,
    nails: false,
  });

  const [makeupProductsData, setmakeupProductsData] = useState<any>();

  const [isMakeUpProducsValid, setisMakeUpProducsValid] = useState(false);
  const [questionIds, setquestionIds] = useState<any>([]);
  const [responseId, setresponseId] = useState<any>();

  const handleNextClick = () => {
    setSectionNumber(sectionNumber + 1);
  };
  const handleBackClick = () => {
    setSectionNumber(sectionNumber - 1);
  };

  // SEND DATA
  useEffect(() => {
    if (sectionNumber === -1) {
      router.push("/");
    }
    if (sectionNumber === 4) {
      router.push("/thank-you");

      const finalObj: any = {
        userInfo,
        data: [],
      };
      const data: any = [];

      // SKIN TYPE

      const innerObj1: any = {
        questionId: "",
        answer: [],
      };

      for (let [key, value] of Object.entries(skinType)) {
        if (value === true) {
          if (key === "sensitive" || key === "normal") {
            if (key === "normal") {
              key = key.charAt(0).toUpperCase() + key.slice(1);
            }
            key = key.padStart(key.length + 1, " ");
          }
          innerObj1.answer.push(key);
        }
      }

      innerObj1.questionId = questionIds[0];
      data.push(innerObj1);

      // SKIN TONE

      const innerObj3: any = {
        questionId: "",
        answer: [],
      };

      innerObj3.answer.push(skinTone.toString());

      innerObj3.questionId = questionIds[1];
      data.push(innerObj3);

      // COMFORTLEVEL

      const innerObj4: any = {
        questionId: "",
        answer: [],
      };

      innerObj4.answer.push(comfortLevel.toString());

      innerObj4.questionId = questionIds[2];
      data.push(innerObj4);

      // MAKEUP PROD

      const innerObj2: any = {
        questionId: "",
        answer: [],
      };

      for (let [key, value] of Object.entries(makeupProducts)) {
        if (value === true) {
          key = key.charAt(0).toUpperCase() + key.slice(1);
          if (key === "Lips" || key === "Eyes") {
            key = key.padStart(key.length + 1, " ");
          }
          innerObj2.answer.push(key);
        }
      }

      innerObj2.questionId = questionIds[3];
      data.push(innerObj2);

      finalObj.data = data;

      console.log(responseId);

      const consumerApi = new ConsumerAPI();
      if (userInfo.isPost) {
        delete finalObj.userInfo.isPost;
        consumerApi.setCustomerProfile(finalObj);
      } else if (responseId) {
        consumerApi.updateCustomerProfile(responseId, finalObj);
      }
    }
  }, [sectionNumber]);

  const handleSkinType = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;

    setSkinType({
      ...skinType,
      [name]: !skinType[name],
    });
  };

  useEffect(() => {
    if (profile) {
      const res = async () => {
        const consumerApi = new ConsumerAPI();
        const questdata = await consumerApi.getQuestionnaire();
        const answerData = await consumerApi.getAnswers(profile.id);
        setQuestions(questdata?.data?.data?.data);
        setquestionIds([
          ...questionIds,
          questdata?.data?.data?.data?.[0]?._id,
          questdata?.data?.data?.data?.[1]?._id,
          questdata?.data?.data?.data?.[2]?._id,
          questdata?.data?.data?.data?.[3]?._id,
        ]);

        if (Object.keys(answerData.data.data.data.result).length > 0) {
          const skinData: any = Object.values(answerData.data.data.data.result);

          setresponseId(answerData.data.data.data.id);
          setuserInfo({
            identifier: profile.id,
            name: `${profile.firstName} ${profile.lastName}`,
            email: profile.email,
            contact: profile.phoneNumber,
          });
          setskinTypeData(skinData[0]);

          setSkinTone(parseInt(skinData[1][0], 10));
          setComfortLevel(parseInt(skinData[2][0], 10));
          setmakeupProductsData(skinData[3]);
        } else {
          setuserInfo({
            identifier: profile.id,
            name: `${profile.firstName} ${profile.lastName}`,
            email: profile.email,
            contact: profile.phoneNumber,
            isPost: true,
          });
        }
      };
      res();
    }
  }, [profile]);

  useEffect(() => {
    if (skinTypeData) {
      let newData: any;
      skinTypeData.forEach((item: string) => {
        newData = {
          ...newData,
          [item.trim().toLowerCase()]: true,
        };
      });
      setSkinType({ ...skinType, ...newData });
    }
  }, [skinTypeData]);

  useEffect(() => {
    if (makeupProductsData) {
      let newData: any;
      makeupProductsData.forEach((item: string) => {
        newData = {
          ...newData,
          [item.trim().toLowerCase()]: true,
        };
      });
      setMakeupProducts({ ...makeupProducts, ...newData });
    }
  }, [makeupProductsData]);

  useEffect(() => {
    if (Object.values(skinType).includes(true)) {
      setisSkinTypeValid(true);
    } else {
      setisSkinTypeValid(false);
    }
  }, [skinType]);

  useEffect(() => {
    if (Object.values(makeupProducts).includes(true)) {
      setisMakeUpProducsValid(true);
    } else {
      setisMakeUpProducsValid(false);
    }
  }, [makeupProducts]);

  const handleSkinToneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSkinTone(value);
    setSkinToneText(skinTones[parseInt(value, 10) - 1]);
  };

  const handleComfortLevelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setComfortLevel(value);
    setComfortLevelText(comfortLevels[parseInt(value, 10) - 1]);
  };

  const handleMakeupProductsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;

    setMakeupProducts({
      ...makeupProducts,
      [name]: !makeupProducts[name],
    });
  };

  // Adobe Analytics[47] - Page Load - Skin Preference.
  useEffect(() => {
    const digitalData = {
      common: {
        pageName: "web|hamburger|account|skin preferences",
        newPageName: "skin preferences",
        subSection: "my profile",
        assetType: "skin preference",
        newAssetType: "my account",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };

    ADOBE_REDUCER.adobePageLoadData = digitalData;
  }, []);

  return (
    <main className="customer-proflile-page relative bg-white">
      <style jsx>
        {`
          button:disabled {
            background: #babbbe;
          }
          .header ul li {
            width: 34px;
            height: 4px;
            display: inline-block;
            background-color: #c9c9c9;
            margin-right: 4px;
          }
          .header ul .active {
            background-color: #fab6b5;
          }
          /* ************************************************** */
          section {
            height: calc(100vh - 9rem);
            padding: 0 1rem;
          }
          section h1 {
            font-size: 2.2rem;
            margin-bottom: 1.2rem;
            line-height: normal;
          }
          section p {
            font-size: 1.1rem;
            color: #4a4a4a;
            line-height: 1.4;
          }
          .skin-tone .skin-tone-slider .slider {
            background-image: linear-gradient(
              to right,
              #fcd2b0 0%,
              #fcd2b0 16.6667%,
              #e0b592 16.6667%,
              #e0b592 33.3333%,
              #bf8f69 33.3333%,
              #bf8f69 50%,
              #bd8457 50%,
              #bd8457 66.6667%,
              #a86b3a 66.6667%,
              #a86b3a 83.3333%,
              #904f1a 83.3333%,
              #904f1a 100%
            );
          }
          .comfortable-section .slider {
            background-image: linear-gradient(to right, #fff9f9, #ffdada);
          }
          /* ************************************************** */
          /* COMMON STYLES */
          .range-content-wrapper {
            margin: 8rem 0;
          }
          .range-content-wrapper .slider {
            -webkit-appearance: none;
            width: 100%;
            height: 40px;
            outline: none;
            border-radius: 21.5px;
            z-index: 1;
          }
          .range-content-wrapper .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 52px;
            height: 52px;
            border-radius: 50%;
            background: none;
            cursor: pointer;
            border: 8px solid #fff;
            box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.5);
          }
          .range-content-wrapper .slider::-moz-range-thumb {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: none;
            cursor: pointer;
            border: 7px solid #fff;
            box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.5);
          }
          .range-content-wrapper .content {
            text-align: center;
            margin-top: 1rem;
          }
          .range-content-wrapper .content h5 {
            font-size: 1rem;
            color: #4a4a4a;
          }
          .range-content-wrapper .content h4 {
            font-size: 2rem;
            font-weight: bold;
          }
          .preference-option-boxes {
            width: 80%;
            padding: 0;
            margin: 32px 0 0;
          }
          .preference-option-boxes li {
            list-style: none;
            float: left;
            position: relative;
            margin: 0 20px 20px 0;
          }
          .preference-option-boxes li input[type="checkbox"] {
            display: none;
          }
          .preference-option-boxes li .ico-radio {
            width: 103px;
            height: 103px;
            background: #fff;
            box-shadow: 0 0 18px 0 rgba(51, 0, 0, 0.22);
            border-radius: 8px;
            margin: 0;
          }
          .preference-option-boxes li input:checked + .ico-radio {
            background: color2;
          }
          .preference-option-boxes li input:checked + .ico-radio span {
            color: #fff;
          }
          .preference-option-boxes li label {
            margin-bottom: 0;
          }
          .preference-option-boxes li span {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            text-transform: uppercase;
            font-weight: 600;
            font-size: 13px;
          }
          .section-img {
            position: absolute;
            bottom: 4rem;
            float: right;
            right: 0;
          }
          .section1-img {
            width: 125px;
            height: 60px;
          }
          .section2-img {
            bottom: 1rem;
            width: 375px;
            height: 177px;
          }
          .section3-img {
            bottom: 1rem;
          }
          .section4-img {
            width: 125px;
            height: 302px;
          }
        `}
      </style>

      {sectionNumber >= 0 && (
        <button type="button" onClick={handleBackClick} className="back-btn outline-none absolute left-0 right-2 top-1">
          <GiBackIco fill="black" height="45px" width="45px" viewBox="-250 -150 1000 1000" role="img" aria-labelledby="back" />
        </button>
      )}
      {/* HEADER */}
      <div className="header py-4 flex justify-center">
        <ul className="list-none">
          <li className={sectionNumber === 0 ? "active" : ""} />
          <li className={sectionNumber === 1 ? "active" : ""} />
          <li className={sectionNumber === 2 ? "active" : ""} />
          <li className={sectionNumber === 3 ? "active" : ""} />
        </ul>
      </div>
      {/* SKIN TYPE */}
      {questions?.length > 0 && sectionNumber === 0 && (
        <React.Fragment>
          <section className="skin-type px-4">
            <h1>{questions[sectionNumber].question}</h1>
            <p>{questions[sectionNumber].shortDescription}</p>
            {/* boxes */}
            <ul className="preference-option-boxes">
              {questions[0].choices.map((choice: any) => (
                <li key={choice.choice}>
                  <label className="i-checks">
                    <input
                      type="checkbox"
                      name={choice.choice.trim().toLowerCase()}
                      checked={skinType[choice.choice.trim().toLowerCase()]}
                      onChange={handleSkinType}
                    />
                    <div className="ico-radio">
                      <span>{choice.choice.trim().toUpperCase()}</span>
                    </div>
                  </label>
                </li>
              ))}
            </ul>
          </section>

          <LazyLoadImage
            className="section-img section1-img"
            src="https://files.myglamm.com/site-images/original/customer-pref-1.png"
            alt="beauty"
          />
        </React.Fragment>
      )}

      {/* SKIN TONE */}
      {sectionNumber === 1 && (
        <React.Fragment>
          <section className="skin-tone">
            <h1>{questions[sectionNumber].question}</h1>
            <p>{questions[sectionNumber].shortDescription}</p>

            <div className="skin-tone-slider">
              <div className="range-content-wrapper">
                <div className="slide-container">
                  <input
                    type="range"
                    className="slider"
                    min="1"
                    max="6"
                    step="1"
                    value={skinTone}
                    onChange={handleSkinToneChange}
                  />
                </div>
                <div className="content">
                  <h5>{t("yourSkinTone")}</h5>
                  <h4>{skinToneText}</h4>
                </div>
              </div>
            </div>
          </section>

          <LazyLoadImage
            className="section-img section2-img"
            src="https://files.myglamm.com/site-images/original/customer-pref-1.png"
            alt="beauty"
          />
        </React.Fragment>
      )}

      {/* HOW COMFORTABLE */}
      {sectionNumber === 2 && (
        <React.Fragment>
          <section className="comfortable-section">
            <h1>{questions[sectionNumber].question}</h1>
            <p>{questions[sectionNumber].shortDescription}</p>

            <div className="skin-tone-slider">
              <div className="range-content-wrapper">
                <div className="slide-container">
                  <input
                    type="range"
                    className="slider"
                    min="1"
                    max="3"
                    step="1"
                    value={comfortLevel}
                    onChange={handleComfortLevelChange}
                  />
                </div>
                <div className="content">
                  <h5>{t("yourLevel")}</h5>
                  <h4>{comfortLevelText}</h4>
                </div>
              </div>
            </div>
          </section>

          <LazyLoadImage
            className="section-img section3-img"
            src="https://files.myglamm.com/site-images/original/customer-pref-2.png"
            alt="beauty"
          />
        </React.Fragment>
      )}

      {/* MAKE UP PRODUCTS */}
      {sectionNumber === 3 && (
        <React.Fragment>
          <section className="makeup-products-section">
            <h1>{questions[sectionNumber].question}</h1>
            <p>{questions[sectionNumber].shortDescription}</p>
            {/* boxes */}
            <ul className="preference-option-boxes">
              {questions[3].choices.map((choice: any) => (
                <li key={choice.choice}>
                  <label className="i-checks">
                    <input
                      type="checkbox"
                      name={choice.choice.trim().toLowerCase()}
                      checked={makeupProducts[choice.choice.trim().toLowerCase()]}
                      onChange={handleMakeupProductsChange}
                    />
                    <div className="ico-radio">
                      <span>{choice.choice.trim().toUpperCase()}</span>
                    </div>
                  </label>
                </li>
              ))}
            </ul>
          </section>

          <LazyLoadImage
            className="section-img section4-img"
            src="https://files.myglamm.com/site-images/original/customer-pref-3.png"
            alt="beauty"
          />
        </React.Fragment>
      )}

      {/* FOOTER, BUTTON */}
      <div className="cp-footer flex justify-center items-center sticky bottom-0 w-full text-white bg-black text-center rounded-sm">
        <button
          disabled={(sectionNumber === 0 && !isSkinTypeValid) || (sectionNumber === 3 && !isMakeUpProducsValid)}
          type="button"
          onClick={handleNextClick}
          className="uppercase h-16 py-4 px-2.5 flex w-full justify-center text-center outline-none"
        >
          {sectionNumber === 3 ? t("saveMyPreferences") : t("next")}
          <div className="forward-icon ml-2.5 transform rotate-180">
            <GiBackIco
              fill="white"
              height="27px"
              width="27px"
              viewBox="-400 -170 1000 1000"
              role="img"
              aria-labelledby="next"
            />
          </div>
        </button>
      </div>
    </main>
  );
}

CustomerProfile.getLayout = (children: ReactElement) => children;

export default CustomerProfile;
