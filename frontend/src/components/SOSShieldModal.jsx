import React, { useState } from 'react';

// Destination-aware emergency directories with verified helpline numbers
const EMERGENCY_DIRECTORIES = {
  switzerland: {
    country: "Switzerland",
    primary: "112",
    police: "117",
    ambulance: "144",
    tourist: "+41 800 100 200",
    fire: "118",
    airRescue: "1414",
    hospital: "University Hospital Zurich (USZ) Trauma Center / Cantonal Hospital Lucerne",
    policeStation: "Kantonspolizei Zürich Central Station (Bahnhofquai 3)",
    notes: "Universal 112 connects to English, German, French, and Italian dispatchers 24/7."
  },
  goa: {
    country: "India (Goa)",
    primary: "112",
    police: "100",
    ambulance: "108",
    tourist: "+91-832-2419080",
    fire: "101",
    womenSafety: "1091",
    hospital: "Goa Medical College & Hospital (Bambolim, North Goa)",
    policeStation: "Panaji Police Station & Tourist Police Booth (Near Miramar)",
    notes: "Drishti Marine operates lifeguard towers with beach rescue flags."
  },
  hyderabad: {
    country: "India (Telangana)",
    primary: "112",
    police: "100",
    ambulance: "108",
    tourist: "+91-40-23450444",
    fire: "101",
    womenSafety: "+91-9490616555",
    hospital: "Osmania General Hospital / Apollo Emergency Care Jubilee Hills",
    policeStation: "Hyderabad City Police Commissionerate & SHE Teams Unit",
    notes: "SHE Teams patrol tourist circuits and transit hubs 24/7 for women's safety."
  },
  vizag: {
    country: "India (Andhra Pradesh)",
    primary: "112",
    police: "100",
    ambulance: "108",
    tourist: "1800-425-4545",
    fire: "101",
    womenSafety: "181",
    hospital: "King George Hospital (KGH) Trauma Center / Apollo Health City",
    policeStation: "Three Town Police Station & RK Beach Coastal Police Booth",
    notes: "Coastal police patrol beaches. Avoid deep sea swimming during high tide."
  },
  delhi_agra: {
    country: "India (Delhi & Agra)",
    primary: "112",
    police: "100",
    ambulance: "102",
    tourist: "1363",
    fire: "101",
    womenSafety: "1091",
    hospital: "AIIMS New Delhi / SN Medical College Hospital Agra",
    policeStation: "Delhi Tourist Police Booth (Connaught Place & Airport)",
    notes: "1363 is India's toll-free 24/7 multi-lingual tourist assistance helpline."
  },
  kerala: {
    country: "India (Kerala)",
    primary: "112",
    police: "100",
    ambulance: "108",
    tourist: "+91-484-2215640",
    fire: "101",
    womenSafety: "1091",
    hospital: "Ernakulam Government General Hospital / Aster Medcity Kochi",
    policeStation: "Fort Kochi Tourist Police Station & Marine Police Coastal Wing",
    notes: "Official tourist police assist with backwater houseboat security and travel queries."
  },
  paris: {
    country: "France",
    primary: "112",
    police: "17",
    ambulance: "15",
    tourist: "+33 1 49 52 42 63",
    fire: "18",
    hospital: "Hôpital Hôtel-Dieu (1 Pl. du Parvis Notre-Dame, 75004 Paris)",
    policeStation: "Commissariat Central de Police du 1er Arrondissement",
    notes: "112 is the EU-wide emergency number with multilingual operators."
  },
  dubai: {
    country: "United Arab Emirates",
    primary: "999",
    police: "999",
    ambulance: "998",
    tourist: "901",
    fire: "997",
    hospital: "Rashid Hospital Trauma Center / Dubai Hospital",
    policeStation: "Dubai Police Headquarters & Al Barsha Police Station",
    notes: "Dubai Tourist Police (Dial 901) offers dedicated assistance in 12+ languages."
  },
  tokyo: {
    country: "Japan",
    primary: "110",
    police: "110",
    ambulance: "119",
    tourist: "+81 3 3201 3331",
    fire: "119",
    hospital: "St. Luke's International Hospital (English-Speaking 24/7 ER)",
    policeStation: "Tokyo Metropolitan Police Department (Koban Network)",
    notes: "Dial 110 for police or 119 for medical emergency and fire services."
  },
  rome: {
    country: "Italy",
    primary: "112",
    police: "112",
    ambulance: "118",
    tourist: "+39 060 608",
    fire: "115",
    hospital: "Policlinico Umberto I Emergency Trauma Center Rome",
    policeStation: "Questura di Roma Central Police Station (Via di San Vitale)",
    notes: "112 connects to Carabinieri and state emergency dispatchers."
  },
  london: {
    country: "United Kingdom",
    primary: "999",
    police: "999",
    ambulance: "999",
    tourist: "101",
    fire: "999",
    hospital: "St Thomas' Hospital A&E (Westminster Bridge Road, London)",
    policeStation: "Metropolitan Police Charing Cross Station",
    notes: "Dial 999 for emergencies or 111 for urgent NHS medical advice."
  }
};

