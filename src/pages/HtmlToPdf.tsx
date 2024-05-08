// src/App.js
import { useState } from 'react';
import axios from 'axios';
import fileDownload from 'js-file-download';
import Loading from '../components/Loading';
import { MdFileDownload } from "react-icons/md";

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setUrl(e.target.value);
  };

  const handleGenerateScreenshot = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`https://utility-backend-z88z.onrender.com/screenshot?url=${encodeURIComponent(url)}`, { responseType: 'blob' });
      console.log(data)
      fileDownload(data, "download.pdf")

    } catch (error) {
      console.error('Error generating screenshot:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className='text-gray-600 font-semibold mt-20 text-center'>Webpage URL : </p>
      <input 
      type="text"
       value={url}
        onChange={handleChange} placeholder="eg:- https://google.com" 
      className='border border-gray-400 p-2 rounded-md outline-none min-w-[250px] mb-4 mt-3'
      />

      <button onClick={handleGenerateScreenshot} disabled={!url || loading}
        className='block mx-auto cursor-pointer bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 mt-2'
      >
        {loading ? "Generating..." : 'Generate Screenshot '}
        <MdFileDownload size={22} className='inline-block ml-2'/>
      </button>

      <div className='min-h-screen flex items-center justify-center'>
        {loading && <Loading />}
      </div>

    </div>
  );
}

export default App;
