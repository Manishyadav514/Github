import React from "react";
import Head from "next/head";
import Image from "next/legacy/image";
import Link from "next/link";

import TestimonialSection from "@libComponents/CommonBBC/TestimonialSection";

// later move this data to common json
import homePageStaticData from "@libUtils/jsondata/home-static.json";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";
import { IS_DESKTOP } from "@libConstants/COMMON.constant";

type StoryCardDataType = {
  imgUrl: string;
  text: string;
};

const contentAndImage = [
  {
    title: "Click on Register",
    image: "https://files.babychakra.com/site-images/original/how-to-sign-up-1.png",
    alt: "How to sign for Guest blogging",
  },
  {
    title: "Fill in Your Details",
    image: "https://files.babychakra.com/site-images/original/how-to-sign-up-2.png",
    alt: "fill creators form ",
  },
  {
    title: "Get Started!",
    image: "https://files.babychakra.com/site-images/original/how-to-sign-up-3.png",
    alt: "get started with creating content",
  },
];

const CreatorsClubPage = () => {
  return (
    <main>
      <Head>
        <title>Write for Us & Get Paid | BabyChakra.com</title>
        <meta name="title" key="title" content="Write for Us & Get Paid | BabyChakra.com" />
        <meta
          name="description"
          key="description"
          content="Write Guest blogs on Babychakra.com | Blog with BabyChakra & Win Cash Rewards |Build Community, Get Verified Profile Badges and a lot more! "
        />

        <meta property="og:title" key="og:title" content="Write for Us & Get Paid | BabyChakra.com" />
        <meta
          property="og:description"
          key="og:description"
          content="Write Guest blogs on Babychakra.com | Blog with BabyChakra & Win Cash Rewards |Build Community, Get Verified Profile Badges and a lot more! "
        />
        <link rel="canonical" key="canonical" href={`${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}/become-a-creator`} />
      </Head>
      <div className="mx-auto">
        <div className="w-full relative block ">
          <Image
            alt="Blog with Babychakra"
            priority
            src={
              IS_DESKTOP
                ? "https://files.babychakra.com/site-images/original/web-top-banner.png"
                : "https://files.babychakra.com/site-images/original/mweb-top-banner.png"
            }
            width={!IS_DESKTOP ? "300" : "1440"}
            height={!IS_DESKTOP ? "460" : "360"}
            className=""
            layout="responsive"
            objectFit="cover"
          />
          <div className="absolute top-8 text-center left-0 right-0 m-auto px-6 lg:left-60 lg:text-left lg:max-w-[400px] lg:mx-0 lg:top-24">
            <h1 className="text-2xl font-semibold text-red-500">Blog with Babychakra</h1>
            <h2 className="my-2  ">
              Build your audience to get a verified creator badge, assured cash rewards, paid brand campaigns & a WHOLE lot
              more!
            </h2>
          </div>
          <div className="absolute left-0 right-0 bottom-10 mx-auto text-center lg:left-60 lg:text-left lg:max-w-[400px] lg:mx-0 lg:top-60 lg:px-6">
            <button
              type="button"
              className="bg-themePink  text-base  uppercase font-bold  py-2 px-8 rounded text-white lg:w-[230px]"
            >
              <Link href="https://bit.ly/3BRBGYQ" className="w-full block" aria-label="register now">
                Register Now
              </Link>
            </button>
          </div>
        </div>
        <div className="why-create-section text-center bg-yellow-50 py-8 my-2  lg:py-16">
          <h2 className="text-xl font-semibold mb-2">Why Create With Us</h2>
          <p>Unlock exciting rewards each time you level up</p>
          <div className="flex items-center overflow-auto space-x-8 hide-scrollbar-css my-8 px-4 mx-auto lg:justify-center">
            {[
              {
                imgUrl: "https://files.babychakra.com/site-images/original/creator-badge.png",
                text: "BabyChakra Creator Badges",
              },
              {
                imgUrl: "https://files.babychakra.com/site-images/original/social-media-shouts.png",
                text: "Social-Media Shoutouts",
              },
              { imgUrl: "https://files.babychakra.com/site-images/original/asured-cash.png", text: "Assured Cash Rewards" },
              { imgUrl: "https://files.babychakra.com/site-images/original/paid-campaign.png", text: "Paid Brand Campaigns" },
              {
                imgUrl: "https://files.babychakra.com/site-images/original/livechat-bbc.png",
                text: "Live Chat With BabyChakra",
              },
            ].map((elem: StoryCardDataType) => {
              return (
                <div className="relative items-center text-center " key={elem?.text}>
                  <img
                    alt={elem?.text}
                    src={elem?.imgUrl}
                    width={100}
                    height={100}
                    className="min-w-[100px] max-w-[100px] mx-auto "
                  />
                  {elem?.text && <p className="my-3 text-[12px] lg:my-6  lg:text-lg lg:max-w-[140px]"> {elem?.text}</p>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Roadmap */}
        <div className="w-full relative block  bg-blue-50 my-2 text-center p-2 lg:p-10 lg:h-full lg:px-32 lg:py-20">
          <Image
            alt="Start your journey as a  Guest Blogger on Babychakra"
            src={
              IS_DESKTOP
                ? "https://files.babychakra.com/site-images/original/web-creator-journey.png"
                : "https://files.babychakra.com/site-images/original/creator-journey.png"
            }
            width={IS_DESKTOP ? 1400 : 750}
            height={IS_DESKTOP ? 600 : 1642}
            className=""
            layout="responsive"
            objectFit="cover"
          />
          <button
            type="button"
            className="bg-themePink mt-10 my-4 text-base  uppercase font-bold  py-2 px-8 rounded text-white lg:w-[230px]"
          >
            <Link
              href={`${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}/community`}
              className="w-full block"
              aria-label="Get Started Now"
            >
              Get Started Now
            </Link>
          </button>
        </div>

        {/* New creator */}
        <div className="w-full relative pt-4 mx-auto px-6 lg:h-full lg:px-32 lg:py-20">
          <Image
            alt="Blog with Babychakra"
            src={
              IS_DESKTOP
                ? "https://files.babychakra.com/site-images/original/web-newbie-creator.png"
                : "https://files.babychakra.com/site-images/original/newbie-creator.png"
            }
            width={IS_DESKTOP ? 1200 : 300}
            height={IS_DESKTOP ? 400 : 460}
            className="rounded-lg "
            layout="responsive"
            objectFit="cover"
          />
          <div className="absolute top-2/3 left-0 right-0 m-auto text-center lg:left-60 lg:text-left lg:max-w-[400px] lg:mx-0 lg:top-52">
            <h2 className="text-2xl font-semibold">Our Latest Newbie Creator</h2>
            <h2 className="my-3">
              Check out everyone who has been creating a <br />
              lot of noise with their posts
            </h2>

            <button
              type="button"
              className="bg-themePink  text-base  uppercase font-bold lg:w-[230px] py-2 px-8 rounded text-white "
            >
              <Link href="https://bit.ly/3BRBGYQ" className="w-full block " aria-label="Register Now">
                Register Now
              </Link>
            </button>
          </div>
        </div>

        <div className="w-full relative  bg-yellow-50 p-10 text-center my-4 ">
          <h2 className="text-2xl font-semibold">How To Sign Up</h2>
          <div className="flex items-center justify-evenly">
            {contentAndImage.map(elem => {
              return (
                <div className="pt-6" key={elem.title}>
                  <h3 className="font-semibold">{elem.title}</h3>
                  <img src={elem.image} className="mx-auto" alt={elem.alt} width="300px" loading="lazy" />
                </div>
              );
            })}
          </div>
        </div>
        <TestimonialSection
          testimonialData={homePageStaticData.creators_testimonials}
          customClassTitle="text-2xl font-semibold text-center"
        />
      </div>
    </main>
  );
};

export default CreatorsClubPage;
