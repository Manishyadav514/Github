import useTranslation from "@libHooks/useTranslation";
import * as React from "react";

import PopupModal from "./PopupModal";

const MessagePopup = ({ view, hide }: any) => {
  const { t } = useTranslation();
  return (
    <PopupModal show={view} onRequestClose={hide} type="center-modal">
      <div className="modal-dialog glammPopup bg-white">
        <div className="modal-content">
          <div id="birthday-popup-modal">
            {/**/}
            <div className="">
              <button type="button" className="close" onClick={hide}>
                ×
              </button>
              <div className="fullwidth pull-left">
                <div className="popup-heading">
                  <div className="modal-head text-center">Thank You!</div>
                  <div className="birthday-txt text-center">
                    Your {t("myglammPoints")} will be credited to your account within 4 Hours
                  </div>
                </div>
                <button type="submit" className="popupSubmit" onClick={hide}>
                  <span className="btn">OKAY</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PopupModal>
  );
};

export default MessagePopup;
