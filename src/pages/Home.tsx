
import { FaImages } from "react-icons/fa6";
import { LiaImagesSolid } from "react-icons/lia";
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <div className="w-11/12 mx-auto py-10 flex flex-col gap-10 min-h-screen items-center justify-center">
            <Link to="/image-to-pdf">
                <button className="min-w-[200px] bg-orange-600 text-white rounded-full p-4 shadow-md uppercase hover:bg-orange-700">
                    <FaImages className="inline mr-2" size={24} />
                    <span>Images to pdf </span>
                </button>
            </Link>

            <Link to="/image-resizer">
                <button className="min-w-[200px] bg-blue-600 text-white rounded-full p-4 shadow-md uppercase hover:bg-blue-700">

                    <LiaImagesSolid className="inline mr-2" size={24} />
                    <span>image Resizer</span>
                </button>
            </Link>

            <Link to="/html-to-pdf">
                <button className="min-w-[200px]  bg-green-600 text-white rounded-full p-4 shadow-md uppercase hover:bg-green-700">

                    <LiaImagesSolid className="inline mr-2" size={24} />
                    <span>HTML to PDF</span>
                </button>
            </Link>

            <Link to="/qr-code-generator">
                <button className="min-w-[200px]  bg-pink-600 text-white rounded-full p-4 shadow-md uppercase hover:bg-pink-700">

                    <LiaImagesSolid className="inline mr-2" size={24} />
                    <span>QR Code Generator</span>
                </button>
            </Link>



        </div>
    )
}

export default Home
