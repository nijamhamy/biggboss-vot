import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const STORAGE_KEY = 'bb_chat_messages';
const MAX_MESSAGES = 50;

/**
 * This keeps chat local to each visitor's browser (via localStorage) so it
 * works with zero backend setup. For a real cross-visitor live chat, swap
 * the local state below for a Supabase table + Realtime subscription:
 *
 *   const channel = supabase
 *     .channel('fan-chat')
 *     .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
 *       setMessages((prev) => [payload.new, ...prev].slice(0, MAX_MESSAGES));
 *     })
 *     .subscribe();
 */
function LiveChat() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    const newMessage = {
      id: Date.now(),
      user: name.trim().slice(0, 24),
      text: text.trim().slice(0, 280),
    };

    setMessages((prev) => [newMessage, ...prev].slice(0, MAX_MESSAGES));
    setText('');
  };

  return (
    <section className="bg-stage-surface border border-stage-line rounded-xl p-5 my-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-ivory text-base">{t('chatTitle')}</h3>
        <span className="text-[11px] text-muted">{t('chatNote')}</span>
      </div>

      <div ref={scrollRef} className="h-56 overflow-y-auto bg-stage-black rounded-lg border border-stage-line p-3 space-y-2 mb-4">
        {messages.length === 0 ? (
          <p className="text-sm text-muted text-center py-8">{t('chatEmpty')}</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="bg-stage-raised/70 rounded-lg px-3 py-2 text-sm">
              <span className="font-semibold text-gold mr-2">{msg.user}:</span>
              <span className="text-ivory/90 break-words">{msg.text}</span>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSend} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('chatNamePlaceholder')}
          maxLength={24}
          className="bg-stage-black border border-stage-line rounded-lg px-3 py-2.5 text-sm text-ivory placeholder:text-muted focus:outline-none focus:border-gold/60 sm:w-40"
        />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('chatMessagePlaceholder')}
          maxLength={280}
          className="bg-stage-black border border-stage-line rounded-lg px-3 py-2.5 text-sm text-ivory placeholder:text-muted focus:outline-none focus:border-gold/60 flex-1"
        />
        <button
          type="submit"
          className="bg-crimson hover:bg-crimson-bright text-ivory font-semibold px-5 py-2.5 rounded-lg text-sm transition"
        >
          {t('chatSend')}
        </button>
      </form>
    </section>
  );
}

export default LiveChat;
