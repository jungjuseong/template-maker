import React, { useContext } from 'react';
import {
  Button, ButtonGroup, ThemeProvider, styled, createTheme, Stack, Divider,
  Tooltip
} from '@mui/material';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import FlipToFrontIcon from '@mui/icons-material/FlipToFront';
import FlipToBackIcon from '@mui/icons-material/FlipToBack';
import Title from '@mui/icons-material/Title';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import RectangleOutlinedIcon from '@mui/icons-material/RectangleOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import AddCard from '@mui/icons-material/AddCard';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';

import { HistoryContext, useShapesContext } from '../context';
import { ImageHandler } from '../components';
import { JsonHandler } from '../components/JsonHandler';
import { PSDHandler } from '../components/PSDHandler';

const ToolbarBackground = styled('div')({
  backgroundColor: '#2c2c2c',
  borderBottom: '1px solid #e0e0e0',
  padding: '5px',
  display: 'flex',
});

const TooltipButton = ({
  title,
  disabled,
  onClick,
  children,
  ...props
}: {
  title: string;
  disabled?: boolean;
  onClick?: (e) => void;
  children: React.ReactNode;
  [key: string]: any;
}) => (
  <Tooltip title={title}>
    <span>
      <Button
        size="small"
        type="button"
        disabled={disabled}
        onClick={onClick}
        {...props}
      >
        {children}
      </Button>
    </span>
  </Tooltip>
);

TooltipButton.defaultProps = {
  disabled: false,
  onClick: () => {},
};

export const Toolbar = () => {
  const {
    redo, undo, canRedo, canUndo, saveHistory,
  } = useContext(HistoryContext);

  const {
    selected,
    addShape, setSelected,
    unselect, unfocus, zoomIn, zoomOut,
    canZoomIn, canZoomOut,
    toForward, toBackward,
    layer, removeShape, duplicateShape,
    stage,
  } = useShapesContext();

  const handleAddShape = (configs: {[key: string]: any}) => {
    const [shape] = addShape([{ ...configs }]);
    console.log(`handleAddShape: %o`, {...configs});
    setSelected(shape.id);
  }

  const downloadURI = (uri, name) => {
    const link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const downloadImage = () => {
    const base64 = stage.toDataURL();
    downloadURI(base64, 'image.png');
  }

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#E5E5E5',
      },
      secondary: {
        main: '#f50057',
      },
    },
  })

  const serialize = () => {

    layer.children.map(item => {
      console.log(item.className)
      if (item.className === 'Image') {
        item.attrs.src = item.attrs.image.src;;
      }
    })

    const blob = new Blob([
      JSON.stringify(layer.toJSON()),
    ], { type: 'application/json' });

    downloadURI(URL.createObjectURL(blob), 'image.json');
  }

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <ToolbarBackground>
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={1}
          >
            <ButtonGroup variant="contained" size="small">
              <TooltipButton
                title="Circle"
                onClick={() => handleAddShape({
                  type: 'ellipse',
                })}
              >
                <CircleOutlinedIcon />
              </TooltipButton>

              <TooltipButton
                title="Rectangle"
                onClick={() => handleAddShape({
                  type: 'rect',
                })}
              >
                <RectangleOutlinedIcon />
              </TooltipButton>

              <TooltipButton
                title="Text Fields"
                onClick={() => handleAddShape({
                  type: 'text',
                })}
              >
                <Title />
              </TooltipButton>

              &nbsp;

              <label htmlFor="add-image">
                <ImageHandler
                  onImageLoaded={(image: HTMLImageElement) => {
                    handleAddShape({
                      type: 'image',
                      image,
                    });
                  }}
                />
                <TooltipButton
                  title="Image"
                  component="span"
                >
                  <AddAPhotoIcon />
                </TooltipButton>
              </label>
            </ButtonGroup>

            <ButtonGroup variant="contained" size="small">
              <TooltipButton
                title="Undo"
                disabled={!canUndo}
                onClick={() => {
                  unselect();
                  unfocus();
                  undo();
                }}
              >
                <UndoIcon />
              </TooltipButton>

              <TooltipButton
                title="Redo"
                disabled={!canRedo}
                onClick={() => {
                  unselect();
                  unfocus();
                  redo();
                }}
              >
                <RedoIcon />
              </TooltipButton>
            </ButtonGroup>

            <ButtonGroup variant="contained" size="small">
              <TooltipButton
                title="Zoom In"
                type="button"
                disabled={!canZoomIn}
                onClick={() => {
                  zoomIn();
                }}
              >
                <ZoomInIcon />
              </TooltipButton>

              <TooltipButton
                title="Zoom Out"
                type="button"
                disabled={!canZoomOut}
                onClick={() => {
                  zoomOut();
                }}
              >
                <ZoomOutIcon />
              </TooltipButton>
            </ButtonGroup>

            <ButtonGroup variant="contained" size="small">
              <TooltipButton
                title="Delete"
                disabled={!selected}
                onClick={() => {
                  removeShape(selected);
                  unselect();
                  unfocus();
                }}
              >
                <DeleteForeverIcon />
              </TooltipButton>

              <TooltipButton
                title="Duplicate"
                disabled={!selected}
                onClick={() => {
                  const shape = duplicateShape(selected);
                  setSelected(shape.id);
                }}
              >
                <ContentCopyIcon />
              </TooltipButton>

              <TooltipButton
                title="To Forward"
                disabled={!selected}
                onClick={() => {
                  toForward(selected);
                }}
              >
                <FlipToFrontIcon />
              </TooltipButton>

              <TooltipButton
                title="To Backward"
                disabled={!selected}
                onClick={() => {
                  toBackward(selected);
                }}
              >
                <FlipToBackIcon />
              </TooltipButton>
            </ButtonGroup>

            <ButtonGroup variant="contained" size="small">
            <label htmlFor="parsing_psd">
                <PSDHandler
                  fileLoaded={(shapeArr) => {
                    addShape(shapeArr);
                  }}
                />
                <TooltipButton
                  title="parsing PSD"
                  component="span"
                >
                  <AddCard />
                </TooltipButton>
              </label>

              <TooltipButton
                title="Download"
                onClick={() => {
                  downloadImage();
                }}
              >
                <DownloadIcon />
              </TooltipButton>
              <TooltipButton
                title="Serialize"
                onClick={() => {
                  serialize();
                }}
              >
                <LogoutIcon />
              </TooltipButton>

              <label htmlFor="deserialize">
                <JsonHandler
                  onJsonLoaded={(shapeArr) => {
                    addShape(shapeArr);
                  }}
                  onImageLoaded={(image, attrs) => {
                    const options = {
                      ...attrs,
                      image: image
                    }
                    console.log(`onImageLoaded - %o,%o`, options, image.src.split(",")[0])
                    addShape([options]);
                  }}
                />
                <TooltipButton
                  title="Deserialize"
                  component="span"
                >
                  <LoginIcon />
                </TooltipButton>
              </label>
            </ButtonGroup>
          </Stack>
        </ToolbarBackground>
      </ThemeProvider>

    </>
  );
};
