import React, { useState, useRef, useEffect } from 'react';

const SUGGESTIONS = [
  "🗺️ Can you tell me the tour of Day 1?",
  "🏨 Best sharing lodge near Day 1?",
  "🏍️ Show directions by bike and train",
  "🍲 Top local regional delicacies?",
  "✈️ Change destination to Goa",
  "⚡ Replan schedule for weather"
];

export default function AIChatCompanion({ 
  isOpen,
  onClose,
  destination,
  origin,
  duration,
  travelersCount,
  travelerType,
  itinerary,
  activeDayIndex,
  onExecuteAction 
}) {
  const cleanCity = (destination || "").split("(")[0].split(",")[0].trim();
  const [messages, setMessages] = useState([
    { 
      sender: "assistant", 
      text: `👋 Namaste! I am your AI Adaptive Tourism Companion for ${cleanCity}.\n\nAsk me anything: Day 1 tour breakdown, budget sharing lodges, multi-modal routes, or ask me to perform actions like "change destination to Goa" or "plan for 5 days"!`,
      actionTag: null 
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [activeLang, setActiveLang] = useState("English");

  const messagesContainerRef = useRef(null);
  const isFirstRender = useRef(true);

  // Safe inner-container scroll that NEVER scrolls the browser window
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  if (!isOpen) return null;

  async function handleSendMessage(queryText) {
    const query = (queryText || inputText).trim();
    if (!query) return;

    // Add User Message
    const userMsg = { sender: "user", text: query, actionTag: null };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query,
          destination: destination,
          language: activeLang,
          traveler_context: {
            origin: origin,
            duration: duration,
            travelersCount: travelersCount,
            travelerType: travelerType,
            activeDayIndex: activeDayIndex,
            itinerary: itinerary
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const actionType = data.action?.action_type || null;

        const assistantMsg = { 
          sender: "assistant", 
          text: data.response_text,
          actionTag: actionType
        };
        setMessages(prev => [...prev, assistantMsg]);

        // Execute action if returned
        if (data.action && onExecuteAction) {
          onExecuteAction(data.action);
        }

        if (isVoiceActive && window.speechSynthesis) {
          const spokenText = data.audio_narrative_text || data.response_text.replace(/[*_#`]/g, '');
          const utterance = new SpeechSynthesisUtterance(spokenText);
          utterance.lang = "en-US";
          window.speechSynthesis.speak(utterance);
        }
      } else {
        setMessages(prev => [...prev, { 
          sender: "assistant", 
          text: `I can help you explore ${cleanCity}! Ask me about the Day 1 tour, budget lodges near your hub, travel routes, or regional dishes.`,
          actionTag: null
        }]);
      }
    } catch (err) {
      console.warn("Companion error:", err);
      setMessages(prev => [...prev, { 
        sender: "assistant", 
        text: `I'm here to assist your journey in ${cleanCity}! Ask about the Day 1 tour breakdown, sharing lodges, or transit directions.`,
        actionTag: null
      }]);
    } finally {
      setIsLoading(false);
    }
  }

  function toggleVoice() {
    setIsVoiceActive(!isVoiceActive);
    if (!isVoiceActive) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.onresult = (e) => {
          const transcript = e.results[0][0].transcript;
          handleSendMessage(transcript);
        };
        recognition.start();
      }
    } else {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fadeIn">
      
      {/* Semi-transparent Backdrop (tap to close) */}
      <div 
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity" 
        onClick={() => {
          if (window.speechSynthesis) window.speechSynthesis.cancel();
          if (onClose) onClose();
        }}
      />

      {/* Slide-in Assistant Panel anchored at Upper-Right */}
      <div className="relative w-full max-w-lg bg-white h-full sm:h-[94vh] sm:my-auto sm:mr-4 sm:rounded-[2.5rem] shadow-2xl border border-slate-200/90 flex flex-col z-10 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/95 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-base shadow-md shadow-brand-500/25">
              <i className="fa-solid fa-headset"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-heading font-black text-slate-900 text-sm">AI Travel Companion</h4>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Online · Action Ready</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Active for {cleanCity} · Multilingual Audio TTS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Voice Mode Toggle */}
            <button 
              onClick={toggleVoice}
              className={`w-8 h-8 rounded-xl text-xs font-bold border transition flex items-center justify-center ${
                isVoiceActive 
                  ? 'bg-rose-50 border-rose-400 text-rose-600' 
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
              }`}
              title="Toggle Voice Mode"
            >
              <i className={`fa-solid ${isVoiceActive ? 'fa-microphone-lines text-rose-600 animate-bounce' : 'fa-microphone'}`}></i>
            </button>

            {/* Close Button */}
            <button 
              onClick={() => {
                if (window.speechSynthesis) window.speechSynthesis.cancel();
                if (onClose) onClose();
              }}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
              title="Close Assistant"
            >
              <i className="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-4 py-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0 border-b border-slate-100 bg-slate-50/50">
          {SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(s.replace(/^[^\w\s]+\s*/, ''))}
              className="px-2.5 py-1 rounded-xl bg-white hover:bg-brand-50 hover:text-brand-700 text-slate-700 text-[10.5px] font-bold whitespace-nowrap transition border border-slate-200/70 shadow-xs shrink-0"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Messages Scroll Area */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-slate-50/30"
        >
          {messages.map((m, idx) => {
            const isUser = m.sender === "user";
            return (
              <div 
                key={idx}
                className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px] shrink-0 font-bold shadow-xs">
                    AI
                  </div>
                )}
                <div 
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                    isUser 
                      ? 'bg-brand-600 text-white rounded-br-none shadow-md shadow-brand-600/15 font-medium' 
                      : 'bg-white text-slate-800 rounded-bl-none border border-slate-200/80 shadow-xs font-normal'
                  }`}
                >
                  {/* Action Executed Pill */}
                  {m.actionTag && (
                    <div className="mb-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-[10px]">
                      <i className="fa-solid fa-bolt text-emerald-600"></i>
                      <span>Action Executed: {m.actionTag.replace(/_/g, ' ')}</span>
                    </div>
                  )}
                  <div>{m.text}</div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <div className="w-7 h-7 rounded-full bg-slate-200 animate-pulse flex items-center justify-center text-[10px] font-bold">
                AI
              </div>
              <span className="italic flex items-center gap-1 text-[11px] text-brand-600 font-semibold">
                <i className="fa-solid fa-spinner fa-spin text-xs"></i> Companion is analyzing & executing...
              </span>
            </div>
          )}
        </div>

        {/* Input Box */}
        <div className="p-3.5 border-t border-slate-100 shrink-0 bg-white">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="flex items-center gap-2"
          >
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Ask anything or request action ("change to Goa", "day 1 tour")...`}
              className="flex-1 bg-slate-50 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white transition shadow-inner"
            />
            <button 
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="w-10 h-10 rounded-2xl bg-brand-600 hover:bg-brand-700 active:scale-95 text-white flex items-center justify-center transition shadow-md shadow-brand-600/25 disabled:opacity-40 shrink-0"
            >
              <i className="fa-solid fa-paper-plane text-xs"></i>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
