import React, { Fragment } from "react";

import useTranslation from "@libHooks/useTranslation";

import FooterMenu from "./FooterMenu";

const FooterTMC = () => {
  const { t } = useTranslation();

  return (
    <Fragment>
      <FooterMenu />

      <div className="max-w-screen-lg mx-auto pb-4">
        <div className="col-md-12">
          <img
            style={{ width: "250px" }}
            alt=""
            src="https://files.themomsco.com/site-images/original/-NewLogo-1414x288png.png"
          />
          <p className="text-sm">
            © 2021. Amishi Consumer Technologies Private Limited. The Moms Co (trade name), The Moms Co (logo), Nature In Toxins
            Out (trade name), and Nature In Toxins Out (logo) are properties of Amishi Consumer Technologies Private Limited.
            Australian-Certified Toxic-Free is a Registered Trademark of Safe Cosmetics, Australia, and used under license. All
            other logos and brands are the property of their respective owners. Other companies, product and service names used
            in this website are for identification purposes only. The use of these names, logos, and brands does not imply
            endorsement.
          </p>
          <div className="text-sm flex justify-between items-center">
            <p>
              {t("supportContact") && (
                <>
                  <a>{t("supportContact")}</a> |&nbsp;
                </>
              )}
              <a href={`mailto:${t("supportEmailId")}`}>{t("supportEmailId")}</a>
            </p>
            <p className="flex items-center justify-between">
              <a href="https://www.facebook.com/TheMomsCo" className="mx-1">
                <img src="https://themomsco.cdn.imgeng.in/media/wysiwyg/facebook-logo.png" alt="facebook" />
              </a>
              &nbsp;&nbsp;
              <a href="https://www.instagram.com/TheMomsCo/" className="mx-1">
                <img src="https://themomsco.cdn.imgeng.in/media/wysiwyg/Instagram-logo.png" alt="instagram" />
              </a>
              &nbsp;&nbsp;
              <a href="https://www.youtube.com/channel/UCV0wtCows-JFIGk_xk2trag" className="mx-1">
                <img src="https://themomsco.cdn.imgeng.in/media/wysiwyg/Youtube-Logo.png" alt="youtube" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default FooterTMC;
