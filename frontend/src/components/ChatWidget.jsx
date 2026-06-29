import { useState, useRef, useEffect, useCallback } from 'react';
import { useCityData } from '../context/CityDataContext';
import { sendChatMessage } from '../api/client';
import './ChatWidget.css';

const SUGGESTIONS = [
  'Which zone is hottest?',
  'Best cooling material?',
  'Explain heat drivers',
  'Compare cool roofs vs green roofs',
];

/**
 * Minimal markdown-to-HTML: bold, bullets, inline code.
 * No heavy dependency needed for chat-sized content.
 */
function renderMarkdown(text) {
  if (!text) return '';
  return text
    // code blocks (triple backtick) – simplified
    .replace(/```[\s\S]*?```/g, (m) => {
      const code = m.replace(/```\w*\n?/g, '').trim();
      return `<pre><code>${code}</code></pre>`;
    })
    // inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // unordered list items (- or *)
    .replace(/^[\-\*]\s+(.+)$/gm, '<li>$1</li>')
    // wrap consecutive <li> in <ul>
    .replace(/(<li>.*?<\/li>\n?)+/gs, (m) => `<ul>${m}</ul>`)
    // numbered list items
    .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
    // paragraphs — double newline
    .replace(/\n{2,}/g, '</p><p>')
    // single newline → <br>
    .replace(/\n/g, '<br>')
    // wrap in paragraph
    .replace(/^(.+)$/s, '<p>$1</p>');
}

export default function ChatWidget() {
  const { selectedCityId, selectedCity } = useCityData();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]); // { role: 'user'|'bot', text: string }
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = useCallback(async (overrideMessage) => {
    const text = (overrideMessage || input).trim();
    if (!text || isLoading) return;

    setInput('');
    setError(null);

    const userMsg = { role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Build history for multi-turn (exclude the message we're about to send)
      const history = messages.map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const data = await sendChatMessage(text, selectedCityId, history);
      const botMsg = { role: 'bot', text: data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const detail = err?.response?.data?.detail || err.message || 'Something went wrong';
      setError(detail);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, selectedCityId]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (text) => {
    handleSend(text);
  };

  const cityLabel = selectedCity?.city_name || selectedCityId;
  const hasMessages = messages.length > 0;

  return (
    <>
      {/* Floating Action Button */}
      <button
        id="chat-fab"
        className={`chat-fab ${isOpen ? 'is-open' : ''}`}
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? 'Close chat' : 'Open AI assistant'}
        title="HEATESCAPE AI Assistant"
      >
        {isOpen ? '✕' : '🤖'}
        {!isOpen && !hasMessages && <span className="fab-badge" />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="chat-panel" role="dialog" aria-label="AI Chat Assistant">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-dot" />
            <div className="chat-header-info">
              <div className="chat-header-title">HEATESCAPE AI</div>
              <div className="chat-header-sub">
                Heat expert · {cityLabel}
              </div>
            </div>
            <button
              className="chat-header-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages" id="chat-messages-area">
            {!hasMessages && (
              <div className="chat-welcome">
                <span className="chat-welcome-icon">🔥</span>
                <div className="chat-welcome-title">Ask Me Anything</div>
                <div className="chat-welcome-desc">
                  I'm your urban heat intelligence assistant.
                  Ask about zones, cooling strategies, or heat drivers for <strong>{cityLabel}</strong>.
                </div>
                <div className="chat-suggestions">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      className="chat-suggestion-chip"
                      onClick={() => handleSuggestion(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role === 'user' ? 'is-user' : 'is-bot'}`}>
                <div className="chat-msg-avatar">
                  {msg.role === 'user' ? '👤' : '🔥'}
                </div>
                <div
                  className="chat-msg-bubble"
                  dangerouslySetInnerHTML={{
                    __html: msg.role === 'bot' ? renderMarkdown(msg.text) : msg.text,
                  }}
                />
              </div>
            ))}

            {isLoading && (
              <div className="chat-typing">
                <div className="chat-typing-avatar">🔥</div>
                <div className="chat-typing-dots">
                  <span /><span /><span />
                </div>
              </div>
            )}

            {error && (
              <div className="chat-error">
                ⚠ {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-input-area">
            <div className="chat-input-wrap">
              <textarea
                ref={inputRef}
                id="chat-input"
                className="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask about ${cityLabel}...`}
                rows={1}
                disabled={isLoading}
              />
            </div>
            <button
              id="chat-send-btn"
              className="chat-send-btn"
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
