import React, { useState } from 'react';
import { PHOTO_BANK } from '../data/destinationData';

const SAMPLE_LANDMARKS = [
  { key: "charminar", name: "Charminar", location: "Hyderabad", img: PHOTO_BANK.charminar },
  { key: "titlis", name: "Mount Titlis", location: "Switzerland", img: PHOTO_BANK.mount_titlis },
  { key: "dudhsagar", name: "Dudhsagar Falls", location: "Goa", img: PHOTO_BANK.dudhsagar },
  { key: "ins_kursura", name: "INS Kursura Submarine", location: "Vizag", img: PHOTO_BANK.ins_kursura },
  { key: "taj_mahal", name: "Taj Mahal", location: "Agra", img: PHOTO_BANK.taj_mahal },
  { key: "dal_lake", name: "Dal Lake Shikara", location: "Kashmir", img: PHOTO_BANK.dal_lake },
  { key: "chapel_bridge", name: "Chapel Bridge", location: "Lucerne", img: PHOTO_BANK.chapel_bridge },
  { key: "eiffel_tower", name: "Eiffel Tower", location: "Paris", img: PHOTO_BANK.eiffel_tower },
  { key: "colosseum", name: "The Colosseum", location: "Rome", img: PHOTO_BANK.colosseum },
  { key: "burj_khalifa", name: "Burj Khalifa", location: "Dubai", img: PHOTO_BANK.burj_khalifa }
];

