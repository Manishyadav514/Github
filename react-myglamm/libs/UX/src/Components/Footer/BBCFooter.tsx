import React, { useEffect } from "react";
import Link from "next/link";

import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";

const BBCFooter = () => {
  const { footer } = useSelector((store: ValtioStore) => store.navReducer);

  useEffect(() => {
    const buttonElements = document.querySelectorAll(".ANIMATE");
    buttonElements.forEach(button => {
      const top = button.getBoundingClientRect().top;
      if (top < window.innerHeight - 50) {
        button.classList.add("already-on-page");
      } else {
        button.classList.add("not-on-page");
      }
    });

    window.addEventListener("scroll", () => {
      buttonElements.forEach(button => {
        const topScroll = button.getBoundingClientRect().top;
        if (topScroll < window.innerHeight - 50 && button.classList.contains("not-on-page")) {
          button.classList.add("fade-in-up");
        }
      });
    });
  }, []);

  const styleShadow = {
    borderTop: "1px solid #f9f9f7",
    borderColor: "#000",
    boxShadow: "0 1px 1px 0 #9b9b9b",
  } as React.CSSProperties;

  return (
    <div>
      <style jsx>
        {`
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(50px);
            }
            100% {
              opacity: 1;
              transform: translateY(0px);
            }
          }
          .fade-in-up {
            animation: fadeInUp 0.5s both;
          }
          .already-on-page {
            opacity: 1;
            transform: translateY(0px);
          }
          .not-on-page {
            opacity: 0;
            transform: translateY(50px);
          }
        `}
      </style>

      <div style={{ backgroundColor: "#262424" }} className="DARK-BROWN-THEME py-7 pb-5 px-7">
        <div className="COMMUNITY BANNER">
          <p className="text-center text-xl mb-3 text-white">Join BabyChakra Community</p>
          <div className="text-center mb-7 rounded-lg px-9 bg-white ">
            <div className="flex justify-between items-center py-5">
              <div style={{ backgroundColor: "#e45867" }} className="h-14 w-14 flex justify-center items-center rounded-full">
                <img src="https://files.babychakra.com/site-images/original/icons8-google-pixel-6-48.png" alt="bbImage" />
              </div>
              <p style={{ color: "#e45867" }} className="text-3xl font-medium">
                2.25<span className="text-base">M</span>
              </p>
              {/* change text color #e45867 to #951825 for sufficient color contrast */}
              <p style={{ color: "#951825" }} className="font-semibold">
                Parents on <br />
                BabyChakra
              </p>
            </div>
            <div className="flex items-end justify-center">
              <p className="text-base">Rating</p>
              <p className="text-3xl font-semibold px-2">4.6</p>
              <div className="flex mb-2">
                <img src="https://img.icons8.com/fluency/18/000000/hand-drawn-star.png" alt="star" />
                <img src="https://img.icons8.com/fluency/18/000000/hand-drawn-star.png" alt="star" />
                <img src="https://img.icons8.com/fluency/18/000000/hand-drawn-star.png" alt="star" />
                <img src="https://img.icons8.com/fluency/18/000000/hand-drawn-star.png" alt="star" />
              </div>
            </div>
            <div className="flex justify-between mt-4" role="list">
              <a
                className=""
                href="https://play.google.com/store/apps/details?id=app.babychakra.babychakra&c=web&pid=homepage&"
                role="listitem"
                aria-label="google play"
              >
                <img className="h-10" src="https://files.babychakra.com/site-images/original/play-store.png" alt="playStore" />
              </a>
              <a
                href="https://apps.apple.com/in/app/babychakra-pregnancy-baby-app/id1299615848?c=web&pid=home&"
                role="listitem"
                aria-label="play store"
              >
                <img
                  className="h-10"
                  src="https://files.babychakra.com/site-images/original/apple-store.png"
                  alt="appleStore"
                />
              </a>
            </div>
            <div className="py-4">
              <a href="/login">
                <button
                  type="button"
                  // change button bgcolor #f888b0 to #AE0943 for sufficient color contrast
                  style={{ backgroundColor: "#AE0943" }}
                  className="py-2 font-semibold text-base rounded text-white w-full"
                >
                  SIGN UP NOW
                </button>
              </a>
            </div>
          </div>
        </div>
        <div className="JOIN US my-5 px-6 py-3 border border-dashed rounded-lg" role="list">
          <p className="text-white text-center text-base mb-3" role="listitem">
            JOIN US
          </p>
          <a
            href="https://www.instagram.com/mybabychakra/"
            role="listitem"
            className="text-white font-bold flex justify-around items-center h-12 rounded-lg bg-gradient-to-r from-yellow-300 via-red-500 to-pink-500 mb-3"
            aria-label="instagram"
          >
            <img src="https://img.icons8.com/material-outlined/44/ffffff/instagram-new--v1.png" alt="insta" />
            <p className="text-lg">
              JOIN 55.6<span className="text-sm">K</span>
            </p>
            <span>
              <p>Parents on</p>
              <p> Instagram</p>
            </span>
          </a>
          <a
            href="https://www.facebook.com/babychakra"
            role="listitem"
            className="text-white font-bold flex justify-around items-center h-12 rounded-lg mb-5 bg-blue-800"
            aria-label="facebook"
          >
            <img src="https://img.icons8.com/material-outlined/44/ffffff/facebook.png" alt="facebook" />
            <p className="text-lg">
              JOIN 680<span className="text-sm">K</span>
            </p>
            <span>
              <p>Parents on</p>
              <p>Facebook</p>
            </span>
          </a>
        </div>
      </div>
      <div style={{ backgroundColor: "#373737" }} className="GREY_THEME">
        {footer?.map((items: any, index: number) => (
          <>
            <div className="flex justify-between py-5" role="list" key={index}>
              {items?.map((childItem: any) => (
                <div className="w-1/2 px-7" role="listitem" key={childItem.id}>
                  <div className="mb-11 font-medium text-white ANIMATE">{childItem.label}</div>
                  <div style={{ color: "#bdbdbd" }} className="text-xs" role="list">
                    {childItem.child.map((subChild: any) => (
                      <Link href={subChild.url} key={subChild.id} role="listitem" aria-label={subChild.label}>
                        <p className="ANIMATE mb-2">{subChild.label}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={styleShadow} />
          </>
        ))}

        <div style={styleShadow} />
        <div className="py-5 px-7">
          <p className="mb-11 font-medium text-white ANIMATE">CONTACT US</p>
          <p className="font-medium text-white mb-4 ANIMATE">© Sanghvi Technologies Pvt. Ltd</p>
          <p style={{ color: "#bdbdbd" }} className="mb-4 ANIMATE">
            Sanghvi House, 105/2, Shivajinagar, Pune- 411 005 CIN NO - U72200MH2014PTC253152
          </p>
          <p className="font-medium text-white mb-3 ANIMATE">CONNECT WITH US</p>
          <a href="tel:022-48914748" className="flex ANIMATE" aria-label="phone">
            <img src="https://img.icons8.com/fluency-systems-filled/20/ffffff/phone-disconnected.png" alt="phone" />
            <p className="text-white pl-2">022-48914748</p>
          </a>
          <a href="mailto:hello@babychakra.com" className="flex mb-5 ANIMATE" aria-label="email">
            <img src="https://img.icons8.com/ios-glyphs/20/ffffff/new-post.png" alt="newPost" />
            <p className="text-white pl-2">hello@babychakra.com</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default BBCFooter;
