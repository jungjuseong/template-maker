import React, { useCallback } from 'react';
import { styled } from '@mui/material/styles';
import { ShapeConfig } from 'konva/lib/Shape';

const Input = styled('input')({
  display: 'none',
});

export function JsonHandler(props: {
  jsonLoaded: (shapes: ShapeConfig[]) => void,
}) {
  const { jsonLoaded } = props;

  const handleFileChange = useCallback((event) => {
    const [file] = event.target.files;
    const reader = new FileReader();

    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    reader.onload = () => {
      const result = JSON.parse(JSON.parse(String(reader.result)));

      console.log(`json %o`, result);

      const formatted = result.children.map(shape => {
        if (shape.attrs.type === 'image') {
          shape.attrs.fill = "#637EF7";
          shape.attrs.type = "rectangle";
          // const image = new Image();
          // image.onload = () => {
          //   shape.image = image;
          //   console.log(`image on load: %o`, image);
          // } //onBase64ImageLoaded(image);
          // image.src = shape.src;
        }
        return shape.attrs;
      });

      jsonLoaded(formatted);
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
