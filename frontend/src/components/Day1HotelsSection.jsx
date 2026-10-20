import React, { useState } from 'react';

export default function Day1HotelsSection({ 
  destination, 
  hotels, 
  onOpenBookingModal 
}) {
  const cleanCity = (destination || "").split("(")[0].split(",")[0].trim();
  const [selectedSharingMap, setSelectedSharingMap] = useState({});

  function handleSelectSharing(hotelId, optIdx) {
    setSelectedSharingMap(prev => ({
      ...prev,
      [hotelId]: optIdx
    }));
  }

  return (
    <div id="hotels-section" className="bg-white rounded-[2.5rem] p-5 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-sky-500 text-white flex items-center justify-center font-bold text-base shadow-md shadow-brand-500/20">
              <i className="fa-solid fa-hotel"></i>
            </div>
            <div>
              <h3 className="font-heading font-black text-slate-900 text-lg sm:text-xl">
                Verified Lodges & Stays Near Day 1 ({cleanCity})
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Handpicked budget lodges, heritage inns & hostels located right beside Day 1 morning stops with per-person sharing prices
              </p>
            </div>
          </div>
        </div>

        <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 shrink-0 self-start sm:self-auto shadow-xs">
          <i className="fa-solid fa-shield-check text-emerald-600"></i>
          <span>100% Proximity Verified</span>
        </span>
      </div>

      {/* Hotel Cards List */}
      <div className="space-y-5">
        {(!hotels || hotels.length === 0) ? (
          <p className="text-xs text-slate-500 py-8 text-center font-bold">Discovering verified lodges near Day 1 staying hub...</p>
        ) : (
          hotels.map((h) => {
            const currentSelectedIdx = selectedSharingMap[h.id] !== undefined ? selectedSharingMap[h.id] : 0;
            const activeSharing = h.sharing_options?.[currentSelectedIdx] || h.sharing_options?.[0];

            return (
              <div 
                key={h.id} 
                className="bg-white hover:bg-slate-50/50 p-4 sm:p-6 rounded-3xl border border-slate-200/80 hover:border-brand-300 transition-all duration-300 shadow-xs hover:shadow-xl flex flex-col md:flex-row gap-6 items-start group"
              >
                {/* Hotel Photo */}
                <div className="w-full md:w-64 h-48 shrink-0 relative rounded-2xl overflow-hidden shadow-xs bg-slate-900">
                  <img 
                    src={h.image} 
                    alt={h.name} 
                    loading="lazy"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider border border-white/20">
                    {h.type}
                  </span>
                </div>

                {/* Hotel Details */}
                <div className="flex-1 min-w-0 w-full space-y-4">
                  
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-heading font-black text-slate-900 text-base sm:text-lg leading-snug group-hover:text-brand-700 transition">
                          {h.name}
                        </h4>
                        <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 text-[11px] font-black rounded-lg flex items-center gap-1 border border-amber-200">
                          <i className="fa-solid fa-star text-amber-500 text-[10px]"></i> {h.rating} ({h.reviews} reviews)
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-extrabold text-[11px] border border-emerald-200 flex items-center gap-1">
                          <i className="fa-solid fa-location-crosshairs text-[10px]"></i>
                          <span>{h.distance}</span>
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          near <strong className="text-slate-800">{h.near_landmark}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Dynamic Rate Display based on Selected Sharing Option */}
                    <div className="text-left sm:text-right shrink-0 p-3 bg-slate-50 rounded-2xl border border-slate-200/70 sm:min-w-[140px]">
                      <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">
                        {activeSharing ? activeSharing.type.split(' ')[0] + ' Sharing Rate' : 'Starting Rate'}
                      </span>
                      <span className="text-xl font-black text-emerald-700 block">
                        ₹{(activeSharing ? activeSharing.price_per_person_inr : h.base_price_inr)?.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold block">
                        {activeSharing ? "/ person / night" : "/ room / night"}
                      </span>
                    </div>
                  </div>

                  {/* Amenities Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {h.amenities?.slice(0, 5).map((am, amIdx) => (
                      <span key={amIdx} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold">
                        {am}
                      </span>
                    ))}
                  </div>

                  {/* Room Sharing Breakdown Interactive Selector */}
                  <div className="pt-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                        <i className="fa-solid fa-bed text-brand-600"></i>
                        Select Room Sharing Option (Click to preview price):
                      </span>
                      <span className="text-[10px] font-black text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
                        Interactive
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {h.sharing_options?.map((opt, optIdx) => {
                        const isChosen = currentSelectedIdx === optIdx;
                        return (
                          <div 
                            key={optIdx}
                            onClick={() => handleSelectSharing(h.id, optIdx)}
                            className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                              isChosen
                                ? 'bg-brand-50/80 border-brand-500 shadow-sm ring-2 ring-brand-500/20'
                                : 'bg-slate-50/80 border-slate-200/80 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                                isChosen ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-700'
                              }`}>
                                {opt.badge || "Sharing"}
                              </span>
                              <span className="font-black text-emerald-700 text-xs">
                                ₹{opt.price_per_person_inr?.toLocaleString()}/p
                              </span>
                            </div>
                            <strong className="text-slate-800 text-xs block font-bold truncate">{opt.type}</strong>
                            <span className="text-[10px] text-slate-500 font-medium line-clamp-1 mt-0.5">{opt.note || ''}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Booking & Partner Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button 
                      onClick={() => onOpenBookingModal(h)}
                      className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md shadow-brand-600/25 transition flex items-center gap-2"
                    >
                      <i className="fa-solid fa-calendar-check"></i>
                      <span>Instant Book Stay</span>
                    </button>

                    <a 
                      href={h.booking_links?.primary_url || "https://www.makemytrip.com"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-2"
                    >
                      <span>Partner Booking Portal</span>
                      <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-400"></i>
                    </a>

                    <a 
                      href={h.booking_links?.google_hotels_url || "https://www.google.com/travel/hotels"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3.5 py-2.5 text-slate-500 hover:text-slate-900 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <i className="fa-brands fa-google text-[12px] text-blue-500"></i>
                      <span>Compare Rates</span>
                    </a>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
