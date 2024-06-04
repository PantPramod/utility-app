
import { useState } from 'react'
const YoutubeDownloader = () => {
    const [url, setUrl] = useState('')
    const download = () => {
       
    }
    return (
        <div>
            <input value={url} onChange={(e) => setUrl(e.target.value)} type='text' placeholder='Enter Youtube Video Url' className='border border-gray-400 p-3 rounded-md ' />
            <button onClick={download}>Download</button>
        </div>
    )
}

export default YoutubeDownloader
