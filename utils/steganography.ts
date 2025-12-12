/**
 * Simple LSB Steganography Module.
 * Encodes a string into the Blue channel LSB of an image.
 * 
 * NOTE: This is a "fragile" watermark. Resizing or compressing the image (JPEG) will destroy it.
 * That is actually a feature for document integrity—if the file is modified, the watermark breaks.
 */

// Header to identify our watermark
const MAGIC_HEADER = "CERT:"; 

export const embedData = async (imageSrc: string, data: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject("No canvas context");

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imgData.data;

      // Prepare data: MAGIC_HEADER + data + NULL terminator
      const payload = MAGIC_HEADER + data + '\0';
      const binaryMap: number[] = [];
      
      for (let i = 0; i < payload.length; i++) {
        const charCode = payload.charCodeAt(i);
        for (let j = 0; j < 8; j++) {
          binaryMap.push((charCode >> (7 - j)) & 1);
        }
      }

      // Embed into LSB of Blue channel (index 2, 6, 10...)
      // We start at pixel 0.
      let dataIndex = 0;
      for (let i = 0; i < pixels.length; i += 4) {
        if (dataIndex >= binaryMap.length) break;
        
        // Clear LSB then OR with data bit
        pixels[i + 2] = (pixels[i + 2] & ~1) | binaryMap[dataIndex];
        dataIndex++;
      }

      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = (err) => reject(err);
  });
};

export const extractData = async (file: File): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject("No canvas context");

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imgData.data;
        
        let binaryString = "";
        let charBuffer = 0;
        let bitCount = 0;
        let extractedText = "";

        // Read all pixels or until null terminator
        for (let i = 0; i < pixels.length; i += 4) {
          const bit = pixels[i + 2] & 1; // Get LSB of Blue
          charBuffer = (charBuffer << 1) | bit;
          bitCount++;

          if (bitCount === 8) {
            if (charBuffer === 0) break; // Null terminator
            extractedText += String.fromCharCode(charBuffer);
            charBuffer = 0;
            bitCount = 0;
            
            // Safety break for huge images if garbage data
            if (extractedText.length > 5000) break;
          }
        }

        if (extractedText.startsWith(MAGIC_HEADER)) {
            resolve(extractedText.substring(MAGIC_HEADER.length));
        } else {
            resolve(null);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};
