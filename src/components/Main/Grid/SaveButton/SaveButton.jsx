import React, { useState, useContext } from "react";
import "./SaveButton.css";

// External imports
import UserService from "../../../../services/user-service";
import { AuthContext } from "../../../../contexts/auth-context";
import LoginBox from "../LoginBox/LoginBox";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheck, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

export default function SaveButton(props) {
  const [showFloatingBoxSave, setshowFloatingBoxSave] = useState(false);
  const [patternName, setPatternName] = useState("");
  const [saveSuccessful, setSaveSuccessful] = useState(false);
  const [tooManyPatterns, setTooManyPatterns] = useState(false);
  const [service] = useState(new UserService());
  const context = useContext(AuthContext);
  const [patternExists, setPatternExists] = useState(false);

  const saveButton = (e) => {
    e.preventDefault();
    setshowFloatingBoxSave(!showFloatingBoxSave);
  };

  const closeFloatingSaveBox = () => setshowFloatingBoxSave(false);

  const performLogin = (username, password) => {
    closeFloatingSaveBox();
    context.makeLogin(username, password);
  };

  const closeFloatingSaveBoxCompleted = () => {
    setshowFloatingBoxSave(false);
    setSaveSuccessful(false);
    setTooManyPatterns(false);
  };

  const checkDuplicate = () => {
    let cleanPatternName = patternName
      .replace(/^\s+/g, "")
      .replace(/[^A-Za-z0-9_\-!\s]+/g, "_")
      .toUpperCase();
    let result = false;
    let patternId;
    if (cleanPatternName) {
      service.getPatterns().then((patterns) => {
        if (patterns) {
          patterns.forEach((pattern) => {
            const compareName = pattern.name.toUpperCase();
            if (compareName === cleanPatternName) {
              result = true;
              patternId = pattern.id;
            }
          });
        }
        if (result) {
          setPatternExists(patternId);
        } else {
          sendData();
        }
      });
    }
  };

  const sendData = () => {
    let cleanPatternName = patternName.replace(/^\s+/g, "").replace(/[^A-Za-z0-9_\-!\s]+/g, "_");
    if (cleanPatternName) {
      const updateCurrentGridArray = props.gridData;
      updateCurrentGridArray[0].options.mainvol = props.volume;
      updateCurrentGridArray[0].options.tempo = props.tempo;
      updateCurrentGridArray[0].pattern = cleanPatternName;

      if (patternExists) {
        service.updatePattern(patternExists, cleanPatternName, updateCurrentGridArray).then((result) => {
          if (result.message === "OK") {
            setSaveSuccessful(true);
            setPatternExists(false);
          }
        });
      } else {
        service.savePattern(cleanPatternName, updateCurrentGridArray).then((result) => {
          if (result.message === "OK") {
            setSaveSuccessful(true);
            setPatternExists(false);
            props.updatename(cleanPatternName);
          }

          if (result.error === "too many patterns already stored") {
            setSaveSuccessful(true);
            setPatternExists(false);
            setTooManyPatterns(true);
          }
        });
      }
    }
  };

  return (
    <>
      {/* {console.log(context.appUser)} */}
      {!context.appUser ? (
        <div className="grid-block-transport grid-block-save">
          <button onClick={(e) => saveButton(e)}>SAVE</button>
          {showFloatingBoxSave && (
            <div className="floating-save-box floating-save-box-container">
              <span onClick={closeFloatingSaveBox} className="floating-save-box-close">
                <FontAwesomeIcon icon={faTimes} />
              </span>
              <LoginBox close={performLogin} />
            </div>
          )}
        </div>
      ) : (
        <div className="grid-block-transport grid-block-save">
          <button onClick={(e) => saveButton(e)}>SAVE</button>
          {showFloatingBoxSave && (
            <div className="floating-save-box floating-save-box-container">
              {!saveSuccessful && (
                <span onClick={closeFloatingSaveBox} className="floating-save-box-close">
                  <FontAwesomeIcon icon={faTimes} />
                </span>
              )}
              {!saveSuccessful ? (
                <div className="floating-save-box-container-fields">
                  {patternExists ? (
                    <div className="floating-save-box-container-fields-exists">
                      <p className="floating-save-box-container-fields-error">
                        <FontAwesomeIcon icon={faExclamationTriangle} />
                      </p>
                      <p>Pattern already exists!</p>
                      <p>Overwrite?</p>
                      <span className="floating-save-box-container-fields-btnyes">
                        <button onClick={sendData}>YES</button>
                      </span>
                      <span className="floating-save-box-container-fields-btnno">
                        <button onClick={() => setPatternExists(false)}>NO</button>
                      </span>
                    </div>
                  ) : (
                    <div>
                      <p>
                        Enter a name for the pattern you
                        <br />
                        want to save:
                      </p>
                      <p>
                        <input
                          type="text"
                          value={patternName}
                          onChange={(e) => setPatternName(e.target.value)}
                          name="patternname"
                          placeholder="Please provide a name"
                        />
                      </p>
                      <button onClick={checkDuplicate}>STORE</button>
                    </div>
                  )}
                </div>
              ) : tooManyPatterns ? (
                <div className="floating-save-box-container-patternerror">
                  <span className="floating-save-box-container-patternerror-icon">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                  </span>
                  <span>Too many patterns stored in your account!</span>
                  <p>A maximum of 5 patterns are allowed.</p>
                  <p>You will need to delete a pattern in order to save a new one.</p>
                  <button onClick={closeFloatingSaveBoxCompleted}>CLOSE</button>
                </div>
              ) : (
                <div className="floating-save-box-container-saved">
                  <span className="floating-save-box-container-saved-icon">
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span>Pattern saved successfully!</span>
                  <button onClick={closeFloatingSaveBoxCompleted}>CLOSE</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
