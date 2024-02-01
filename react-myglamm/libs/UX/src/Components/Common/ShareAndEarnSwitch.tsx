import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";

import { REGEX } from "@libConstants/REGEX.constant";
import { anonUserCheck } from "@libUtils/anonUserCheck";
import { CONFIG_REDUCER } from "@libStore/valtio/REDUX.store";

const NameEamilPromptModal = dynamic(
  () => import(/* webpackChunkName: "NameEmailModal" */ "@libComponents/PopupModal/NameEamilPromptModal"),
  { ssr: false }
);

const ShareEarnNewModal = dynamic(
  () => import(/* webpackChunkName: "ShareModal" */ "@libComponents/PopupModal/ShareEarnNewModal"),
  {
    ssr: false,
  }
);

const ShareEarnModal = dynamic(() => import(/* webpackChunkName: "ShareModal" */ "@libComponents/PopupModal/ShareEarnModal"), {
  ssr: false,
});

const ShareAndEarnSwitch = () => {
  const { asPath } = useRouter();

  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);
  const { shareModalConfig } = useSelector((store: ValtioStore) => store.configReducer);

  const [showShareModal, setshowShareModal] = useState(false);
  const [nameEmailModal, setNameEmailModal] = useState(false);

  const onToggleModal = () => {
    if (showShareModal || nameEmailModal) {
      CONFIG_REDUCER.shareModalConfig = { shareUrl: "temp" };
    }
    setshowShareModal(prevState => !prevState);
    setNameEmailModal(prevState => !prevState);
  };

  useEffect(() => {
    if ((shareModalConfig.shareUrl || shareModalConfig.shareMessage) && shareModalConfig.shareUrl !== "temp") {
      onToggleModal();
    }

    return () => {
      setshowShareModal(false);
    };
  }, [shareModalConfig]);

  if (shareModalConfig.shareUrl || shareModalConfig.shareMessage) {
    if (anonUserCheck(userProfile)) {
      return <NameEamilPromptModal show={nameEmailModal} hide={onToggleModal} onSuccess={onToggleModal} />;
    }

    if (asPath.match(REGEX.SHOW_NEW_SHARE_MODAL)) {
      return <ShareEarnModal show={showShareModal} onRequestClose={onToggleModal} />;
    }

    return <ShareEarnNewModal show={showShareModal} onRequestClose={onToggleModal} />;
  }

  return null;
};

export default ShareAndEarnSwitch;
