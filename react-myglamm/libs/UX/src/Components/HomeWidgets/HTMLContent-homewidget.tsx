import React from "react";
import { replaceAV } from "@libHooks/useTranslation";
import InnerHTML from 'dangerously-set-html-content'
import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";

const HTMLContent = ({ item }: any) => (
  <ErrorBoundary>
    <div
      className="HTML-Content p-2"
    >
      <InnerHTML html={`${replaceAV((globalThis as any).htmlReplaceArray || [], item.commonDetails?.description)}`} />
    </div>
  </ErrorBoundary>
);

export default HTMLContent;
