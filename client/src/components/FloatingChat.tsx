"use client";
import React, { useEffect, useState, useRef } from "react";
import { Input, Button, List, Avatar, message, Select } from "antd";
import { 
  MessageOutlined, 
  CloseOutlined, 
  SendOutlined, 
  DeleteOutlined,
  HistoryOutlined,
  PlusOutlined
} from "@ant-design/icons";

type Msg = { 
  id: string; 
  role: "user" | "assistant" | "system"; 
  text: string;
  model?: string;
  latency?: number;
};

const PROVIDERS = [
  { value: "gemini", label: "Gemini 3.5 Flash", color: "#1a73e8" },
  { value: "groq", label: "Groq Llama 3.3", color: "#f55f24" },
  { value: "cohere", label: "Cohere Command R", color: "#00a76f" },
  { value: "mistral", label: "Mistral Tiny", color: "#ff4a00" },
  { value: "openrouter", label: "OpenRouter Gemini", color: "#7c3aed" }
];

const SUGGESTIONS = [
  { text: "🏠 Predict a property listing price", prompt: "How do I predict the price of a property? What details do you need?" },
  { text: "📈 View current real estate market trends", prompt: "What are the latest real estate market trends and predictions?" },
  { text: "✨ Compare the different routing models", prompt: "Can you explain the difference between the Gemini, Groq, Cohere, Mistral, and OpenRouter models used here?" }
];

