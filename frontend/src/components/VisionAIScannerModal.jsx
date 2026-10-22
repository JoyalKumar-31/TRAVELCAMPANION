import React, { useState, useEffect } from 'react';
import { PHOTO_BANK } from '../data/destinationData';

const SAMPLE_LANDMARKS = [
  // India Heritage
  { key: "taj_mahal", name: "Taj Mahal", location: "Agra, India", category: "India", img: PHOTO_BANK.taj_mahal },
  { key: "charminar", name: "Charminar", location: "Hyderabad, India", category: "India", img: PHOTO_BANK.charminar },
  { key: "golconda", name: "Golconda Fort", location: "Hyderabad, India", category: "India", img: PHOTO_BANK.golconda_fort },
  { key: "qutub_minar", name: "Qutub Minar", location: "Delhi, India", category: "India", img: PHOTO_BANK.qutub_minar },
  { key: "red_fort", name: "Red Fort", location: "Delhi, India", category: "India", img: PHOTO_BANK.red_fort },
  { key: "india_gate", name: "India Gate", location: "Delhi, India", category: "India", img: PHOTO_BANK.india_gate },
  { key: "hawa_mahal", name: "Hawa Mahal", location: "Jaipur, India", category: "India", img: PHOTO_BANK.hawa_mahal },
  { key: "amer_fort", name: "Amer Fort", location: "Jaipur, India", category: "India", img: PHOTO_BANK.amber_fort },
  { key: "dudhsagar", name: "Dudhsagar Falls", location: "Goa, India", category: "India", img: PHOTO_BANK.dudhsagar },
  { key: "fort_aguada", name: "Fort Aguada", location: "Goa, India", category: "India", img: PHOTO_BANK.fort_aguada },
  { key: "ins_kursura", name: "INS Kursura Submarine", location: "Vizag, India", category: "India", img: PHOTO_BANK.ins_kursura },
  { key: "kailasagiri", name: "Kailasagiri Hilltop", location: "Vizag, India", category: "India", img: PHOTO_BANK.kailasagiri },
  { key: "dal_lake", name: "Dal Lake Shikara", location: "Kashmir, India", category: "India", img: PHOTO_BANK.dal_lake },
  // International Wonders
  { key: "titlis", name: "Mount Titlis", location: "Switzerland", category: "International", img: PHOTO_BANK.mount_titlis },
  { key: "chapel_bridge", name: "Chapel Bridge", location: "Lucerne, Switzerland", category: "International", img: PHOTO_BANK.chapel_bridge },
  { key: "eiffel_tower", name: "Eiffel Tower", location: "Paris, France", category: "International", img: PHOTO_BANK.eiffel_tower },
  { key: "louvre", name: "Louvre Museum", location: "Paris, France", category: "International", img: PHOTO_BANK.louvre },
  { key: "colosseum", name: "The Colosseum", location: "Rome, Italy", category: "International", img: PHOTO_BANK.colosseum },
  { key: "burj_khalifa", name: "Burj Khalifa", location: "Dubai, UAE", category: "International", img: PHOTO_BANK.burj_khalifa }
];

const SCAN_STAGES = [
  "Reading visual pixel array & optical features...",
  "Analyzing structural geometry, domes & arches...",
  "Cross-referencing Global Cultural Heritage database...",
  "Synthesizing architectural folklore & audio narration guide..."
];

// Helper to identify generic camera/download filenames (e.g. OIP, IMG_1234, photo, screenshot, download)
function isGenericFilename(fileName) {
  if (!fileName) return true;
  const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "").trim();
  const lower = nameWithoutExt.toLowerCase();

  // If 3 letters or fewer and not a known landmark abbreviation (e.g. USA, UK, UAE)
  if (lower.length <= 3 && !['usa', 'uk', 'uae', 'ins'].includes(lower)) {
    return true;
  }

  // Common generic image file prefixes and suffixes from cameras and search engines
  const genericPrefixes = [
    'oip', 'img', 'image', 'photo', 'pic', 'picture', 'screenshot', 'screen',
    'snap', 'camera', 'capture', 'dsc', 'dscn', 'file', 'upload', 'download',
    'unnamed', 'images', 'thumbnail', 'thumb', 'wallpaper', 'asset', 'preview',
    'raw', 'output', 'temp', 'pasted'
  ];

  const genericPattern = new RegExp(`^(${genericPrefixes.join('|')})[\\s_\\-\\d\\(\\)]*$`, 'i');
  if (genericPattern.test(nameWithoutExt)) {
    return true;
  }

  // Hexadecimal hashes or timestamp filenames (e.g. 1792675894384, a2bba9de)
  if (/^[a-f0-9_\-]{6,}$/i.test(nameWithoutExt) || /^\d+$/.test(nameWithoutExt)) {
    return true;
  }

  // If string contains no vowels (e.g. DSC, PNG, JPG)
  if (!/[aeiouAEIOU]/.test(nameWithoutExt)) {
    return true;
  }

  return false;
}

