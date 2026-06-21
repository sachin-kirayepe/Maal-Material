import React, { useState, useRef, useEffect } from "react";
import { useAINegotiationStore } from "../../stores/aiNegotiationStore";
import { MessageBubble } from "./MessageBubble";
import {
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
} from "lucide-react";
const Send = SendIcon as any;
const CheckCircle = CheckCircleIcon as any;
const XCircle = XCircleIcon as any;

export function AIChatInterface() {
  const { messages, isNegotiating, sendMessage, acceptOffer, rejectOffer, endNegotiation } =
    useAINegotiationStore();
  const [inputText, setInputText] = useState("");
  const [proposedQuantity, setProposedQuantity] = useState(1);
  const [proposedPrice, setProposedPrice] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isNegotiating) return null;

  const handleSend = () => {
    if (!inputText.trim() && !proposedPrice) return;

    const priceNum = proposedPrice ? parseFloat(proposedPrice) : undefined;
    sendMessage(inputText, proposedQuantity, priceNum);
    setInputText("");
    setProposedPrice("");
  };

  return (
    <div className="fixed bottom-6 right-6 w-96 max-h-[600px] flex flex-col bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 px-4 py-3 flex justify-between items-center text-white">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-sm tracking-wide">Maal-Material AI Negotiator</span>
        </div>
        <button
          onClick={endNegotiation}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <XCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-slate-50 min-h-[300px] max-h-[400px]">
        {messages.map((msg) => (
          <div key={msg.id}>
            <MessageBubble
              sender={msg.sender}
              text={msg.text}
              time={msg.timestamp}
              isCyberpunk={false}
            />
            {msg.sender === "AI" && msg.meta && msg.meta.accepted === false && (
              <div className="flex justify-start ml-10 mb-4 space-x-2">
                <button
                  onClick={() => acceptOffer(msg.id)}
                  className="flex items-center px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-200 transition-colors"
                >
                  <CheckCircle className="w-3 h-3 mr-1" /> Accept Offer
                </button>
                <button
                  onClick={() => rejectOffer(msg.id)}
                  className="flex items-center px-3 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition-colors"
                >
                  <XCircle className="w-3 h-3 mr-1" /> Decline
                </button>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100 space-y-3">
        <div className="flex space-x-2">
          <div className="w-1/2">
            <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Qty</label>
            <input
              type="number"
              value={proposedQuantity}
              onChange={(e) => setProposedQuantity(parseInt(e.target.value) || 1)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
            />
          </div>
          <div className="w-1/2">
            <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">
              Propose Price ($)
            </label>
            <input
              type="number"
              value={proposedPrice}
              onChange={(e) => setProposedPrice(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type message to AI..."
            className="flex-1 bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