export default function VisionAIScannerModal({ isOpen, onClose, destination }) {
  const [selectedSample, setSelectedSample] = useState(SAMPLE_LANDMARKS[0]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [customHint, setCustomHint] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen) return null;

  const currentPreview = uploadedImage || selectedSample.img;
  const currentHint = customHint || (uploadedImage ? "custom tourist landmark" : selectedSample.name);

  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
        setCustomHint(file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "));
        setScanResult(null);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleSelectSample(sample) {
    setSelectedSample(sample);
    setUploadedImage(null);
    setCustomHint("");
    setScanResult(null);
  }

  async function handleExecuteScan() {
    setIsLoading(true);
    setScanResult(null);

    try {
      const res = await fetch('/api/vision/recognize-landmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: currentPreview,
          landmark_hint: currentHint
        })
      });

      if (res.ok) {
        const data = await res.json();
        setScanResult(data);
      } else {
        alert("Vision AI Scan could not analyze image. Please try another photo.");
      }
    } catch (err) {
      console.warn("Vision AI Scan error:", err);
      alert("Failed to connect to Vision AI Agent.");
    } finally {
      setIsLoading(false);
    }
  }

  function toggleAudioGuide(script) {
    if (!window.speechSynthesis) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(script);
      utterance.lang = "en-US";
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[92vh] overflow-y-auto border border-slate-200/90 shadow-2xl flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10 rounded-t-[2.5rem]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-brand-500/25">
              <i className="fa-solid fa-camera-viewfinder"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-slate-900 text-lg">Landmark Vision AI Scanner</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Multimodal AI
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Upload any monument photo or choose a landmark to extract architectural heritage and audio guide.
              </p>
            </div>
          </div>

          <button 
            onClick={() => {
              if (window.speechSynthesis) window.speechSynthesis.cancel();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Left Column (5 Cols): Image Preview & Uploader */}
            <div className="md:col-span-5 space-y-4">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-950 aspect-4/3 shadow-md group">
                <img 
                  src={currentPreview} 
                  alt="Landmark to scan" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                  <div>
                    <span className="text-[10px] uppercase font-black text-amber-300 tracking-wider">Ready for Recognition</span>
                    <h5 className="text-white font-bold text-sm truncate">{currentHint}</h5>
                  </div>
                </div>
              </div>

              {/* Upload Button */}
              <label className="block w-full cursor-pointer">
                <div className="px-4 py-3 rounded-2xl border-2 border-dashed border-slate-300 hover:border-brand-500 hover:bg-brand-50/40 text-center transition flex items-center justify-center gap-2 text-slate-600 text-xs font-bold">
                  <i className="fa-solid fa-cloud-arrow-up text-brand-600"></i>
                  <span>Upload from Computer / Phone</span>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>

              {/* Scan Trigger Button */}
              <button
                onClick={handleExecuteScan}
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 active:scale-98 text-white text-xs font-black shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin text-sm"></i>
                    <span>Analyzing Architectural Contours...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-wand-magic-sparkles text-sm text-amber-300"></i>
                    <span>Scan with Vision AI</span>
                  </>
                )}
              </button>
            </div>

            {/* Right Column (7 Cols): Sample Monument Selector & Result Details */}
            <div className="md:col-span-7 space-y-4">
              
              {/* Sample Monument Selector */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Or select a famous monument to test:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SAMPLE_LANDMARKS.slice(0, 6).map((s) => {
                    const isSelected = !uploadedImage && selectedSample.key === s.key;
                    return (
                      <button
                        key={s.key}
                        onClick={() => handleSelectSample(s)}
                        className={`p-2 rounded-2xl border text-left transition flex items-center gap-2 ${
                          isSelected 
                            ? 'border-brand-500 bg-brand-50/80 shadow-xs' 
                            : 'border-slate-200/80 hover:border-slate-300 bg-slate-50/50'
                        }`}
                      >
                        <img src={s.img} alt={s.name} className="w-9 h-9 rounded-xl object-cover shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{s.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{s.location}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Scanning Active State */}
              {isLoading && (
                <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 text-center space-y-3 animate-pulse">
                  <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center text-xl mx-auto">
                    <i className="fa-solid fa-eye fa-bounce"></i>
                  </div>
                  <h4 className="font-heading font-black text-slate-900 text-sm">
                    Vision Neural Model Processing
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Matching architectural features, minarets, stonework, and historical registry database...
                  </p>
                </div>
              )}

              {/* Scan Recognition Result */}
              {scanResult && !isLoading && (
                <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-50 to-brand-50/30 border border-brand-200/60 space-y-4 animate-fadeIn">
                  
                  {/* Result Header */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200/60">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white shadow-xs">
                          {Math.round(scanResult.confidence_score * 100)}% Match
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          {scanResult.city}, {scanResult.country}
                        </span>
                      </div>
                      <h4 className="font-heading font-black text-slate-900 text-base mt-1">
                        {scanResult.landmark_name}
                      </h4>
                    </div>

                    {/* Wheelchair Accessible Badge */}
                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border shrink-0 flex items-center gap-1 ${
                      scanResult.wheelchair_accessible 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      <i className={`fa-solid ${scanResult.wheelchair_accessible ? 'fa-wheelchair' : 'fa-stairs'}`}></i>
                      <span>{scanResult.wheelchair_accessible ? 'Step-Free / Accessible' : 'Stairs Required'}</span>
                    </span>
                  </div>

                  {/* History & Architecture */}
                  <div className="space-y-2 text-xs leading-relaxed text-slate-700">
                    <p><strong className="text-slate-900">🏛️ Historical Summary:</strong> {scanResult.historical_summary}</p>
                    <p><strong className="text-slate-900">📐 Architectural Style:</strong> {scanResult.architectural_style}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Best Visiting Hours</span>
                        <span className="font-bold text-slate-800">{scanResult.best_visiting_time}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Estimated Entry Fee</span>
                        <span className="font-bold text-brand-700">{scanResult.estimated_entry_fee}</span>
                      </div>
                    </div>
                  </div>

                  {/* Audio Guide Player */}
                  <div className="p-3.5 rounded-2xl bg-white border border-brand-200 shadow-sm flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button 
                        onClick={() => toggleAudioGuide(scanResult.audio_guide_script)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition shrink-0 shadow-md ${
                          isPlayingAudio 
                            ? 'bg-rose-600 text-white shadow-rose-600/25 animate-pulse' 
                            : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/25'
                        }`}
                      >
                        <i className={`fa-solid ${isPlayingAudio ? 'fa-stop text-sm' : 'fa-play text-sm ml-0.5'}`}></i>
                      </button>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {isPlayingAudio ? "Playing 30s Audio Guide..." : "Listen to Audio Guide"}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          Spoken narration of architectural folklore
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-black text-brand-600 bg-brand-50 px-2 py-1 rounded-lg border border-brand-200/60 shrink-0">
                      TTS Active
                    </span>
                  </div>

                  {/* Eco-Tip */}
                  {scanResult.eco_tip && (
                    <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
                      <i className="fa-solid fa-leaf text-emerald-600 shrink-0"></i>
                      <span><strong>Eco Tip:</strong> {scanResult.eco_tip}</span>
                    </div>
                  )}

                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
