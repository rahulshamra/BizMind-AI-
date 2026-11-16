import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { sendChat } from "../services/api.js";
import { chatGreeting, chatSuggestions } from "../data/mockData.js";

export default function AIChat() {
  const [messages, setMessages] = useState([chatGreeting]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  async function send(text) {
    const message = text.trim();
    if (!message || busy) return;
    setMessages((m) => [...m, { role: "user", text: message }]);
    setInput("");
    setBusy(true);
    try {
      const { reply } = await sendChat(message);
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "I couldn't reach the server. Check that the API is running, then try again.", error: true }]);
    } finally {
      setBusy(false);
    }
  }

  const bubble = (m) =>
    m.role === "user"
      ? "self-end rounded-br-sm bg-brand text-white"
      : m.error
        ? "self-start rounded-bl-sm bg-[#F6DAD4] text-bad"
        : "self-start rounded-bl-sm bg-bg";

  return (
    <section className="panel flex h-[calc(100vh-170px)] min-h-[420px] flex-col">
      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto pb-3" aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={`max-w-[90%] rounded-xl px-3.5 py-2.5 md:max-w-[70%] ${bubble(m)}`}>{m.text}</div>
        ))}
        {busy && <div className="max-w-[70%] self-start rounded-xl rounded-bl-sm bg-bg px-3.5 py-2.5 text-muted">Thinking…</div>}
        <div ref={endRef} />
      </div>
      <div className="flex flex-wrap gap-2 pb-3 pt-2">
        {chatSuggestions.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            disabled={busy}
            className="cursor-pointer rounded-full border border-line px-3 py-1 text-[13px] hover:border-brand hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>
      <div className="flex gap-2.5">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Ask about your business…"
          aria-label="Message"
          className="flex-1 rounded-md border border-line px-3.5 py-2.5"
        />
        <button
          onClick={() => send(input)}
          disabled={busy || !input.trim()}
          className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-brand px-[18px] py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={16} /> Send
        </button>
      </div>
    </section>
  );
}
