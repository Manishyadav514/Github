import React from "react";
import SocialIcon from "@libComponents/Common/SocialIcon";
import { SHOP } from "@libConstants/SHOP.constant";
import YoutubeIcon from "../../../public/svg/youtube-icon.svg";

const FooterSocialLinks = () => {
  return (
    <>
      <div className="flex justify-center pb-6 items-center mb-2" role="list">
        {SHOP.REGION !== "MIDDLE_EAST" && (
          <SocialIcon
            socialLink={SHOP.SOCIAL.FACEBOOK}
            label="Facebook Social Page"
            iconName="fb-ico"
            svgViewBox="-300 0 1000 1000"
            ariaLabel="facebook"
          />
        )}
        {SHOP.REGION !== "MIDDLE_EAST" && SHOP.SOCIAL.TWITTER && (
          <SocialIcon
            socialLink={SHOP.SOCIAL.TWITTER}
            label="Twitter Account Page"
            iconName="twitter-ico"
            ariaLabel="twitter"
          />
        )}
        <SocialIcon
          socialLink={SHOP.SOCIAL.INSTAGRAM}
          label="Instagram Account Page"
          iconName="instagram-ico"
          ariaLabel="instagram"
        />
        {SHOP.REGION !== "MIDDLE_EAST" && (
          <div className="w-1/4 h-12 py-5 px-3 flex justify-center" role="listitem">
            <a href={SHOP.SOCIAL.YOUTUBE} aria-label="youtube">
              <YoutubeIcon width="50" height="45" viewBox="0 3 31 31" role="img" aria-labelledby="youtube" title="youtube" />
            </a>
          </div>
        )}
      </div>
    </>
  );
};

export default FooterSocialLinks;
