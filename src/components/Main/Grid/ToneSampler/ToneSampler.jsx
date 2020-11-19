//import React, { useState, useEffect } from "react";

// Import tone
import * as Tone from "tone";

//Samples
import { C1, D1, E1, F1 } from "../Samples/Samples";


export const sampler = new Tone.Players(
  {
    C1,
    D1,
    E1,
    F1,
  },
  {
    volume: -1,
    fadeOut: "64n",
    onload: () => {
      Tone.start().then(
        console.log("Sampler is loaded."),
      );
    },
  }
).toMaster();

