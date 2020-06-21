import React, { Component } from "react";
import "./Main.css";
import Navbar from "./Navbar/Navbar";
import Grid from "./Grid/Grid";
import { AuthContext } from "../../contexts/auth-context";

export default class Main extends Component {
  static contextType = AuthContext;

  componentDidMount() {
    this.context.checkLogin();
  }

  render() {
    return (
      <>
        <div className="main-container noselect">
          <div className="main-box">
            <header>
              <Navbar />
            </header>
            <section className="main-section">
              <Grid />
            </section>
          </div>
        </div>
        <div className="main-footer" />
      </>
    );
  }
}
