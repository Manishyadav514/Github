/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";

import DatePicker from "@amir04lm26/react-modern-calendar-date-picker";
import { DatePickerCss } from "@libStyles/TSStyles/datePicker";

import RawBtn from "@libComponents/CommonBBC/RawBtn";
import FaqSection from "@libComponents/CommonBBC/FaqSection";
import BreadCrumb from "@libComponents/CommonBBC/BreadCrumb";
import ArticleListRenderer from "@libComponents/CommonBBC/ArticleCardSection";
import CollapsableBlock from "@libComponents/CommonBBC/CollapsableBlock";
import AdSlots from "@libComponents/CommonBBC/ads/AdSlots";
import { HOME_ATF, HOME_BTF, HOME_PAGE_ADS } from "@libConstants/AdsConstants";

import HomeStatic from "@libUtils/jsondata/home-static.json";

import { breadcrumbType } from "@typesLib/seoTypes";

import { generateBreadCrumbSchema, makeBreadCrumbSchemaList, generateFaqSchema } from "@libUtils/seoHelper";

import WpArticleApi from "@libAPI/apis/WpArticleApi";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";
import { getStaticUrl } from "@libUtils/getStaticUrl";

const AppDownloadCard = dynamic(() => import("@libComponents/CommonBBC/AppDownloadCard"));

type cycleLengthInterface = {
  id: number;
  text: string;
};

const CYCLE_LENGTH: cycleLengthInterface[] = [
  {
    id: 23,
    text: "21-25 Days",
  },
  {
    id: 28,
    text: "26-30 Days",
  },
  {
    id: 33,
    text: "30-35 Days",
  },
];

const breadCrumbList: breadcrumbType[] = [
  { to: "/", label: "Home", schemaTo: `${GBC_ENV.NEXT_PUBLIC_BASE_URL}` },
  { to: "/pregnancy", label: "Pregnancy", schemaTo: `${GBC_ENV.NEXT_PUBLIC_BASE_URL}/pregnancy` },
];

const itemListElement = makeBreadCrumbSchemaList(breadCrumbList);

const breadcrumbSchema = generateBreadCrumbSchema(itemListElement, {
  name: "Ovulation Calculator",
  url: `${GBC_ENV.NEXT_PUBLIC_BASE_URL}/ovulation-calculator`,
});

const ovulationFAQSchema = generateFaqSchema(HomeStatic?.faq_ovulation);

type ArticleListType = {
  articleList: any;
};