const getModelColor = (modelName: string) => {
  const normalized = String(modelName).toLowerCase();
  const provider = PROVIDERS.find(p => normalized.includes(p.value));
  return provider ? provider.color : "#6366f1";
};

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [model, setModel] = useState<string>("gemini");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Chat history states
  const [conversations, setConversations] = useState<any[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const chatBodyRef = useRef<HTMLDivElement>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Auto scroll to bottom when new messages arrive or loading state changes
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Fetch conversations list when chat opens
  useEffect(() => {
    if (open) {
      fetchConversations();
    }
  }, [open]);

  async function fetchConversations() {
    try {
      const res = await fetch(`${API_URL}/api/chat/conversations`);
      const json = await res.json();
      if (res.ok && json.success) {
        setConversations(json.conversations || []);
      }
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    }
  }

  async function selectConversation(id: string) {
    setConversationId(id);
    setShowHistory(false);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/chat/conversations/${id}`);
      const json = await res.json();
      if (res.ok && json.success) {
        const mapped: Msg[] = json.messages.map((m: any) => ({
          id: m.id,
          role: m.role,
          text: m.content,
          model: m.model,
          latency: m.latency
        }));
        setMessages(mapped);
      } else {
        message.error("Failed to load messages");
      }
    } catch (err) {
      message.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  }

  function startNewConversation() {
    setConversationId(null);
    setMessages([]);
    setShowHistory(false);
  }

  async function handleDeleteConversation(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      const res = await fetch(`${API_URL}/api/chat/conversations/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        message.success("Conversation deleted");
        fetchConversations();
        if (conversationId === id) {
          startNewConversation();
        }
      } else {
        message.error("Failed to delete conversation");
      }
    } catch (err) {
      message.error("Error deleting conversation");
    }
  }

  async function send(customText?: string) {
    const promptText = customText !== undefined ? customText.trim() : text.trim();
    if (!promptText) return;

    const id = String(Date.now());
    const userMsg: Msg = { id, role: "user", text: promptText };
    setMessages(prev => [...prev, userMsg]);
    
    if (customText === undefined) {
      setText("");
    }
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: model,
          message: promptText,
          conversationId: conversationId || undefined
        })
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to receive response from backend");
      }

      if (json.conversationId && conversationId !== json.conversationId) {
        setConversationId(json.conversationId);
      }

      const botMsg: Msg = {
        id: id + "-bot",
        role: "assistant",
        text: String(json.response),
        model: json.model,
        latency: json.latency
      };

      setMessages(prev => [...prev, botMsg]);
      fetchConversations();
    } catch (err: any) {
      const errorText = err.message || "Failed to connect to backend server";
      message.error(errorText);
      
      const errorMsg: Msg = {
        id: String(Date.now()) + "-error",
        role: "assistant",
        text: `Error: ${errorText}. Please verify the backend Express server is running on port 8000.`
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  useEffect(() => {
    const handleOpenChat = () => setOpen(true);
    window.addEventListener("rezox-open-chat", handleOpenChat);
    return () => window.removeEventListener("rezox-open-chat", handleOpenChat);
  }, []);

  return (
    <>
      <style>{`
        .typing-indicator {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 10px 14px;
          border-radius: 16px;
          background: var(--bg-elevated);
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          color: var(--text-muted);
          font-size: 13px;
          border: 1px solid var(--border);
        }
        .typing-dot {
          width: 5px;
          height: 5px;
          background-color: var(--text-muted);
          border-radius: 50%;
          display: inline-block;
          animation: typing-bounce 1.4s infinite ease-in-out both;
        }
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes typing-bounce {
          0%, 80%, 100% { transform: scale(0.3); opacity: 0.3; }
          40% { transform: scale(1.1); opacity: 1; }
        }
        .suggestion-chip {
          display: block;
          width: 100%;
          text-align: left;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 12px 14px;
          margin-bottom: 8px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 13px;
          color: var(--text);
          font-weight: 500;
        }
        .suggestion-chip:hover {
          transform: translateY(-2px);
          border-color: var(--brand);
          background: var(--bg-soft);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
        }
        .latency-badge {
          font-size: 11px;
          opacity: 0.8;
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
          padding-left: 6px;
        }
        .floating-chat-container {
          animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideUp {
          from { transform: translateY(24px) scale(0.96); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .chat-select .ant-select-selector {
          background: rgba(255, 255, 255, 0.15) !important;
          border: 1px solid rgba(255, 255, 255, 0.25) !important;
          color: #fff !important;
          border-radius: 8px !important;
          font-size: 12px !important;
          font-weight: 500 !important;
        }
        .chat-select .ant-select-arrow {
          color: #fff !important;
        }
        .history-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          margin-bottom: 6px;
          border-radius: 10px;
          cursor: pointer;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          transition: all 0.2s;
        }
        .history-item:hover {
          border-color: var(--brand);
          background: var(--bg-soft);
        }
        .history-item.active {
          border-color: var(--brand);
          background: rgba(99, 102, 241, 0.08);
        }
      `}</style>

      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            right: 24,
            bottom: 24,
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)",
            border: "none",
            color: "#fff",
            fontSize: 24,
            cursor: "pointer",
            boxShadow: "0 6px 20px rgba(99, 102, 241, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.08) translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(99, 102, 241, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1) translateY(0)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(99, 102, 241, 0.4)";
          }}
        >
          <MessageOutlined />
        </button>
      )}

      {open && (
        <div
          className="floating-chat-panel floating-chat-container"
          style={{
            position: "fixed",
            right: 24,
            bottom: 100,
            width: 390,
            maxWidth: "calc(100vw - 48px)",
            height: 600,
            maxHeight: "calc(100vh - 120px)",
            zIndex: 1000,
            boxShadow: "var(--shadow)",
            borderRadius: 16,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column"
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)",
              padding: "12px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "#fff",
              zIndex: 10
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
              <Button
                type="text"
                icon={<HistoryOutlined />}
                onClick={() => setShowHistory(!showHistory)}
                style={{ color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", background: showHistory ? "rgba(255,255,255,0.2)" : undefined }}
                title="Chat history"
              />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14.5, lineHeight: 1.2 }}>AI Assistant</div>
                <div style={{ fontSize: 11, opacity: 0.85, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  Active: {PROVIDERS.find(p => p.value === model)?.label}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Select
                value={model}
                onChange={value => setModel(value)}
                size="small"
                className="chat-select"
                dropdownStyle={{ zIndex: 10001 }}
                style={{ width: 115 }}
                options={PROVIDERS.map(p => ({
                  value: p.value,
                  label: (
                    <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.color, display: "inline-block" }} />
                      {p.value.charAt(0).toUpperCase() + p.value.slice(1)}
                    </span>
                  )
                }))}
              />

              <Button
                type="text"
                icon={<PlusOutlined />}
                onClick={startNewConversation}
                style={{ color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}
                title="New conversation"
              />

              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => setOpen(false)}
                style={{ color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}
              />
            </div>
          </div>

          {/* Main Area */}
          <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
            
            {/* History Overlay Drawer */}
            {showHistory && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "var(--bg)",
                  zIndex: 5,
                  display: "flex",
                  flexDirection: "column",
                  padding: "16px",
                  overflowY: "auto"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>History</div>
                  <Button type="primary" size="small" icon={<PlusOutlined />} onClick={startNewConversation}>
                    New Chat
                  </Button>
                </div>

                {conversations.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-muted)", fontSize: 13 }}>
                    No previous chats found.
                  </div>
                ) : (
                  <div>
                    {conversations.map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => selectConversation(conv.id)}
                        className={`history-item ${conversationId === conv.id ? "active" : ""}`}
                      >
                        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13, marginRight: 8, color: "var(--text)" }}>
                          {conv.title || "Untitled Conversation"}
                        </div>
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={(e) => handleDeleteConversation(conv.id, e)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Chat Messages Body */}
            <div
              ref={chatBodyRef}
              className="floating-chat-body"
              style={{
                flex: 1,
                overflow: "auto",
                padding: "16px",
                display: "flex",
                flexDirection: "column"
              }}
            >
              {messages.length === 0 ? (
                <div style={{ margin: "auto 0" }}>
                  <div style={{ textAlign: "center", padding: "16px 16px 24px", color: "var(--text-muted)" }}>
                    <Avatar size={48} style={{ background: "linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)", marginBottom: 14, fontWeight: "bold" }}>AI</Avatar>
                    <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>RezoX AI Companion</div>
                    <div style={{ fontSize: 12.5, marginTop: 6, lineHeight: 1.5 }}>
                      Evaluate listings, generate price forecasts, or get market advice using our dynamic router connected to 5 LLM models.
                    </div>
                  </div>

                  <div style={{ padding: "0 8px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", marginBottom: 8 }}>Suggested Topics</div>
                    {SUGGESTIONS.map((s, idx) => (
                      <button
                        key={idx}
                        className="suggestion-chip"
                        onClick={() => send(s.prompt)}
                      >
                        {s.text}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <List
                  dataSource={messages}
                  renderItem={m => (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                        marginBottom: 14
                      }}
                    >
                      {m.role === "user" ? (
                        <div
                          style={{
                            maxWidth: "75%",
                            padding: "11px 15px",
                            borderRadius: "16px 16px 4px 16px",
                            background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                            color: "#fff",
                            boxShadow: "0 2px 8px rgba(99,102,241,0.15)"
                          }}
                        >
                          <div style={{ whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.5 }}>
                            {m.text}
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", maxWidth: "78%", alignItems: "flex-start" }}>
                          <div
                            style={{
                              width: "100%",
                              padding: "11px 15px",
                              borderRadius: "16px 16px 16px 4px",
                              background: "var(--bg-elevated)",
                              color: "var(--text)",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                              border: "1px solid var(--border)",
                              borderLeft: `3px solid ${getModelColor(m.model || model)}`
                            }}
                          >
                            <div style={{ whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.5 }}>
                              {m.text}
                            </div>
                          </div>
                          {m.latency !== undefined && (
                            <span className="latency-badge" style={{ color: "var(--text-muted)" }}>
                              ⚡ {m.latency}ms via {m.model || model}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                />
              )}
              
              {loading && (
                <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 12 }}>
                  <div className="typing-indicator">
                    <span>AI is thinking</span>
                    <div style={{ display: "inline-flex", gap: 3, marginLeft: 6, alignItems: "center" }}>
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", background: "var(--bg-elevated)", zIndex: 4 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                <Input.TextArea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Ask ${model.charAt(0).toUpperCase() + model.slice(1)}...`}
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  style={{ flex: 1, borderRadius: 12, border: "1px solid var(--border)" }}
                />
                <Button
                  type="primary"
                  shape="circle"
                  icon={<SendOutlined />}
                  onClick={() => send()}
                  loading={loading}
                  disabled={!text.trim()}
                  style={{ 
                    height: 36, 
                    width: 36, 
                    minWidth: 36,
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    background: !text.trim() ? undefined : "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                    border: "none",
                    boxShadow: !text.trim() ? undefined : "0 2px 8px rgba(99,102,241,0.25)"
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
