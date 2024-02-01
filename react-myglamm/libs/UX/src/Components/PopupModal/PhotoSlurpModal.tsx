import React, { RefObject, useEffect, useRef, useState } from "react";
import Link from "next/link";

import ReactDOM from "react-dom";
import { useInView } from "react-intersection-observer";
// @ts-ignore
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { useRouter } from "next/router";
import CustomVideoControls from "@libComponents/PopupModal/CustomVideoControls";

import useTranslation from "@libHooks/useTranslation";

import Adobe from "@libUtils/analytics/adobe";

import { ADOBE } from "@libConstants/Analytics.constant";

import PlayIcon from "../../../public/svg/playIcon.svg";
import PauseIcon from "../../../public/svg/pauseIcon.svg";

interface slurpProps {
  show: boolean;
  photoSlurpData: any;
  activeSlurpIndex: number;
  hide: () => void;
  getPhotoSlurp?: () => void;
  autoPlay?: boolean;
}

const PhotoSlurpModal = ({ show, photoSlurpData, activeSlurpIndex, hide, getPhotoSlurp, autoPlay = false }: slurpProps) => {
  const { t } = useTranslation();

  const { ref, inView } = useInView({ threshold: 0 });
  const slurpContainerRef: RefObject<HTMLDivElement> = useRef(null);
  const videoRef = useRef<any>([]);
  const router = useRouter();
  const [readMore, setReadMore] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>();
  const [pauseVideo, setPauseVideo] = useState<boolean | undefined>();
  const [currentTime, setCurrentTime] = useState("0.00");
  const [remainingTime, setRemainingTime] = useState("0.00");
  const [progress, setProgress] = useState(0);
  const [photoSlurpIds, setPhotoSlurpIds] = useState<any>(
    JSON.parse((process.browser && localStorage.getItem("photoSlurpIds")) || "{}")
  );

  useEffect(() => {
    /**
     * Scrolling to the Slide of the Photoslurp on load as while render it laods the first and the
     * first one is not the actual slurp user have selected
     */
    if (show && slurpContainerRef.current && activeSlurpIndex) {
      slurpContainerRef.current.scrollTop = window.innerHeight * activeSlurpIndex;
    }

    return () => {
      setReadMore(false);
      setPlayVideo(false);

      // fix: react-spring-modal sets this to restrict focus to the modal
      // but the way we close the modal, the library doesn't get enough time to clear this
      const root = document.getElementById("__next");
      root?.removeAttribute("inert");
    };
  }, [show]);

  /* Load More PhotoSlurps Once the Second Last Slrup or the Last is in User's Viewport */
  useEffect(() => {
    if (inView) {
      getPhotoSlurp?.();
    }
  }, [inView]);

  useEffect(() => {
    if (photoSlurpIds) {
      localStorage.setItem("photoSlurpIds", JSON.stringify(photoSlurpIds));
    }
  }, [photoSlurpIds]);

  useEffect(() => {
    setVideoUrl(photoSlurpData[activeSlurpIndex].videos?.standard?.url);
    playVideoAutomatically();
  }, []);

  /* Added #modal so when user press back modal should close not page  */
  useEffect(() => {
    if (show) {
      setTimeout(() => {
        router.push("#modal", undefined, { shallow: true });
      }, 500);

      router.beforePopState(() => {
        hide();
        return false;
      });

      // Adobe Event
      (window as any).digitalData = {
        common: {
          assetType: "photoslurp",
          newAssetType: "photoslurp",
          newPageName: "Photoslurp Details Page",
          pageLocation: "",
          pageName: `web|photoslurp|photoslurp detail page|${photoSlurpData[activeSlurpIndex]?.id}`,
          platform: ADOBE.PLATFORM,
          subSection: photoSlurpData[activeSlurpIndex]?.id?.toString(),
          technology: ADOBE.TECHNOLOGY,
        },
        user: Adobe.getUserDetails(),
      };
      Adobe.PageLoad();
      //Event End
    } else {
      router.beforePopState(() => {
        return true;
      });
    }

    return () => {
      router.beforePopState(() => {
        return true;
      });
    };
  }, [show]);

  const formatTime = (seconds: any) => {
    let minutes: any = Math.floor(seconds / 60);
    let secs: any = Math.floor(seconds % 60);

    // if (minutes < 10) {
    //   minutes = "0" + minutes;
    // }rem

    if (secs < 10) {
      secs = "0" + secs;
    }

    return minutes + ":" + secs;
  };

  const handleOnTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = formatTime(videoRef.current.currentTime);
      const duration = formatTime(videoRef.current.duration);

      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
      setCurrentTime(currentTime);
      setRemainingTime(duration);

      if (videoRef.current.ended) {
        setPauseVideo(true);
      }
    }
  };

  const handlePlay = () => {
    if (videoRef?.current) {
      if (videoRef.current.paused === true || videoRef.current.ended) {
        // Play the video
        videoRef.current.play?.();

        setPauseVideo(false);
      } else {
        // Pause the video
        videoRef.current.pause();
        setPauseVideo(true);
      }
    }

    setTimeout(() => setPauseVideo(undefined), 1000);
  };

  const getIndex = (value: any) => {
    if (!photoSlurpIds[value]) {
      setPhotoSlurpIds({
        ...photoSlurpIds,
        [value]: true,
      });
    } else {
      const copyOfObject = { ...photoSlurpIds };
      delete copyOfObject[value];

      setPhotoSlurpIds({
        ...copyOfObject,
      });
    }
  };

  const playVideoAutomatically = () => {
    if (!/iPad|iPhone|iPod/.test(navigator.userAgent)) setTimeout(() => videoRef.current.play(), 0);
  };

  const getActivePhotoSlurp = () => {
    const CONTAINER = slurpContainerRef.current as HTMLElement;
    const options = {
      root: CONTAINER,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const ele: any = entry.target;
          setPauseVideo(undefined);
          setVideoUrl(ele?.dataset?.url);
          playVideoAutomatically();
          observer.disconnect(); // Stop observing once the first element is in view
        }
      });
    }, options);

    CONTAINER.childNodes.forEach((ele: any) => {
      observer.observe(ele);
    });
  };

  if (show) {
    return ReactDOM.createPortal(
      <div className="fixed z-[60] inset-0">
        <style jsx>
          {`
            .video-container:hover > .play-button {
              visibility: visible;
              opacity: 1;
            }
          `}
        </style>
        <section
          ref={slurpContainerRef}
          onScroll={getActivePhotoSlurp}
          onTouchMove={getActivePhotoSlurp}
          style={{ scrollSnapType: "y mandatory" }}
          className="bg-black overflow-y-auto overflow-x-hidden relative h-screen w-screen"
        >
          {photoSlurpData.map((photoSlurp: any, index: number) => (
            <div
              key={photoSlurp.id}
              data-url={photoSlurp.videos?.standard?.url}
              className="w-screen flex-sliderChild relative h-screen"
              style={{
                scrollSnapAlign: "start",
                scrollSnapStop: "always",
                backgroundImage: "linear-gradient(180deg,transparent 77%, #00000040)",
              }}
              /* Hit on Second Last Slide or if the Starting Slide is Last */
              ref={index === photoSlurpData.length - 2 || activeSlurpIndex === photoSlurpData.length - 1 ? ref : null}
            >
              {/* Background Blurry Image */}
              <div
                className="bg-no-repeat bg-cover bg-center absolute h-screen w-screen top-0 filter blur-3xl"
                style={{
                  backgroundImage: `url(${photoSlurp.images?.medium?.url})`,
                }}
              />

              {/* Header - User Name and Close Button */}
              <div className="flex px-7 w-screen justify-between items-center absolute top-7 z-50">
                <img
                  alt="User"
                  className="h-10 w-10 rounded-full mr-2"
                  src="https://files.myglamm.com/site-images/original/ic-user.png"
                />
                <h3 className="font-semibold text-white text-left w-full">{photoSlurp.user?.username}</h3>
                <img
                  alt="Close"
                  onClick={() => {
                    hide();
                    setVideoUrl(null);
                    setPauseVideo(false);
                  }}
                  className="w-4"
                  role="presentation"
                  src="https://files.myglamm.com/site-images/original/whiteCloseCross.png"
                />
              </div>

              {/* PhotoSlurp Image */}
              <div
                className="w-full justify-center flex items-center relative h-full pt-6 pb-32 z-10"
                style={{
                  backgroundImage: "linear-gradient(180deg,transparent 70%, #00000090)",
                }}
              >
                {(() => {
                  if (photoSlurp.videos?.standard?.url && photoSlurp.videos?.standard?.url === videoUrl) {
                    return (
                      <div
                        onClick={handlePlay}
                        style={{ height: "calc(100vh - 17.875rem)" }}
                        className="w-full overflow-hidden flex items-center relative video-container"
                      >
                        <video
                          loop
                          height="100%"
                          ref={videoRef}
                          className="w-full relative"
                          onTimeUpdate={handleOnTimeUpdate}
                          poster={photoSlurp.images?.medium?.url}
                        >
                          <source src={photoSlurp.videos?.standard.url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>

                        {typeof pauseVideo === "boolean" &&
                          (pauseVideo ? (
                            <div className="playPause opacity-0 rounded-full flex justify-center items-center h-14 w-14 bg-black/25 z-10 inset-0 m-auto absolute">
                              <PauseIcon className="text-white" height={30} width={30} />
                            </div>
                          ) : (
                            <div className="playPause opacity-0 rounded-full flex justify-center items-center h-14 w-14 bg-black/25 z-10 inset-0 m-auto absolute">
                              <PlayIcon className="text-white" height={30} width={30} />
                            </div>
                          ))}
                      </div>
                    );
                  }

                  return (
                    <TransformWrapper centerOnInit={true} panning={{ disabled: true }}>
                      <TransformComponent>
                        <img
                          alt="Photoslurp IMG"
                          className="w-full object-cover"
                          src={photoSlurp.images?.medium?.url}
                          style={{ height: "calc(100vh - 17.875rem)" }}
                        />
                      </TransformComponent>
                    </TransformWrapper>
                  );
                })()}
              </div>

              {/* Photoslurp Image like/unlike */}
              <div
                className=" text-center absolute bottom-32  right-2.5 z-10"
                onClick={() => {
                  getIndex(photoSlurp.id);
                }}
              >
                <span
                  className="rounded-full  p-2 filter inline-block"
                  style={{
                    background: "rgba(0,0,0,0.3)",
                  }}
                >
                  {photoSlurpIds[photoSlurp.id] ? (
                    <img src="https://files.myglamm.com/site-images/original/filled-heart.png" className="w-5" />
                  ) : (
                    <img src="https://files.myglamm.com/site-images/original/white-heart.png" className="w-5" />
                  )}
                </span>
                <span className="text-xs text-white font-bold leading-none text-center float-left w-full ">
                  {photoSlurpIds[photoSlurp.id]
                    ? photoSlurp.counts?.likes + 1
                    : photoSlurp.counts?.likes
                    ? photoSlurp.counts?.likes
                    : 0}
                </span>
              </div>

              {photoSlurp.videos?.standard?.url && photoSlurp.videos?.standard?.url === videoUrl && playVideo && (
                <CustomVideoControls
                  videoRef={videoRef}
                  progress={progress}
                  setPauseVideo={setPauseVideo}
                  pauseVideo={pauseVideo}
                  currentTime={currentTime}
                  remainingTime={remainingTime}
                  setProgress={setProgress}
                />
              )}

              {/* Black Overlay For Read More */}
              {readMore && (
                <div
                  role="presentation"
                  onClick={() => setReadMore(false)}
                  className="bg-black bg-opacity-50 absolute inset-0 h-screen w-full z-20"
                />
              )}

              <div className="px-7 absolute bottom-4 w-screen z-50">
                {/* Product Listing */}
                <div className="flex relative items-center my-2.5">
                  <span className="font-semibold text-white text-11 h-12 mr-3 py-2 text-center">
                    Tagged
                    <br />
                    Products
                  </span>
                  <div className="flex overflow-y-hidden overflow-x-auto w-full">
                    {photoSlurp.products.map((product: any) => (
                      <Link href={new URL(product.url).pathname} key={product.id} legacyBehavior>
                        <a onClick={hide} role="presentation" className="flex-sliderChild" aria-label={product.title}>
                          <img src={product.image} alt={product.title} className="rounded-lg w-14 h-14 mr-2" />
                        </a>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* USER DETAIL */}
                <p className="relative text-white font-semibold text-xs overflow-hidden">
                  {photoSlurp.title?.length > 150 && !readMore ? (
                    <>
                      {photoSlurp.title.substring(0, 100)}
                      <button
                        type="button"
                        onClick={() => setReadMore(true)}
                        className="text-color1 px-1 text-13 font-semibold"
                      >
                        {t("readMore")}
                      </button>
                    </>
                  ) : (
                    photoSlurp.title
                  )}
                </p>
              </div>
            </div>
          ))}
        </section>

        <style jsx global>
          {`
            .playPause {
              animation: fadeInOut 1s ease-in-out;
            }

            @keyframes fadeInOut {
              0% {
                transform: scale(0);
                opacity: 1;
              }
              25% {
                transform: scale(1);
                opacity: 1;
              }
              66% {
                opacity: 1;
              }
              100% {
                opacity: 0;
              }
            }
          `}
        </style>
      </div>,
      document.getElementById("modal-root") as HTMLElement
    );
  }
  return null;
};

export default PhotoSlurpModal;
