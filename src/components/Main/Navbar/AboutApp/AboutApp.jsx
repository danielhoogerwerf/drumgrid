import React, { useState, useContext } from "react";
import "./AboutApp.css";
import { GridContext } from "../../../../contexts/grid-context";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFontAwesomeFlag } from "@fortawesome/free-brands-svg-icons";

export default function AboutApp() {
  const [showAbout, setShowAbout] = useState(false);
  const gridContext = useContext(GridContext);

  const showAboutFrame = () => {
    gridContext.openSingleWindow("about");
    if (gridContext.windowOpen !== "about") {
      setShowAbout(true);
    } else {
      setShowAbout(!showAbout);
    }
  };

  return (
    <span className="navbar-aboutapp-text">
      {showAbout && gridContext.windowOpen === "about" ? (
        <span className="navbar-aboutapp-text-selected">
          <button onClick={() => showAboutFrame()}>about app</button>
        </span>
      ) : (
        <button onClick={() => showAboutFrame()}>about app</button>
      )}
      {showAbout && gridContext.windowOpen === "about" && (
        <div className="navbar-aboutapp-showcontentbox">
          <div className="navbar-aboutapp-showcontentbox-shell scale-up-ver-top">
            <div className="navbar-aboutapp-showcontentbox-content fade-in-smalldelay">
              <div className="navbar-aboutapp-showcontentbox-content-flexlogos-box">
                <div className="navbar-aboutapp-showcontentbox-content-apptechnologies">
                  <p className="navbar-aboutapp-showcontentbox-content-fattext">This app is powered by</p>
                </div>
                <div className="navbar-aboutapp-showcontentbox-content-flexlogos">
                  <div className="navbar-aboutapp-showcontentbox-content-flexlogos-whiteborder">
                    <a href="https://tonejs.github.io/" rel="noopener noreferrer" target="_blank">
                      <img
                        src="/images/tonejs-logo-w.png"
                        className="navbar-aboutapp-showcontentbox-content-logo"
                        alt="Tone.js"
                      />
                    </a>
                  </div>
                  <div className="navbar-aboutapp-showcontentbox-content-flexlogos-whiteborder">
                    <a href="https://reactjs.org/" rel="noopener noreferrer" target="_blank">
                      <img
                        src="/images/react-logo-w.svg"
                        className="navbar-aboutapp-showcontentbox-content-logo"
                        alt="React.js"
                      />
                    </a>
                  </div>
                  <div className="navbar-aboutapp-showcontentbox-content-flexlogos-whiteborder">
                    <a href="https://nodejs.org/" rel="noopener noreferrer" target="_blank">
                      <img
                        src="/images/nodejs-logo-w.svg"
                        className="navbar-aboutapp-showcontentbox-content-logo"
                        alt="Node.js"
                      />
                    </a>
                  </div>
                </div>
                <div className="navbar-aboutapp-showcontentbox-content-flexlogos">
                  <div className="navbar-aboutapp-showcontentbox-content-flexlogos-whiteborder">
                    <a href="https://fontawesome.com/" rel="noopener noreferrer" target="_blank">
                      <span className="navbar-aboutapp-showcontentbox-content-flexlogos-fa">
                        <FontAwesomeIcon icon={faFontAwesomeFlag} />
                      </span>
                    </a>
                  </div>
                  <div className="navbar-aboutapp-showcontentbox-content-flexlogos-whiteborder">
                    <a href="https://www.mongodb.com" rel="noopener noreferrer" target="_blank">
                      <img
                        src="/images/mongodb-logo-w.svg"
                        className="navbar-aboutapp-showcontentbox-content-logo"
                        alt="MongoDB"
                      />
                    </a>
                  </div>
                  <div className="navbar-aboutapp-showcontentbox-content-flexlogos-whiteborder">
                    <a href="https://expressjs.com" rel="noopener noreferrer" target="_blank">
                      <img
                        src="/images/expressjs-logo-w.svg"
                        className="navbar-aboutapp-showcontentbox-content-logo"
                        alt="Express.js"
                      />
                    </a>
                  </div>
                </div>
              </div>
              <div className="navbar-aboutapp-showcontentbox-content-text">
                <span className="navbar-aboutapp-showcontentbox-content-br"></span>
                <p>This app is a graduation project for the web development bootcamp from IronHack.</p>
                <span className="navbar-aboutapp-showcontentbox-content-br"></span>
                <p className="navbar-aboutapp-showcontentbox-content-textborder">MANUAL</p>
                <span className="navbar-aboutapp-showcontentbox-content-br"></span>
                <p>
                  Click on the sound names to hear an example of the sound you want to program. Then just click on a
                  square within the lane of the sound you want, and it will program the sound to play at that spot. Just
                  click on the yellow square again to remove the sound to play at that time.
                </p>
                <span className="navbar-aboutapp-showcontentbox-content-br"></span>
                <p>
                  If you want to save your pattern, click on the SAVE button. You will need to login (or create an
                  account) to save your pattern. The app will allow you to do that from there as well. You can store up
                  to 5 patterns in your account.
                </p>
                <span className="navbar-aboutapp-showcontentbox-content-br"></span>
                <p>
                  You can manage your saved patterns through MY PATTERNS, where you can load your saved pattern or
                  delete one. You can manage your profile via PROFILE where you can modify your email address or change
                  your password.
                </p>
                <span className="navbar-aboutapp-showcontentbox-content-br"></span>
                <p>
                  {/* If you use bluetooth speakers or headphones, the sound seems to play later than what you see in the
                  app.
                  <span className="navbar-aboutapp-showcontentbox-content-br"></span>
                  This is because your operating system is compensating for the time the sound takes to travel to your
                  bluetooth device, but your browser doesn't know this delay. Therefore the visual elements work with
                  the 'un-delayed' timing, but the sound plays later. Nothing to worry about. */}
                </p>
                <span className="navbar-aboutapp-showcontentbox-content-br"></span>
                <p className="navbar-aboutapp-showcontentbox-content-textborder">THANKS</p>
                <span className="navbar-aboutapp-showcontentbox-content-br"></span>
                <p>
                  I would like to thank everyone who was involved in making this app. This includes the fantastic
                  teachers of the bootcamp (thanks Jorg, Lloyd & Rana!), my classmates who are all amazing coders, my
                  friends who helped me break this app enough times for it to work, and my wife Nadia who helped so much
                  with everything, who is the most beautiful woman I've ever met, and who had to endure me and my
                  code-speak during these past couple of months{" "}
                  <span role="img" aria-label="eyes closed">
                    🙈
                  </span>{" "}
                  <span role="img" aria-label="heart">
                    ❤️
                  </span>
                </p>
                <p className="navbar-aboutapp-showcontentbox-content-fattext">
                  <button onClick={() => showAboutFrame()}>CLOSE OVERLAY</button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </span>
  );
}
