/* eslint-disable */
import React from "react";

const SuccessNotification = ({ showNotification }: any) => {
  if (showNotification) {
    return (
      <>
        <div className="success-popup-text">Copied to clipboard successfully</div>
        <style jsx>
          {`
            .success-popup-text {
              background-color: #def2d6;
              color: #257e01;
              position: fixed;
              top: 84px;
              z-index: 99;
              left: 50%;
              transform: translateX(-50%);
              text-align: center;
              padding: 10px 20px;
              border-radius: 12px;
              max-width: 300px;
            }
          `}
        </style>
      </>
    );
  }
  return null;
};

export default SuccessNotification;
