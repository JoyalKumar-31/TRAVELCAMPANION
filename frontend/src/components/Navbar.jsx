import React from 'react';

export default function Navbar({ onOpenGroupModal, onScrollToSection, onOpenSafetyModal, onOpenScannerModal, onToggleChat }) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 lg:px-8 py-3 transition shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 group-hover:shadow-brand-500/40 transition-all duration-300">
            <i className="fa-solid fa-compass text-lg group-hover:rotate-45 transition-transform duration-500"></i>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-slate-900 tracking-tight text-lg sm:text-xl bg-gradient-to-r from-slate-900 via-slate-800 to-brand-800 bg-clip-text text-transparent">
                TravelMate<span className="text-brand-600">.ai</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-brand-50 text-brand-600 rounded-full border border-brand-200/80 shadow-xs">
                PRO 2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:flex items-center gap-1.5">
              <span>Adaptive Multi-Agent Autonomous Travel System</span>
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/60 text-xs font-bold text-slate-600">
          <button 
            onClick={() => onScrollToSection('itinerary-timeline-section')}
            className="px-3.5 py-1.5 rounded-xl hover:text-slate-900 hover:bg-white transition flex items-center gap-1.5 text-brand-700 bg-white shadow-xs"
          >
            <i className="fa-solid fa-route text-brand-600"></i>
            <span>Itinerary Timeline</span>
          </button>
          
          <button 
            onClick={() => onScrollToSection('day1-hotels-section')}
            className="px-3.5 py-1.5 rounded-xl hover:text-slate-900 hover:bg-white transition flex items-center gap-1.5"
          >
            <i className="fa-solid fa-hotel text-slate-400"></i>
            <span>Day 1 Stays</span>
          </button>

          <button 
            onClick={() => onScrollToSection('places-gallery-section')}
            className="px-3.5 py-1.5 rounded-xl hover:text-slate-900 hover:bg-white transition flex items-center gap-1.5"
          >
            <i className="fa-solid fa-camera-retro text-slate-400"></i>
            <span>Places Showcase</span>
          </button>

          <button 
            onClick={onOpenGroupModal}
            className="px-3.5 py-1.5 rounded-xl hover:text-slate-900 hover:bg-white transition flex items-center gap-1.5"
          >
            <i className="fa-solid fa-users text-slate-400"></i>
            <span>Group Voting</span>
          </button>

          <button 
            onClick={onOpenSafetyModal}
            className="px-3.5 py-1.5 rounded-xl hover:text-rose-700 hover:bg-rose-50/50 transition flex items-center gap-1.5 text-rose-600 font-bold"
          >
            <i className="fa-solid fa-shield-halved text-rose-500"></i>
            <span>SOS Shield</span>
          </button>
        </nav>

        {/* Right Header Badges & Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Currency Indicator (₹ INR) */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50/90 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-black shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>₹ INR</span>
          </div>

          {/* Vision Scanner Shortcut */}
          <button
            onClick={onOpenScannerModal}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-slate-900/15 active:scale-95"
            title="Vision AI Scanner (Recognize monuments and listen to audio guides)"
          >
            <i className="fa-solid fa-camera-viewfinder text-amber-300"></i>
            <span>Vision AI</span>
          </button>

          {/* AI Travel Companion Shortcut (Upperside Launcher) */}
          <button
            onClick={onToggleChat}
            className="px-3.5 py-1.5 bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black transition flex items-center gap-2 shadow-md shadow-brand-500/25 active:scale-95"
            title="Open AI Travel Companion Chat"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <i className="fa-solid fa-headset text-xs"></i>
            <span>AI Assistant</span>
          </button>

        </div>

      </div>
    </header>
  );
}
