import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { gridInitData } from "./GridInitData/GridInitData";
import { GridContext } from "../../../contexts/grid-context";
import "./Grid.css";

// Grid Modules
import SaveButton from "./SaveButton/SaveButton";

// InputRange Sliders
import InputRange from "react-input-range";
import "./InputSlider/InputSlider.css";

// Tone
import * as Tone from "tone";
import { sampler } from "./ToneSampler/ToneSampler";

// Font Awesome Icons
import {
  faPlay,
  faPause,
  faClock,
  faChevronRight,
  faVolumeDown,
} from "@fortawesome/free-solid-svg-icons";

// Rendering
export default function Grid() {
  // Transport
  const [musicTransport, setMusicTransport] = useState(true);

  // Grid Configuration Data Object
  const context = useContext(GridContext);
  const [gridData, setGridData] = useState(
    JSON.parse(JSON.stringify(gridInitData))
  );

  // GUI
  const [playButtonDisabled, setPlayButtonDisabled] = useState(true);
  const [showPlayIcon, setShowPlayIcon] = useState(true);
  //const [yellowGridBlock, setYellowGridBlock] = useState(true);
  const [pianoBarLeft, setPianoBarLeft] = useState(364);
  const [pianoBarHeight] = useState(238);
  const [pianoBarMaxWidth, setPianoBarMaxWidth] = useState(500);
  const [toneBPM, setToneBPM] = useState(120);
  const [volume, setVolume] = useState(-10);
  const [transportTime, setTransportTime] = useState("");

  // Declare ID for the ResizeObserver
  let intervalId;

  // Tone declarations
  const loadingPattern = () => {
    Tone.context.latencyHint = "interactive";

    clearGrid();
    const loadGrid = JSON.parse(JSON.stringify(context.gridData));
    const currentGrid = gridData;
    const loadedVol = loadGrid[0].options.mainvol;
    const loadedTempo = loadGrid[0].options.tempo;
    currentGrid[0] = loadGrid[0];
    setToneBPM(loadedTempo);
    setVolume(loadedVol);
    setGridData(currentGrid);

    currentGrid[0].grid.forEach((elem, gridIndex) => {
      elem.steps.forEach((step, stepIndex) => {
        if (step.active) {
          scheduleTimelineBlock(step.time, elem.sound, gridIndex, stepIndex);
        }
      });
    });
    Tone.context.latencyHint = "fastest";
    context.loadingFinished();
  };

  const playSample = (sample) => {
    sampler.get(sample).start();
  };

  // Grid functions
  const updateNameAfterSaving = (name) => {
    const currentGrid = gridData;
    currentGrid[0].patttern = name;
    setGridData(currentGrid);
  };

  const clearGrid = () => {
    Tone.Transport.cancel();
    let newArr = gridData;
    newArr[0] = JSON.parse(JSON.stringify(gridInitData[0]));
    const newTempo = newArr[0].options.tempo;
    setGridData(newArr);
    setToneBPM(newTempo);
  };

  const refreshData = () => {
    const transportpos = Tone.Transport.position;
    const transportprogress = Math.round(Tone.Transport.progress * 100);
    setTransportTime(transportpos);
    setGridData(gridData);
    setPianoBarLeft(208 + ((pianoBarMaxWidth - 210) / 100) * transportprogress);
  };

  const playButton = (e) => {
    e.preventDefault();
    // Changed latency here to fix Tonejs sound trigger issue and to have better timing
    Tone.context.latencyHint = "fastest";
    setMusicTransport(!musicTransport);
    setShowPlayIcon(!showPlayIcon);
    transportControl();
  }

  const scheduleTimelineBlock = (
    position,
    sound,
    gridSoundPosition,
    gridStepPosition
  ) => {
    const gridArray = gridData[0].grid;
    const scheduleID = Tone.Transport.schedule((time) => {
      playSample(sound);
    }, position);

    gridArray[gridSoundPosition].steps[gridStepPosition].id = scheduleID;
  };

  const clearTimelineBlock = (
    scheduleId,
    gridSoundPosition,
    gridStepPosition
  ) => {
    const gridArray = gridData[0].grid;
    let gridId = gridArray[gridSoundPosition].steps[gridStepPosition].id;

    if (gridId >= 0) {
      Tone.Transport.clear(scheduleId);
      gridId = null;
    }
  };

  const changeGridBlock = (stepValue, elemSound, elemMuted) => {
    const gridArray = gridData[0].grid;
    const findSoundNumber = gridArray.findIndex((x) => x.sound === elemSound);
    const findStepNumber = gridArray[findSoundNumber].steps.findIndex(
      (y) => y.time === stepValue.time
    );
    gridArray[findSoundNumber].steps[findStepNumber].active = !gridArray[
      findSoundNumber
    ].steps[findStepNumber].active;
    let gridActive = gridArray[findSoundNumber].steps[findStepNumber].active;
    let gridId = gridArray[findSoundNumber].steps[findStepNumber].id;

    if (gridActive) {
      scheduleTimelineBlock(
        stepValue.time,
        elemSound,
        findSoundNumber,
        findStepNumber
      );
    } else {
      clearTimelineBlock(gridId, findSoundNumber, findStepNumber);
    }
    refreshData();
  };

  const transportControl = () => {
    if (musicTransport) {
      Tone.Transport.position = "0";
      Tone.Transport.setLoopPoints(0, "1m");
      Tone.Transport.loop = true;
      Tone.Transport.start();
      intervalId = setInterval(refreshData.bind(this), 25);
      refreshData();
    } else {
      Tone.Transport.stop();
      Tone.Transport.position = "0";
      clearInterval(intervalId);
      refreshData();
    }
  };

  if (context.provideGridLoading) {
    loadingPattern();
  }

  useEffect(() => {
    Tone.context.latencyHint = "interactive";
    Tone.start().then(
      console.log("Audio is ready."),
      setPlayButtonDisabled(false)
    );
  }, []);

  useEffect(() => {
    // Calculate the width of the grid for the pianobar position
    const resizeObserver = new ResizeObserver((element) => {
      setPianoBarMaxWidth(element[0].contentRect.width);
    });
    resizeObserver.observe(document.getElementById("gridContainer"));

    // Unmount
    return () => {
      clearInterval(intervalId);
      resizeObserver.unobserve(document.getElementById("gridContainer"));
    };
  }, [intervalId]);

  // ComponentDidUpdate
  useEffect(() => {
    Tone.Transport.bpm.value = toneBPM;
    sampler.volume.value = volume;
  }, [toneBPM, volume]);

  return (
    <>
      <div className="grid-container noselect">
        {/* Place pianoroll line */}
        {!showPlayIcon && (
          <div
            className="grid-pianoroll-line"
            style={{ left: pianoBarLeft, height: pianoBarHeight }}
          />
        )}
        {/* Start of transport lane */}
        <div id="gridContainer" className="grid-line">
          <div className="grid-block-transport grid-icons-play">
            {playButtonDisabled && (
              <button>
                <FontAwesomeIcon id="grid-icons-play-button" icon={faClock} />
              </button>
            )}
            {!playButtonDisabled && showPlayIcon ? (
              <button onClick={playButton}>
                <FontAwesomeIcon id="grid-icons-play-button" icon={faPlay} />
              </button>
            ) : (
              <button onClick={playButton}>
                <FontAwesomeIcon id="grid-icons-play-button" icon={faPause} />
              </button>
            )}
          </div>
          <div className="grid-block-transport grid-block-pattern ">
            PATTERN
            <span className="grid-block-pattern-line" />
            <div className="grid-block-pattern-nameblock">
              <span className="grid-block-pattern-name">
                {gridData[0].pattern.length > 16
                  ? `${gridData[0].pattern.slice(0, 16)}...`
                  : gridData[0].pattern}
              </span>
              <span className="grid-block-pattern-time">{transportTime}</span>
            </div>
          </div>
          <div className="grid-block-transport grid-block-reset-grid">
            <button onClick={clearGrid}>
              RESET
              <br />
              GRID
            </button>
          </div>
          <div className="grid-block-transport grid-block-tempo-lane grid-block-tempo-lane-arrow">
            <FontAwesomeIcon icon={faChevronRight} />
            <span>
              <FontAwesomeIcon icon={faChevronRight} />
            </span>
            <span className="grid-block-tempo-lane-spacer">TEMPO</span>
            <span className="grid-block-tempo-lane-slider">
              <InputRange
                minValue={60}
                maxValue={200}
                value={toneBPM}
                onChange={(value) => setToneBPM(value)}
              />
            </span>
            <span className="grid-block-tempo-lane-bpm">{toneBPM} bpm</span>
          </div>
          <div className="grid-block-transport grid-block-volume-lane grid-block-volume-lane-speaker">
            <FontAwesomeIcon icon={faVolumeDown} />
            <span className="grid-block-volume-lane-spacer">VOLUME</span>
            <span className="grid-block-volume-lane-slider">
              <InputRange
                minValue={-60}
                maxValue={0}
                step={1}
                value={volume}
                onChange={(value) => setVolume(value)}
              />
            </span>
          </div>
          <SaveButton
            gridData={gridData}
            tempo={toneBPM}
            volume={volume}
            updatename={updateNameAfterSaving}
          />
        </div>
        {/* End of transport line */}
        {/* Start of grid lanes */}
        {gridData[0].grid.map((elem, key) => (
          <div key={key} className="grid-line">
            <div
              className="grid-block-instrument grid-block-instrument-name"
              onClick={(e) => playSample(elem.sound)}
            >
              {elem.name}
            </div>
            {elem.steps.map((value, key) => {
              if (!value.active) {
                return (
                  <div
                    key={key}
                    className="grid-block-instrument grid-block-sequence"
                    onClick={(e) =>
                      changeGridBlock(value, elem.sound, elem.muted)
                    }
                  />
                );
              } else {
                return (
                  <div
                    key={key}
                    className="grid-block-instrument grid-block-sequence-yellow"
                    onClick={(e) =>
                      changeGridBlock(value, elem.sound, elem.muted)
                    }
                  />
                );
              }
            })}
          </div>
        ))}
        {/* End of grid lanes */}
        {/* Start Bottom Line */}
        <div className="grid-bottom-line">
          {/* Add plus button, disabled for now */}
          <div className="grid-bottom-plus">
            {/* <FontAwesomeIcon icon={faPlus} /> */}
          </div>
          {/* Create an array with numbers 1 to 16 and perform a map to visualize them */}
          {Array.from(Array(16).keys()).map((element, key) => (
            <div key={key} className="grid-bottom-numbers">
              {element + 1}
            </div>
          ))}
        </div>
        {/* End content */}
      </div>
    </>
  );
}
