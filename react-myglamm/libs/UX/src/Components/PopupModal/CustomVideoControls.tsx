import { VideoSeekSliderCss } from "@libStyles/TSStyles/videSeekSlider";
import React, { RefObject, useEffect, useRef, useState } from "react";
import { VideoSeekSlider } from "react-video-seek-slider";
// import "react-video-seek-slider/styles.css";

function CustomVideoControls({ videoRef, setProgress, progress, setPauseVideo, pauseVideo, currentTime, remainingTime }: any) {
  const seekBarRef = useRef(null);
  const progressRef = useRef(null);
  const [mute, setMute] = useState(false);

  const handlePlay = () => {
    if (videoRef?.current) {
      if (videoRef.current.paused === true || videoRef.current.ended) {
        // Play the video
        videoRef.current.play();
        setPauseVideo(false);
      } else {
        // Pause the video
        videoRef.current.pause();
        setPauseVideo(true);
      }
    }
  };

  const muteButton = () => {
    // Event listener for the mute button
    if (videoRef?.current) {
      if (videoRef.current.muted == false) {
        // Mute the video
        videoRef.current.muted = true;
        setMute(true);
      } else {
        // Unmute the video
        videoRef.current.muted = false;
        setMute(false);
      }
    }
  };

  const seekBar = (e: any) => {
    // Event listener for the seek bar
    if (videoRef.current) {
      // Calculate the new time
      const manualChange = Number(e);
      setProgress(manualChange);
      videoRef.current.currentTime = (videoRef.current.duration / 100) * manualChange;
    }
  };

  return (
    <div className="items-center flex justify-center p-2 h-8 absolute bottom-36 w-5/6 z-10">
      <div className="text-white text-xs pl-2">
        <span className="mr-1">{currentTime}</span>/<span className=""> {remainingTime}</span>
      </div>

      {VideoSeekSliderCss}

      <div className="rh5v-Seek_component rh5v-DefaultPlayer_seek flex-grow relative mx-2 z-50">
        <VideoSeekSlider
          max={100}
          currentTime={progress}
          onChange={seekBar}
          offset={0}
          hideHoverTime={true}
          limitTimeTooltipBySides={true}
        />
      </div>

      <div className="relative">
        <button aria-label="Mute video" className="rh5v-Volume_button w-8 h-8" type="button" onClick={muteButton}>
          {mute ? (
            <img className="w-5" src="https://files.myglamm.com/site-images/original/mute.png" alt="Mute" />
          ) : (
            <img className="w-5" src="https://files.myglamm.com/site-images/original/unmute.png" alt="Unmute" />
          )}
        </button>
      </div>
    </div>
  );
}

export default CustomVideoControls;
