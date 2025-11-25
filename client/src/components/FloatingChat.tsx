"use client";
import React, { useState } from "react";
import { Card, Input, Button, List, Avatar, message } from "antd";
import { MessageOutlined, CloseOutlined, SendOutlined } from "@ant-design/icons";

type Msg = { id: string; role: "user" | "assistant"; text: string };

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!text.trim()) return;
    const userMessage = text.trim();
    const id = String(Date.now());
    const userMsg: Msg = { id, role: "user", text: userMessage };
    setMessages(prev => [...prev, userMsg]);
    setText("");
    setLoading(true);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage })
      });
      
      const json = await res.json();
      
      if (!res.ok || json.error) {
        const errorMessage = json.error || json.details?.error?.message || "API request failed";
        throw new Error(errorMessage);
      }
      
      const reply = json?.reply ?? json?.output ?? "Sorry, I couldn't generate a response.";
      const botMsg: Msg = { id: id + "-bot", role: "assistant", text: String(reply) };
      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      const errorText = err.message || "Failed to get response from Gemini API";
      message.error(errorText);
      const errorMsg: Msg = { 
        id: String(Date.now()) + "-error", 
        role: "assistant", 
        text: `Error: ${errorText}. Please check your API key or try again later.` 
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

  return (
    <>
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
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            color: "#fff",
            fontSize: 24,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(102, 126, 234, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)";
          }}
        >
          <MessageOutlined />
        </button>
      )}
      
      {open && (
        <div
          style={{
            position: "fixed",
            right: 24,
            bottom: 100,
            width: 380,
            maxWidth: "calc(100vw - 48px)",
            height: 600,
            maxHeight: "calc(100vh - 120px)",
            zIndex: 1000,
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            borderRadius: 16,
            overflow: "hidden",
            background: "#fff",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              padding: "16px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "#fff"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar style={{ background: "rgba(255,255,255,0.3)" }}>AI</Avatar>
              <div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>AI Assistant</div>
                <div style={{ fontSize: 12, opacity: 0.9 }}>Ask me anything about real estate</div>
              </div>
            </div>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setOpen(false)}
              style={{ color: "#fff" }}
            />
          </div>

          <div
            style={{
              flex: 1,
              overflow: "auto",
              padding: "16px",
              background: "#f5f5f5"
            }}
          >
            {messages.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#888" }}>
                <MessageOutlined style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }} />
                <div>Start a conversation with the AI assistant</div>
                <div style={{ fontSize: 12, marginTop: 8 }}>
                  Ask about listings, market trends, or get property advice
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
                      marginBottom: 12
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "75%",
                        padding: "12px 16px",
                        borderRadius: 16,
                        background: m.role === "user" ? "#1890ff" : "#fff",
                        color: m.role === "user" ? "#fff" : "#262626",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                      }}
                    >
                      <div style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.6 }}>
                        {m.text}
                      </div>
                    </div>
                  </div>
                )}
              />
            )}
            {loading && (
              <div style={{ textAlign: "center", padding: 12, color: "#888" }}>
                AI is typing...
              </div>
            )}
          </div>

          <div style={{ padding: "16px", background: "#fff", borderTop: "1px solid #f0f0f0" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <Input.TextArea
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                autoSize={{ minRows: 1, maxRows: 4 }}
                style={{ flex: 1 }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={send}
                loading={loading}
                disabled={!text.trim()}
                style={{ height: "auto" }}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

