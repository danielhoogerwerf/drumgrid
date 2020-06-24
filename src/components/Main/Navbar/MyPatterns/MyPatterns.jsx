import React, { useState, useContext, useEffect } from "react";
import "./MyPatterns.css";
import UserService from "../../../../services/user-service";
import { AuthContext } from "../../../../contexts/auth-context";
import { GridContext } from "../../../../contexts/grid-context";
import LoginBox from "../../Grid/LoginBox/LoginBox";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAudio,
  faExclamationTriangle,
  faUpload,
  faTrashAlt,
  faTimes,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

export default function MyPatterns() {
  const context = useContext(AuthContext);
  const gridContext = useContext(GridContext);
  const [showPatterns, setShowPatterns] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [currentPatterns, setCurrentPatterns] = useState();
  const service = new UserService();

  useEffect(() => {
    const service = new UserService();
    if (context.appUser) {
      service.getPatterns().then((result) => {
        setCurrentPatterns(result);
      });
    }
  }, [context.appUser]);

  const showPatternFrame = () => {
    gridContext.openSingleWindow("patterns");
    if (gridContext.windowOpen !== "patterns") {
      setShowPatterns(true);
    } else {
      setShowPatterns(!showPatterns);
    }

    if (context.appUser) {
      getPatternsFromApi();
    }
  };

  const performLogin = (username, password) => {
    showPatternFrame();
    context.makeLogin(username, password);
  };

  const getPatternsFromApi = () => {
    service.getPatterns().then((result) => {
      if (context.appUser) {
        setCurrentPatterns(result);
      }
    });
  };

  const loadPattern = (patternId) => {
    gridContext.updateGrid(patternId);
  };

  const delPatternConfirmation = (patternId) => {
    setConfirmDelete(patternId);
  };

  const delPattern = (patternId) => {
    service.deletePattern(patternId).then(() => {
      getPatternsFromApi();
      setConfirmDelete(false);
    });
  };

  return (
    <>
      <span className="navbar-mypatterns-text">
        {showPatterns && gridContext.windowOpen === "patterns" ? (
          <span className="navbar-mypatterns-text-selected">
            <button onClick={() => showPatternFrame()}>my patterns</button>
          </span>
        ) : (
          <button onClick={() => showPatternFrame()}>my patterns</button>
        )}
        {showPatterns && gridContext.windowOpen === "patterns" && (
          <div className="navbar-mypatterns-showcontentbox">
            <div className="navbar-mypatterns-showcontentbox-content-inside">
              {!context.appUser ? (
                <>
                  <span onClick={() => showPatternFrame()} className="floating-save-box-close">
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                  <LoginBox close={performLogin} />
                </>
              ) : (
                <>
                  <div className="navbar-mypatterns-showcontentbox-content-inside-close">
                    <button onClick={() => showPatternFrame()}>
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                  {currentPatterns ? (
                    confirmDelete ? (
                      <div className="navbar-mypatterns-showcontentbox-content-inside-overwrite">
                        <p className="navbar-mypatterns-showcontentbox-content-inside-overwrite-icon">
                          <FontAwesomeIcon icon={faExclamationTriangle} />
                        </p>
                        <p className="navbar-mypatterns-showcontentbox-content-inside-overwrite-text">
                          Are you sure you want to delete your pattern?
                        </p>
                        <span className="navbar-mypatterns-showcontentbox-content-inside-overwrite-btnyes">
                          <button onClick={() => delPattern(confirmDelete)}>
                            <FontAwesomeIcon icon={faCheck} />
                          </button>
                        </span>
                        <span className="navbar-mypatterns-showcontentbox-content-inside-overwrite-btnno">
                          <button onClick={() => setConfirmDelete(false)}>
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </span>
                      </div>
                    ) : currentPatterns.length === 0 ? (
                      <div className="navbar-mypatterns-showcontentbox-content-inside-empty">
                        You haven't saved any patterns yet.
                        <span className="navbar-mypatterns-showcontentbox-content-inside-empty-br"></span>
                        <span className="navbar-mypatterns-showcontentbox-content-inside-empty-br"></span>
                        <strong>Go make some music!</strong>
                      </div>
                    ) : (
                      <div className="navbar-mypatterns-showcontentbox-content-inside-patternbox">
                        <div className="navbar-mypatterns-showcontentbox-content-inside-patternbox-text">
                          your stored patterns
                        </div>
                        {currentPatterns.map((elem, key) => {
                          return (
                            <div key={key} className="navbar-mypatterns-showcontentbox-content-inside-patterns">
                              <span>
                                <FontAwesomeIcon icon={faFileAudio} />
                              </span>
                              <p>{elem.name.length > 29 ? `${elem.name.slice(0, 29)}...` : elem.name}</p>
                              <div className="navbar-mypatterns-showcontentbox-content-inside-patterns-tbox">
                                <div className="navbar-mypatterns-showcontentbox-content-inside-tooltip">
                                  <button onClick={() => loadPattern(elem.id)}>
                                    <FontAwesomeIcon icon={faUpload} />
                                  </button>
                                  <span className="tooltiptext">Load pattern</span>
                                </div>
                                <div className="navbar-mypatterns-showcontentbox-content-inside-tooltip">
                                  <button onClick={() => delPatternConfirmation(elem.id)}>
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                  </button>
                                  <span className="tooltiptext">Delete pattern</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )
                  ) : (
                    <div>Loading patterns..</div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </span>
    </>
  );
}
