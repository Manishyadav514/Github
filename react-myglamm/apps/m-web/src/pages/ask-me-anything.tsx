import React, { useState, useRef, useEffect, ReactElement } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { ValtioStore } from "@typesLib/ValtioStore";

import { getFirebaseConfig } from "@libUtils/firebase";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import { isWebview } from "@libUtils/isWebview";

import { ADOBE } from "@libConstants/Analytics.constant";

import { useSelector } from "@libHooks/useValtioSelector";

import Ask from "@components/AskMeAnything/Ask";
import Answers from "@components/AskMeAnything/Answers";
import Questions from "@components/AskMeAnything/Questions";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

import ConsumerAPI from "@libAPI/apis/ConsumerAPI";

import FirebaseScript from "@libComponents/FirebaseScript";
const LoginModal = dynamic(() => import(/* webpackChunkName: "LoginModal" */ "@libComponents/Auth/Login.Modal"), {
  ssr: false,
});

export const AskMeAnything = () => {
  const { profile } = useSelector((store: ValtioStore) => ({
    profile: store.userReducer.userProfile,
  }));
  const [loginModal, setLoginModal] = useState<boolean | undefined>();
  const [questions, setQuestions] = useState<any>([]);
  const [answers, setAnswers] = useState<any>([]);
  const questionsRef = useRef<any>();
  const [user, setUser] = useState<any>(false);
  const [expandAll, setExpandAll] = useState<any>(false);

  const router = useRouter();

  // Adobe Analytics[1] - Page Load - Home
  useEffect(() => {
    const pageload = {
      common: {
        pageName: "web|AskMeAnything Main",
        newPageName: "AskMeAnything Main",
        subSection: ADOBE.ASSET_TYPE.ASK_ME_ANYTHING,
        assetType: ADOBE.ASSET_TYPE.ASK_ME_ANYTHING,
        newAssetType: ADOBE.ASSET_TYPE.ASK_ME_ANYTHING,
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };

    ADOBE_REDUCER.adobePageLoadData = pageload;
  }, []);

  // Adobe Analytics[1] - Page Load - View More
  useEffect(() => {
    if (expandAll) {
      const pageload = {
        common: {
          pageName: "web|AskMeAnything ViewMore",
          newPageName: "AskMeAnything ViewMore",
          subSection: ADOBE.ASSET_TYPE.ASK_ME_ANYTHING,
          assetType: ADOBE.ASSET_TYPE.ASK_ME_ANYTHING,
          newAssetType: ADOBE.ASSET_TYPE.ASK_ME_ANYTHING,
          platform: ADOBE.PLATFORM,
          pageLocation: "",
          technology: ADOBE.TECHNOLOGY,
        },
      };

      ADOBE_REDUCER.adobePageLoadData = pageload;
    }
  }, [expandAll]);

  useEffect(() => {
    if (!checkUserLoginStatus() && !isWebview()) {
      setLoginModal(true);
    }
  }, []);

  useEffect(() => {
    if (profile) {
      if (profile.memberType.typeName === "ambassador") {
        if (localStorage.getItem("userAuthenticated")) {
          const firebaseData = getFirebaseConfig();

          const db = firebaseData.firestore();
          questionsRef.current = db.collection("questions");
          setUser(true);
        } else {
          const consumerApi = new ConsumerAPI();
          consumerApi.getFirebaseToken(profile.id).then(res => {
            if (res.data.data?.token) {
              const firebaseData = getFirebaseConfig();
              firebaseData
                .auth()
                .signInWithCustomToken(res.data.data?.token)
                .then((userCredential: any) => {
                  localStorage.setItem("userAuthenticated", "true");
                  // Signed in
                  console.log("userCredential", "true");
                  const db = firebaseData.firestore();
                  questionsRef.current = db.collection("questions");
                  setUser(true);
                })
                .catch((error: any) => {
                  console.log("error", error);
                });
              // }
            }
          });
        }
      } else {
        router.push("/");
      }
    }
  }, [profile]);

  // get posted questions from firebase
  const getQuestions = () => {
    try {
      // Subscribe to query with onSnapshot
      questionsRef?.current
        .where("answer", "==", "")
        .orderBy("createdAt", "desc")
        .limit(60)
        .onSnapshot((querySnapshot: any) => {
          // Get all documents from collection
          const data = querySnapshot?.docs?.map((doc: any) => ({
            ...doc.data(),
            id: doc.id,
          }));

          // Update state
          setQuestions(data.reverse());
        });
    } catch (error: any) {
      console.error("error", error);
    }
  };

  // get answers from firebase
  const getAnswers = (answer: any) => {
    try {
      answer.onSnapshot((querySnapshot: any) => {
        // Get all documents from collection
        const data = querySnapshot?.docs?.map((doc: any) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setAnswers(data.reverse());
      });
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (questionsRef?.current) {
      let answersWhere = questionsRef?.current.where("answeredAt", "!=", "").orderBy("answeredAt", "desc").limit(6);

      if (expandAll) {
        answersWhere = questionsRef?.current.where("answeredAt", "!=", "").orderBy("answeredAt", "desc");
      }

      getQuestions();
      getAnswers(answersWhere);
    }
  }, [questionsRef?.current, expandAll, user]);

  // post questions

  return (
    <>
      <FirebaseScript />

      <section className="h-screen flex flex-col">
        <Answers
          answers={answers}
          className={`${expandAll ? "h-full" : "h-2/3 rounded-b-2xl"} w-full  flex flex-col`}
          getAnswers={getAnswers}
          questionsRef={questionsRef}
          setExpandAll={setExpandAll}
          expandAll={expandAll}
          user={user}
        />

        {!expandAll && (
          <>
            <Questions questions={questions} className="overflow-y-scroll mt-1 h-[22%]" />
            <Ask className="p-2 w-full h-16 fixed bottom-2" />
          </>
        )}

        {typeof loginModal === "boolean" && (
          <LoginModal
            show={loginModal}
            hasGuestCheckout={false}
            onRequestClose={() => null}
            onSuccess={() => setLoginModal(false)}
          />
        )}
      </section>
    </>
  );
};

AskMeAnything.getLayout = (children: ReactElement) => children;

AskMeAnything.getInitialProps = () => {
  return {};
};

export default AskMeAnything;
