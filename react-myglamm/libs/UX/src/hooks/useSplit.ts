import { getCookie, setCookie } from "@libUtils/cookies";
import useTranslation from "./useTranslation";
import { useEffect, useRef, useState } from "react";
import { setSessionStorageValue } from "@libUtils/sessionStorage";

const randomByWeight = (items: any) => {
  // https://stackoverflow.com/a/73702866
  const weights = items.reduce((acc: any, item: any, i: number) => {
    // divide by 10 since we are asking product team to define weight in increments of 10
    // totalling to 100
    acc.push(item.weight / 10 + (acc[i - 1] ?? 0));
    return acc;
  }, []);

  const random = Math.random() * weights[weights.length - 1];
  return items[weights.findIndex((weight: any) => weight > random)];
};
const getCookieKey = (id: string) => {
  return `st-${id}`;
};

export function readSplitValues(ids: string[]) {
  return ids?.map(id => {
    return getCookie(getCookieKey(id));
  });
}

export function useSplit({
  experimentsList,
  deps,
}: {
  experimentsList: { id: string; condition?: boolean | null }[];
  deps: any[];
}) {
  //{ ids, deps, condition = [] }: { ids?: string[]; deps: any[]; condition?: any }
  const { t } = useTranslation();
  const [variants, setVariants] = useState<any>(null);
  const variantsRef = useRef<any>(null);

  const experimentFunc = () => {
    const experiments = t("ab");
    if (experiments) {
      try {
        experimentsList?.forEach(currentExperiment => {
          const experiment = experiments.find((x: any) => x.id == currentExperiment.id);

          if (!experiment || (typeof currentExperiment.condition === "boolean" && !currentExperiment?.condition)) {
            variantsRef.current = {
              ...variantsRef.current,
              ...({ [currentExperiment.id]: "no-variant" } as any),
            };

            // if (experiment.evar) (window as any).evars[`evar${experiment.evar}`] = undefined;
            // console.error(`Experiment with ID ${id} not found`);
            return;
          }

          const weightSum = experiment.weights.map((w: any) => parseInt(w.weight)).reduce((a: number, b: number) => a + b, 0);
          if (weightSum != 100) {
            console.error(`split(${currentExperiment.id}) weight mismatch`);
            return;
          }
          const cookieKey = getCookieKey(currentExperiment.id);
          const cookieData = getCookie(cookieKey);
          const splittedValues = cookieData?.split("__") || [];
          const cookieValue = splittedValues[0];
          const cookieExpVersion = splittedValues[1];

          const params = new URLSearchParams(window.location.search);
          const expParam = params.get(cookieKey);
          const expParamSplittedValues = expParam?.split("__") || [];

          const setExperimentValues = (id: string, value: string) => {
            const cookieValue = `${value}__${experiment.version || "0.1"}`;
            setCookie(cookieKey, decodeURIComponent(cookieValue), 7);
            setSessionStorageValue(id, cookieValue);
            if (experiment?.evar) {
              (window as any).evars[`evar${experiment.evar}`] = value.toString();
            }
            variantsRef.current = { ...variantsRef.current, ...({ [id]: value } as any) };
          };

          let isNewVersion;

          if (
            cookieData &&
            (!experiment.version || !cookieExpVersion || (experiment.version && cookieExpVersion === experiment.version))
          ) {
            isNewVersion = false;
          } else {
            isNewVersion = true;
          }

          // Setting an experiment based on the router query parameter. It is helpful for local testing
          if (expParam) {
            setExperimentValues(currentExperiment.id, expParamSplittedValues[0]);
            return;
          }

          // Assign a random value based on experiment weights if it is new version
          if (isNewVersion || !cookieValue) {
            const random = randomByWeight(experiment.weights);
            setExperimentValues(currentExperiment.id, random.value);
            return;
          }
          if (experiment?.evar) {
            (window as any).evars[`evar${experiment.evar}`] = cookieValue.toString();
          }

          variantsRef.current = {
            ...variantsRef.current,
            ...({ [currentExperiment.id]: cookieValue } as any),
          };
        });
      } catch (e) {}
    }
  };

  if (!variantsRef.current && typeof window !== "undefined") {
    experimentFunc();
  }

  useEffect(() => {
    // re-run the entire hook if dependency changes for updated variants
    if (variants) {
      experimentFunc();
    }
    setVariants(variantsRef.current);
  }, deps);

  return variants;
}
