import React from 'react';
import { Input, Divider} from '@mui/material';
import { useShapesContext } from '../../context';


export const PositionInfo = (
  {id,x,y,width,height}:
  {
    id: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {

  const { selected, getShapeById, updateShape } = useShapesContext();
  const selectedShape = getShapeById(selected);

  return (
    <div>
      <label htmlFor="name">
        name: <Input
          type="string"
          name="name"
          value={ selectedShape.name }
          onChange={(e) => {
            updateShape({
              id: selectedShape.id,
              name: e.target.value
            })
          }}
        />
      </label>
      <Divider/>
      <label htmlFor="x">
          x: <Input id="position-input-x-label"
            type="number"
            name="x"
            value={ x && Math.trunc(x)}
            onChange={(e) => {

            }}
          />
        </label>
        <Divider/>
        <label htmlFor="y">
          y: <Input id="position-input-y-label"
            type="number"
            name="y"
            value={ y && Math.trunc(y)}
            onChange={(e) => {
            }}
          />
        </label>
        <Divider/>
          <label htmlFor="width">
            w: <Input id="position-input-width-label"
              type="number"
              name="width"
              // inputProps={{
              //   min: object_min_value,
              //   max: object_max_value,
              // }}
              value={ selectedShape.width && Math.trunc(selectedShape.width)}
              onChange={(e) => {
                // updateShape({
                //   id: id,
                //   width: width && e.target.value
                // })
              }}
            />
          </label>
          <Divider/>
          <label htmlFor="height">
            h: <Input id="position-input-height-label"
              type="number"
              // inputProps={{
              //   min: object_min_value,
              //   max: object_max_value,
              // }}
              name="height"
              value={ selectedShape.height && Math.trunc(selectedShape.height)}
              onChange={(e) => {
                // updateShape({
                //   id: id,
                //   height: height && e.target.value
                // })
              }}
            />
          </label>
        </div>
  )
}
