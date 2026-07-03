"use client";
import React, { useState } from "react";
import { Card, Input, Button, List, Avatar, message, Select } from "antd";
import { SendOutlined, DeleteOutlined } from "@ant-design/icons";

type Msg = { 
  id: string; 
  role: "user" | "assistant"; 
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

const getModelColor = (modelName: string) => {
  const normalized = String(modelName).toLowerCase();
  const provider = PROVIDERS.find(p => normalized.includes(p.value));
  return provider ? provider.color : "#6366f1";
};

export default function GeminiChat() {
  const [model, setModel] = useState<string>("gemini");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  async function send() {
    if (!text.trim()) return;
    const userMessage = text.trim();
    const id = String(Date.now());
    const userMsg: Msg = { id, role: "user", text: userMessage };
    setMessages(prev => [...prev, userMsg]);
    setText("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          model: model,
          message: userMessage 
        })
      });
      
      const json = await res.json();
      
      if (!res.ok || !json.success) {
        throw new Error(json.error || "API request failed");
      }
      
      const botMsg: Msg = { 
        id: id + "-bot", 
        role: "assistant", 
        text: String(json.response),
        model: json.model,
        latency: json.latency
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      const errorText = err.message || "Failed to get response from AI Assistant";
      message.error(errorText);
      
      const errorMsg: Msg = { 
        id: String(Date.now()) + "-error", 
        role: "assistant", 
        text: `Error: ${errorText}. Please verify the backend server is running.` 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card 
      title={"AI Assistant Chat"} 
      extra={
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Select
            value={model}
            onChange={value => setModel(value)}
            size="small"
            style={{ width: 140 }}
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
          {messages.length > 0 && (
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => setMessages([])}
              title="Clear Chat"
            />
          )}
        </div>
      }
      style={{ borderRadius: 12 }} 
      className="fade-in"
    >
      <List
        dataSource={messages}
        renderItem={m => (
          <List.Item style={{ padding: "10px 0" }}>
            <List.Item.Meta
              avatar={
                <Avatar style={{ background: m.role === "user" ? "#6366f1" : getModelColor(m.model || model) }}>
                  {m.role === "user" ? "U" : "AI"}
                </Avatar>
              }
              title={
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600 }}>
                  <span>{m.role === "user" ? "You" : `${(m.model || model).toUpperCase()} Assistant`}</span>
                  {m.latency !== undefined && (
                    <span style={{ fontSize: 11, fontWeight: "normal", color: "var(--text-muted)" }}>
                      ⚡ {m.latency}ms
                    </span>
                  )}
                </div>
              }
              description={
                <div 
                  style={{ 
                    whiteSpace: "pre-wrap", 
                    color: "var(--text)", 
                    fontSize: 13.5, 
                    marginTop: 4,
                    padding: "8px 12px",
                    borderRadius: 8,
                    background: "var(--bg-soft)",
                    borderLeft: `3px solid ${m.role === "user" ? "#6366f1" : getModelColor(m.model || model)}`
                  }}
                >
                  {m.text}
                </div>
              }
            />
          </List.Item>
        )}
        style={{ maxHeight: 350, overflow: "auto", marginBottom: 12 }}
      />

      <div style={{ display: "flex", gap: 8 }}>
        <Input.TextArea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={`Ask ${model.toUpperCase()}...`}
          autoSize={{ minRows: 2, maxRows: 6 }}
          onKeyPress={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          style={{ borderRadius: 8 }}
        />
        <Button 
          type="primary" 
          onClick={send} 
          loading={loading}
          icon={<SendOutlined />}
          style={{ height: "auto", minWidth: 70 }}
          disabled={!text.trim()}
        />
      </div>
    </Card>
  );
}
