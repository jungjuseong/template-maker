import React, { useCallback } from 'react';
import { styled } from '@mui/material/styles';
import { ShapeConfig } from 'konva/lib/Shape';

const Input = styled('input')({
  display: 'none',
});

export function PSDHandler(props: {
  fileLoaded: (shapes: ShapeConfig[]) => void,
}) {
  const { fileLoaded } = props;

  const handleFileChange = useCallback((event) => {
    const [file] = event.target.files;
    const reader = new FileReader();

    reader.onload = () => {
      const result = JSON.parse(JSON.parse(String(reader.result)));

      console.log(`json %o`, result);

      const formatted = result.children.map(shape => {

        return shape.attrs;
      });

      fileLoaded(formatted);
    };

    reader.readAsText(file);
  }, [props]);

  return (
    <Input
      type="file"
      onChange={handleFileChange}
      id="parsing_psd"
      accept="image/psd"
    />
  );
}
