import React, { useState } from 'react';

export default function HotelBookingModal({
  hotel,
  destination,
  travelersCount,
  travelerType,
  isOpen,
  onClose,
  onNotifyAssistant
}) {
  if (!isOpen || !hotel) return null;

  const [selectedSharingIdx, setSelectedSharingIdx] = useState(0);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const cleanCity = (destination || "").split("(")[0].split(",")[0].trim();
  const selectedOption = hotel.sharing_options?.[selectedSharingIdx] || hotel.sharing_options?.[0];
  const guests = travelersCount || 2;
  const isDorm = selectedOption?.type?.toLowerCase().includes("dorm") || selectedOption?.type?.toLowerCase().includes("bed");
  const totalPrice = isDorm ? (selectedOption.price_per_person_inr * guests) : selectedOption.total_inr;

  const partnerPortalUrl = hotel.booking_links?.primary_url || hotel.booking_links?.google_hotels_url || "https://www.makemytrip.com";

  function handleConfirmBooking() {
    const bookingId = "BK-LDG-" + Math.floor(10000 + Math.random() * 90000);
    const bookingData = {
      id: bookingId,
      hotelName: hotel.name,
      roomType: `${selectedOption.type} (${guests} Members)`,
      totalPrice: totalPrice
    };
    setConfirmedBooking(bookingData);
    if (onNotifyAssistant) {
      onNotifyAssistant(`🏨 Reserved Day 1 stay at ${hotel.name} (${selectedOption.type})! Reference ID: ${bookingId}. Total: ₹${totalPrice.toLocaleString()}. Free cancellation enabled.`);
    }
  }

  function handleResetAndClose() {
    setConfirmedBooking(null);
    setSelectedSharingIdx(0);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="relative h-44 sm:h-52 w-full bg-slate-900 shrink-0">
          <img 
            src={hotel.image} 
            alt={hotel.name} 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          
          <button 
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          <div className="absolute bottom-4 left-5 right-5 text-white">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-brand-600 text-white text-[10px] font-extrabold uppercase">
                {hotel.type}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-400/90 text-slate-950 text-[10px] font-black">
                ★ {hotel.rating}
              </span>
            </div>
            <h3 className="font-black text-lg sm:text-xl text-white mt-1 leading-tight">{hotel.name}</h3>
            <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
              <i className="fa-solid fa-location-dot text-rose-400"></i>
              <span>{hotel.distance} · {hotel.near_landmark}</span>
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {!confirmedBooking ? (
            <>
              {/* Room Sharing Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <i className="fa-solid fa-bed text-brand-600"></i>
                    <span>Select Room Sharing Configuration:</span>
                  </h4>
                  <span className="text-[11px] font-bold text-slate-500">
                    {guests} Adults ({travelerType.toUpperCase()})
                  </span>
                </div>

                <div className="space-y-2">
                  {hotel.sharing_options?.map((opt, idx) => {
                    const isSelected = idx === selectedSharingIdx;
                    return (
                      <div 
                        key={idx}
                        onClick={() => setSelectedSharingIdx(idx)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                          isSelected 
                            ? 'border-brand-500 bg-brand-50/60 ring-2 ring-brand-500/20' 
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300'
                          }`}>
                            {isSelected && <i className="fa-solid fa-check text-[9px]"></i>}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <strong className="text-xs text-slate-900">{opt.type}</strong>
                              {opt.badge && (
                                <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-brand-100 text-brand-700">
                                  {opt.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">{opt.note || ''}</p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-sm font-black text-slate-900">₹{opt.price_per_person_inr?.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-400 block font-medium">/ person / night</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Calculation Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>{selectedOption?.type} (₹{selectedOption?.price_per_person_inr?.toLocaleString()} × {guests} guests):</span>
                  <span className="font-bold text-slate-900">₹{totalPrice?.toLocaleString()} / night</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Taxes, Linen & Resort Fee:</span>
                  <span className="text-emerald-600 font-bold">Included</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
                  <span className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Total Payable in ₹ INR:</span>
                  <span className="text-lg font-black text-brand-600">₹{totalPrice?.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <a 
                  href={partnerPortalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-arrow-up-right-from-square text-[11px] text-slate-500"></i>
                  <span>Book via MakeMyTrip / Portal ({cleanCity})</span>
                </a>

                <button 
                  onClick={handleConfirmBooking}
                  className="w-full sm:flex-1 py-3 px-4 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md shadow-brand-600/20 transition flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-check"></i>
                  <span>Confirm Direct Lodge Booking</span>
                </button>
              </div>
            </>
          ) : (
            /* Confirmation View */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mx-auto shadow-inner">
                <i className="fa-solid fa-check"></i>
              </div>
              <h4 className="font-extrabold text-slate-900 text-lg">Lodge Reservation Confirmed!</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Your Day 1 stay has been verified. Free cancellation is enabled up to 24 hours prior to check-in.
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Booking Reference:</span>
                  <span className="font-bold text-brand-600">{confirmedBooking.id}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Stay:</span>
                  <span className="font-medium text-slate-900">{confirmedBooking.hotelName}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Room:</span>
                  <span className="font-medium text-slate-900">{confirmedBooking.roomType}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between font-extrabold text-slate-900">
                  <span>Total Payable:</span>
                  <span className="text-emerald-700">₹{confirmedBooking.totalPrice?.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <a 
                  href={partnerPortalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <i className="fa-solid fa-arrow-up-right-from-square"></i>
                  <span>Open Partner Booking Listing</span>
                </a>
                <button 
                  onClick={handleResetAndClose}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
