import { GBC_ENV } from "@libConstants/GBC_ENV.constant";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const getOrSetGUID = () => {
  let fsGUID = localStorage.getItem("fsGUID");
  if (!fsGUID) {
    fsGUID = uuidv4();
    localStorage.setItem("fsGUID", fsGUID);
  }
  return fsGUID;
};

export const useFlag = (featureId: string, isActive: boolean) => {
  const [value, setValue] = useState<any>(undefined);
  useEffect(() => {
    if (isActive) {
      fetch(`https://edge.api.flagsmith.com/api/v1/identities/?identifier=${getOrSetGUID()}`, {
        headers: {
          "content-type": "application/json",
          "x-environment-key": GBC_ENV.NEXT_PUBLIC_FLAGSMITH_ENV_ID || "",
        },
      })
        .then(r => r.json())
        .then(r => {
          for (let i = 0; i < r.flags.length; i++) {
            if (r.flags[i].feature.name === featureId) {
              // Retrieve the feature_state_value for the found feature
              let featureStateValue = r.flags[i].feature_state_value;
              setValue(featureStateValue);
              break;
            }
          }
        })
        .catch(err => {
          console.error("Flagsmith REST call failed");
          /* setting value to no-variant for usecase(s) where the flagsmith API fails or the experiment is not setup */
          setValue("no-variant");
        });
    }
  }, []);
  return {
    value,
    featureId,
  };
};
