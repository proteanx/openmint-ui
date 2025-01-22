import React from 'react';
import xLogo from "../assets/logo.svg";
import githubLogo from "../assets/github.svg";
import farcasterLogo from "../assets/farcaster.svg";

const Footer = ({ X_USER, X_LINK, GITHUB_LINK, FARCASTER_LINK }) => {
  return (
    <div className="footer">
      <img alt="X Logo" className="x-logo" src={xLogo} />
      <a
        className="footer-text"
        href={X_LINK}
        target="_blank"
        rel="noreferrer"
      >{`@${X_USER}`}</a>

      <img alt="GitHub Logo" className="x-logo" src={githubLogo} />
      <a
        className="footer-text"
        href={GITHUB_LINK}
        target="_blank"
        rel="noreferrer"
      >{`@${X_USER}`}</a>

      <img alt="Farcaster Logo" className="x-logo" src={farcasterLogo} />
      <a
        className="footer-text"
        href={FARCASTER_LINK}
        target="_blank"
        rel="noreferrer"
      >{`@proteanx.eth`}</a>
    </div>
  );
};

export default Footer; 