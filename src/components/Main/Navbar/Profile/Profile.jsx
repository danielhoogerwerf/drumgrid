import React, { useState, useContext, useEffect } from "react";
import "./Profile.css";
import { AuthContext } from "../../../../contexts/auth-context";
import UserService from "../../../../services/user-service";

import LoginBox from "../../Grid/LoginBox/LoginBox";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Profile() {
  const [showProfile, setShowProfile] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [wrongEmail, setWrongEmail] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);
  const context = useContext(AuthContext);
  const service = new UserService();

  useEffect(() => {
    if (!context.appUser) {
      context.checkLogin();
    } else {
      setEmail(context.appUser.email);
    }
  }, [context.appUser, context]);

  const showProfileFrame = () => {
    setShowProfile(!showProfile);
  };

  const signOut = () => {
    context.logout();
  };

  const performLogin = (username, password) => {
    showProfileFrame();
    context.makeLogin(username, password);
  };

  const handleProfileUpdateSubmit = (event) => {
    event.preventDefault();
    let errorDetected = false;
    console.log("submit profile update");

    if (!email) {
      console.log("e1");
      setWrongEmail("This field cannot be empty");
      errorDetected = true;
    }

    if (editPassword && !password) {
      console.log("e2");
      setEditPassword(false);
      errorDetected = true;
    }

    if (!errorDetected) {
      console.log("go go go !");
      service.updateProfile(email, password).then((msg) => {
        if (msg.message === "Email address already exists") {
          setWrongEmail("Email address already exists");
        } else {
          service.updateProfile(email, password).then((msg) => {
            setEditEmail(false);
            setEditPassword(false);
            setWrongEmail(false);
            setWrongPassword(false);
            setPassword("");
          });
        }
      });
    }
  };

  return (
    <span className="navbar-profile-text">
      {!context.appUser && <button onClick={() => showProfileFrame()}>login</button>}
      {context.appUser && <button onClick={() => showProfileFrame()}>profile</button>}
      {showProfile && (
        <div className="navbar-profile-showcontentbox">
          <div className="navbar-profile-showcontentbox-content-inside">
            {!context.appUser ? (
              <>
                <span onClick={() => showProfileFrame()} className="floating-save-box-close">
                  <FontAwesomeIcon icon={faTimes} />
                </span>
                <LoginBox close={performLogin} />
              </>
            ) : (
              <div className="navbar-profile-showcontentbox-content-inside-loggedin">
                <div className="navbar-profile-showcontentbox-content-inside-pads">
                  <div className="navbar-profile-showcontentbox-content-inside-close">
                    <button onClick={() => showProfileFrame()}>
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                  <form onSubmit={handleProfileUpdateSubmit}>
                    <div className="navbar-profile-showcontentbox-content-inside-fat">
                      <p>EMAIL</p>
                      <span className="navbar-profile-showcontentbox-content-inside-normal">
                        {!editEmail ? (
                          email
                        ) : (
                          <>
                            {wrongEmail && (
                              <div className="navbar-profile-showcontentbox-content-inside-erroremail">
                                {wrongEmail}
                              </div>
                            )}
                            <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                          </>
                        )}
                      </span>
                      <span className="navbar-profile-showcontentbox-content-inside-button">
                        {!editEmail ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setEditEmail(true);
                            }}
                          >
                            EDIT
                          </button>
                        ) : (
                          <button type="submit">UPDATE</button>
                        )}
                      </span>
                    </div>
                    <div className="navbar-profile-showcontentbox-content-inside-fat">
                      <p>PASSWORD</p>
                      <span className="navbar-profile-showcontentbox-content-inside-normal">
                        {!editPassword ? (
                          "●●●●●●●●●●"
                        ) : (
                          <>
                            {wrongPassword && (
                              <div className="navbar-profile-showcontentbox-content-inside-erroremail">
                                {wrongPassword}
                              </div>
                            )}
                            <input
                              type="password"
                              name="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </>
                        )}
                      </span>
                      <span className="navbar-profile-showcontentbox-content-inside-button">
                        {!editPassword ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setEditPassword(true);
                            }}
                          >
                            EDIT
                          </button>
                        ) : (
                          <button>UPDATE</button>
                        )}
                      </span>
                    </div>
                    <div className="navbar-profile-showcontentbox-content-inside-username">
                      Current username: <strong>{context.appUser.username}</strong>
                    </div>
                  </form>
                  <button onClick={() => signOut()}>
                    <span className="navbar-profile-showcontentbox-content-inside-pads-btnspan">Logout</span>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </span>
  );
}
