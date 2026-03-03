import { useState } from "react";
import { useAppStore } from "../store/useAppStore";

export default function TrainingPage() {
  const {
    activeConversationId,
    messagesByConversation,
    addMessage,
  } = useAppStore();

  const [input, setInput] = useState("");

  const messages = messagesByConversation[activeConversationId] || [];

  const handleSend = () => {
    if (!input.trim()) return;

    addMessage(activeConversationId, {
      from: "bot",
      text: input,
    });

    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Entrenamiento del Bot</h2>
      </div>

      {/* Chat Simulation */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
              msg.from === "bot"
                ? "bg-black text-white self-end ml-auto"
                : "bg-neutral-200"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Modificar respuesta del bot..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-black text-white rounded-lg text-sm"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}