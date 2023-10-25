
import React from 'react'
import { Input } from '@mui/material';
import { useShapesContext } from '../../context';

export const CanvasInfo = ({
  canvasSize,
  setCanvasSize,
}: {
  canvasSize: { width: number; height: number };
  setCanvasSize: (size: { width: number; height: number }) => void;
}) => {
  const canvas_min_value = 0;
  const canvas_max_value = 4000;

  const canvasFilterNumber = (value) => {
    let filtered = (parseInt(value.replace(/[^0-9]/g, ''), 10) || 0);
    filtered = Math.max(canvas_min_value, filtered);
    filtered = Math.min(canvas_max_value, filtered);
    return filtered;
  };

  return(
    <>
    <h3>Canvas</h3>
      <label htmlFor="canvasWidth">
        width
        <Input
          fullWidth
          type="number"
          name="canvasWidth"
          inputProps={{
            min: canvas_min_value,
            max: canvas_max_value,
          }}
          value={canvasSize.width}
          onChange={(e) => {
            setCanvasSize({
              ...canvasSize,
              width: canvasFilterNumber(e.target.value),
            });
          }}
        />
      </label>
      <label htmlFor="canvasHeight">
        height
        <Input
          fullWidth
          type="number"
          inputProps={{
            min: canvas_min_value,
            max: canvas_max_value,
          }}
          name="canvasHeight"
          value={canvasSize.height}
          onChange={(e) => {
            setCanvasSize({
              ...canvasSize,
              height: canvasFilterNumber(e.target.value),
            });
          }}
        />
      </label>
    </>
  )
}
