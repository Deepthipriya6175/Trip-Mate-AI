import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LanguageSelector, LANGUAGES } from '../components/LanguageSelector';
import {
  Compass,
  Send,
  Sparkles,
  Bot,
  User,
  Building2,
  Clock,
  ShieldCheck,
  RotateCcw,
  AlertCircle,
  Copy,
  Check,
  ChevronDown
} from 'lucide-react';

export const ConciergeChatPage = () => {
  const { user } = useAuth();
  const [hotels, setHotels] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
  const [currentHotel, setCurrentHotel] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(user?.preferred_language || 'en');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const chatBottomRef = useRef(null);

  // Load hotels and default welcome greeting
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await api.get('/hotels');
        if (res.data?.data) {
          setHotels(res.data.data);
          const active = res.data.data.find(h => h.id === selectedHotelId) || res.data.data[0];
          setCurrentHotel(active);
        }
      } catch (err) {
        console.warn('Failed to load hotels:', err);
      }
    };

    fetchHotels();
  }, [selectedHotelId]);

  // Set initial welcome message
  useEffect(() => {
    if (currentHotel && messages.length === 0) {
      setMessages([
        {
          id: 'welcome-1',
          sender_role: 'assistant',
          content: `Namaste and warm greetings from **${currentHotel.name}**! 🌸\n\nI am your verified AI Concierge. I can assist you with dining reservations, check-in timings, complimentary Wi-Fi, Ayurvedic spa appointments, and local palace excursions.\n\nHow may I be of royal service to you today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'grounded_gemini'
        }
      ]);
    }
  }, [currentHotel]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || loading) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender_role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const historyPayload = messages.slice(-6).map(m => ({
        sender_role: m.sender_role,
        content: m.content
      }));

      const res = await api.post('/ai/chat', {
        message: query,
        hotel_id: selectedHotelId,
        language: selectedLanguage,
        history: historyPayload
      });

      if (res.data?.data) {
        const aiReply = res.data.data;
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender_role: 'assistant',
            content: aiReply.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            source: aiReply.source || 'gemini',
            matched_faq: aiReply.matched_faq
          }
        ]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender_role: 'assistant',
          content: 'I apologize, but I encountered a momentary connection interruption. Please try asking again or contact the Front Desk directly by dialing 0 on your room phone.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (content, index) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClearChat = () => {
    if (currentHotel) {
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          sender_role: 'assistant',
          content: `Welcome back to **${currentHotel.name}**! How may I assist you today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'grounded_gemini'
        }
      ]);
    }
  };

  const quickPrompts = [
    'When is breakfast served and where?',
    'How do I connect to the complimentary Wi-Fi?',
    'What are the check-in and check-out times?',
    'How do I book a treatment at the Jiva Spa?',
    'Do you provide airport chauffeur transfers?',
    'Can you check the status of my open maintenance ticket?'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Header Bar */}
      <div className="bg-white rounded-2xl p-4 border border-ivory-300 shadow-xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Hotel & Location selector */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-800 text-ivory-50 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5 text-royal-gold" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-teal-700">Verified Knowledge Base</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <select
              value={selectedHotelId}
              onChange={(e) => setSelectedHotelId(e.target.value)}
              className="font-serif text-sm sm:text-base font-bold text-teal-950 bg-transparent border-none focus:outline-none cursor-pointer pr-4"
            >
              {hotels.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Controls: Language, Grounding status & Clear */}
        <div className="flex items-center space-x-3">
          <LanguageSelector
            currentLanguage={selectedLanguage}
            onLanguageChange={(lang) => setSelectedLanguage(lang)}
          />

          <div className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Grounded Retrieval</span>
          </div>

          <button
            onClick={handleClearChat}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-ivory-200 transition-colors"
            title="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Chat Window */}
        <div className="lg:col-span-8 flex flex-col bg-white rounded-3xl border border-ivory-300 shadow-card h-[680px] overflow-hidden">
          
          {/* Chat Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-ivory-50/40">
            {messages.map((msg, idx) => (
              <div
                key={msg.id || idx}
                className={`flex items-start gap-3 ${
                  msg.sender_role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-xs ${
                    msg.sender_role === 'user'
                      ? 'bg-teal-800 text-white'
                      : 'bg-ivory-200 text-teal-900 border border-ivory-300'
                  }`}
                >
                  {msg.sender_role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-teal-800" />}
                </div>

                {/* Message Body */}
                <div className={`max-w-[80%] space-y-1 ${msg.sender_role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs whitespace-pre-line ${
                      msg.sender_role === 'user'
                        ? 'bg-teal-800 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-ivory-300 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>

                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 px-1">
                    <span>{msg.timestamp}</span>
                    {msg.sender_role === 'assistant' && (
                      <>
                        <span>•</span>
                        <span className="text-teal-700 font-medium">Grounded AI</span>
                        <button
                          onClick={() => handleCopy(msg.content, idx)}
                          className="hover:text-slate-600 transition-colors ml-1"
                          title="Copy reply"
                        >
                          {copiedIndex === idx ? (
                            <Check className="w-3 h-3 text-emerald-600 inline" />
                          ) : (
                            <Copy className="w-3 h-3 inline" />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-ivory-200 text-teal-900 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-teal-800" />
                </div>
                <div className="bg-white p-3.5 rounded-2xl rounded-tl-none border border-ivory-300 shadow-xs flex items-center space-x-2">
                  <span className="text-xs text-teal-900 font-medium font-serif">Consulting verified hotel records</span>
                  <div className="flex space-x-1">
                    <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 border-t border-ivory-300 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Ask ${currentHotel?.name || 'Concierge'} in ${selectedLanguage.toUpperCase()}...`}
                disabled={loading}
                className="flex-1 px-4 py-3 text-xs sm:text-sm border border-ivory-300 rounded-xl bg-ivory-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className="p-3 rounded-xl bg-teal-800 text-ivory-50 hover:bg-teal-900 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Grounded Hotel Knowledge & Quick Prompts */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Quick Prompts Box */}
          <div className="bg-white rounded-3xl p-5 border border-ivory-300 shadow-card space-y-3">
            <div className="flex items-center space-x-2 text-teal-950 font-serif font-bold text-sm">
              <Sparkles className="w-4 h-4 text-royal-gold" />
              <span>Suggested Inquiries</span>
            </div>
            <div className="space-y-1.5">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  disabled={loading}
                  className="w-full text-left p-2.5 rounded-xl bg-ivory-100 hover:bg-teal-50 hover:border-teal-200 border border-ivory-200 text-xs text-slate-700 transition-colors flex items-center justify-between group disabled:opacity-50"
                >
                  <span className="line-clamp-1">{prompt}</span>
                  <Send className="w-3 h-3 text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-1.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Grounded Hotel Details Drawer */}
          {currentHotel && (
            <div className="bg-white rounded-3xl p-5 border border-ivory-300 shadow-card space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-ivory-200">
                <span className="font-serif font-bold text-teal-950 text-sm">Verified Property Specs</span>
                <span className="text-[10px] bg-royal-sand text-teal-900 px-2 py-0.5 rounded font-bold">
                  {currentHotel.star_rating}★
                </span>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">Check-in / Check-out</span>
                <p className="text-slate-500">
                  From {currentHotel.check_in_time} / Until {currentHotel.check_out_time}
                </p>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">Fine Dining Highlights</span>
                <ul className="text-slate-500 space-y-1">
                  {currentHotel.dining_info?.slice(0, 2).map((d, i) => (
                    <li key={i} className="line-clamp-1">
                      • <strong>{d.name}</strong> ({d.cuisine})
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">Spa & Facilities</span>
                <ul className="text-slate-500 space-y-1">
                  {currentHotel.facilities_info?.slice(0, 2).map((f, i) => (
                    <li key={i} className="line-clamp-1">
                      • <strong>{f.facility}</strong>: {f.timings}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-ivory-200 flex items-center justify-between text-[11px] text-teal-800 font-medium">
                <span>Front Desk Dial: 0</span>
                <span>{currentHotel.contact_phone}</span>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

