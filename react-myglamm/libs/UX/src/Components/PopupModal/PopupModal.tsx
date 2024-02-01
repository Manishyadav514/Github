import React, { useState, useEffect } from "react";

import clsx from "clsx";
import { useRouter } from "next/router";
import { createPortal } from "react-dom";

import { getClientQueryParam } from "@libUtils/_apputils";
import { disableBodyScroll, enableBodyScroll } from "@libUtils/bodyScroll";

import styles from "@libStyles/css/custom-modal.module.css";
import { getGBCFont, GOOD_POINTS_FONT } from "@libConstants/FONTS.constant";
import { SITE_CODE } from "@libConstants/GLOBAL_SHOP.constant";

export const ModalPortal = ({ children }: any) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted ? createPortal(children, document.body) : null;
};

interface ModalProps {
  show: boolean;
  children: any;
  additionClass?: string;
  onRequestClose: () => void;
  type?: "center-modal" | "bottom-modal" | "right-modal";
}

const PopupModal = ({ show, children, additionClass, onRequestClose, type = "bottom-modal" }: ModalProps) => {
  const [reverse, setReverse] = useState(false);
  const router = useRouter();
  const [cleanupModal, setCleanupModal] = useState(false);

  const isSimplifiedLoginTrue = getClientQueryParam("simplifiedLogin");

  /* On State Change Handling Modal with local state to perform animation properly */
  useEffect(() => {
    if (show) {
      if (
        !isSimplifiedLoginTrue &&
        router.pathname !== "addAddress" &&
        router.pathname !== "/chat-with-us" &&
        router.pathname !== "/"
      ) {
        setTimeout(() => {
          router.push("#modal", undefined, { shallow: true });
        }, 500);
      }
      disableBodyScroll();
      setCleanupModal(true);
      router.beforePopState(() => {
        onRequestClose();
        return false;
      });
    } else {
      setReverse(true);
      setTimeout(() => {
        setCleanupModal(false);
        enableBodyScroll();
        setReverse(false);
      }, 500);
      router.beforePopState(() => {
        return true;
      });
    }

    return enableBodyScroll;
  }, [show, isSimplifiedLoginTrue]);

  useEffect(() => {
    return () => {
      router.beforePopState(() => {
        return true;
      });
    };
  }, []);

  useEffect(() => {
    return () => {
      enableBodyScroll();
    };
  }, []);

  return (
    <ModalPortal>
      {cleanupModal && (
        <div
          aria-hidden="true"
          onClick={onRequestClose}
          className={clsx(`backdrop ${styles.backdropStyle}`, reverse && "reverse", getGBCFont(SITE_CODE()))}
        >
          <div
            className={clsx(type, reverse && "reverse", styles[type], additionClass || "top-auto")}
            onClick={e => e.stopPropagation()}
            aria-hidden="true"
          >
            {children}
          </div>
        </div>
      )}
    </ModalPortal>
  );
};

export default PopupModal;
