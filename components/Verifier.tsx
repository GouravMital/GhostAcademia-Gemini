
import React, { useState } from 'react';
import { extractData } from '../utils/steganography';
import { generateCertHash, verifySignature } from '../utils/crypto';
import { VerificationResult, CertificateData } from '../types';
import { BLOCKCHAIN_EXPLORER_URL } from '../constants';

const Verifier: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [extractedJson, setExtractedJson] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleVerify = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const stegoData = await extractData(file);
      if (!stegoData) throw new Error("No secure watermark found. File may be tampered.");

      setExtractedJson(stegoData);
      
      let certData: CertificateData;
      try {
        certData = JSON.parse(stegoData);
      } catch (e) {
        throw new Error("Watermark corrupted.");
      }

      await new Promise(r => setTimeout(r, 800));
      
      const calculatedHash = await generateCertHash(certData);
      const isSignatureValid = verifySignature(calculatedHash, certData.signature, certData.issuerDid);

      setResult({
        isValid: isSignatureValid,
        issuerTrusted: true,
        integrity: {
          blockchainMatch: true,
          signatureValid: isSignatureValid,
          stegoMatch: true
        },
        details: certData
      });

    } catch (err: any) {
      setError(err.message || "Verification failed");
      setResult({
        isValid: false,
        issuerTrusted: false,
        integrity: { blockchainMatch: false, signatureValid: false, stegoMatch: false },
        details: null
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight">Verify Credential</h1>
        <p className="mt-4 text-zinc-400">
          Upload a digital certificate (PNG) to reveal hidden Ghost-Academy metadata.
        </p>
      </div>

      <div className="glass-panel rounded-2xl p-8 shadow-2xl shadow-black/50">
          <div className="flex justify-center w-full mb-6">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-zinc-700 border-dashed rounded-xl cursor-pointer bg-zinc-800/30 hover:bg-zinc-800/50 hover:border-indigo-500/50 transition-all duration-300 group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <div className="w-16 h-16 mb-4 rounded-full bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-zinc-400 group-hover:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                </div>
                <p className="mb-2 text-sm text-zinc-300"><span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-zinc-500">PNG (Certificate Image)</p>
              </div>
              <input id="dropzone-file" type="file" accept="image/png" className="hidden" onChange={handleFileChange} />
            </label>
          </div>

          {file && (
            <div className="flex items-center justify-between bg-zinc-800/50 p-4 rounded-lg border border-zinc-700 mb-6">
              <span className="text-sm font-medium text-zinc-200">{file.name}</span>
              <button 
                onClick={handleVerify}
                disabled={loading}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Decrypting..." : "Verify Integrity"}
              </button>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-900/20 border-l-4 border-red-500 text-red-300 rounded mb-6">
              <p className="font-bold">Verification Error</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          )}

          {result && (
            <div className={`mt-8 border-t border-zinc-700 pt-6 ${result.isValid ? '' : 'opacity-75'}`}>
              <div className="flex items-center mb-6">
                <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${result.isValid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                   {result.isValid ? (
                     <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                   ) : (
                     <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                   )}
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-white">
                    {result.isValid ? "Valid Ghost-Academy Credential" : "Credential Invalid"}
                  </h3>
                  <p className="text-sm text-zinc-400">
                    {result.isValid ? "Cryptographic proofs confirmed. Steganographic layer intact." : "Integrity check failed. Hashes do not match."}
                  </p>
                </div>
              </div>

              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50">
                  <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Issuer DID</dt>
                  <dd className="mt-1 text-sm text-indigo-300 font-mono truncate">{result.details?.issuerDid || "Unknown"}</dd>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50">
                  <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Course</dt>
                  <dd className="mt-1 text-sm text-white">{result.details?.courseName || "Unknown"}</dd>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50">
                   <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Risk Score</dt>
                   <dd className={`mt-1 text-sm font-bold ${result.details?.riskScore && result.details.riskScore > 20 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                    {result.details?.riskScore ?? "N/A"} / 100
                   </dd>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50">
                   <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Issue Date</dt>
                   <dd className="mt-1 text-sm text-white">{result.details?.issueDate ? new Date(result.details.issueDate).toLocaleDateString() : "-"}</dd>
                </div>
                {/* Blockchain Link Added Here */}
                <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50 sm:col-span-2">
                   <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Blockchain Record</dt>
                   <dd className="mt-1 text-sm text-indigo-400 truncate">
                     {result.details?.txHash ? (
                       <a href={`${BLOCKCHAIN_EXPLORER_URL}${result.details.txHash}`} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-300 underline decoration-indigo-500/30 underline-offset-2 flex items-center">
                         View Transaction 
                         <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                       </a>
                     ) : (
                       <span className="text-zinc-500 italic">Pending / Not available</span>
                     )}
                   </dd>
                </div>

                 <div className="sm:col-span-2 mt-4">
                  <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Decoded Metadata</dt>
                  <dd className="font-mono text-xs bg-black/50 p-4 rounded-lg text-emerald-500 break-all border border-zinc-800 shadow-inner">
                    {extractedJson}
                  </dd>
                </div>
              </dl>
            </div>
          )}
      </div>
    </div>
  );
};

export default Verifier;
