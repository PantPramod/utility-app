
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ImageToPdf from "./pages/ImageToPdf";
import HtmlToPdf from "./pages/HtmlToPdf";
import QRCodeGenerator from "./pages/QRCodeGenerator";
import YoutubeDownloader from "./pages/YoutubeDownloader";
import ImageEditor from './pages/imageEditor'
const App = () => {
  return (<>
    <BrowserRouter>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<ImageToPdf />} path="/image-to-pdf" />
        <Route element={<HtmlToPdf/>} path="/html-to-pdf" />
        <Route element={<QRCodeGenerator/>} path="/qr-code-generator" />
        <Route element={<YoutubeDownloader/>} path="/yt-downloader"/>
        <Route element={<ImageEditor/>} path="/image-editor"/>
      </Routes>
    </BrowserRouter>
  </>
  )
}

export default App
