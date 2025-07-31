import { useState, useEffect, useRef } from "react";
import { FaComments, FaPaperPlane } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

type ChatMessage = {
  from: "bot" | "user";
  text: string;
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: "bot", text: "👋 Hi! How may I help you today?" },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getBotResponse = (message: string): string => {
    const lower = message.toLowerCase();
    if (lower.includes("appointment")) {
      return "📅 To book or check your appointments, please go to the Appointments section.";
    } else if (lower.includes("doctor")) {
      return "🩺 You can view available doctors in the Doctors section.";
    } else if (lower.includes("prescription")) {
      return "💊 You can view or request prescriptions in the Prescriptions tab.";
    } else if (lower.includes("thanks") || lower.includes("thank you")) {
      return "😊 You're welcome! Let me know if you need anything else.";
    } else {
      return "🤔 Sorry, I didn’t understand that. Please try asking about appointments, doctors, or prescriptions.";
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    const botReply = getBotResponse(input);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg"
      >
        <FaComments size={24} />
      </button>

      {/* Chat Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="w-80 h-96 bg-white shadow-lg rounded-xl mt-3 flex flex-col overflow-hidden"
          >
            <div className="bg-blue-600 text-white px-4 py-3 font-semibold">
              SwiftCare Assistant
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg max-w-[70%] ${
                      msg.from === "user"
                        ? "bg-blue-100 text-right"
                        : "bg-gray-100 text-left"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="text-gray-400 text-xs animate-pulse">
                  Bot is typing...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="flex border-t p-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="flex-1 px-3 py-1 border rounded-full outline-none text-sm"
              />
              <button
                onClick={handleSend}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <FaPaperPlane />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWidget;
