import React, { Fragment, useState } from "react";

import useTranslation from "@libHooks/useTranslation";

import { PDPProd } from "@typesLib/PDP";

import { decodeHtml } from "@libUtils/decodeHtml";

import FaqSchema from "@libComponents/PLP/FaqSchema";

import { PDP_INFO_TABS } from "@productLib/pdp/PDP.constant";

const PDPTabs = ({ product }: { product: PDPProd }) => {
  const { t } = useTranslation();

  const CONTENT = product.cms?.[0].content as any;
  const checkSeoFaq = CONTENT.seoFaq?.[0].question;

  const TABS = PDP_INFO_TABS(t, checkSeoFaq);

  const [selectedTab, setSelectedTab] = useState(TABS[0].key);

  return (
    <section className="py-4">
      <ul className="flex list-none font-bold">
        {TABS.map(({ key, label }) => {
          if (CONTENT[key] && label) {
            return (
              <Fragment key={key}>
                <li
                  onClick={() => setSelectedTab(key)}
                  className={`flex-sliderChild mr-5 pb-2.5 tracking-wide uppercase border-b-4 rounded cursor-pointer ${
                    selectedTab === key ? "border-black" : "border-transparent"
                  }`}
                >
                  {label}
                </li>

                {(key === "faq" || key === "seoFaq") && (
                  <FaqSchema data={checkSeoFaq ? CONTENT.seoFaq : CONTENT.faq} type={`${checkSeoFaq ? "seoFaq" : "faq"}`} />
                )}
              </Fragment>
            );
          }

          return null;
        })}
      </ul>

      {selectedTab === "seoFaq" ? (
        CONTENT[selectedTab]?.map(({ question, answer }: any) => (
          <div key={question}>
            <h3 className="text-md p-2 font-semibold">{`Q: ${question}`}</h3>
            <div
              className="p-2 leading-relaxed text-[#212529] prose prose-sm prose-a:text-blue-600"
              dangerouslySetInnerHTML={{ __html: decodeHtml(answer, { stripSlash: true }) }}
            />
          </div>
        ))
      ) : (
        <div
          className="my-6  prose prose-a:text-blue-600"
          dangerouslySetInnerHTML={{ __html: decodeHtml(CONTENT[selectedTab], { stripSlash: true }) }}
        />
      )}
    </section>
  );
};

export default PDPTabs;
