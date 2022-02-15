import React, { Component } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Main from "./components/Main/Main";

export default class App extends Component {
  render() {
    return (
      <>
        <div className="App">
          <Routes>
            <Route exact path="/" element={<Main />} />
          </Routes>
        </div>
      </>
    );
  }
}
