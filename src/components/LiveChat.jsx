import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useLanguage } from '../i18n/LanguageContext';

const MAX_MESSAGES = 50;

function LiveChat() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // 1. முந்தைய மெசேஜ்களை டேட்டாபேஸில் இருந்து எடுப்பது மற்றும் Realtime சப்ஸ்கிரைப் செய்வது
  useEffect(() => {
    fetchMessages();

    // Supabase Realtime Channel for live multi-user chat
    const channel = supabase
      .channel('public:chat_messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload) => {
          setMessages((prev) => [payload.new, ...prev].slice(0, MAX_MESSAGES));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchMessages() {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(MAX_MESSAGES);

    if (!error && data) {
      setMessages(data);
    }
  }

  const handleSend = async (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim() || loading) return;

    setLoading(true);

    const newMessage = {
      user: name.trim().slice(0, 24),
      text: text.trim().slice(0, 280),
    };

    // Supabase டேட்டாபேஸுக்கு மெசேஜை அனுப்புதல்
    const { error } = await supabase
      .from('chat_messages')
      .insert([newMessage]);

    if (!error) {
      setText('');
    }

    setLoading(false);
  };

  return (
    <section className="bg-stage-surface border border-stage-line rounded-xl p-5 my-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-ivory text-base">{t('chatTitle') || 'Live Fan Chat'}</h3>
        <span className="text-[11px] text-muted">{t('chatNote') || 'Chat live with other fans!'}</span>
      </div>

      <div ref={scrollRef} className="h-56 overflow-y-auto bg-stage-black rounded-lg border border-stage-line p-3 space-y-2 mb-4 flex flex-col-reverse">
        {messages.length === 0 ? (
          <p className="text-sm text-muted text-center py-8">{t('chatEmpty') || 'No messages yet. Be the first to chat!'}</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id || Math.random()} className="bg-stage-raised/70 rounded-lg px-3 py-2 text-sm">
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
          placeholder={t('chatNamePlaceholder') || 'Your Name'}
          maxLength={24}
          className="bg-stage-black border border-stage-line rounded-lg px-3 py-2.5 text-sm text-ivory placeholder:text-muted focus:outline-none focus:border-gold/60 sm:w-40"
        />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('chatMessagePlaceholder') || 'Type your message...'}
          maxLength={280}
          className="bg-stage-black border border-stage-line rounded-lg px-3 py-2.5 text-sm text-ivory placeholder:text-muted focus:outline-none focus:border-gold/60 flex-1"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-crimson hover:bg-crimson-bright text-ivory font-semibold px-5 py-2.5 rounded-lg text-sm transition disabled:opacity-50"
        >
          {loading ? 'Sending...' : (t('chatSend') || 'Send')}
        </button>
      </form>
    </section>
  );
}

export default LiveChat;