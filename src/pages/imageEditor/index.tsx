import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { FaFilter } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import { fabric } from 'fabric';
import { PiCirclesThreeFill } from "react-icons/pi";
import { TiTick } from "react-icons/ti";
type myFilterType = {
  isInvert: boolean,
  isGrayScale: boolean,
  brightness: number,
  contrast: number,
  pixlate: number,
  isSpia: boolean,
  blur: number,
  saturation: number,
  hue: number,
  gamma: number[]
}
type filterType = "isInvert" | "isGrayScale" | "brightness" | "contrast" | "pixlate" | "isSpia" | "blur" | "saturation" | "hue" | "gamma"
const FabricCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [brightness, setBrightness] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(0);
  const [saturation, setSaturation] = useState<number>(0);
  const [isInvert, setIsInvert] = useState<boolean>(false);
  const [isGrayScale, setIsGrayScale] = useState<boolean>(false);
  const [isSpia, setIsSpia] = useState<boolean>(false)
  const [pixlate, setPixlate] = useState<number>(1)
  const [blur, setBlur] = useState<number>(0)
  const [hue, setHue] = useState<number>(0)
  // const [gamma, setGamma] = useState<number[]>([1, 1, 1])
  const [image, setImage] = useState<fabric.Image | null>(null);
  const [showAllFilters, setShowAllFilters] = useState<"number" | "boolean" | null>(null)
  const [rangeFilter, setRangeFilter] = useState<{
    show: boolean,
    min: number,
    max: number,
    step: number,
    str: filterType,
    setter: Dispatch<SetStateAction<number>>
    value: number
  }>({
    show: false,
    min: 0,
    max: 1,
    step: 0.01,
    str: 'brightness',
    setter: setBrightness,
    value: 0

  })



  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new fabric.Canvas(canvasRef.current, {
        width: 360,
        height: 550,
        backgroundColor: '#ffffff',
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
            // img.centeredScaling(true)

            img.scaleToWidth(360);

            img.scaleToHeight(550)

            canvas?.clear();
            canvas?.add(img);

            img.center();
            img.setCoords();

            setImage(img);
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };



  const obj = {
    isInvert,
    isGrayScale,
    brightness,
    contrast,
    pixlate,
    isSpia,
    blur,
    saturation,
    hue,
    gamma: [1, 1, 1]
  }


  const applyFilters = (obj: myFilterType) => {

    const { isInvert, isGrayScale, brightness, contrast, pixlate, saturation, hue, gamma, isSpia } = obj
    if (image) {
      image.filters = [];
      const brightnessFilter = new fabric.Image.filters.Brightness({ brightness: brightness! })
      const contrastFilter = new fabric.Image.filters.Contrast({ contrast })
      const invertFilter = new fabric.Image.filters.Invert()
      const grayScaleFilter = new fabric.Image.filters.Grayscale()
      const pixlateFilter = new fabric.Image.filters.Pixelate({ blocksize: pixlate })
      const saturationFilter = new fabric.Image.filters.Saturation({ saturation })
      const spiaFIlter = new fabric.Image.filters.Sepia()
      const blurFilter = new fabric.Image.filters.Blur({ blur: Number(blur) })
      const hueRotationFilter = new fabric.Image.filters.HueRotation({
        rotation: hue
      });
      const gammaFilter = new fabric.Image.filters.Gamma({
        gamma: [gamma[0], gamma[1], gamma[2]]
      })
      image.filters[0] = brightnessFilter
      image.filters[1] = contrastFilter
      myFun(image, isInvert, 2, invertFilter)
      myFun(image, isGrayScale, 3, grayScaleFilter)
      myFun(image, isSpia, 4, spiaFIlter)
      image.filters[5] = pixlateFilter
      image.filters[6] = blurFilter
      image.filters[7] = saturationFilter
      image.filters[8] = hueRotationFilter
      image.filters[9] = gammaFilter
      image.applyFilters();
      canvas?.renderAll();
    }
  };








  function handleValueChange(val: string, setValue: any, item: filterType, type: "boolean" | "number") {
    let value
    if (type === "boolean") {
      value = val === "true" ? false : true

    } else {
      value = parseFloat(val);
    }


    setValue(value);

    let newObj: myFilterType = { ...obj }
    //@ts-ignore
    newObj[item] = value

    applyFilters(newObj);
  }



  function myFun(image: any, flag: boolean | undefined, no: number, filter: any) {
    if (flag) {
      image.filters[no] = filter
    } else {
      image.filters.splice(no, 1)
    }
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
    <div className=''>
      {/* <div className="flex">
        <div className="w-1/4 p-4">
       

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
              applyFilters({ ...obj, gamma: [parseFloat(e.target.value), gamma[1], gamma[2]] });
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
              applyFilters({ ...obj, gamma: [gamma[0], parseFloat(e.target.value), gamma[2]] });
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
              applyFilters({ ...obj, gamma: [gamma[0], gamma[1], parseFloat(e.target.value)] });
            }}
          />
      </div> */}


      <div className='flex items-center justify-center h-screen '>

        {!image &&
          <div className='z-[77] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <input
              type="file"
              className='p-4 py-2 opacity-0 z-[3]  cursor-pointer relative w-[90%] max-w-[360px]'
              accept="image/*"
              onChange={handleImageUpload}
            />
            <div className=' z-[1]  border-dashed absolute left-0 right-0 bottom-0 top-0  rounded-xl flex items-center justify-center border-2 border-green-600 text-green-600'>
              Browse Image
            </div>
          </div>
        }

        <canvas ref={canvasRef} className="w-full border border-red-500" />



        <div className='fixed bottom-0 left-0 right-0  bg-transparent  flex justify-center items-center flex-col  mx-auto w-full sm:w-[500px] p-2'>

          {
            showAllFilters === "boolean" &&
            <div className='bg-[#68616154] w-full flex gap-x-1'>

              <p
                onClick={() => { setIsInvert((prev) => !prev); handleValueChange(isInvert ? "true" : "false", setIsInvert, 'isInvert', "boolean") }}
                className='p-4 py-1 border border-black cursor-pointer'
                style={isInvert ? { background: "green", color: "white" } : {}}
              >
                Invet
              </p>
              <p
                onClick={() => { setIsGrayScale((prev) => !prev); handleValueChange(isGrayScale ? "true" : "false", setIsGrayScale, 'isGrayScale', "boolean") }}
                className='p-4 py-1 border border-black cursor-pointer'
                style={isGrayScale ? { background: "green", color: "white" } : {}}
              >
                Grayscale
              </p>
              <p className='p-4 py-1 border border-black cursor-pointer'
                onClick={() => { setIsSpia((prev) => !prev); handleValueChange(isSpia ? "true" : "false", setIsSpia, 'isSpia', "boolean") }}
                style={isSpia ? { background: "green", color: "white" } : {}}
              >
                Spia
              </p>

            </div>
          }
          {
            rangeFilter.show && showAllFilters === "number" &&
            <div className='bg-[#68616154] w-full'>
              <div className='flex items-center justify-between w-full'>
                <label className='uppercase'>{rangeFilter.str}</label>
                <TiTick
                  color='green'
                  cursor="pointer"
                  size={30}
                  className='inline mx-3'
                  onClick={() => setRangeFilter({ ...rangeFilter, show: false })}
                />
              </div>

              <input
                key={rangeFilter.str}
                defaultValue={rangeFilter.value}
                type="range"
                min={rangeFilter.min}
                max={rangeFilter.max}
                step={rangeFilter.step}
                onChange={(e) => handleValueChange(e.target.value, rangeFilter.setter, rangeFilter.str, "number")}
                className="mt-2 block w-full cursor-pointer py-3 accent-[#ca3232]"
              />
            </div>
          }
          {
            showAllFilters === "number" &&
            <div className='no-scrollbar  overflow-y-auto  w-full'>
              <ul className='flex gap-x-1 '>
                <li
                  onClick={() => {
                    !rangeFilter.show &&
                      setRangeFilter(
                        (prev) => ({
                          ...prev,
                          min: -1,
                          max: 1,
                          step: .01,
                          setter: setBrightness,
                          str: "brightness",
                          show: true
                        }))
                  }}
                  style={rangeFilter.str === "brightness" ? { "background": "green", color: "white" } : {}}
                  className='p-4 py-1 border border-black cursor-pointer'>Brightness</li>
                <li
                  onClick={() => {
                    !rangeFilter.show &&
                      setRangeFilter(
                        (prev) => ({
                          ...prev,
                          value: brightness,
                          min: -1,
                          max: 1,
                          step: .01,
                          setter: setContrast,
                          str: "contrast",
                          show: true
                        }))
                  }}
                  style={rangeFilter.str === "contrast" ? { "background": "green", color: "white" } : {}}
                  className='p-4 py-1 border border-black cursor-pointer'>Contrast</li>
                <li
                  onClick={() => {
                    !rangeFilter.show &&
                      setRangeFilter(
                        (prev) => ({
                          ...prev,
                          value: hue,
                          min: -1,
                          max: 1,
                          step: .01,
                          setter: setHue,
                          str: "hue",
                          show: true
                        }))
                  }}
                  style={rangeFilter.str === "hue" ? { "background": "green", color: "white" } : {}}
                  className='p-4 py-1 border border-black cursor-pointer'>Hue</li>
                <li
                  onClick={() => {
                    !rangeFilter.show &&
                      setRangeFilter(
                        (prev) => ({
                          ...prev,
                          value: saturation,
                          min: -1,
                          max: 1,
                          step: .01,
                          setter: setSaturation,
                          str: "saturation",
                          show: true
                        }))
                  }}
                  style={rangeFilter.str === "saturation" ? { "background": "green", color: "white" } : {}}
                  className='p-4 py-1 border border-black cursor-pointer'>Saturation</li>
                <li
                  onClick={() => {
                    !rangeFilter.show &&
                      setRangeFilter(
                        (prev) => ({
                          ...prev,
                          value: pixlate,
                          min: 1,
                          max: 8,
                          step: .1,
                          setter: setPixlate,
                          str: "pixlate",
                          show: true
                        }))
                  }}
                  style={rangeFilter.str === "pixlate" ? { "background": "green", color: "white" } : {}}
                  className='p-4 py-1 border border-black cursor-pointer'>Pixlate</li>
                <li
                  onClick={() => {
                    !rangeFilter.show &&
                      setRangeFilter(
                        (prev) => ({
                          ...prev,
                          value: blur,
                          min: -1,
                          max: 1,
                          step: .01,
                          setter: setBlur,
                          str: "blur",
                          show: true
                        }))
                  }}
                  style={rangeFilter.str === "blur" ? { "background": "green", color: "white" } : {}}
                  className='p-4 py-1 border border-black cursor-pointer'>Blur</li>
              </ul>
            </div>
          }
          <div className='flex w-full'>
            <span
              onClick={() => {
                if (showAllFilters === "number") {
                  setShowAllFilters(null)
                } else {
                  setShowAllFilters("number");
                }
                setRangeFilter(
                  (prev) => ({
                    ...prev,
                    show: true
                  }))
              }}
              style={showAllFilters === "number" ? { background: "black", color: "white" } : {}}
              className='w-1/2 border border-gray-700 flex justify-center  p-4 cursor-pointer  self-center'>
              <FaFilter />
            </span>
            <span
              onClick={() => {
                if (showAllFilters === "boolean") {
                  setShowAllFilters(null)
                } else {
                  setShowAllFilters("boolean");
                }
              }}
              style={showAllFilters === "boolean" ? { background: "black", color: "white" } : {}}
              className='border border-gray-700 w-1/2 flex justify-center  p-4 cursor-pointer  self-center'>
              <PiCirclesThreeFill />
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={saveFile}
        disabled={!image}
        className='disabled:bg-green-400 fixed right-4 top-4 bg-green-600 text-white p-4 rounded-tr-3xl'>
        <FaSave
          size={25} />
      </button>
    </div>
  );
};

export default FabricCanvas;
