import React, { useCallback } from 'react';
import { styled } from '@mui/material/styles';
import { ShapeConfig } from 'konva/lib/Shape';
import useImage from 'use-image';

const Input = styled('input')({
  display: 'none',
});

const getFormatted = async (shapes:ShapeConfig[], onLoad) => {
  try {
    const formatted = shapes.map(shape => {
      if (shape.attrs.type === 'image') {
        const image = new window.Image();
        image.src = shape.attrs.src;
        image.onload = () => {
          shape.attrs.image = image;
          console.log(`1. onload`)
        }
      }
      return shape.attrs;
    })

    await sleep(1000);
    return formatted;
  }
  catch (err) {
    console.log(err);
  }
}

function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function JsonHandler(props: {
  onJsonLoaded: (shapes: ShapeConfig[]) => void,
  onImageLoaded: (image: HTMLImageElement, options: ShapeConfig) => void
}) {
  const { onJsonLoaded, onImageLoaded } = props;

  const handleFileChange = useCallback((event) => {
    const [file] = event.target.files;
    const reader = new FileReader();

    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    reader.onload = () => {
      const result = JSON.parse(JSON.parse(String(reader.result)));

      const formatted = result.children.map(shape => {
        if (shape.attrs.type === 'image') {
          const image = new window.Image();
          image.src = shape.attrs.src;
          image.onload = () => {
            onImageLoaded(image, shape.attrs);
          }
        }
        return shape.attrs;
      });

      onJsonLoaded(formatted.filter((shape) => shape.type !== 'image'));
    };

    reader.readAsText(file);
  }, [props]);

  return (
    <Input
      type="file"
      onChange={handleFileChange}
      id="deserialize"
      accept="application/json"
    />
  );
}
