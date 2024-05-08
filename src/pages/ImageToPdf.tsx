import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { MdFileDownload } from "react-icons/md";

const ImageToPDFConverter: React.FC = () => {
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [width, setWidth] = useState<number[]>([]) 
    const [height, setHeight] = useState<number[]>([]) 
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setSelectedImages(files);
        
        files.forEach(image => {
            const reader = new FileReader();
            reader.readAsDataURL(image);

            reader.onload = () => {
                const img = new Image()
                img.src = reader.result as string;

                img.onload = () => {
                    console.log(img.width, img.height)
                    width.push(img.width)
                    height.push(img.height)

                    setWidth([...width])
                    setHeight([...height])
                 
                }
            }
        })
    };

    const convertToPDF = () => {
        if (selectedImages.length === 0) {
            alert('Please select at least one image.');
            return;
        }
        
        


        
        const pdf = new jsPDF('p', 'mm', [Math.max(...width),Math.max(...height) ]);
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        

        selectedImages.forEach((image, index) => {
            const reader = new FileReader();
            reader.readAsDataURL(image);

            reader.onload = () => {
                const img = new Image();
                img.src = reader.result as string;

                img.onload = () => {
                    const imgWidth = img.width
                    const imgHeight = img.height

                    let x = (pageWidth - imgWidth) / 2;
                    let y = (pageHeight - imgHeight) / 2;
                    pdf.addImage(img.src, 'JPEG', x, y, imgWidth, imgHeight);

                    if (index !== selectedImages.length - 1) {
                        pdf.addPage();
                    } else {
                        pdf.save('images_to_pdf.pdf');
                    }
                };
            };
        });
    };

    return (
        <div>

            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                multiple
                className="block mx-auto mt-10" />
            {selectedImages.length > 0 &&
                <button onClick={convertToPDF}
                    className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full px-6 block mx-auto mt-10">
                    Download PDF
                    <MdFileDownload className='inline-block ml-2'/>
                </button>}
            <div className="mt-10 max-w-[500px] flex flex-col gap-5 mx-auto">
                {selectedImages &&
                    [...selectedImages].map((file: File, index) => <img
                        key={Math.random()}
                        src={URL.createObjectURL(file)}
                        className="w-full"
                        id={`img-${index}`}
                    />)

                }
            </div>
        </div>
    );
};

export default ImageToPDFConverter;
