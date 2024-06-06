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
        case 'eraser':
          setupEraser();
          break;
        case 'text':
          canvas.isDrawingMode = false;
          break;
        default:
          canvas.isDrawingMode = false;
          break;
      }
    }
  }, [canvas, activeTool, color, lineWidth, isDashed, isFilled]);

  const handleToolChange = (tool: string) => {
    setActiveTool(tool);
  };

  const handleClear = () => {
    canvas?.clear();
  };

  const handleAddText = () => {
    if (canvas && text) {
      const textObj = new fabric.IText(text, {
        left: 50,
        top: 50,
        fill: color,
        fontSize: 20,
      });
      canvas.add(textObj);
      setText('');
    }
  };

  const setupPencil = () => {
    if (canvas) {
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.width = lineWidth;
      canvas.freeDrawingBrush.color = color;
      //@ts-ignore
      canvas.freeDrawingBrush.strokeDashArray = isDashed ? [5, 5] : undefined;
    }
  };

  const setupBrush = () => {
    if (canvas) {
      //@ts-ignore
      canvas.freeDrawingBrush = new fabric.CircleBrush(canvas);
      canvas.freeDrawingBrush.width = lineWidth;
      canvas.freeDrawingBrush.color = color;
      //@ts-ignore
      canvas.freeDrawingBrush.strokeDashArray = isDashed ? [5, 5] : undefined;
    }
  };

  const setupLine = () => {
    let isDrawing = false;
    let line: fabric.Line;
    canvas?.on('mouse:down', (opt) => {
      if (canvas) {
        isDrawing = true;
        const pointer = canvas.getPointer(opt.e);
        const points = [pointer.x, pointer.y, pointer.x, pointer.y];
        line = new fabric.Line(points, {
          strokeWidth: lineWidth,
          fill: color,
          stroke: color,
          strokeDashArray: isDashed ? [5, 5] : undefined,
        });
        canvas.add(line);
      }
    });

    canvas?.on('mouse:move', (opt) => {
      if (isDrawing && canvas) {
        const pointer = canvas.getPointer(opt.e);
        line.set({ x2: pointer.x, y2: pointer.y });
        canvas.renderAll();
      }
    });

    canvas?.on('mouse:up', () => {
      isDrawing = false;
    });
  };

  const setupRectangle = () => {
    let isDrawing = false;
    let rect: fabric.Rect;
    canvas?.on('mouse:down', (opt) => {
      if (canvas) {
        isDrawing = true;
        const pointer = canvas.getPointer(opt.e);
        const origX = pointer.x;
        const origY = pointer.y;
        rect = new fabric.Rect({
          left: origX,
          top: origY,
          originX: 'left',
          originY: 'top',
          width: pointer.x - origX,
          height: pointer.y - origY,
          angle: 0,
          fill: isFilled ? color : 'transparent',
          stroke: color,
          strokeWidth: lineWidth,
          strokeDashArray: isDashed ? [5, 5] : undefined,
        });
        canvas.add(rect);
      }
    });

    canvas?.on('mouse:move', (opt) => {
      if (isDrawing && canvas) {
        const pointer = canvas.getPointer(opt.e);
        if (rect) {
          rect.set({
            width: pointer.x - rect.left!,
            height: pointer.y - rect.top!,
          });
          canvas.renderAll();
        }
      }
    });

    canvas?.on('mouse:up', () => {
      isDrawing = false;
    });
  };

  const setupCircle = () => {
    let isDrawing = false;
    let circle: fabric.Circle;
    canvas?.on('mouse:down', (opt) => {
      if (canvas) {
        isDrawing = true;
        const pointer = canvas.getPointer(opt.e);
        const origX = pointer.x;
        const origY = pointer.y;
        circle = new fabric.Circle({
          left: origX,
          top: origY,
          originX: 'center',
          originY: 'center',
          radius: 1,
          fill: isFilled ? color : 'transparent',
          stroke: color,
          strokeWidth: lineWidth,
          strokeDashArray: isDashed ? [5, 5] : undefined,
        });
        canvas.add(circle);
      }
    });

    canvas?.on('mouse:move', (opt) => {
      if (isDrawing && canvas) {
        const pointer = canvas.getPointer(opt.e);
        const radius = Math.sqrt(Math.pow(pointer.x - circle.left!, 2) + Math.pow(pointer.y - circle.top!, 2));
        circle.set({ radius: radius });
        canvas.renderAll();
      }
    });

    canvas?.on('mouse:up', () => {
      isDrawing = false;
    });
  };

  const setupPolygon = () => {
    let points: { x: number; y: number }[] = [];
    let polygon: fabric.Polygon;
    canvas?.on('mouse:down', (opt) => {
      if (canvas) {
        const pointer = canvas.getPointer(opt.e);
        points.push({ x: pointer.x, y: pointer.y });

        if (points.length > 2) {
          if (!polygon) {
            polygon = new fabric.Polygon(points, {
              fill: isFilled ? color : 'transparent',
              stroke: color,
              strokeWidth: lineWidth,
              strokeDashArray: isDashed ? [5, 5] : undefined,
            });
            canvas.add(polygon);
          } else {//@ts-ignore

            polygon.set({ points: points });
            canvas.renderAll();
          }
        }
      }
    });

    canvas?.on('mouse:dblclick', () => {
      points = [];
      polygon = null as unknown as fabric.Polygon;
    });
  };

  const handleSaveImage = () => {
    if (canvas) {
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1.0,
      });
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'canvas.png';
      link.click();
    }
  };

  const setupEraser = () => {
    if (canvas) {
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.width = lineWidth;
      canvas.freeDrawingBrush.color = '#FFFFFF'; // assuming white background
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-1/4 p-4 bg-gray-200">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleToolChange('pencil')} className="p-2 bg-blue-500 text-white rounded">Pencil</button>
          <button onClick={() => handleToolChange('brush')} className="p-2 bg-blue-500 text-white rounded">Brush</button>
          <button onClick={() => handleToolChange('line')} className="p-2 bg-blue-500 text-white rounded">Line</button>
          <button onClick={() => handleToolChange('rectangle')} className="p-2 bg-blue-500 text-white rounded">Rectangle</button>
          <button onClick={() => handleToolChange('circle')} className="p-2 bg-blue-500 text-white rounded">Circle</button>
          <button onClick={() => handleToolChange('polygon')} className="p-2 bg-blue-500 text-white rounded">Polygon</button>
          <button onClick={() => handleToolChange('eraser')} className="p-2 bg-blue-500 text-white rounded">Eraser</button>
          <button onClick={() => handleToolChange('text')} className="p-2 bg-blue-500 text-white rounded">Text</button>
          <button onClick={handleClear} className="p-2 bg-red-500 text-white rounded">Clear</button>
          <button onClick={handleSaveImage} className="p-2 bg-green-500 text-white rounded">Save Image</button>
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
        {['rectangle', 'circle', 'polygon'].includes(activeTool) && (
          <div className="mt-4">
            <label className="block mt-2">Filled</label>
            <input
              type="checkbox"
              checked={isFilled}
              onChange={(e) => setIsFilled(e.target.checked)}
            />
          </div>
        )}
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
      <div className="flex-grow flex items-center justify-center p-2">
        <canvas ref={canvasRef} width={800} height={600} className="border border-black w-full max-w-full" />
      </div>
    </div>
  );
};

export default DrawingCanvas;

