import * as React from "react";

export const BodyStyles = (
  <style>
    {`
      :root {
        --pdp-review-star-size: 44px;
        --pdp-review-star-color: var('--color2');
        --pdp-review-star-background: var('--color1');
      }
      
      .Stars {
          --percent: calc(var(--rating) / 5 * 100%);
          display: inline-block;
          font-size: var(--pdp-review-star-size);
          font-family: Times;
          line-height: 1;
          left: -2px;
          position: relative;
      }
      
      .CenterModal .VideoModal {
          top: calc(50% - 8rem);
      }
      
      .CenterModal .shadow-lg .glammPopup {
          background-color: white;
          border-radius: 20px;
      }
      
      .BottomModal {
          z-index: 1000;
          width: 100%;
          --padding: 0;
      }
      
      /* fix: react-spring-modal uses 100vh which causes problems in safari and chrome both */
      .ModalOverlay {
          z-index: 1000;
          width: 100%;
          padding: 0;
          height: 100% !important;
      }
      
      .CenterModal {
          z-index: 1000;
          width: 100%;
          padding: 0;
          --padding: 0;
          background: unset;
      }
      
      .ModalContent {
          height: max-content;
          outline: none;
      }
      
      .VideoModal {
          top: calc(50% - 8rem) !important;
      }
      
      .FilterModal {
          top: calc(5%) !important;
      }
      
      .PreOrderModal {
          padding: 0 25px !important;
      }
      
      button {
        outline: none;
      }
      
      /* Native HTML Accordian css */
      details {
          transition: max-height 2s ease;
          overflow: hidden;
      }
      
      details summary>* {
          display: inline;
      }
      
      summary {
          outline: none;
      }
      
      summary::marker,
      summary::-webkit-details-marker {
          color: transparent;
          display: none;
      }
      
      details[open] {}
      
      @keyframes dropDown {
          from {
              max-height: 60px;
          }
      
          to {
              max-height: 10000px;
          }
      }
      
      /* Skeleton Animation */
      @keyframes shine {
          to {
              background-position: 100% 0;
          }
      }
      
      .react-transform-component,
      .react-transform-element {
          width: 100% !important;
      }
      
      .rh5v-Seek_component .ui-video-seek-slider .thumb {
          top: 5px;
      }
      
      .rh5v-Seek_component .ui-video-seek-slider .thumb .handler,
      .rh5v-Seek_component .ui-video-seek-slider .track .main .connect {
          background-color: #fff;
      }
      
      .rh5v-Seek_component .ui-video-seek-slider .track .main {
          top: 9px;
      }
      
      /* Scratch Card Shake Animation - Start */
      
      .card {
          perspective: 75rem;
      }
      
      .front, .back {
          position: absolute;
          width: 300px;
          height: 460px;
          backface-visibility: hidden;
          overflow: hidden;
          transition: transform 0.6s linear;
          -webkit-backface-visibility: hidden;
      }
      
      .front {
          transform: rotateY(-0deg);
      }
      
      .back {
          transform: rotateY(-180deg);
      }
      
      .scratchCard-shake {
          animation: shakeImg 0.7s ease-in-out;
      }
      
      @keyframes shakeImg {
          0% {
              -webkit-transform: rotate(0deg);
          }
      
          25% {
              -webkit-transform: rotate(20deg);
          }
      
          50% {
              -webkit-transform: rotate(0deg);
          }
      
          75% {
              -webkit-transform: rotate(-20deg);
          }
      
          100% {
              -webkit-transform: rotate(0deg);
          }
      }
      
      /* Scratch Card Shake Animation - End */
      
      /** bof :: popup modal */
      @keyframes modalBottomFade {
          from {
              bottom: -100%;
              opacity: 0;
          }
      
          to {
              bottom: 0;
              opacity: 1;
          }
      }
      
      @keyframes modalBottomFadeReverse {
          from {
              bottom: 0;
              opacity: 1;
          }
      
          to {
              bottom: -100%;
              opacity: 0;
          }
      }
      
      @keyframes modalCenterScaleFade {
          from {
              transform: scale(0);
              opacity: 0;
          }
      
          to {
              transform: scale(1);
              opacity: 1;
          }
      }
      
      @keyframes modalCenterScaleReverse {
          from {
              transform: scale(1);
              opacity: 1;
          }
      
          to {
              transform: scale(0);
              opacity: 0;
          }
      }

      @keyframes modalRightFade {
        from {
            right: -100%;
            opacity: 0;
        }
    
        to {
            right: 0;
            opacity: 1;
          }
      }
      
      @keyframes modalRightFadeReverse {
          from {
            right: 0;
            opacity: 1;
          }
      
          to {
            right: -100%;
            opacity: 0;
          }
      }
      
      .bottom-modal {
          animation-name: modalBottomFade;
          animation-duration: 0.3s;
          animation-fill-mode: forwards;
      }
      
      .bottom-modal.reverse {
          animation-duration: 0.8s;
          animation-name: modalBottomFadeReverse;
      }
      
      .center-modal {
          animation-name: modalCenterScaleFade;
          animation-duration: 0.3s;
          animation-fill-mode: forwards;
      }
      
      .center-modal.reverse {
          animation-duration: 0.8s;
          animation-name: modalCenterScaleReverse;
      }

      .right-modal {
        animation-name: modalRightFade;
        animation-duration: 0.5s;
        animation-fill-mode: forwards;
      }
      
      .right-modal.reverse {
        animation-duration: 0.8s;
        animation-name: modalRightFadeReverse;
      }
      
      @keyframes backdropFade {
          from {
              opacity: 0;
          }
      
          to {
              opacity: 1;
          }
      }
      
      @keyframes backdropFadeReverse {
          from {
              opacity: 1;
          }
      
          to {
              opacity: 0;
          }
      }
      
      .backdrop {
          animation-name: backdropFade;
          animation-duration: 0.3s;
          animation-fill-mode: forwards;
          display: flex;
          align-items: center;
          justify-content: center;
      }
      
      .backdrop.reverse {
          animation-name: backdropFadeReverse;
      }
      
      /** eof :: popup modal */
      
      .extraSpace {
          height: 4rem;
      }
    `}
  </style>
);
