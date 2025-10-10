import React, { useState } from "react";
import api from "../../api";
import { marked } from "marked";

marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: true,
});

export default function AIChat() {
  const [responses, setResponses] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function callGemini(rawUserText) {
    const res = await api.post("/projects/askGemini", {
      input: rawUserText,
    });
    // Expect a JSON response with a raw text field, e.g. { "text": "..." }
    const data = await res.data.text;
    // The UI must use data.text (raw) and render it as plain escaped text.
    return data ?? "";
  }

  async function handleSend() {
    if (!input.trim()) return;
    setLoading(true);
    try {
      // --- Replace with real API call ---
      const text = await callGemini(input);
      // --- end placeholder ---
      setResponses((prev) => [{ text }, ...prev]);
      setInput("");
    } catch (e) {
      setResponses((prev) => [
        { text: "Error: failed to fetch response." },
        ...prev,
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full max-h-screen relative mb-16 style-4">
      <div className="w-full p-6 border-t border-gray-200 flex items-center gap-3 bg-white sticky top-0 left-0">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
          placeholder="What Do You Want To Know..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
          onClick={handleSend}
          disabled={loading}
        >
          Send
        </button>
      </div>
      <div className="w-full overflow-y-auto p-2 gap-8 flex flex-col style-4">
        {responses.length < 1 && (
          <div className="text-gray-500 text-center">
            The chat will be cleared on refresh
          </div>
        )}
        {loading && <div className="p-4 ">Loading...</div>}
        {responses.map((r, idx) => (
          <div
            key={idx}
            className="text-wrap prose p-4  bg-white text-gray-900 x style-4"
            dangerouslySetInnerHTML={{ __html: marked(r.text) }}
          />
        ))}
      </div>
    </div>
  );
}
