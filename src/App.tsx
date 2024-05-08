
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ImageToPdf from "./pages/ImageToPdf";
import ImageResizer from "./pages/ImageResizer";
//@ts-ignore
import Paint from './pages/Paint.jsx'
import HtmlToPdf from "./pages/HtmlToPdf.js";
import QRCodeGenerator from "./pages/QRCodeGenerator.js";
const App = () => {
  return (<>
    <BrowserRouter>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<ImageToPdf />} path="/image-to-pdf" />
        <Route element={<ImageResizer/>} path="/image-resizer" />
        <Route element={<Paint/>} path="/paint" />
        <Route element={<HtmlToPdf/>} path="/html-to-pdf" />
        <Route element={<QRCodeGenerator/>} path="/qr-code-generator" />
      </Routes>
    </BrowserRouter>
  </>
  )
}

export default App
