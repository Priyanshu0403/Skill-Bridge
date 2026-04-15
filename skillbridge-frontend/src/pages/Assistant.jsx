import { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const seedPrompts = [
  'How can I improve my profile for better gigs?',
  'What does the resume parser extract?',
  'Explain paid gigs vs barter gigs.',
];

const Assistant = () => {
  const { profile } = useContext(AuthContext);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi ${profile?.full_name?.split(' ')?.[0] || 'there'}, I can help with profiles, gigs, resume uploads, and how SkillBridge works.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [suggestions, setSuggestions] = useState(seedPrompts);

  const canSend = useMemo(() => input.trim().length > 0 && !sending, [input, sending]);

  const sendMessage = async (overrideMessage) => {
    const message = String(overrideMessage ?? input).trim();
    if (!message || sending) {
      return;
    }

    const nextMessages = [...messages, { role: 'user', content: message }];
    setMessages(nextMessages);
    setInput('');
    setSending(true);

    try {
      const response = await api.post('/api/chat/message', {
        message,
        history: nextMessages.slice(-6),
      });

      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: response.data?.reply || 'I could not generate a response right now.',
        },
      ]);

      setSuggestions(
        Array.isArray(response.data?.suggestions) && response.data.suggestions.length > 0
          ? response.data.suggestions
          : seedPrompts
      );
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: error.response?.data?.message || 'The assistant is unavailable right now.',
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_35%),linear-gradient(180deg,#f8fafc_0%,#ecfdf5_100%)]">
      <nav className="border-b border-emerald-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">AI Workspace</p>
            <h1 className="text-2xl font-light text-slate-900">SkillBridge Assistant</h1>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/dashboard" className="text-slate-600 transition-colors hover:text-slate-900">Dashboard</Link>
            <Link to="/resume" className="text-slate-600 transition-colors hover:text-slate-900">Resume Parser</Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-3xl border border-emerald-100 bg-white/80 p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-900">What it can help with</p>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>Platform guidance for gigs, payments, recommendations, and profiles.</p>
            <p>Resume upload tips before parsing and applying fields to your profile.</p>
            <p>Personalized suggestions using your current SkillBridge profile context.</p>
          </div>
          <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900">
            <p className="font-medium">Current skills</p>
            <p className="mt-2">{profile?.skills?.length ? profile.skills.join(', ') : 'No skills added yet.'}</p>
          </div>
        </aside>

        <section className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-xl shadow-emerald-100/60">
          <div className="mb-6 flex flex-wrap gap-3">
            {suggestions.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-900 transition hover:border-emerald-400 hover:bg-emerald-100"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="h-[28rem] space-y-4 overflow-y-auto rounded-3xl bg-slate-50 p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[85%] rounded-3xl px-5 py-4 text-sm leading-7 ${
                  message.role === 'user'
                    ? 'ml-auto bg-slate-900 text-white'
                    : 'bg-white text-slate-700 shadow-sm'
                }`}
              >
                {message.content}
              </div>
            ))}
            {sending && (
              <div className="max-w-[85%] rounded-3xl bg-white px-5 py-4 text-sm text-slate-500 shadow-sm">
                Thinking through your question...
              </div>
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
            className="mt-6 flex flex-col gap-3 sm:flex-row"
          >
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about recommendations, profiles, payments, or resume uploads..."
              rows="3"
              className="min-h-[76px] flex-1 rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-700 outline-none transition focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!canSend}
              className="rounded-3xl bg-emerald-700 px-6 py-4 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Send message'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Assistant;
