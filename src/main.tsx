import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'


// @webtoon/psd
// Copyright 2021-present NAVER WEBTOON
// MIT License

import "./style.css";
import {createMessage, validateMessage} from "./showPSD/messaging";

let canvasEl:HTMLCanvasElement|null = null;
// let context:CanvasRenderingContext2D;

const generateCanvas = (data: {
  pixelData: Uint8ClampedArray;
  width: number;
  height: number;
}) => {
  //if (canvasEl == null) {
    canvasEl = document.createElement("canvas");
  //}

  const context = canvasEl.getContext("2d") as CanvasRenderingContext2D;
  const {width, height, pixelData: rgba} = data;
  const imageData = context.createImageData(width, height);

  canvasEl.width = width;
  canvasEl.height = height;

  imageData.data.set(rgba);
  context.putImageData(imageData, 0, 0);

  return canvasEl;
};

const readFileAsArrayBuffer = (file: File) => {
  if (file.arrayBuffer) {
    return file.arrayBuffer();
  } else {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    return new Promise<ArrayBuffer>((resolve) => {
      reader.addEventListener("load", (event) => {
        if (event.target) {
          resolve(event.target.result as ArrayBuffer);
        } else {
          throw new Error("Loaded file but event.target is null");
        }
      });
    });
  }
};

const workerCallback = ({data}: MessageEvent<any>, element: HTMLDivElement) => {
  const {type, value} = data;
  validateMessage(data);
  if (type === "Layer") {
    const layer = value;

    // -- Layers --
    element.insertAdjacentHTML("beforeend", `<h3>${layer.name} Layer</h3>`);
    element.insertAdjacentHTML(
      "beforeend",
      `<div><p class="layer-info">size : ${layer.width} x ${layer.height} | top: ${layer.top} | left: ${layer.left}</p></div>`
    );
    //console.time("Create and append <canvas> for layer");
    element.appendChild(generateCanvas(layer));
    console.log(`%s layer %o`,layer.name, layer)
    //console.timeEnd("Create and append <canvas> for layer");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const resultsEl = document.querySelector("#results") as HTMLDivElement;

  console.log('DOMContentLoaded')

  // eslint-disable-next-line compat/compat
  // const worker = new Worker(new URL("./worker.ts", import.meta.url), {
  //   type: "module",
  // });

  // worker.addEventListener("message", (e: MessageEvent<any>) =>
  //   workerCallback(e, resultsEl)
  // );

  // console.log(`worker: %o`, worker)
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
)
