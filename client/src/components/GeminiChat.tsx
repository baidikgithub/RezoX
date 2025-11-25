"use client";
import React, { useState } from "react";
import { Card, Input, Button, List, Avatar, message } from "antd";

type Msg = { id: string; role: "user" | "assistant"; text: string };

export default function GeminiChat() {
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

  return (
    <Card title={"Gemini Chat"} style={{ borderRadius: 12 }} className="fade-in">
      <List
        dataSource={messages}
        renderItem={m => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar>{m.role === "user" ? "U" : "G"}</Avatar>}
              title={m.role === "user" ? "You" : "Gemini"}
              description={<div style={{ whiteSpace: "pre-wrap" }}>{m.text}</div>}
            />
          </List.Item>
        )}
        style={{ maxHeight: 300, overflow: "auto", marginBottom: 12 }}
      />

      <Input.TextArea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Ask Gemini about listings, the market, or tips..."
        autoSize={{ minRows: 2, maxRows: 6 }}
      />
      <div style={{ display: "flex", gap: 8, marginTop: 8, justifyContent: "flex-end" }}>
        <Button onClick={() => setText("")}> 
          Clear
        </Button>
        <Button type="primary" onClick={send} loading={loading}>
          Send
        </Button>
      </div>
    </Card>
  );
}
