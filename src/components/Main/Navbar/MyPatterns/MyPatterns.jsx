import React, { useState, useContext, useEffect } from "react";
import "./MyPatterns.css";
import UserService from "../../../../services/user-service";
import { AuthContext } from "../../../../contexts/auth-context";
import { GridContext } from "../../../../contexts/grid-context";
import LoginBox from "../../Grid/LoginBox/LoginBox";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAudio, faExclamationTriangle, faUpload, faTrashAlt, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function MyPatterns() {
  const context = useContext(AuthContext);
  const gridContext = useContext(GridContext);
  const [service] = useState(new UserService());
  const [showPatterns, setShowPatterns] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [currentPatterns, setCurrentPatterns] = useState();
  const userUpdated = context.appUser;

  useEffect(() => {
    if (context.appUser) {
      getPatternsFromApi();
    }
  }, [userUpdated, context.appUser, getPatternsFromApi]);

  const showPatternFrame = () => {
    console.log("show pattern frame");
    setShowPatterns(!showPatterns);
    getPatternsFromApi();
  };

  const getPatternsFromApi = () => {
    service.getPatterns().then((result) => {
      if (context.appUser) {
        setCurrentPatterns(result);
      }
    });
  };

  const loadPattern = (patternId) => {
    console.log(`Load pattern with id: ${patternId}`);
    gridContext.updateGrid(patternId);
  };

  const delPatternConfirmation = (patternId) => {
    setConfirmDelete(patternId);
  };

  const delPattern = (patternId) => {
    console.log("deleting pattern");
    service.deletePattern(patternId).then(() => {
      getPatternsFromApi();
      setConfirmDelete(false);
    });
  };

  return (
    <>
      <span className="navbar-mypatterns-text">
        <button onClick={() => showPatternFrame()}>my patterns</button>
        {showPatterns && (
          <div className="navbar-mypatterns-showcontentbox">
            <div className="navbar-mypatterns-showcontentbox-content-inside">
              {!context.appUser ? (
                <>
              <span onClick={() => showPatternFrame()} className="floating-save-box-close">
                <FontAwesomeIcon icon={faTimes} />
              </span>
                <LoginBox />
                </>
              ) : (
                <span>
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
                          <button onClick={() => delPattern(confirmDelete)}>YES</button>
                        </span>
                        <span className="navbar-mypatterns-showcontentbox-content-inside-overwrite-btnno">
                          <button onClick={() => setConfirmDelete(false)}>NO</button>
                        </span>
                      </div>
                    ) : (
                      currentPatterns.map((elem, key) => {
                        return (
                          <div key={key} className="navbar-mypatterns-showcontentbox-content-inside-patterns">
                            <span>
                              <FontAwesomeIcon icon={faFileAudio} />
                            </span>
                            <p>{elem.name.length > 32 ? `${elem.name.slice(0, 32)}...` : elem.name}</p>
                            <button onClick={() => loadPattern(elem.id)}>
                              <FontAwesomeIcon icon={faUpload} />
                            </button>
                            <button onClick={() => delPatternConfirmation(elem.id)}>
                              <FontAwesomeIcon icon={faTrashAlt} />
                            </button>
                          </div>
                        );
                      })
                    )
                  ) : (
                    <div>Loading patterns..</div>
                  )}
                  {!confirmDelete && (
                    <span className="navbar-mypatterns-showcontentbox-content-inside-btnclose">
                      <button onClick={() => showPatternFrame()}>close</button>
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>
        )}
      </span>
    </>
  );
}
