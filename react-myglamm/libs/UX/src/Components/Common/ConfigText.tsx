import * as React from "react";
import useTranslation from "@libHooks/useTranslation";

type ConfigTextProps = {
  configKey: string;
  fallback?: string;
  className?: string;
};

const ConfigText = ({ configKey, fallback, className = "" }: ConfigTextProps) => {
  const { t } = useTranslation();
  return <span className={className}>{t(configKey) || fallback}</span>;
};

export default ConfigText;
