import Konva from 'konva';
import  { useContext, useEffect, useState } from 'react';

import { useIdCounter } from './useIdCounter';
import { HistoryContext } from '../context/HistoryContext';

type ShapeConfig = Konva.ShapeConfig;

export function useShapes() {
  const [shapes, setShapes] = useState<ShapeConfig[]>([]);

  const { generateId } = useIdCounter();

  const {
    saveHistory,
    history,
    index: historyIndex,
  } = useContext(HistoryContext);

  const getShapeById = (id: string) => shapes.find((shape) => shape.id === id);

  const updateShape = <T extends ShapeConfig>(
    config: T & { id: string },
    options: {
      saveHistory: boolean;
    } = {
      saveHistory: true,
    }
  ) => {
    const updated = shapes.map((shape) => {
      if (shape.id === config.id) {
        return {
          ...shape,
          ...config,
        };
      }
      return shape;
    });

    setShapes(updated);

    if (options.saveHistory) {
      saveHistory(updated);
    }

    return updated;
  };

  const DefaultAttrs = {
    draggable: true,
    shadowBlur: 0,
    brightness: 0,
    blur: 0,
    contrast: 0,
    pixelSize: 1,
    fill: '#637EF7',
  }

  const generateShape = <T extends ShapeConfig>(shape: T) => {

    let createdShape: ShapeConfig = {
      ...DefaultAttrs,
      id: generateId(),
      ...shape,
    };

    switch (shape.type) {
      case 'rectangle':
      case 'rect':
        createdShape = {
          ...createdShape,
          type: 'rectangle',
          y: shape.y ?? Math.random() * 100,
          x: shape.x ?? Math.random() * 100,
          fill: shape.fill ?? '#637EF7',
        };
        break;

      case 'text':
        createdShape = {
          ...createdShape,
          type: 'text',
          rotation: shape.rotation ?? 0,
          y: shape.y ?? Math.random() * 100,
          x: shape.x ?? Math.random() * 100,
          fill: shape.fill ?? '#637EF7',
          text: shape.text ?? 'Double click to edit',
          fontSize: shape.fontSize ?? 28,
          fontStyle: shape.fontStyle ?? 'normal',
          align: shape.align ?? 'left',
          wrap: shape.wrap ?? 'word',
        };
        break;
      case 'image':
        createdShape = {
          ...createdShape,
          y: shape.x ?? Math.random() * 100,
          x: shape.y ?? Math.random() * 100,

          fill: undefined,
        }
        break;

      default:
        break;
    }

    return createdShape;
  };

  const addShape = <T extends ShapeConfig>(shapeArr: T[]) => {

    const createdShapes = shapeArr.map((shape) =>
      generateShape(shape));

    const nextShapes = shapes.concat(createdShapes);
    setShapes(nextShapes);
    saveHistory(nextShapes);

    return createdShapes;
  };

  // HistoryIndex 변하면 history 번째 인덱스꺼 가져와서 변화시키기
  useEffect(() => {
    setShapes(history[historyIndex]);
  }, [historyIndex]);

  const toForward = (id: string) => {
    const shape = shapes.find((item) => item.id === id);
    if (shape) {
      const result = shapes.filter((item) => item.id !== id).concat([shape]);
      setShapes(result);
      saveHistory(result);
    }
  };

  const toBackward = (id: string) => {
    const shape = shapes.find((item) => item.id === id);
    if (shape) {
      const result = [shape].concat(shapes.filter((item) => item.id !== id));
      setShapes(result);
      saveHistory(result);
    }
  };

  const removeShape = (id: string) => {
    const shape = shapes.find((item) => item.id === id);
    if (shape) {
      const result = shapes.filter((item) => item.id !== id);
      setShapes(result);
      saveHistory(result);
    }
  };

  const duplicateShape = (id: string): ShapeConfig => {
    const shape = shapes.find((item) => item.id === id);
    const created = {
      ...shape,
      id: generateId(),
      x: shape.x + 10,
      y: shape.y + 10,
    };

    const result = shapes.concat([created]);
    setShapes(result);
    saveHistory(result);

    return created;
  };

  return {
    shapes,

    getShapeById,
    duplicateShape,

    setShapes,
    updateShape,
    addShape,
    removeShape,

    toForward,
    toBackward,
  };
}