const OvulationCalculator = ({ articleList }: ArticleListType) => {
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [cycleLength, setCycleLength] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [fertileDate, setFertileDates] = useState<any[]>([]);

  const getFertilePeriod = (nextOvulationDate: Date) => {
    const milliSecondValueForFertileDays = 4 * 1000 * 60 * 60 * 24;
    const fertileStartDate = new Date(+nextOvulationDate - milliSecondValueForFertileDays);
    const fertileLastDate = new Date(+nextOvulationDate + milliSecondValueForFertileDays);

    return `${fertileStartDate.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })}- ${fertileLastDate.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })}`;
  };

  const getNextSixMonthsOvulationData = (ovulationDate: Date) => {
    const milliSecondValueForCycle = cycleLength * 1000 * 60 * 60 * 24;
    const nineMonthDate = 1000 * 60 * 60 * 24 * 274;
    let dueDate;
    let nextOvulationDate = ovulationDate;
    const sixMonthsData = [...Array(6).keys()].map(() => {
      nextOvulationDate = new Date(+nextOvulationDate + milliSecondValueForCycle);
      dueDate = new Date(+nextOvulationDate + nineMonthDate);
      return {
        text: getFertilePeriod(nextOvulationDate),
        dueDate: dueDate.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      };
    });
    setFertileDates(sixMonthsData as any);
  };

  const handleCalculationAndShow = () => {
    const userLastPeriodDate = new Date(`${selectedDate?.year}-${selectedDate?.month}-${selectedDate?.day}`);
    const lastOvulationDate = new Date(+new Date(userLastPeriodDate) - 12096e5); // magic number 14
    getNextSixMonthsOvulationData(lastOvulationDate);
    setShowResult(true);
  };

  return (
    <main>
      <Head>
        <title>Ovulation Calculator: Discover your fertile days</title>
        <meta name="title" key="title" content="Ovulation Calculator: Discover your fertile days" />
        <meta
          key="description"
          name="description"
          content=" Ovulation calculator |  Trying to get pregnant, use this BabyChakra Ovulation calculator and discover your most fertile days"
        />
        <meta name="keywords" key="keywords" content="ovulation, ovulation calculator" />
        <meta property="og:title" key="og:title" content="Ovulation Calculator: Discover your fertile days" />
        <meta
          property="og:description"
          key="og:description"
          content="Trying to get pregnant, use this BabyChakra Ovulation calculator and discover your most fertile days"
        />
        <link rel="canonical" href={`${GBC_ENV.NEXT_PUBLIC_BASE_URL}/ovulation-calculator`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ovulationFAQSchema) }} />
      </Head>
      <div className="lg:bg-white">
        <div>
          <div className="lg:w-[55%] mx-auto">
            <BreadCrumb
              breadCrumbList={breadCrumbList}
              currentPath="Ovulation Calculator"
              customClassname="px-2.5 mb-2 py-1 "
            />
          </div>
          <div className="phase-1 relative lg:w-[55%] mx-auto">
            <img
              alt="ovulation calculator"
              title="Due Date Calculator "
              className="w-full lg:hidden"
              src={getStaticUrl("/images/bbc-g3/pink-bg-img-trackers.svg")}
            />
            <img
              alt="ovulation calculator"
              title="Due Date Calculator"
              className="w-full hidden lg:block"
              src={getStaticUrl("/svg/web-bg-ovulation.png")}
            />
            {!showResult ? (
              <div className="absolute top-4 z-0 mx-4  lg:w-full lg:mx-0 md:px-20 lg:py-10">
                <span className="text-red-800 text-xl">When did your last period start?</span>
                <div className="relative">
                  {/* Label used so that the icon click  activates date picker */}
                  <div className="relative">
                    {DatePickerCss}

                    <DatePicker
                      value={selectedDate}
                      onChange={setSelectedDate}
                      inputPlaceholder="Last Period Date"
                      locale="en"
                      wrapperClassName="w-full my-4 rounded-lg border border-red-800 lg:w-10/12"
                      inputClassName="border border-red-800 h-12 text-left w-full font-bold text-black rounded-lg"
                    />

                    <img
                      src={getStaticUrl("/images/bbc-g3/ico-calendar.svg")}
                      alt="ico-calendar"
                      width="20px"
                      height="20px"
                      className="absolute top-1/2 -translate-y-1/2 right-4 md:hidden"
                      style={{ zIndex: "999" }}
                    />
                  </div>
                </div>
                <p className="text-red-800 text-xl pt-8">Pick your cycle length</p>
                <div className="my-8">
                  {CYCLE_LENGTH?.map(elem => {
                    return (
                      <span
                        className={`w-[105px] rounded-xl py-2 px-3 font-500 mx-1 h-[35px] cursor-pointer lg:mx-3 ${
                          elem?.id === cycleLength ? "bg-red-800 text-white" : "bg-white text-gray-500"
                        }`}
                        key={elem?.id}
                        onClick={() => setCycleLength(elem?.id as any)}
                      >
                        {elem.text}
                      </span>
                    );
                  })}
                </div>
                <div className="mx-auto text-center py-8">
                  <RawBtn
                    buttonName="SEE YOUR FERTILE DAYS"
                    customClassName={`${
                      !(selectedDate && cycleLength) ? "bg-gray-300" : "bg-color1"
                    } text-base font-bold  uppercase font-bold  py-2 px-8 rounded text-white lg:w-[350px] `}
                    buttonOnClick={handleCalculationAndShow}
                    isButtonDisabled={!(selectedDate && cycleLength)}
                  />
                </div>
                <p className="text-xs text-gray-500 my-6">
                  Note: Do not use this tool to prevent pregnancy. The results of actual ovulation will vary for each woman.
                </p>
              </div>
            ) : (
              <div className="absolute top-4 z-0 mx-4 text-center lg:w-full lg:mx-0 md:px-20 lg:px-40 lg:py-10">
                <p className="text-base font-semibold text-left lg:text-center">
                  Your most fertile days for next six <br />
                  month cycles
                </p>
                <div className="border bg-color2 rounded-xl my-3">
                  <div className="flex items-center justify-between p-3">
                    <div className="text-red-800 text-base font-semibold">Fertile Days</div>
                    <div className="text-red-800 text-base font-semibold">Due Date</div>
                  </div>
                  {fertileDate?.map((elem, index) => {
                    return (
                      <div
                        key={elem?.dueDate}
                        className={`${
                          fertileDate.length - 1 === index && "rounded-b-lg"
                        } flex bg-white items-center justify-between p-3`}
                      >
                        <div className="text-red-800">{elem?.text}</div>
                        <div className="text-red-800">{elem?.dueDate}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="mx-auto text-center py-3">
                  <RawBtn
                    buttonName="RECALCULATE"
                    customClassName="text-base font-bold uppercase  py-2 px-8  text-color1 underline"
                    buttonOnClick={() => setShowResult(false)}
                    isButtonDisabled={!(selectedDate && cycleLength)}
                  />
                  <p className="text-sm text-gray-500 my-6">
                    Note: Do not use this tool to prevent pregnancy. The results of actual ovulation will vary for each woman.
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="mx-auto lg:w-[55%]">
            <AdSlots id="div-gpt-ad-ovulation-atf" className="my-4 mx-auto md:hidden" adSlotData={HOME_ATF} />
            {showResult && articleList?.length > 0 && (
              <ArticleListRenderer articleDetails={articleList} title="Most Read Articles" />
            )}
          </div>
          <div className="lg:w-[55%] mx-auto">
            <div className="p-6  lg:p-0 lg:py-4 bg-white drop-shadow-lg lg:drop-shadow-none">
              <div>
                <h1 className="font-bold text-base">What Is An Ovulation Calculator & How Does It Work</h1>
                <p
                  className="text-gray-500 text-sm"
                  dangerouslySetInnerHTML={{ __html: (HomeStatic?.ovulation as any)?.what_is_ovulation_calc?.text }}
                />
              </div>
            </div>
            <div className="p-6 lg:p-0 bg-white my-4 drop-shadow-lg lg:drop-shadow-none">
              <h2 className="font-bold text-base mb-2"> Signs Of Ovulation</h2>
              <CollapsableBlock
                minHeight="h-[193px]"
                ctaText="Read More"
                ctaReverseText="Read Less"
                ctaCustomClass="text-color1 -bottom-10 absolute right-0 text-sm"
              >
                <p
                  className=" text-gray-500 text-sm"
                  dangerouslySetInnerHTML={{ __html: (HomeStatic?.ovulation as any)?.signs_of_ovulation?.text }}
                />
                <div className=" my-4">
                  {HomeStatic?.ovulation?.ovulation_prediction.map(elem => {
                    return (
                      <p
                        className="text-gray-500 text-sm py-1"
                        dangerouslySetInnerHTML={{ __html: elem?.text }}
                        key={elem?.text}
                      />
                    );
                  })}
                </div>
              </CollapsableBlock>
            </div>
            <AdSlots id="div-gpt-ad-ovulation-mid" className="my-4 mx-auto md:hidden" adSlotData={HOME_PAGE_ADS} />
            <div className="p-6 lg:p-0 bg-white my-4 drop-shadow-lg lg:drop-shadow-none">
              <h2 className="font-bold text-base mb-2">Ovulation Prediction</h2>
              <p
                className=" text-gray-500 text-sm"
                dangerouslySetInnerHTML={{ __html: (HomeStatic?.ovulation as any)?.prediction?.text }}
              />
            </div>
            <div className="p-6 lg:p-0 bg-white my-4 drop-shadow-lg lg:drop-shadow-none">
              <h2 className="font-bold text-base mb-2">Other Helpful Resources</h2>
              <div className="bg-orange-50 py-4 px-2">
                <div className="px-2 list-disc">
                  <li>
                    <Link
                      href={`${GBC_ENV.NEXT_PUBLIC_BASE_URL}/learn/category/pregnancy-week-by-week`}
                      aria-label="Week By Week Pregnancy"
                    >
                      Week By Week Pregnancy
                    </Link>
                  </li>
                  <li>
                    <Link href={`${GBC_ENV.NEXT_PUBLIC_BASE_URL}/pregnancy`} aria-label="Pregnancy Tips">
                      Pregnancy Tips
                    </Link>
                  </li>
                  <li>
                    <Link href={`${GBC_ENV.NEXT_PUBLIC_BASE_URL}/baby`} aria-label="Baby Care">
                      Baby Care
                    </Link>
                  </li>
                  <li>
                    <Link href={`${GBC_ENV.NEXT_PUBLIC_BASE_URL}/baby-names-finder`} aria-label="Baby Names">
                      Baby Names
                    </Link>
                  </li>
                </div>
              </div>
            </div>
            <AdSlots id="div-gpt-ad-ovulation-btf" className="my-4 mx-auto md:hidden" adSlotData={HOME_BTF} />
            <div className="m-6 p-3 text-sm text-gray-500 border-solid border border-[#dbdbdb] rounded-md">
              Disclaimer: This tool cannot and should not be used to prevent pregnancy. Results are estimates and actual
              ovulation will vary for each woman.This tool cannot and should not be used to prevent pregnancy. Results are
              estimates and actual ovulation will vary for each woman.
            </div>
          </div>
          <div className="mx-auto lg:w-[55%]">
            {showResult && <AppDownloadCard />}
            <FaqSection faqData={HomeStatic.faq_ovulation} />
          </div>
        </div>
      </div>
    </main>
  );
};

OvulationCalculator.getInitialProps = async (ctx: any) => {
  let userAgent;
  if (ctx?.req) {
    userAgent = ctx.req.headers["user-agent"];
  } else {
    userAgent = navigator.userAgent;
  }

  try {
    const ovulationData = {
      slug: "planning-a-baby",
    };
    const articlesAPI = new WpArticleApi();
    const response = await Promise.allSettled([articlesAPI.getArticleListBySlug(ovulationData)]);
    let articleList = [];
    if (response?.[0]?.status === "fulfilled") {
      articleList = response?.[0]?.value?.data || [];
    }
    return {
      articleList,
    };
  } catch (error) {
    return {
      articleList: [],
    };
  }
};

export default OvulationCalculator;
