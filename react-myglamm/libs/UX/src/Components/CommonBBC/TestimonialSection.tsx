import React from "react";

import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";
import { getStaticUrl } from "@libUtils/getStaticUrl";

import { IS_DESKTOP } from "@libConstants/COMMON.constant";

interface TestimonialCardInterface {
  image: string;
  name: string;
  text: string;
}

const TestimonialCard = (props: TestimonialCardInterface) => {
  const { image, name, text } = props;
  return (
    <div className="text-center shadow-combo px-2 py-8 relative w-[295px] mx-auto h-[360px] bg-white">
      {/* <Image className=" mx-auto" src={image} alt={name} layout="intrinsic" width={112} height={126} /> */}
      <div className="font-bold text-lg mt-4">{name}</div>
      <div className="my-8 mx-2 ">{text}</div>
      <div className="flex flex-row-reverse absolute bottom-4 right-4">
        <img src={getStaticUrl("/svg/down-quote.svg")} style={{ width: "41px", height: "41px" }} alt="quote" loading="lazy" />
      </div>
      <img
        src={getStaticUrl("/svg/up-quote.svg")}
        style={{ width: "171px", height: "171px" }}
        alt="quote"
        loading="lazy"
        className="absolute top-0"
      />
    </div>
  );
};

interface TestimonialSectionInterface {
  testimonialData: {
    title: string;
    cards: TestimonialCardInterface[];
  };
  isHomePage?: boolean;
  customClassTitle?: string;
}

const TestimonialSection = ({ testimonialData, customClassTitle }: TestimonialSectionInterface) => {
  return (
    <section className="py-6 md:py-16 bg-white">
      <h2 className="mx-auto text-center text-xl font-semibold"> What are our Bloggers Saying</h2>
      <GoodGlammSlider slidesPerView={IS_DESKTOP ? 4.2 : 1} autoPlay dots="dots">
        {testimonialData.cards.map(elem => {
          return (
            <div className="keen-slider__slide mt-4 pb-10 md:py-6 " key={elem?.image}>
              <TestimonialCard key={elem.name} image={elem.image} name={elem.name} text={elem.text} />
            </div>
          );
        })}
      </GoodGlammSlider>
    </section>
  );
};

TestimonialSection.defaultProps = {
  isHomePage: false,
  customClassTitle: "",
};

export default React.memo(TestimonialSection);
