// src/DrawingCanvas.tsx
import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { SketchPicker } from 'react-color';
import { MdClear } from "react-icons/md";
import { IoMdSave } from "react-icons/io";

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
      canvas.isDrawingMode = activeTool === 'pencil' || activeTool === 'brush' || activeTool === 'eraser';
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
      canvas.freeDrawingCursor = `url("/images/pen.png"), auto`
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.width = lineWidth;
      canvas.freeDrawingBrush.color = color;

      //@ts-ignore
      canvas.freeDrawingBrush.strokeDashArray = isDashed ? [5, 5] : undefined;
    }
  };

  const setupBrush = () => {
    if (canvas) {
      canvas.freeDrawingCursor = `url("/images/brush.png"), auto`
      //@ts-ignore
      canvas.freeDrawingBrush = new fabric.CircleBrush(canvas);
      canvas.freeDrawingBrush.width = lineWidth;
      canvas.freeDrawingBrush.color = color;
      //@ts-ignore
      canvas.freeDrawingBrush.strokeDashArray = isDashed ? [20, 20] : undefined;
    }
  };

  const setupLine = () => {
    let isDrawing = false;
    let line: fabric.Line;

    canvas?.on('mouse:down', (opt) => {
      if (canvas) {
        isDrawing = true;
        canvas.freeDrawingCursor = `url("/images/brush.png"), auto`
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


      canvas.freeDrawingCursor = `url("/images/eraser.png"), auto`
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.width = lineWidth;
      canvas.freeDrawingBrush.color = 'white';
    }
  };

  return (
    < div className='bg-gray-100 min-h-screen'>
      <div className=' pt-3'>
        <div className="flex flex-row gap-2  items-stretch justify-center bg-gray-50">
          <button onClick={() => handleToolChange('pencil')} className="p-2  text-white rounded "
            style={activeTool === "pencil" ? { border: "1px solid blue", background: "#dbdb3b" } : {}}
          >
            <img src="/images/pen.png" className='object-contain w-full' />
          </button>
          <button onClick={() => handleToolChange('brush')} className="p-2  text-white rounded"
            style={activeTool === "brush" ? { border: "1px solid blue", background: "#dbdb3b" } : {}}
          >
            <img src="/images/brush.png" className='object-contain w-full' />
          </button>
          <button onClick={() => handleToolChange('line')} className="p-2  text-white rounded"
            style={activeTool === "line" ? { border: "1px solid blue", background: "#dbdb3b" } : {}}
          >
            <img src="/images/ln.png" className='object-contain w-full' />
          </button>
          <button onClick={() => handleToolChange('rectangle')} className="p-2  text-white rounded"
            style={activeTool === "rectangle" ? { border: "1px solid blue", background: "#dbdb3b" } : {}}
          >
            <div className='w-[40px] h-[30px] border-2 border-black'></div>
          </button>
          <button onClick={() => handleToolChange('circle')} className="p-2  text-white rounded"
            style={activeTool === "circle" ? { border: "1px solid blue", background: "#dbdb3b" } : {}}
          >
            <div className='w-[30px] h-[30px] border-2 border-black rounded-full'></div>
          </button>
          {/* <button onClick={() => handleToolChange('polygon')} className="p-2 bg-blue-500 text-white rounded">Polygon</button> */}
          <button
            style={activeTool === "eraser" ? { border: "1px solid blue", background: "#dbdb3b" } : {}}
            onClick={() => handleToolChange('eraser')} className="p-2  text-white rounded">
            <img src="/images/eraser.png" className='object-contain w-full -rotate-45' />
          </button>
          <button onClick={() => handleToolChange('text')} className="p-2   rounded text-4xl">T</button>
          <button onClick={handleClear} className="p-2  rounded ">
            <MdClear size={30} />
          </button>
          <button onClick={handleSaveImage} className="p-2  rounded">
            <IoMdSave size={30} />
          </button>



        </div>
      </div>
      <div className='flex px-6 gap-x-10'>
        <div className=' '>
          <SketchPicker color={color} onChangeComplete={(color) => setColor(color.hex)} className='mx-auto' />
          {['pencil', 'brush', 'line', 'rectangle', 'polygon', 'eraser','circle'].includes(activeTool) && (
            <div className="mt-4">
              <div className='flex gap-x-2'>
                <label className="block"> Width</label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={lineWidth}
                  onChange={(e) => setLineWidth(parseInt(e.target.value))}
                  className="w-full max-w-[150px]"
                />
              </div>
              <div className='flex gap-x-2 mt-2 '>
                <label className=" mr-2">Dashed</label>
                <input
                  type="checkbox"
                  checked={isDashed}
                  onChange={(e) => setIsDashed(e.target.checked)}
                />
              </div>
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
            <div className="flex ">
              <label className="block">Text</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <button onClick={handleAddText} className=" mt-2 p-2 bg-green-500 text-white rounded">Add Text</button>
            </div>
          )}


        </div>

        <div className="flex items-center justify-center  bg-white rounded-2xl">
          <canvas
            ref={canvasRef}
            width={900}
            height={500}
            className="cursor-move border border-gray-200 rounded-2xl w-full max-w-full" />
        </div>

      </div>

    </div>


  );
};

export default DrawingCanvas;

