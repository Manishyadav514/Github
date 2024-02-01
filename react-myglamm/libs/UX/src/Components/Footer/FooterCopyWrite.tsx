import useTranslation from "@libHooks/useTranslation";
import React from "react";

const FooterCopyWrite = ({ websiteName }: any) => {
  const { t } = useTranslation();

  return (
    <div className="px-4">
      {/* change text color text-gray-500 to text-gray-200 for sufficient color contrast  */}
      <p className="py-1 flex justify-center text-xxs text-gray-200 border-t border-gray-600">
        &copy; {websiteName ? `Copyright ${websiteName}` : t("copyRight")} {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default FooterCopyWrite;
