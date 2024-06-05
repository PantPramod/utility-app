import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

const FabricCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [brightness, setBrightness] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(0);
  const [saturation, setSaturation] = useState<number>(0);
  const [isInvert, setIsInvert] = useState(false);
  const [isGrayScale, setIsGrayScale] = useState(false);
  const [isSpia, setIsSpia] = useState(false)
  const [pixlate, setPixlate] = useState<number>(1)
  const [blur, setBlur] = useState<number>(0)
  const [hue, setHue] = useState<number>(0)

  const [gamma, setGamma] = useState<number[]>([1, 1, 1])

  const [image, setImage] = useState<fabric.Image | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new fabric.Canvas(canvasRef.current, {
        height: 500,
        width: 500,
        backgroundColor: '#f3f3f3',
      });
      setCanvas(initCanvas);
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (f) => {
        if (f.target && f.target.result && typeof f.target.result === 'string') {
          fabric.Image.fromURL(f.target.result, (img) => {
            img.scaleToWidth(400);
            canvas?.clear();
            canvas?.add(img);
            setImage(img);
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  function myFun(image: any, flag: boolean | undefined, no: number, filter: any) {
    if (flag) {
      image.filters[no] = filter
    } else {
      image.filters.splice(no, 1)
    }
  }

  const applyFilters = (
    is_invert?: boolean,
    is_gray_scale?: boolean,
    brightness?: number,
    contrast?: number,
    pixlate?: number,
    is_spia?: boolean,
    blur?: number,
    saturation?: number,
    hue?: number,
    gamma?: number[]
  ) => {
    if (image) {
      image.filters = [];
      const brightnessFilter = new fabric.Image.filters.Brightness({ brightness: brightness! })
      const contrastFilter = new fabric.Image.filters.Contrast({ contrast })
      const invertFilter = new fabric.Image.filters.Invert()
      const grayScaleFilter = new fabric.Image.filters.Grayscale()
      const pixlateFilter = new fabric.Image.filters.Pixelate({ blocksize: pixlate })
      const saturationFilter = new fabric.Image.filters.Saturation({ saturation })
      const spiaFIlter = new fabric.Image.filters.Sepia()
      const blurFilter = new fabric.Image.filters.Blur({ blur: blur })
      const hueRotationFilter = new fabric.Image.filters.HueRotation({
        rotation: hue
      });
      const gammaFilter = gamma && new fabric.Image.filters.Gamma({
        gamma: [gamma[0], gamma[1], gamma[2]]
      })



      image.filters[0] = brightnessFilter
      image.filters[1] = contrastFilter
      myFun(image, is_invert, 2, invertFilter)
      myFun(image, is_gray_scale, 3, grayScaleFilter)
      myFun(image, is_spia, 4, spiaFIlter)
      image.filters[5] = pixlateFilter
      image.filters[6] = blurFilter
      image.filters[7] = saturationFilter
      image.filters[8] = hueRotationFilter
      if (gammaFilter) image.filters[9] = gammaFilter


      image.applyFilters();
      canvas?.renderAll();
    }
  };


  // is_invert?: boolean,
  //   is_gray_scale?: boolean,
  //   brightness?: number,
  //   contrast?: number,
  //   pixlate?: number,
  //   is_spia?: boolean,
  //   blur?: number,
  //   saturation?: number
  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setBrightness(value);
    applyFilters(isInvert, isGrayScale, value, contrast, pixlate, isSpia, blur, saturation, hue, gamma);
  };

  const handleContrastChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setContrast(value);
    applyFilters(isInvert, isGrayScale, brightness, value, pixlate, isSpia, blur, saturation, hue, gamma);
  };

  const handlePixlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setPixlate(value);
    applyFilters(isInvert, isGrayScale, brightness, contrast, value, isSpia, blur, saturation, hue, gamma);
  }

  const handleBlurChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setBlur(value);
    applyFilters(isInvert, isGrayScale, brightness, contrast, pixlate, isSpia, value, saturation, hue, gamma);

  }

  const handleSaturationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setSaturation(value);
    applyFilters(isInvert, isGrayScale, brightness, contrast, pixlate, isSpia, blur, value, hue, gamma);
  }

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setHue(value);
    applyFilters(isInvert, isGrayScale, brightness, contrast, pixlate, isSpia, blur, saturation, value, gamma);
  }

  const applyInvert = (str: string) => {
    let invertValue = setterFun(setIsInvert, str)
    applyFilters(!invertValue, isGrayScale, brightness, contrast, pixlate, isSpia, blur, saturation, hue, gamma);
  }

  const applyGrayScale = (str: string) => {
    let grayScaleValue = setterFun(setIsGrayScale, str)
    applyFilters(isInvert, !grayScaleValue, brightness, contrast, pixlate, isSpia, blur, saturation, hue, gamma)
  }

  const applySpia = (str: string) => {
    let spiaValue = setterFun(setIsSpia, str)
    applyFilters(isInvert, isGrayScale, brightness, contrast, pixlate, !spiaValue, blur, saturation, hue, gamma)
  }



  function setterFun(set: Dispatch<SetStateAction<boolean>>, str: string) {
    let value = str === "true" ? true : false
    set(!value);
    return value
  }

  const saveFile = () => {


    var link = document.createElement('a');
    link.download = 'filename.png';
    if (canvasRef.current) {
      link.href = canvasRef.current?.toDataURL()
      link.click();
    }


  }


  return (
    <div className="flex">
      <div className="w-1/4 p-4">
        <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full mb-4" />
        <label className="block mb-2">
          Brightness:

        </label>
        <input
          type="range"
          min="-1"
          max="1"
          step="0.01"
          value={brightness}
          onChange={handleBrightnessChange}
          className="block w-full cursor-pointer"
        />
        <label className="block mb-2">
          Contrast:

        </label>
        <input
          type="range"
          min="-1"
          max="1"
          step="0.01"
          value={contrast}
          onChange={handleContrastChange}
          className="block w-full cursor-pointer"
        />

        <label className="block mb-2">
          Hue:

        </label>
        <input
          type="range"
          min="-1"
          max="1"
          step="0.01"
          value={hue}
          onChange={handleHueChange}
          className="block w-full cursor-pointer"
        />


        <label className="block mb-2">
          Saturation:

        </label>
        <input
          type="range"
          min="-10"
          max="10"
          step="0.1"
          value={saturation}
          onChange={handleSaturationChange}
          className="block w-full cursor-pointer"
        />

        <label className="mt-2 block ">
          Pixlate:

        </label>
        <input
          type="range"
          min="1"
          max="8"
          step="0.1"
          value={pixlate}
          onChange={handlePixlateChange}
          className="mt-2 block w-full cursor-pointer"
        />

        <label className="mt-2 block ">
          Blur:

        </label>
        <input
          type="range"
          min="-1"
          max="1"
          step="0.01"
          value={blur}
          onChange={handleBlurChange}
          className="mt-2 block w-full cursor-pointer"
        />

        <div className='flex gap-x-2 items-center'>
          <label className=" ">
            Invert:

          </label>
          <input
            type="checkbox"
            checked={isInvert}
            value={isInvert ? 'true' : 'false'}
            onChange={(e) => { applyInvert(e.target.value) }}
            className="cursor-pointer"
          />
        </div>

        <div className='flex gap-x-2 items-center'>
          <label className=" ">
            GrayScale:

          </label>
          <input
            type="checkbox"
            checked={isGrayScale}
            value={isGrayScale ? 'true' : 'false'}
            onChange={(e) => { applyGrayScale(e.target.value) }}
            className="cursor-pointer"
          />
        </div>

        <div className='flex gap-x-2 items-center'>
          <label className=" ">
            Spia:

          </label>
          <input
            type="checkbox"
            checked={isSpia}
            value={isSpia ? 'true' : 'false'}
            onChange={(e) => { applySpia(e.target.value) }}
            className="cursor-pointer"
          />
        </div>

        <label className='block'>Gamma: </label>
        <input
          className='block w-full'
          type="range"
          min="0.01"
          max="2.2"
          step="0.01"
          value={gamma[0]}
          onChange={(e) => {
            gamma[0] = parseFloat(e.target.value); setGamma([...gamma]);
            applyFilters(isInvert, isGrayScale, brightness, contrast, pixlate, isSpia, blur, saturation, hue, [parseFloat(e.target.value), gamma[1], gamma[2]]);


          }}
        />
        <input
          className='block w-full mt-2'
          type="range"
          min="0.01"
          max="2.2"
          step="0.01"
          value={gamma[1]}
          onChange={(e) => {
            gamma[1] = parseFloat(e.target.value); setGamma([...gamma]);
            applyFilters(isInvert, isGrayScale, brightness, contrast, pixlate, isSpia, blur, saturation, hue, [gamma[0], parseFloat(e.target.value), gamma[2]]);


          }}
        />
        <input
          className='block w-full mt-2'
          type="range"
          min="0.01"
          max="2.2"
          step="0.01"
          value={gamma[2]}
          onChange={(e) => {
            gamma[2] = parseFloat(e.target.value); setGamma([...gamma]);
            applyFilters(isInvert, isGrayScale, brightness, contrast, pixlate, isSpia, blur, saturation, hue, [gamma[0], gamma[1], parseFloat(e.target.value)]);


          }}
        />

        <button
          onClick={saveFile}
          className='p-3 bg-green-600 text-white rounded-md'>Save</button>





      </div>



      <div className="w-3/4 p-4">
        <canvas ref={canvasRef} className="border border-gray-300" />
      </div>
    </div>
  );
};

export default FabricCanvas;
