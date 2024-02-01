import * as React from "react";

import useTranslation from "@libHooks/useTranslation";

const HealthCheck = () => {
  const { t } = useTranslation();
  return (
    <div className="panel shadow-lg m-3 p-3 text-center rounded-md">
      <h1>
        {t("ALL")}&nbsp;{t("ok")} !!!
      </h1>
    </div>
  );
};

export default HealthCheck;
