"use client";

import React, { useState } from "react";
import { useCopilotStore } from "../../../../stores/copilotStore";

export default function Copilot() {
  const { activeConversation, sendMessage, isLoading } = useCopilotStore();
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;
    sendMessage(input, activeConversation?.id);
    setInput("");
  };

  const history = activeConversation ? JSON.parse(activeConversation.history) : [];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <h1 className="text-2xl font-bold text-gray-900">Maal-Material AI Copilot</h1>

      <div className="flex-1 bg-white p-6 rounded-lg shadow border border-gray-100 overflow-y-auto min-h-[400px]">
        {history.length === 0 ? (
          <p className="text-gray-500 text-center mt-20">
            Start a conversation with the AI Copilot. Ask about inventory, logistics, or operational
            risks.
          </p>
        ) : (
          <div className="space-y-4">
            {history.map((msg: any, idx: number) => (
              <div
                key={idx}
                className={`p-4 rounded-lg max-w-3xl ${msg.role === "user" ? "bg-blue-50 ml-auto border border-blue-100" : "bg-gray-50 mr-auto border border-gray-200"}`}
              >
                <p className="text-sm font-semibold mb-1">
                  {msg.role === "user" ? "You" : "AI Copilot"}
                </p>
                <p className="text-gray-800 whitespace-pre-wrap">{msg.content}</p>
              </div>
            ))}
            {isLoading && <p className="text-gray-500 italic">Thinking...</p>}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about top contractors, low stock, or operational inefficiencies..."
          className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
