import React, { ChangeEvent, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { ShapeConfig } from 'konva/lib/Shape';

import Psd from "@webtoon/psd";
import {createMessage, validateMessage} from "../showPSD/messaging";

const workerCallback = ({data}: MessageEvent<any>) => {
  const {type, value} = data;
  validateMessage(data);
  if (type === "Layer") {
    const layer = value;

    // -- Layers --
    // element.insertAdjacentHTML("beforeend", `<h3>${layer.name} Layer</h3>`);
    // element.insertAdjacentHTML(
    //   "beforeend",
    //   `<div><p class="layer-info">size : ${layer.width} x ${layer.height} | top: ${layer.top} | left: ${layer.left}</p></div>`
    // );
    // //console.time("Create and append <canvas> for layer");
    // element.appendChild(generateCanvas(layer));
    console.log(`%s layer %o`,layer.name, layer)
    //console.timeEnd("Create and append <canvas> for layer");
  }
};

const readFileAsArrayBuffer = (file: File) => {
  if (file.arrayBuffer) {
    return file.arrayBuffer();
  }
  else {
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
}

const Input = styled('input')({
  display: 'none',
});

export function PSDHandler(props: {
  fileLoaded: (shapes: ShapeConfig[]) => void,
}) {
  const { fileLoaded } = props;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] as File;
    console.log(`handleChange %o`, file)

    readFileAsArrayBuffer(file).then(async (buffer) => {
      // worker.postMessage(createMessage("ParseData", buffer), [buffer]);
      const psd = Psd.parse(buffer);
      // console.timeEnd("Parse PSD file");

      console.log(`psd %o name(%s)`, psd, psd.name);

      for (const [index, layer] of psd.layers.entries()) {
        const pixelData = await layer.composite(true, true);

        console.log(`layer %s %d %d %d %d`, layer.name, layer.left, layer.top, layer.width, layer.height);
        // (self as unknown as Worker).postMessage(
        //   createMessage("Layer", {
        //     pixelData,
        //     name: layer.name,
        //     left: layer.left,
        //     top: layer.top,
        //     width: layer.width,
        //     height: layer.height,
        //   }),
        //   [pixelData.buffer]
        // );
    }
  });
  }

  return (
    <Input
      type="file"
      onChange={handleChange}
      id="parsing_psd"
      accept=".psd,.psb"
    />
  );
}
