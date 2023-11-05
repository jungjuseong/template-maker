import React, { useCallback } from 'react';
import { styled } from '@mui/material/styles';

const Input = styled('input')({
  display: 'none',
});

export function ImageHandler(props: {
  onImageLoaded: (image: HTMLImageElement) => void,
}) {
  const { onImageLoaded } = props;

  const handleFileChange = useCallback((event) => {
    const [file] = event.target.files;
    const reader = new FileReader();

    reader.onload = () => {
      const image = new window.Image();
      image.src = String(reader.result);
      image.onload = () => onImageLoaded(image);
    };

    reader.readAsDataURL(file);
  }, [props]);

  return (
    <Input
      type="file"
      onChange={handleFileChange}
      id="add-image"
      accept="image/*"
    />
  );
}
