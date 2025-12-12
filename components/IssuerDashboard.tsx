
import React, { useState } from 'react';
import { embedData } from '../utils/steganography';
import { generateCertHash } from '../utils/crypto';
import { MOCK_ISSUER_DID } from '../constants';

const IssuerDashboard: React.FC = () => {
  const [recipientName, setRecipientName] = useState("Jane Doe");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const COURSE_NAME = "Quantum Resistant Cryptography 101";

  /**
   * Generates a Ghost-Academy themed certificate
   */
  const drawCertificate = (
    name: string, 
    course: string, 
    dateStr: string, 
    certId: string, 
    score: number
  ): string => {
    const canvas = document.createElement('canvas');
    const width = 1200;
    const height = 800;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return '';

    // 1. Dark Theme Background
    ctx.fillStyle = "#09090b"; 
    ctx.fillRect(0, 0, width, height);
    
    // Abstract Gradient Background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#09090b");
    gradient.addColorStop(0.5, "#18181b");
    gradient.addColorStop(1, "#09090b");
    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,width,height);

    // Grid Pattern (Cyber aesthetic)
    ctx.strokeStyle = "#27272a";
    ctx.lineWidth = 1;
    for(let i=0; i<width; i+=40) {
        ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,height); ctx.stroke();
    }
    for(let i=0; i<height; i+=40) {
        ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(width,i); ctx.stroke();
    }

    // Border
    ctx.strokeStyle = "#4f46e5"; // Indigo-600
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, width - 60, height - 60);
    
    // Corners
    ctx.fillStyle = "#4f46e5";
    ctx.fillRect(25, 25, 20, 4);
    ctx.fillRect(25, 25, 4, 20);
    
    ctx.fillRect(width-45, 25, 20, 4);
    ctx.fillRect(width-29, 25, 4, 20);
    
    ctx.fillRect(25, height-29, 20, 4);
    ctx.fillRect(25, height-45, 4, 20);
    
    ctx.fillRect(width-45, height-29, 20, 4);
    ctx.fillRect(width-29, height-45, 4, 20);

    // 3. Header
    ctx.font = "bold 40px 'Inter', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText("GHOST ACADEMY", width / 2, 140);
    
    ctx.font = "16px 'Fira Code', monospace";
    ctx.fillStyle = "#818cf8"; // Indigo-400
    ctx.fillText("QUANTUM-SECURED CREDENTIAL", width / 2, 170);

    // 4. Subtitle
    ctx.font = "italic 20px 'Inter', sans-serif";
    ctx.fillStyle = "#a1a1aa";
    ctx.fillText("This verifies that", width / 2, 280);

    // 5. Candidate Name
    ctx.font = "bold 60px 'Inter', sans-serif";
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "#4f46e5";
    ctx.shadowBlur = 20;
    ctx.fillText(name, width / 2, 360);
    ctx.shadowBlur = 0; // Reset

    // 6. Achievement Text
    ctx.font = "20px 'Inter', sans-serif";
    ctx.fillStyle = "#a1a1aa";
    ctx.fillText("has mastered the protocols of", width / 2, 440);

    // 7. Course Name
    ctx.font = "bold 40px 'Inter', sans-serif";
    ctx.fillStyle = "#e4e4e7";
    ctx.fillText(course, width / 2, 500);

    // 8. Stats
    ctx.font = "bold 24px 'Fira Code', monospace";
    ctx.fillStyle = "#34d399"; // Emerald-400
    ctx.fillText(`RISK SCORE: ${5} (EXCELLENT)`, width / 2, 580);

    // 9. Footer Area
    const footerY = 700;
    
    // Date
    ctx.textAlign = "left";
    ctx.fillStyle = "#71717a";
    ctx.font = "16px 'Fira Code', monospace";
    ctx.fillText("ISSUED:", 100, footerY);
    ctx.fillStyle = "#fff";
    ctx.fillText(dateStr, 100, footerY + 25);

    // Signature
    ctx.textAlign = "right";
    ctx.fillStyle = "#71717a";
    ctx.fillText("CRYPTOGRAPHIC SIG:", width - 100, footerY);
    ctx.fillStyle = "#fff";
    ctx.fillText("0x7F...3A", width - 100, footerY + 25);

    // 10. Watermark/ID text (Visible)
    ctx.textAlign = "center";
    ctx.font = "12px 'Fira Code', monospace";
    ctx.fillStyle = "#3f3f46";
    ctx.fillText(`ID: ${certId}`, width / 2, height - 20);

    return canvas.toDataURL('image/png');
  };

  const handleIssue = async () => {
    if (!recipientName.trim()) {
      alert("Please enter a recipient name");
      return;
    }

    setIsProcessing(true);
    try {
      const id = crypto.randomUUID();
      const now = new Date();
      const readableDate = now.toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric' 
      });
      const score = 98; 

      // Simulate a blockchain transaction hash
      const mockTxHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');

      const certData = {
        id: id,
        issuerDid: MOCK_ISSUER_DID,
        recipientHash: await generateCertHash({ name: recipientName }), 
        issueDate: now.toISOString(),
        courseName: COURSE_NAME,
        riskScore: 5, 
        signature: "0x123456...mock_ecdsa_signature...",
        pqcSignature: "0x987654...mock_dilithium_signature...",
        txHash: mockTxHash
      };

      const jsonPayload = JSON.stringify(certData);

      const baseCertificateImage = drawCertificate(
        recipientName,
        COURSE_NAME,
        readableDate,
        id,
        score
      );

      const stegoImage = await embedData(baseCertificateImage, jsonPayload);
      setGeneratedImage(stegoImage);
    } catch (e) {
      console.error(e);
      alert("Error generating certificate");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Issuer Dashboard</h1>
          <p className="text-zinc-400 mt-2">Node Status: <span className="text-emerald-400">Connected</span> • DID: {MOCK_ISSUER_DID.substring(0, 16)}...</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-lg font-semibold mb-4 text-white">Mint Credential</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Recipient Name</label>
                <input 
                  type="text" 
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Course</label>
                <div className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 text-zinc-500">
                  {COURSE_NAME}
                </div>
              </div>

              <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-500/20">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wide mb-2">Metadata Injection</h4>
                <div className="flex items-center space-x-2 text-xs text-indigo-300">
                   <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                   <span>PQC Signatures Ready</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-indigo-300 mt-1">
                   <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                   <span>Steganography Engine Idling</span>
                </div>
              </div>

              <button 
                onClick={handleIssue}
                disabled={isProcessing}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-4 rounded-lg font-bold transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:shadow-none"
              >
                {isProcessing ? "Minting & Embedding..." : "Mint Certificate"}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="glass-panel p-6 rounded-2xl h-full flex flex-col items-center justify-center min-h-[500px]">
            {generatedImage ? (
              <div className="space-y-6 w-full">
                <div className="relative rounded-lg overflow-hidden shadow-2xl border border-zinc-800">
                  <img src={generatedImage} alt="Generated Cert" className="w-full h-auto" />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-emerald-900/20 rounded-lg border border-emerald-500/20">
                  <div className="flex items-center">
                    <div className="bg-emerald-500/10 p-2 rounded-full mr-3 text-emerald-400">
                       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-400">Certificate Finalized</p>
                      <p className="text-xs text-emerald-600">Invisible watermark embedded.</p>
                    </div>
                  </div>
                  <a 
                    href={generatedImage} 
                    download={`GhostAcademy-Cert-${recipientName}.png`}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors"
                  >
                    Download
                  </a>
                </div>
              </div>
            ) : (
               <div className="text-center text-zinc-500">
                 <div className="w-20 h-20 border-2 border-dashed border-zinc-700 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                 </div>
                 <p>Preview Area</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssuerDashboard;
