import React, { useState, createContext } from "react";
import UserService from "../services/user-service";

// Import default grid data
import { gridInitData } from "../components/Main/Grid/GridInitData/GridInitData";

export const GridContext = createContext();

export const GridContextProvider = (props) => {
  const parseGridInitData = JSON.parse(JSON.stringify(gridInitData));
  const [gridData, setGridData] = useState(parseGridInitData);
  const [provideGridLoading, setProvideGridLoading] = useState(false);
  const service = new UserService();

  const updateGrid = async (patternId) => {
    await service
      .loadPattern(patternId)
      .then((response) => {
        // console.log(response.data)
        setGridData(response.data);
        setProvideGridLoading(true);
      })
      .catch((error) => console.log(error));
  };

  const loadingFinished = () => {
    setProvideGridLoading(false);
  };

  return (
    <GridContext.Provider value={{ gridData, provideGridLoading, updateGrid, loadingFinished }}>
      {props.children}
    </GridContext.Provider>
  );
};
