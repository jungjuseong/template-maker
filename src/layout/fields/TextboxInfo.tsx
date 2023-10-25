import React from 'react';
import { Input, Divider, FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import { useShapesContext } from '../../context';

export function TextboxInfo() {

  const { selected, getShapeById, updateShape } = useShapesContext();
  const selectedShape = getShapeById(selected);

  return (
    <div>
      <label htmlFor="fontSize">
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="textbox-fontsize-select-label">FontSize</InputLabel>
          <Select
            labelId="textbox-fontsize-select-label"
            id="textbox-fontsize-select"
            value={selectedShape.fontSize}
            label="FontSize"
            onChange={(e) => {
              updateShape({
                id: selectedShape.id,
                fontSize: e.target.value
              })
            }}
          >
            <MenuItem value={28}>x-small</MenuItem>
            <MenuItem value={40}>small</MenuItem>
            <MenuItem value={75}>medium</MenuItem>
            <MenuItem value={130}>large</MenuItem>
          </Select>
        </FormControl>
      </label>
      <label htmlFor="fontStyle">
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="textbox-fontStyle-select-label">fontStyle</InputLabel>
          <Select
            labelId="textbox-fontStyle-select-label"
            id="textbox-fontstyle-select"
            value={selectedShape.fontStyle}
            label="FontStyle"
            onChange={(e) => {
              updateShape({
                id: selectedShape.id,
                fontStyle: e.target.value
              })
            }}
          >
            <MenuItem value={'normal'}>normal</MenuItem>
            <MenuItem value={'italic'}>italic</MenuItem>
            <MenuItem value={'bold'}>bold</MenuItem>
            <MenuItem value={500}>thick-500</MenuItem>
          </Select>
        </FormControl>
      </label>
      <label htmlFor="fontFamily">
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="textbox-fontFamily-select-label">FontFamily</InputLabel>
          <Select
            labelId="textbox-fontFamily-select-label"
            id="textbox-fontFamily-select"
            value={selectedShape.fontFamily}
            label="FontFamily"
            onChange={(e) => {
              updateShape({
                id: selectedShape.id,
                fontFamily: e.target.value
              })
            }}
          >
            <MenuItem value={'Pretendard'}>Pretendard</MenuItem>
            <MenuItem value={'NanumGothic'}>Nanum</MenuItem>
            <MenuItem value={'NanumRegular'}>NanumRegular</MenuItem>
          </Select>
        </FormControl>
      </label>
      <Divider />
      <label htmlFor="text">
        <Input
          type="string"
          name="text"
          multiline
          value={ selectedShape.text }
          onChange={(e) => {
            updateShape({
              id: selectedShape.id,
              text: e.target.value
            })
          }}
        />
      </label>
      <Divider/>
    </div>
  )
}
