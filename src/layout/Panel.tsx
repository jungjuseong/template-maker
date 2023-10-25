import React from 'react';
import { Input, Slider, Card } from '@mui/material';
import { PositionInfo } from './fields/PositionInfo';
import { TextboxInfo } from './fields/TextboxInfo';
import { useFilter } from '../hooks';
import { useShapesContext } from '../context';
import { CanvasInfo } from './fields/CanvasInfo';

export const Panel = ({
  canvasSize,
  setCanvasSize,
}: {
  canvasSize: { width: number; height: number };
  setCanvasSize: (size: { width: number; height: number }) => void;
}) => {
  const { selected, getShapeById, updateShape } = useShapesContext();
  const selectedShape = getShapeById(selected);
  const { applyFilter, previewFilter } = useFilter({ selected, updateShape });

  return (
    <div>
      {selectedShape ? (
        <>
            <h3>
             {selectedShape.type}
            </h3>

          <PositionInfo
            id={selectedShape.id}
            x={selectedShape.x}
            y={selectedShape.y}
            width={selectedShape.width}
            height={selectedShape.height}
          />

          {selectedShape.type === 'text' ? (
            <TextboxInfo />
          ) : selectedShape.type !== 'image' && (
            <label htmlFor="fill">
              color
              <Input
                fullWidth
                type="color"
                name="fill"
                value={selectedShape.fill}
                onBlur={(e) => {
                  applyFilter({ type: 'fill' })(e.target.value);
                }}
                onChange={(e) => {
                  previewFilter({ type: 'fill' })(e.target.value);
                }}
              />
            </label>
          )}
        </>
      ) : (
        <CanvasInfo
          canvasSize={canvasSize}
          setCanvasSize={setCanvasSize}
        />
      )}
    </div>
  );
};
