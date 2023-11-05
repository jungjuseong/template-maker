import React, { useCallback } from 'react';
import { styled } from '@mui/material/styles';
import { ShapeConfig } from 'konva/lib/Shape';

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
  onImageLoaded: (imageShape: ShapeConfig) => void
}) {
  const { onJsonLoaded, onImageLoaded } = props;

  const handleFileChange = useCallback((event) => {
    const [file] = event.target.files;
    const reader = new FileReader();

    reader.onload = () => {
      const result = JSON.parse(JSON.parse(String(reader.result)));
      const shapes = result.children.filter(item => item.className !== 'Group');
      console.log(`shapes - %o`, shapes)

      const formatted = shapes.map((shape) => {

        if (shape.attrs.type === 'image') {
          shape.attrs.type = 'rectangle';
          // const image = new window.Image();
          // image.src = shape.attrs.src;
          // image.onload = async () => {
          //   shape.attrs = {
          //     ...shape.attrs,
          //     image
          //   }
          //   console.log(`onload - %o`, shape.attrs)
            //onImageLoaded(img);
          // }
        }
        // await sleep(2000);

        return shape.attrs;
      })


      const imageRemoved = formatted.filter((shape) => shape.type !== 'image');
      console.log(`imageRemoved - %o`, imageRemoved);

      onJsonLoaded(imageRemoved);
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
