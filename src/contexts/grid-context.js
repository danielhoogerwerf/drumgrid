import React, { useState, createContext } from "react";
import UserService from "../services/user-service";

// Import default grid data
import { gridInitData } from "../components/Main/Grid/GridInitData/GridInitData";

export const GridContext = createContext();

export const GridContextProvider = (props) => {
  const parseGridInitData = JSON.parse(JSON.stringify(gridInitData));
  const [gridData, setGridData] = useState(parseGridInitData);
  const [provideGridLoading, setProvideGridLoading] = useState(false);
  const [windowOpen, setWindowOpen] = useState();
  const service = new UserService();

  const updateGrid = async (patternId) => {
    await service
      .loadPattern(patternId)
      .then((response) => {
        setGridData(response.data);
        setProvideGridLoading(true);
      })
      .catch((error) => console.log(error));
  };

  const loadingFinished = () => {
    setProvideGridLoading(false);
  };

  const openSingleWindow = (window) => {
        setWindowOpen(window);
  };

  return (
    <GridContext.Provider value={{ gridData, provideGridLoading, windowOpen, updateGrid, loadingFinished, openSingleWindow }}>
      {props.children}
    </GridContext.Provider>
  );
};
