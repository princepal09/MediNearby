import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, MapPin, Clock, Phone, Star } from "lucide-react";

export default function SmartChatbot({ doctorsData = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hi! I'm MediBot. I can help you:\n• Find nearby doctors\n• Book appointments\n• Get emergency contacts\n• Check symptoms", timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => setIsOpen((prev) => !prev);

  const addBotMessage = (text, delay = 800) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text, timestamp: new Date() }]);
      setIsTyping(false);
    }, delay);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { from: "user", text: userMsg, timestamp: new Date() }]);
    setInput("");

    const response = handleQuery(userMsg.toLowerCase());
    addBotMessage(response);
  };

  const handleQuery = (query) => {
    // Emergency detection
    if (query.includes("emergency") || query.includes("urgent") || query.includes("911")) {
      return "🚨 EMERGENCY SERVICES:\n📞 Ambulance: 911\n📞 Poison Control: 1-800-222-1222\n\nFor immediate danger, please call 911 now!";
    }

    // Appointment booking
    if (query.includes("book") || query.includes("appointment") || query.includes("schedule")) {
      return "📅 To book an appointment:\n1. Choose a doctor from search results\n2. I'll show available slots\n3. Confirm your preferred time\n\nWhich specialist would you like to see?";
    }

    // Symptom checker
    if (query.includes("symptom") || query.includes("pain") || query.includes("fever") || query.includes("sick")) {
      return "🩺 I can help with basic symptom guidance, but please consult a doctor for proper diagnosis.\n\nCommon concerns:\n• Fever → See General Physician\n• Chest pain → See Cardiologist (Emergency if severe)\n• Skin issues → See Dermatologist\n\nWhat symptoms are you experiencing?";
    }

    // Hours/timing
    if (query.includes("hours") || query.includes("open") || query.includes("timing")) {
      return "🕐 Most clinics operate:\nMon-Fri: 9 AM - 6 PM\nSat: 10 AM - 4 PM\nSun: Closed (Emergency only)\n\nWant to find a specific clinic's hours?";
    }

    // Doctor specialties
    const specialties = {
      "cardiologist": "heart and cardiovascular",
      "dermatologist": "skin conditions",
      "pediatrician": "children's health",
      "orthopedic": "bones and joints",
      "neurologist": "brain and nervous system",
      "psychiatrist": "mental health",
      "dentist": "dental and oral care",
      "ophthalmologist": "eye care",
      "gynecologist": "women's health"
    };

    for (const [specialty, description] of Object.entries(specialties)) {
      if (query.includes(specialty)) {
        const matched = doctorsData.filter(
          (d) => d.specialty?.toLowerCase().includes(specialty)
        );

        if (matched.length > 0) {
          const top3 = matched.slice(0, 3);
          const list = top3.map((d, i) => 
            `${i + 1}. Dr. ${d.name || "Unknown"}\n   ⭐ ${d.rating || "4.5"}/5 | ${d.specialty}\n   📍 ${d.location || "City Center"} | ${d.distance || "2.3km away"}`
          ).join("\n\n");
          return `✅ Found ${matched.length} ${specialty}s (${description}):\n\n${list}\n\nWould you like to book an appointment?`;
        } else {
          return `😕 No ${specialty}s found nearby. Try:\n• Expanding search radius\n• Checking nearby cities\n• Trying 'general physician'`;
        }
      }
    }

    // Pharmacy
    if (query.includes("pharmacy") || query.includes("medicine") || query.includes("drug")) {
      return "💊 24/7 Pharmacies Nearby:\n1. HealthPlus Pharmacy (0.5 km)\n2. MediCare Drug Store (1.2 km)\n3. QuickMeds Express (1.8 km)\n\nNeed directions to any?";
    }

    // Ratings/reviews
    if (query.includes("rating") || query.includes("review") || query.includes("best")) {
      return "⭐ Top Rated Doctors:\n1. Dr. Sarah Johnson (4.9/5) - Cardiology\n2. Dr. Michael Chen (4.8/5) - Pediatrics\n3. Dr. Emily Rodriguez (4.7/5) - Dermatology\n\nWant details on any doctor?";
    }

    // Default help
    return "I can assist you with:\n\n🔍 Find doctors by specialty\n📅 Book appointments\n🚨 Emergency contacts\n💊 Locate pharmacies\n⭐ Check ratings & reviews\n🩺 Symptom guidance\n\nWhat do you need help with?";
  };

  const QuickAction = ({ icon: Icon, label, query }) => (
    <button
      onClick={() => {
        setMessages((prev) => [...prev, { from: "user", text: query, timestamp: new Date() }]);
        const response = handleQuery(query.toLowerCase());
        addBotMessage(response);
      }}
      className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-lg text-xs font-medium text-gray-700 transition-all hover:scale-105"
    >
      <Icon size={14} className="text-blue-600" />
      {label}
    </button>
  );

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all z-[99999] flex items-center justify-center group"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
          </>
        )}
      </button>

      {/* Chatbot Box */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-[99999] animate-slideUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">MediBot Assistant</h3>
                <p className="text-xs opacity-90">● Online now</p>
              </div>
            </div>
            <button onClick={toggleChat} className="hover:bg-white/20 p-1 rounded-lg transition">
              <X size={20} />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-3 bg-gradient-to-b from-gray-50 to-white border-b flex gap-2 overflow-x-auto">
            <QuickAction icon={MapPin} label="Find Doctors" query="show nearby doctors" />
            <QuickAction icon={Clock} label="Book" query="book appointment" />
            <QuickAction icon={Phone} label="Emergency" query="emergency contacts" />
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-96 bg-gradient-to-b from-white to-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-end gap-2 ${msg.from === "user" ? "flex-row-reverse" : "flex-row"} animate-fadeIn`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.from === "user" 
                    ? "bg-gradient-to-br from-blue-500 to-purple-500" 
                    : "bg-gradient-to-br from-gray-100 to-gray-200"
                }`}>
                  {msg.from === "user" ? (
                    <User size={16} className="text-white" />
                  ) : (
                    <Bot size={16} className="text-gray-600" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[75%] ${msg.from === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm ${
                      msg.from === "user"
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-sm"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>
                  </div>
                  <span className="text-xs text-gray-400 px-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-end gap-2 animate-fadeIn">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Bot size={16} className="text-gray-600" />
                </div>
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex border-t border-gray-200 bg-white p-3 gap-2">
            <input
              type="text"
              value={input}
              placeholder="Type your message..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 px-4 py-3 outline-none text-sm bg-gray-50 rounded-full border border-gray-200 focus:border-blue-400 focus:bg-white transition"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-full hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Send size={18} />
            </button>
          </div>

          {/* Powered by */}
          <div className="px-4 py-2 bg-gray-50 text-center text-xs text-gray-500 border-t">
            Powered by MediBot AI • Always consult a real doctor
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}