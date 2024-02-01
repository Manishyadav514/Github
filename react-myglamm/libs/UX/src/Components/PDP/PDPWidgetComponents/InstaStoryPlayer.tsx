import { useEffect, useRef } from "react";

const InstaStoryPlayer = ({ sources, onVideoClick }: { sources: any[]; onVideoClick: any }) => {
  const currentSourceIndex = useRef(0);

  useEffect(() => {
    const playingVideoElement = document.getElementById(`video-player-${0}`) as HTMLVideoElement;
    playingVideoElement.style.display = "block";
    playingVideoElement.currentTime = 0;
    playingVideoElement.play();

    const interval = setInterval(() => {
      const currentSourceIndexVar = (currentSourceIndex.current + 1) % sources?.length;
      const playingVideoElement = document.getElementById(`video-player-${currentSourceIndexVar}`) as HTMLVideoElement;
      playingVideoElement.style.display = "block";
      playingVideoElement.currentTime = 0;
      playingVideoElement.play();
      (document.getElementById(`video-player-${currentSourceIndex.current}`) as HTMLVideoElement).style.display = "none";
      //  (document.getElementById(`video-player-${currentSourceIndex.current}`) as HTMLVideoElement).pause()
      currentSourceIndex.current = currentSourceIndexVar;
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ul
      className="flex list-none overflow-x-auto gap-2 pr-3"
      dir="ltr"
      style={{
        scrollSnapType: "x mandatory",
      }}
    >
      {sources.map((source: any, index: any) => {
        return (
          <li
            key={source + index}
            className="rounded-full border-2 border-color1"
            style={{ width: "84px", height: "84px" }}
            onClick={e => {
              e.preventDefault();
              onVideoClick(index);
            }}
          >
            <div className="w-20 h-20 rounded-full border-2 border-white flex justify-center items-center overflow-hidden">
              <div
                style={{ backgroundImage: `url(${source?.images?.small?.url})` }}
                className="bg-center bg-cover bg-no-repeat w-full h-full flex justify-center items-center"
              >
                <video
                  muted
                  src={source?.videos?.standard?.url}
                  id={`video-player-${index}`}
                  preload="metadata"
                  className={`ease-in-out transition-all duration-300 hidden`}
                  playsInline
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default InstaStoryPlayer;
