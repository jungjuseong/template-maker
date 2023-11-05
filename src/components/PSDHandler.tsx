import React, { ChangeEvent, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Konva from 'konva';
import Psd, { Node } from "@webtoon/psd";

type ShapeConfig = Konva.ShapeConfig;


const Input = styled('input')({
  display: 'none',
});

const generateImage = (layer: {
  imageData?: Uint8ClampedArray;
  width: number;
  height: number;
}) => {

  console.log(layer);

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;
  const {width, height, imageData: rgba} = layer;
  const contextImageData = context.createImageData(width, height);

  canvas.width = width;
  canvas.height = height;

  contextImageData.data.set(rgba);
  context.putImageData(contextImageData, 0, 0);

  var image = new Image();
  image.src = canvas.toDataURL("image/png");

  console.log(`image %o`, image);
  return image;
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

export function PSDHandler(props: {
  fileLoaded: (shapes: Konva.ShapeConfig[]) => void,
}) {
  const { fileLoaded } = props;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] as File;
    //console.log(`handleChange %o`, file)

    readFileAsArrayBuffer(file).then(async (buffer) => {
      const psd = Psd.parse(buffer);
      const formatted:ShapeConfig[] = [];

      for (const [index, layer] of psd.layers.entries()) {
        const pixelData = await layer.composite(true, true);
        const image = generateImage(layer);

        console.log(`layer %s %d %d %d %d, %o`, layer.name, layer.left, layer.top, layer.width, layer.height, layer);
        const shape:ShapeConfig = {
          name: layer.name,
          type: 'image',
          image: image,
          x: layer.left,
          y: layer.top,
          width: layer.width,
          height: layer.height,
          fill: '#924567',
          opacity: 0.5
          //opacity: layer.opacity / 255,
        }

        formatted.push(shape);

        // const shape_name:ShapeConfig = {
        //   type: 'text',
        //   x: layer.left,
        //   y: layer.top,
        //   text: layer.name,
        //   fontSize: 38,
        //   width: layer.width,
        //   height: layer.height,
        //   fill: '#ffff22',
        //   opacity: 1,
        // }
        // formatted.push(shape_name);

        //console.log(`layer %s %d %d %d %d, %o`, layer.name, layer.left, layer.top, layer.width, layer.height, layer);
      }
      fileLoaded(formatted);
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
