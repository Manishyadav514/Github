import { makePopup } from "@typeform/embed";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

const TypeFormModal = ({ multimediaDetails, typeFormURL }: any) => {
  function handleRedirection() {
    makePopup(typeFormURL, {
      mode: "popup",
      hideScrollbars: true,
      hideHeaders: false,
      hideFooter: false,
      opacity: 1,
      buttonText: "Let's Go",
      autoOpen: false,
      autoClose: 180,
    }).open();
  }

  return (
    <div className="SingleBannerWidget mb-5 px-3" role="banner">
      <a onClick={handleRedirection} aria-label={multimediaDetails.assetDetails.name}>
        <ImageComponent
          className="rounded-md"
          style={{ height: "auto", width: "100%" }}
          alt={multimediaDetails.assetDetails.name}
          src={multimediaDetails.assetDetails.url}
        />
      </a>
    </div>
  );
};

export default TypeFormModal;
