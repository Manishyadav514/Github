/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import Head from "next/head";
import Image from "next/legacy/image";

import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";
import IngredientBlock from "@libComponents/LabelPadho/IngredientBlock";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";
import { IS_DESKTOP } from "@libConstants/COMMON.constant";

const instagramImageList: string[] = [
  // "https://files.babychakra.com/site-images/1200x1200/insta-post-img.png",
  "https://files.babychakra.com/site-images/original/insta-post-img-2.png",
  "https://files.babychakra.com/site-images/original/insta-post-img-3.png",
  "https://files.babychakra.com/site-images/original/insta-post-img-4.png",
  "https://files.babychakra.com/site-images/original/insta-post-img-5.png",
  "https://files.babychakra.com/site-images/original/insta-post-img-6.png",
  "https://files.babychakra.com/site-images/original/insta-post-img-7.png",
];

const LabelPadhoPage = () => {
  return (
    <main className="bg-white">
      <Head>
        <title>LabelPadhoMom - Know What Ingredients to Avoid in Baby Products - BabyChakra</title>
        <meta name="title" key="title" content="LabelPadhoMom - Know What Ingredients to Avoid in Baby Products - BabyChakra" />
        <meta
          name="description"
          key="description"
          content=" From parabens to formaldehyde, there are plenty of ingredients to avoid in baby products. Being a new mom is hard: Learn how to buy safer baby care products"
        />
        <meta name="keywords" key="keywords" content="Read the label, label padho, harmful ingredients, baby products" />
        <meta
          property="og:title"
          key="og:title"
          content="LabelPadhoMom - Know What Ingredients to Avoid in Baby Products - BabyChakra"
        />
        <meta property="og:url" key="og:url" content={`${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}/label-padho`} />
        <meta
          property="og:description"
          key="og:description"
          content="From parabens to formaldehyde, there are plenty of ingredients to avoid in baby products. Being a new mom is hard: Learn how to buy safer baby care products"
        />
        <link rel="canonical" key="canonical" href={`${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}/label-padho`} />
      </Head>
      <div className="w-full mb-4 relative lg:pb-20">
        <Image
          alt="Label Padho Moms Babychakra"
          src={
            IS_DESKTOP
              ? "https://files.babychakra.com/site-images/original/img-desktop-banner.png"
              : "https://files.babychakra.com/site-images/original/bbc-top-banner-1.png"
          }
          priority
          width={IS_DESKTOP ? 1440 : 720}
          height={IS_DESKTOP ? 578 : 1248}
          layout="responsive"
          objectFit="cover"
          title="Label Padho Moms Babychakra"
        />
        <div className="absolute bottom-10 left-0  w-full    right-0 ml-0 mr-0 text-center px-6 lg:w-2/6 lg:left-40 lg:top-60">
          <h1 className="text-2xl text-white lg:text-3xl">
            #BabyChakraKiList <br />
            <span className="text-xl text-white"> Ingredients To Avoid In Baby Products</span>
          </h1>
          <p className=" text-white py-4 text-base leading-6 lg:text-lg">
            {
              "A global rise in atopic dermatitis, eczema & allergies is because 40-60% of what you apply to your child's skin gets absorbed in their bloodstream. To champion Label Literacy, BabyChakra has created India’s 1st definitive list of ingredients to avoid in baby products."
            }
          </p>
        </div>
      </div>
      <div>
        <IngredientBlock />
      </div>
      <div className="p-4 lg:px-28 lg:py-20">
        <a href="https://djcvz.app.link/NFVDszLYEtb" aria-label="shop on babychakra">
          <Image
            width={IS_DESKTOP ? 1200 : 256}
            height={IS_DESKTOP ? 400 : 256}
            src={
              !IS_DESKTOP
                ? "https://files.babychakra.com/site-images/original/shop-banner-img.png"
                : "https://files.babychakra.com/site-images/original/img-desktop-shop-banner.png"
            }
            layout="responsive"
            objectFit="contain"
            alt="shop on babychakra "
            title="shop on babychakra"
            className=""
          />
        </a>
      </div>
      <div className="bg-gradient-to-r from-blue-100 my-4 to-rose-200 text-center py-6 lg:px-28 lg:py-12">
        <a href="https://www.instagram.com/explore/tags/labelpadhomoms/" aria-label="LabelPadhoMoms">
          <p className="text-2xl font-semibold bbc-title-theme mx-auto mt-12 inline-block ">#LabelPadhoMoms</p>
        </a>
        <p className="text-lg text-grey-400  px-6 py-4 lg:px-32 leading-6">
          With this campaign, BabyChakra started urging moms to read & check the labels of their baby’s products for hidden
          toxins & highlighted that our nourishing baby care products have clean labels & no toxins at all.
        </p>
        <GoodGlammSlider slidesPerView={IS_DESKTOP ? 3.6 : 1} autoPlay dots="dots">
          {instagramImageList?.map(imageUrl => {
            return (
              <div key={imageUrl} className="keen-slider__slide">
                <a href="https://www.instagram.com/explore/tags/labelpadhomoms/" aria-label="babychakra instagram posts">
                  <Image src={imageUrl} alt="babychakra instagram posts" width={564} height={728} />
                </a>
              </div>
            );
          })}
        </GoodGlammSlider>
      </div>

      <div className="lg:grid lg:grid-cols-3 lg:px-28 lg:py-20">
        <div className="bg-blue-400 py-4 text-center lg:p-12">
          <p className="text-2xl text-white font-semibold ">#LabelPadhoMoms</p>
          <p className="text-base text-white p-4 lg:my-8  ">
            #LabelPadhoMoms aims to increase awareness for moms about the importance of carefully choosing products for their
            kids by understanding the ingredients that go into creating the product., The BabyChakra #LabelPadhoMoms campaign
            urges mothers to read the labels of the products before buying them
          </p>
        </div>
        <div className="col-span-2">
          <iframe
            width="100%"
            height={IS_DESKTOP ? "450px" : "300px"}
            src="https://www.youtube.com/embed/flY43c0k9Kg?controls=0&rel=0"
            title="babychakra label padho moms"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      </div>
      <div className="mt-4">
        <Image
          width={IS_DESKTOP ? 1440 : 256}
          height={IS_DESKTOP ? 360 : 256}
          layout="responsive"
          objectFit="contain"
          alt="label padho momsco"
          title="label padho momsco"
          src={
            IS_DESKTOP
              ? "https://files.babychakra.com/site-images/original/web-momsco.png"
              : "https://files.babychakra.com/site-images/original/img-momsco.png"
          }
        />
      </div>
      <div className="p-4 lg:px-28 lg:py-0">
        <a href="https://djcvz.app.link/EnyUI3I0Etb" aria-label="babychakra survey">
          <Image
            width={IS_DESKTOP ? 2240 : 256}
            height={IS_DESKTOP ? 480 : 256}
            layout="responsive"
            objectFit="contain"
            alt="babychakra survey"
            title="babychakra survey"
            src={
              IS_DESKTOP
                ? "https://files.babychakra.com/site-images/original/Magic-bullet-banner-Web-2240x280-1.jpg"
                : "https://files.babychakra.com/site-images/original/magic-bullet-banner.png"
            }
          />
        </a>
      </div>
    </main>
  );
};

export default LabelPadhoPage;