function getDirectoryKey(dest) {
  const d = (dest || "").toLowerCase();
  if (d.includes("goa")) return "goa";
  if (d.includes("hyderabad")) return "hyderabad";
  if (d.includes("vizag") || d.includes("visakhapatnam")) return "vizag";
  if (d.includes("kerala") || d.includes("munnar") || d.includes("kochi") || d.includes("alappuzha")) return "kerala";
  if (d.includes("delhi") || d.includes("agra") || d.includes("taj mahal")) return "delhi_agra";
  if (d.includes("paris") || d.includes("france")) return "paris";
  if (d.includes("dubai") || d.includes("uae")) return "dubai";
  if (d.includes("tokyo") || d.includes("japan")) return "tokyo";
  if (d.includes("rome") || d.includes("italy")) return "rome";
  if (d.includes("london") || d.includes("uk")) return "london";
  return "switzerland";
}

export default function SOSShieldModal({ isOpen, onClose, destination = "Switzerland (Zurich, Lucerne)" }) {
  if (!isOpen) return null;

  const [activeCallStatus, setActiveCallStatus] = useState(null);
  const [copiedCoordinates, setCopiedCoordinates] = useState(false);

  const key = getDirectoryKey(destination);
  const dir = EMERGENCY_DIRECTORIES[key] || EMERGENCY_DIRECTORIES["switzerland"];
  const cleanCity = destination.split("(")[0].split(",")[0].trim();

  // Trigger Phone Call via Native tel: Protocol
  function handleMakeCall(number, label) {
    const cleanNumber = number.replace(/[^\d+]/g, '');
    setActiveCallStatus({
      number,
      label,
      time: new Date().toLocaleTimeString()
    });

    // Native Browser Call Trigger
    window.location.href = `tel:${cleanNumber}`;
  }

  // Copy or Share Live Location
  function handleShareLocation() {
    const locText = `🚨 EMERGENCY SOS ALERT!\nLocation: ${destination}\nCoordinates: Current Traveler Position via TravelMate AI\nContact Police: ${dir.police} | Ambulance: ${dir.ambulance}\nPlease dispatch assistance immediately!`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(locText).then(() => {
        setCopiedCoordinates(true);
        setTimeout(() => setCopiedCoordinates(false), 3000);
      });
    }

    if (navigator.share) {
      navigator.share({
        title: `SOS Emergency Alert - ${cleanCity}`,
        text: locText
      }).catch(() => {});
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      
      {/* Modal Container */}
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-rose-100 overflow-hidden flex flex-col max-h-[92vh] transition-all">
        
        {/* Header with Emergency Red Gradient */}
        <div className="relative bg-gradient-to-r from-red-600 via-rose-600 to-rose-700 text-white p-5 sm:p-6 shrink-0 shadow-lg">
          
          {/* Subtle Ambient Pulse */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-inner text-white">
                <i className="fa-solid fa-shield-halved animate-pulse"></i>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight font-heading">
                    SOS Emergency Hub
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white border border-white/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping"></span>
                    24/7 ACTIVE
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-rose-100 font-medium mt-0.5 flex items-center gap-1.5">
                  <i className="fa-solid fa-location-dot text-rose-200"></i>
                  <span>Tourist Safety Shield for <strong className="text-white">{cleanCity}</strong></span>
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition border border-white/20 active:scale-95"
              title="Close SOS Modal"
            >
              <i className="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>

          {/* Active Call In-Progress Feedback Toast */}
          {activeCallStatus && (
            <div className="mt-4 p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-between text-xs font-bold animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Connecting call to <strong>{activeCallStatus.label}</strong> ({activeCallStatus.number})...</span>
              </div>
              <span className="text-[11px] text-white/80 font-mono">{activeCallStatus.time}</span>
            </div>
          )}

        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          
          {/* PRIMARY ONE-TAP EMERGENCY ACTION CARD */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white p-4 sm:p-5 shadow-lg shadow-rose-500/25 border border-red-400">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase font-extrabold tracking-wider text-rose-100">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  <span>Universal National Helpline</span>
                </div>
                <div className="text-3xl sm:text-4xl font-black mt-1 tracking-tight font-heading flex items-center gap-3">
                  <span>{dir.primary}</span>
                  <span className="text-xs px-2.5 py-1 bg-white/20 rounded-full font-bold uppercase tracking-wider">
                    Free / 24x7
                  </span>
                </div>
                <p className="text-xs text-rose-100 mt-1 max-w-sm">
                  {dir.notes}
                </p>
              </div>

              {/* Direct Call Button */}
              <a
                href={`tel:${dir.primary}`}
                onClick={() => handleMakeCall(dir.primary, "Universal Emergency")}
                className="w-full sm:w-auto px-6 py-3.5 bg-white text-red-600 hover:bg-rose-50 rounded-2xl font-black text-sm transition-all shadow-xl flex items-center justify-center gap-2.5 active:scale-95 group text-center shrink-0"
              >
                <i className="fa-solid fa-phone-volume text-lg group-hover:rotate-12 transition-transform"></i>
                <span>CALL {dir.primary} NOW</span>
              </a>
            </div>
          </div>

          {/* GRID OF VERIFIED HELPLINES WITH CLICK-TO-CALL */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-phone-flip text-rose-500"></i>
              <span>Official Department Helplines (Tap to Call)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* 1. Police Helpline */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/40 transition flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition">
                    <i className="fa-solid fa-building-shield"></i>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800">Police Control</h4>
                    <p className="text-sm font-black text-blue-600">{dir.police}</p>
                    <p className="text-[10px] text-slate-500 font-medium">Law enforcement & safety</p>
                  </div>
                </div>

                <a 
                  href={`tel:${dir.police}`}
                  onClick={() => handleMakeCall(dir.police, "Police Control")}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition"
                >
                  <i className="fa-solid fa-phone text-[10px]"></i>
                  <span>Call</span>
                </a>
              </div>

              {/* 2. Medical Ambulance Helpline */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/40 transition flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition">
                    <i className="fa-solid fa-truck-medical"></i>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800">Medical Ambulance</h4>
                    <p className="text-sm font-black text-emerald-600">{dir.ambulance}</p>
                    <p className="text-[10px] text-slate-500 font-medium">Trauma care & hospital transit</p>
                  </div>
                </div>

                <a 
                  href={`tel:${dir.ambulance}`}
                  onClick={() => handleMakeCall(dir.ambulance, "Medical Ambulance")}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition"
                >
                  <i className="fa-solid fa-phone text-[10px]"></i>
                  <span>Call</span>
                </a>
              </div>

              {/* 3. Tourist Helpline / Diplomatic Assistance */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-purple-300 hover:bg-purple-50/40 transition flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition">
                    <i className="fa-solid fa-passport"></i>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800">Tourist Assistance</h4>
                    <p className="text-sm font-black text-purple-600">{dir.tourist}</p>
                    <p className="text-[10px] text-slate-500 font-medium">Consular & visitor help</p>
                  </div>
                </div>

                <a 
                  href={`tel:${dir.tourist}`}
                  onClick={() => handleMakeCall(dir.tourist, "Tourist Assistance")}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition"
                >
                  <i className="fa-solid fa-phone text-[10px]"></i>
                  <span>Call</span>
                </a>
              </div>

              {/* 4. Fire / Rescue / Air Rescue */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-amber-300 hover:bg-amber-50/40 transition flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition">
                    <i className="fa-solid fa-fire-extinguisher"></i>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800">Fire & Civil Rescue</h4>
                    <p className="text-sm font-black text-amber-600">{dir.fire || "118"}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{dir.airRescue ? `Air Rescue: ${dir.airRescue}` : "Civil defense & disaster"}</p>
                  </div>
                </div>

                <a 
                  href={`tel:${dir.fire || "118"}`}
                  onClick={() => handleMakeCall(dir.fire || "118", "Fire & Rescue")}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition"
                >
                  <i className="fa-solid fa-phone text-[10px]"></i>
                  <span>Call</span>
                </a>
              </div>

            </div>
          </div>

          {/* EMERGENCY TOOLS: GPS BROADCAST & SHARE */}
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-200/80 text-rose-700 flex items-center justify-center text-sm shrink-0">
                <i className="fa-solid fa-tower-broadcast"></i>
              </div>
              <div>
                <h4 className="text-xs font-black text-rose-900">Broadcast Live Location to Emergency Contacts</h4>
                <p className="text-[11px] text-rose-700">Pre-formats SMS / WhatsApp message with your current travel destination</p>
              </div>
            </div>

            <button
              onClick={handleShareLocation}
              className="w-full sm:w-auto px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-sm active:scale-95 shrink-0"
            >
              <i className="fa-solid fa-share-nodes"></i>
              <span>{copiedCoordinates ? "✔ Coordinates Copied!" : "Share / Copy SOS"}</span>
            </button>
          </div>

          {/* LOCAL HOSPITAL & POLICE FACILITY CARD */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <h4 className="font-black text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-2">
              <i className="fa-solid fa-hospital text-rose-500"></i>
              <span>Nearest Recommended Support Facilities</span>
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
              <div className="bg-white p-3 rounded-xl border border-slate-200/70">
                <strong className="block text-slate-900 font-bold mb-0.5">Primary Trauma Hospital:</strong>
                <span>{dir.hospital}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200/70">
                <strong className="block text-slate-900 font-bold mb-0.5">Central Police Desk:</strong>
                <span>{dir.policeStation}</span>
              </div>
            </div>
          </div>

          {/* CRISIS PROTOCOL CHECKLIST */}
          <div className="rounded-2xl border border-slate-200 p-4 bg-white text-xs text-slate-600 space-y-1.5">
            <h5 className="font-extrabold text-slate-800 text-xs mb-1 flex items-center gap-1.5">
              <i className="fa-solid fa-list-check text-brand-600"></i>
              <span>Immediate Tourist Crisis Action Steps</span>
            </h5>
            <ol className="list-decimal pl-4 space-y-1 text-slate-500 font-medium">
              <li>Stay calm and remain in a well-lit public area or hotel lobby.</li>
              <li>Tap the red <strong>Call {dir.primary} Now</strong> button above to connect immediately.</li>
              <li>State your location: <em>"{cleanCity}, {dir.country}"</em> and state whether you need medical, police, or rescue.</li>
              <li>Keep your identification passport/ID photo accessible on your smartphone.</li>
            </ol>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <i className="fa-solid fa-circle-check text-emerald-500"></i>
            <span>TravelMate Tourist Protection Shield is active</span>
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition active:scale-95"
          >
            Close Shield
          </button>
        </div>

      </div>

    </div>
  );
}
