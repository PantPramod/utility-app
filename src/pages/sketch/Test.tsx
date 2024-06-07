import { useEffect, useRef } from "react"
import { fabric } from 'fabric'

const Test = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = new fabric.Canvas(canvasRef.current, {})
        

        return () => {
            canvas.dispose();
          };
    }, [])

    return (
        <div>
            <canvas width={600} height={600} ref={canvasRef} />
        </div>
    )
}

export default Test
