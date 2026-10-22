import React, { useState } from 'react';
import { DESTINATION_PLACES, getDestinationKey } from '../data/destinationData';

export default function PlacesGallery({ destination, onSelectPlace }) {
  const destKey = getDestinationKey(destination);
  const cleanCity = (destination || "").split("(")[0].split(",")[0].trim();
  const places = (DESTINATION_PLACES && DESTINATION_PLACES[destKey]) || (DESTINATION_PLACES && DESTINATION_PLACES["switzerland"]) || [];

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activePhotoModal, setActivePhotoModal] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Derive unique categories for filter tabs
  const categories = ["all", ...new Set(places.map(p => (p && p.category ? (p.category.split(' ')[0] || p.category) : "Attraction")))];

  const filteredPlaces = selectedCategory === "all" 
    ? places 
    : places.filter(p => (p.category || "").toLowerCase().includes(selectedCategory.toLowerCase()));

  // Audio Guide Simulation using Browser SpeechSynthesis
  function handlePlayAudioGuide(text) {
    if (!window.speechSynthesis) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  }

  function handleCloseModal() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsPlayingAudio(false);
    setActivePhotoModal(null);
  }

  return (
    <div id="gallery-section" className="bg-white rounded-[2.5rem] p-5 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      
      {/* Header with Title and Featured Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-amber-500 to-orange-500 text-white flex items-center justify-center font-bold text-base shadow-md shadow-rose-500/20">
              <i className="fa-solid fa-camera-retro"></i>
            </div>
            <div>
              <h3 className="font-heading font-black text-slate-900 text-lg sm:text-xl">
                Iconic Places & Attractions in {cleanCity}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Authentic photographs, entry tickets in ₹ INR, and multi-agent historical briefings
              </p>
            </div>
          </div>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-black text-brand-700 bg-brand-50 px-3.5 py-1.5 rounded-xl border border-brand-200/80 flex items-center gap-1.5 shadow-xs">
            <i className="fa-solid fa-images text-brand-600"></i>
            <span>{places.length} Verified Landmarks</span>
          </span>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider mr-1 shrink-0">
          Filter:
        </span>
        {categories.slice(0, 6).map((cat, idx) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 capitalize ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20 scale-102'
                  : 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-600'
              }`}
            >
              {cat === "all" ? "🌟 All Attractions" : cat}
            </button>
          );
        })}
      </div>

      {/* Places Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPlaces.map((place, idx) => (
          <div 
            key={idx}
            className="group rounded-3xl overflow-hidden border border-slate-200/80 hover:border-brand-400 bg-white hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
            onClick={() => setActivePhotoModal(place)}
          >
            {/* Image Container with Zoom & Badge */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-900">
              <img 
                src={place.img} 
                alt={place.title} 
                loading="lazy"
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80"; }}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-slate-950/75 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider border border-white/10 shadow-xs">
                {place.category}
              </span>

              <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-amber-400/95 text-slate-950 text-[10px] font-black flex items-center gap-1 shadow-md">
                <i className="fa-solid fa-star text-[9px]"></i> {place.rating} ({place.reviews})
              </span>

              <span className="absolute bottom-3 left-3 text-[11px] font-bold text-white/90 drop-shadow flex items-center gap-1 opacity-0 group-hover:opacity-100 transition duration-300">
                <i className="fa-solid fa-expand text-[10px]"></i> View Full Details
              </span>
            </div>

            {/* Place Details */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h4 className="font-heading font-black text-slate-900 text-sm sm:text-base group-hover:text-brand-600 transition line-clamp-1">
                  {place.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed font-normal">
                  {place.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Entry Fee:</span>
                  <span className="font-black text-emerald-700 text-sm">{place.fee}</span>
                </div>
                <button 
                  className="px-3 py-1.5 rounded-xl bg-slate-100 group-hover:bg-brand-600 group-hover:text-white text-slate-700 font-extrabold text-[11px] transition flex items-center gap-1"
                >
                  <span>Explore</span>
                  <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Full Photo Modal Viewer & Audio Tour */}
      {activePhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20">
            
            {/* Modal Image Header */}
            <div className="relative h-64 sm:h-72 w-full bg-slate-950">
              <img 
                src={activePhotoModal.img} 
                alt={activePhotoModal.title}
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80"; }}
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

              <button 
                onClick={handleCloseModal}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>

              <span className="absolute bottom-3 left-4 px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider border border-white/20">
                {activePhotoModal.category}
              </span>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-7 space-y-4">
              
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-heading font-black text-slate-900 text-xl">{activePhotoModal.title}</h3>
                  <span className="text-xs text-slate-400 font-bold">{cleanCity} Tourist Attraction</span>
                </div>
                <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-xs font-black shrink-0 flex items-center gap-1">
                  <i className="fa-solid fa-star text-amber-500 text-[10px]"></i> {activePhotoModal.rating} ({activePhotoModal.reviews} ratings)
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {activePhotoModal.desc}
              </p>

              {/* Admission & Proximity Box */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-black block tracking-wider">Entrance Fee / Permit:</span>
                  <span className="font-black text-emerald-700 text-base">{activePhotoModal.fee}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-black block tracking-wider">Visiting Hours:</span>
                  <span className="font-bold text-slate-800">9:00 AM – 6:30 PM</span>
                </div>
              </div>

              {/* Action Buttons: Audio Guide & Close */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  onClick={() => handlePlayAudioGuide(`${activePhotoModal.title}. ${activePhotoModal.desc}. Entrance fee is ${activePhotoModal.fee}.`)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 ${
                    isPlayingAudio
                      ? 'bg-rose-50 text-rose-600 border border-rose-300 animate-pulse'
                      : 'bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200'
                  }`}
                >
                  <i className={`fa-solid ${isPlayingAudio ? 'fa-pause' : 'fa-volume-high'}`}></i>
                  <span>{isPlayingAudio ? "Stop Audio Guide" : "Listen to AI Guide"}</span>
                </button>

                <button 
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
                >
                  Close Photo
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