export default function VisionAIScannerModal({ isOpen, onClose, destination }) {
  const [selectedSample, setSelectedSample] = useState(SAMPLE_LANDMARKS[0]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [landmarkHint, setLandmarkHint] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [scanStageIndex, setScanStageIndex] = useState(0);
  const [scanResult, setScanResult] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Match initial landmark to active destination if passed
  useEffect(() => {
    if (destination) {
      const destLower = destination.toLowerCase();
      const match = SAMPLE_LANDMARKS.find(l => 
        l.location.toLowerCase().includes(destLower) || l.name.toLowerCase().includes(destLower)
      );
      if (match) {
        setSelectedSample(match);
      }
    }
  }, [destination, isOpen]);

  // Stage progression timer during scan
  useEffect(() => {
    let timer;
    if (isLoading) {
      setScanStageIndex(0);
      timer = setInterval(() => {
        setScanStageIndex(prev => (prev < SCAN_STAGES.length - 1 ? prev + 1 : prev));
      }, 600);
    }
    return () => clearInterval(timer);
  }, [isLoading]);

  if (!isOpen) return null;

  const currentPreview = uploadedImage || selectedSample.img;
  const currentDisplayName = landmarkHint.trim() || (uploadedImage ? "Uploaded Monument Photo" : selectedSample.name);

  // Client-side fast image compressor & resizer
  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Detect if file name contains meaningful words vs generic camera/download names (OIP, IMG_123, photo, screenshot)
    if (isGenericFilename(file.name)) {
      setLandmarkHint("");
    } else {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ").trim();
      setLandmarkHint(cleanName);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 960;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Export high-quality compressed JPEG (typically ~100KB vs 10MB)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.86);
        setUploadedImage(compressedDataUrl);
        setScanResult(null);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  function handleSelectSample(sample) {
    setSelectedSample(sample);
    setUploadedImage(null);
    setLandmarkHint(sample.name);
    setScanResult(null);
  }

  async function handleExecuteScan() {
    setIsLoading(true);
    setScanResult(null);

    const effectiveHint = landmarkHint.trim() || (!uploadedImage ? selectedSample.name : "");

    try {
      const res = await fetch('/api/vision/recognize-landmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: currentPreview,
          landmark_hint: effectiveHint
        })
      });

      if (res.ok) {
        const data = await res.json();
        setScanResult(data);
      } else {
        alert("Vision AI Scan could not process this image. Please check backend status.");
      }
    } catch (err) {
      console.warn("Vision AI Scan error:", err);
      alert("Failed to connect to Vision AI Agent. Please ensure FastAPI server is running.");
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
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(script);
      utterance.lang = "en-US";
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  }

  const filteredSamples = SAMPLE_LANDMARKS.filter(s => {
    if (activeCategory === "All") return true;
    return s.category === activeCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[92vh] overflow-y-auto border border-slate-200/90 shadow-2xl flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-20 rounded-t-[2.5rem]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-brand-500/25">
              <i className="fa-solid fa-camera-viewfinder"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-slate-900 text-lg">Landmark Vision AI Scanner</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Multimodal AI Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Upload any tourist monument photo or select a landmark to extract architectural heritage, visiting tips, and audio guides.
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
            
            {/* Left Column (5 Cols): Image Preview, Laser Scanner & Controls */}
            <div className="md:col-span-5 space-y-4">
              
              {/* Image Preview Window */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-950 aspect-4/3 shadow-md group">
                <img 
                  src={currentPreview} 
                  alt="Landmark to scan" 
                  className={`w-full h-full object-cover transition-all duration-300 ${isLoading ? 'brightness-75' : ''}`}
                />

                {/* Laser Scanning Bar Animation */}
                {isLoading && (
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-scan-laser pointer-events-none z-10"></div>
                )}

                {/* Overlay Header / Status */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                  <div>
                    <span className="text-[10px] uppercase font-black text-amber-300 tracking-wider">
                      {isLoading ? "⚡ Neural Scan in Progress..." : (scanResult ? "Identified Monument" : "Ready for Recognition")}
                    </span>
                    <h5 className="text-white font-bold text-sm truncate">
                      {scanResult ? scanResult.landmark_name : currentDisplayName}
                    </h5>
                  </div>
                </div>

                {uploadedImage && (
                  <button
                    onClick={() => {
                      setUploadedImage(null);
                      setLandmarkHint("");
                      setScanResult(null);
                    }}
                    className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-slate-900/80 hover:bg-rose-600 text-white text-[10px] font-bold backdrop-blur-md transition flex items-center gap-1 shadow-md"
                  >
                    <i className="fa-solid fa-rotate-left"></i>
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Upload Input */}
              <label className="block w-full cursor-pointer">
                <div className="px-4 py-3 rounded-2xl border-2 border-dashed border-slate-300 hover:border-brand-500 hover:bg-brand-50/40 text-center transition flex items-center justify-center gap-2 text-slate-700 text-xs font-bold bg-white">
                  <i className="fa-solid fa-cloud-arrow-up text-brand-600 text-sm"></i>
                  <span>Upload Photo from Computer / Phone</span>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>

              {/* Editable Landmark Hint Field */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                  <span>Landmark Name or Clue:</span>
                  <span className="text-[10px] text-slate-400 font-normal">Optional / Auto-detected</span>
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={landmarkHint} 
                    onChange={(e) => setLandmarkHint(e.target.value)} 
                    placeholder={uploadedImage ? "Auto-detecting landmark from photo... (or type name)" : selectedSample.name}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none font-semibold text-slate-800 bg-white"
                  />
                  {landmarkHint && (
                    <button 
                      onClick={() => setLandmarkHint("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      <i className="fa-solid fa-circle-xmark"></i>
                    </button>
                  )}
                </div>
              </div>

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

            {/* Right Column (7 Cols): Category Tabs, Sample Selector & Scan Results */}
            <div className="md:col-span-7 space-y-4">
              
              {/* Sample Monument Selector with Filter Tabs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Or select a famous monument to test:
                  </span>
                  {/* Category Pills */}
                  <div className="flex gap-1">
                    {["All", "India", "International"].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition ${
                          activeCategory === cat 
                            ? 'bg-brand-600 text-white' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                  {filteredSamples.map((s) => {
                    const isSelected = !uploadedImage && selectedSample.key === s.key;
                    return (
                      <button
                        key={s.key}
                        onClick={() => handleSelectSample(s)}
                        className={`p-2 rounded-2xl border text-left transition flex items-center gap-2 ${
                          isSelected 
                            ? 'border-brand-500 bg-brand-50/90 shadow-xs ring-1 ring-brand-500/30' 
                            : 'border-slate-200/80 hover:border-slate-300 bg-slate-50/60'
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

              {/* Scanning Active Progress Card */}
              {isLoading && (
                <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-lg animate-pulse">
                      <i className="fa-solid fa-eye"></i>
                    </div>
                    <div>
                      <h4 className="font-heading font-black text-sm text-cyan-300">
                        Neural Vision Scanner Active
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Analyzing photo with Vision AI Model...
                      </p>
                    </div>
                  </div>

                  {/* Stage Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-cyan-400 to-brand-500 h-full transition-all duration-500"
                        style={{ width: `${((scanStageIndex + 1) / SCAN_STAGES.length) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-[11px] font-mono text-cyan-200 truncate">
                      <i className="fa-solid fa-chevron-right text-[9px] mr-1 text-cyan-400"></i>
                      {SCAN_STAGES[scanStageIndex]}
                    </p>
                  </div>
                </div>
              )}

              {/* Scan Recognition Result Card */}
              {scanResult && !isLoading && (
                <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-50 to-brand-50/30 border border-brand-200/80 space-y-4 animate-fadeIn shadow-sm">
                  
                  {/* Result Header */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200/70">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white shadow-xs">
                          {Math.round(scanResult.confidence_score * 100)}% Match
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          <i className="fa-solid fa-location-dot text-rose-500 mr-1"></i>
                          {scanResult.city}, {scanResult.country}
                        </span>
                      </div>
                      <h4 className="font-heading font-black text-slate-900 text-base mt-1.5">
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

                  {/* Historical Summary & Architecture */}
                  <div className="space-y-2 text-xs leading-relaxed text-slate-700">
                    <p><strong className="text-slate-900">🏛️ Historical Summary:</strong> {scanResult.historical_summary}</p>
                    <p><strong className="text-slate-900">📐 Architectural Style:</strong> {scanResult.architectural_style}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Best Visiting Hours</span>
                        <span className="font-bold text-slate-800 text-xs">{scanResult.best_visiting_time}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Estimated Entry Fee</span>
                        <span className="font-bold text-brand-700 text-xs">{scanResult.estimated_entry_fee}</span>
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

                    <span className="text-[10px] font-black text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200/60 shrink-0">
                      TTS Active
                    </span>
                  </div>

                  {/* Visitor Advice Tips */}
                  {scanResult.safety_and_visiting_tips && scanResult.safety_and_visiting_tips.length > 0 && (
                    <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Visitor Advice & Tips:
                      </span>
                      <ul className="text-[11px] text-slate-600 space-y-0.5 list-disc list-inside">
                        {scanResult.safety_and_visiting_tips.map((tip, idx) => (
                          <li key={idx} className="leading-snug">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}

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
