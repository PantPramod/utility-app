// src/DrawingCanvas.tsx
import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { SketchPicker } from 'react-color';

const DrawingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [activeTool, setActiveTool] = useState<string>('pencil');
  const [color, setColor] = useState<string>('#000000');
  const [lineWidth, setLineWidth] = useState<number>(5);
  const [isDashed, setIsDashed] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const [isFilled, setIsFilled] = useState<boolean>(false);

  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        isDrawingMode: true,
      });
      setCanvas(fabricCanvas);

      return () => {
        fabricCanvas.dispose();
      };
    }
  }, []);

  useEffect(() => {
    if (canvas) {
      canvas.isDrawingMode = activeTool === 'pencil' || activeTool === 'brush';
      canvas.selection = activeTool === 'select';
      canvas.defaultCursor = activeTool === 'select' ? 'default' : 'crosshair';

      canvas.forEachObject((obj) => {
        obj.selectable = activeTool === 'select';
      });

      canvas.off('mouse:down');
      canvas.off('mouse:move');
      canvas.off('mouse:up');
      canvas.off('mouse:dblclick');

      switch (activeTool) {
        case 'pencil':
          setupPencil();
          break;
        case 'brush':
          setupBrush();
          break;
        case 'line':
          setupLine();
          break;
        case 'rectangle':
          setupRectangle();
          break;
        case 'circle':
          setupCircle();
          break;
        case 'polygon':
          setupPolygon();
          break;
        case 'text':
          canvas.isDrawingMode = false;
          break;
        default:
          canvas.isDrawingMode = false;
          break;
      }
    }
  }, [canvas, activeTool, lineWidth, color, isDashed, isFilled]);

  const setupPencil = () => {
    if (canvas) {
      const brush = new fabric.PencilBrush(canvas);
      brush.width = lineWidth;
      brush.color = color;
      //@ts-ignore
      brush.strokeDashArray = isDashed ? [10, 5] : undefined;
      canvas.freeDrawingBrush = brush;
    }
  };

  const setupBrush = () => {
    if (canvas) {
      //@ts-ignore
      const brush = new fabric.CircleBrush(canvas);
      brush.width = lineWidth;
      brush.color = color;
      canvas.freeDrawingBrush = brush;
    }
  };

  const setupLine = () => {
    if (canvas) {
      let isDown = false;
      let line: fabric.Line | undefined;

      canvas.on('mouse:down', (o) => {
        if (activeTool !== 'line') return;
        isDown = true;
        const pointer = canvas.getPointer(o.e);
        const points = [pointer.x, pointer.y, pointer.x, pointer.y];
        line = new fabric.Line(points, {
          strokeWidth: lineWidth,
          fill: color,
          stroke: color,
          originX: 'center',
          originY: 'center',
          strokeDashArray: isDashed ? [10, 5] : undefined,
        });
        canvas.add(line);
      });

      canvas.on('mouse:move', (o) => {
        if (!isDown || !line) return;
        const pointer = canvas.getPointer(o.e);
        line.set({ x2: pointer.x, y2: pointer.y });
        canvas.renderAll();
      });

      canvas.on('mouse:up', () => {
        isDown = false;
      });
    }
  };

  const setupRectangle = () => {
    if (canvas) {
      let isDown = false;
      let rect: fabric.Rect | undefined;
      let origX: number, origY: number;

      canvas.on('mouse:down', (o) => {
        if (activeTool !== 'rectangle') return;
        isDown = true;
        const pointer = canvas.getPointer(o.e);
        origX = pointer.x;
        origY = pointer.y;
        rect = new fabric.Rect({
          left: origX,
          top: origY,
          width: 0,
          height: 0,
          fill: isFilled ? color : 'transparent',
          stroke: color,
          strokeWidth: lineWidth,
          strokeDashArray: isDashed ? [10, 5] : undefined,
        });
        canvas.add(rect);
      });

      canvas.on('mouse:move', (o) => {
        if (!isDown || !rect) return;
        const pointer = canvas.getPointer(o.e);
        if (origX > pointer.x) {
          rect.set({ left: pointer.x });
        }
        if (origY > pointer.y) {
          rect.set({ top: pointer.y });
        }
        rect.set({ width: Math.abs(origX - pointer.x) });
        rect.set({ height: Math.abs(origY - pointer.y) });
        canvas.renderAll();
      });

      canvas.on('mouse:up', () => {
        isDown = false;
      });
    }
  };

  const setupCircle = () => {
    if (canvas) {
      let isDown = false;
      let circle: fabric.Circle | undefined;
      let origX: number, origY: number;

      canvas.on('mouse:down', (o) => {
        if (activeTool !== 'circle') return;
        isDown = true;
        const pointer = canvas.getPointer(o.e);
        origX = pointer.x;
        origY = pointer.y;
        circle = new fabric.Circle({
          left: origX,
          top: origY,
          radius: 0,
          fill: isFilled ? color : 'transparent',
          stroke: color,
          strokeWidth: lineWidth,
          strokeDashArray: isDashed ? [10, 5] : undefined,
        });
        canvas.add(circle);
      });

      canvas.on('mouse:move', (o) => {
        if (!isDown || !circle) return;
        const pointer = canvas.getPointer(o.e);
        const radius = Math.max(Math.abs(origX - pointer.x), Math.abs(origY - pointer.y)) / 2;
        if (radius > circle.strokeWidth!) {
          circle.set({ radius });
        }
        canvas.renderAll();
      });

      canvas.on('mouse:up', () => {
        isDown = false;
      });
    }
  };

  const setupPolygon = () => {
    if (canvas) {
      let polygonPoints: { x: number; y: number }[] = [];

      canvas.on('mouse:down', (o) => {
        if (activeTool !== 'polygon') return;
        const pointer = canvas.getPointer(o.e);
        polygonPoints.push({ x: pointer.x, y: pointer.y });

        const polygon = new fabric.Polygon(polygonPoints, {
          fill: isFilled ? color : 'transparent',
          stroke: color,
          strokeWidth: lineWidth,
          strokeDashArray: isDashed ? [10, 5] : undefined,
        });

        canvas.clear().add(polygon);
      });

      canvas.on('mouse:dblclick', () => {
        if (activeTool !== 'polygon') return;
        polygonPoints = [];
      });
    }
  };

  const handleClear = () => {
    if (canvas) {
      canvas.clear();
    }
  };

  const handleAddText = () => {
    if (canvas && text) {
      const textObj = new fabric.Text(text, {
        left: 50,
        top: 50,
        fill: color,
        fontSize: 20,
      });
      canvas.add(textObj);
    }
  };

  const handleToolChange = (tool: string) => {
    setActiveTool(tool);
    if (canvas) {
      canvas.isDrawingMode = tool === 'pencil' || tool === 'brush';
      if (tool !== 'pencil' && tool !== 'brush') {
        canvas.defaultCursor = 'crosshair';
      }
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 p-4 bg-gray-100 border-r border-gray-300">
        <div className="flex flex-col space-y-2">
          <button onClick={() => handleToolChange('pencil')} className="p-2 bg-blue-500 text-white rounded">Pencil</button>
          <button onClick={() => handleToolChange('brush')} className="p-2 bg-blue-500 text-white rounded">Brush</button>
          <button onClick={() => handleToolChange('line')} className="p-2 bg-blue-500 text-white rounded">Line</button>
          <button onClick={() => handleToolChange('rectangle')} className="p-2 bg-blue-500 text-white rounded">Rectangle</button>
          <button onClick={() => handleToolChange('circle')} className="p-2 bg-blue-500 text-white rounded">Circle</button>
          <button onClick={() => handleToolChange('polygon')} className="p-2 bg-blue-500 text-white rounded">Polygon</button>
          <button onClick={() => handleToolChange('text')} className="p-2 bg-blue-500 text-white rounded">Text</button>
          <button onClick={handleClear} className="p-2 bg-red-500 text-white rounded">Clear</button>
        </div>
        <div className="mt-4">
          <SketchPicker color={color} onChangeComplete={(color) => setColor(color.hex)} />
        </div>
        {activeTool === 'pencil' && (
          <div className="mt-4">
            <label className="block">Pencil Width</label>
            <input
              type="range"
              min="1"
              max="50"
              value={lineWidth}
              onChange={(e) => setLineWidth(parseInt(e.target.value))}
              className="w-full"
            />
            <label className="block mt-2">Dashed</label>
            <input
              type="checkbox"
              checked={isDashed}
              onChange={(e) => setIsDashed(e.target.checked)}
            />
          </div>
        )}
        {activeTool === 'rectangle' || activeTool === 'circle' || activeTool === 'polygon' ? (
          <div className="mt-4">
            <label className="block mt-2">Filled</label>
            <input
              type="checkbox"
              checked={isFilled}
              onChange={(e) => setIsFilled(e.target.checked)}
            />
          </div>
        ) : null}
        {activeTool === 'text' && (
          <div className="mt-4">
            <label className="block">Text</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button onClick={handleAddText} className="mt-2 p-2 bg-green-500 text-white rounded">Add Text</button>
          </div>
        )}
      </div>
      <div className="flex-grow flex items-center justify-center">
        <canvas ref={canvasRef} width={800} height={600} className="border border-black" />
      </div>
    </div>
  );
};

export default DrawingCanvas;
