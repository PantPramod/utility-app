// QRCodeGenerator.js
import  { useState } from 'react';
import QRCode from 'qrcode.react';

function QRCodeGenerator() {
  const [text, setText] = useState('');

  const handleInputChange = (e:any) => {
    setText(e.target.value);
  };

  return (
    <div>
      <h2>QR Code Generator</h2>
      <input 
        type="text" 
        value={text} 
        onChange={handleInputChange} 
        placeholder="Enter text or URL" 
        style={{ marginBottom: '10px' }} 
      />
      {text && <QRCode value={text} style={{ marginBottom: '10px' }} />}
      {text && <p style={{ wordWrap: 'break-word' }}>{text}</p>}
    </div>
  );
}

export default QRCodeGenerator;
