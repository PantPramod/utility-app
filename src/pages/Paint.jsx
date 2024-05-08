// App.js 

import { useEffect, useRef, useState } from "react"; 
import Menu from "./Menu.jsx"; 


function Paint() { 
	const canvasRef = useRef(null); 
	const ctxRef = useRef(null); 
	const [isDrawing, setIsDrawing] = useState(false); 
	const [lineWidth, setLineWidth] = useState(5); 
	const [lineColor, setLineColor] = useState("black"); 
	const [lineOpacity, setLineOpacity] = useState(0.1); 

	// Initialization when the component 
	// mounts for the first time 
	useEffect(() => { 
		const canvas = canvasRef.current; 
		const ctx = canvas.getContext("2d"); 
		ctx.lineCap = "round"; 
		ctx.lineJoin = "round"; 
		ctx.globalAlpha = lineOpacity; 
		ctx.strokeStyle = lineColor; 
		ctx.lineWidth = lineWidth; 
		ctxRef.current = ctx; 
	}, [lineColor, lineOpacity, lineWidth]); 

	// Function for starting the drawing 
	const startDrawing = (e) => { 
		ctxRef.current.beginPath(); 
		ctxRef.current.moveTo( 
			e.nativeEvent.offsetX, 
			e.nativeEvent.offsetY 
		); 
		setIsDrawing(true); 
	}; 

	// Function for ending the drawing 
	const endDrawing = () => { 
		ctxRef.current.closePath();
      
		setIsDrawing(false); 
	}; 

	const draw = (e) => { 
		if (!isDrawing) { 
			return; 
		} 
		ctxRef.current.lineTo( 
			e.nativeEvent.offsetX, 
			e.nativeEvent.offsetY 
		); 

		ctxRef.current.stroke(); 
	}; 
const download=()=>{
     // Convert our canvas to a data URL
     let canvasUrl = canvasRef.current.toDataURL();
     // Create an anchor, and set the href value to our data URL
     const createEl = document.createElement('a');
     createEl.href = canvasUrl;
 
     // This is the name of our downloaded file
     createEl.download = "download-this-canvas";
 
     // Click the download button, causing a download, and then remove it
     createEl.click();
     createEl.remove();
}
	return ( 
		<div className="App"> 
			<h1>Paint App</h1> 
            <button onClick={download}>Download</button>
			<div className="draw-area"> 
				<Menu 
					setLineColor={setLineColor} 
					setLineWidth={setLineWidth} 
					setLineOpacity={setLineOpacity} 
				/> 
				<canvas 
					onMouseDown={startDrawing} 
					onMouseUp={endDrawing} 
					onMouseMove={draw} 
					ref={canvasRef} 
					width={`1280px`} 
					height={`720px`} 
				/> 
			</div> 
		</div> 
	); 
} 

export default Paint
