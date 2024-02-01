import React from "react";
import useTranslation from "@libHooks/useTranslation";

const SearchFooter = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center text-gray-600 font-medium text-xxs capitalize py-4 bg-themeGray">
      &copy; {t("copyRight")} {new Date().getFullYear()}
    </div>
  );
};

export default SearchFooter;
