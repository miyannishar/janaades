'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'

interface Message {
  id: string
  role: 'user' | 'agent'
  text: string
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'agent',
      text: 'Namaste! I am the Parliamentary Accountability Agent. Ask me anything about recently tracked bills, political news, or parliamentary procedures.',
    }
  ])
  const [input, setInput] = useState('')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input.trim(),
    }
    
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch(`${BACKEND_URL}/api/agent/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          session_id: sessionId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to communicate with agent')
      }

      const data = await response.json()
      
      if (data.session_id) {
        setSessionId(data.session_id)
      }

      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        text: data.reply,
      }

      setMessages(prev => [...prev, agentMsg])

    } catch (error) {
      console.error(error)
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        text: 'Sorry, I encountered an error connecting to the server. Please try again.',
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)' }}>
      <div className="page-header" style={{ marginBottom: '1rem', flexShrink: 0 }}>
        <h1 className="page-title"><Bot style={{ marginRight: '0.5rem', display: 'inline', verticalAlign: 'bottom' }} /> AI Chat Assistant</h1>
        <p className="page-subtitle">Direct line to the Parliamentary Accountability Agent.</p>
      </div>

      <div className="card" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        {/* Chat History */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ 
              display: 'flex', 
              gap: '1rem', 
              alignItems: 'flex-start',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
            }}>
              <div style={{ 
                width: '36px', height: '36px', borderRadius: '50%', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                background: msg.role === 'user' ? 'var(--rsp)' : 'var(--bg-card-hover)',
                color: msg.role === 'user' ? 'white' : 'var(--text-primary)'
              }}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div style={{ 
                background: msg.role === 'user' ? 'var(--rsp)' : 'var(--bg-page)',
                color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                padding: '1rem', 
                borderRadius: '12px',
                borderTopRightRadius: msg.role === 'user' ? '2px' : '12px',
                borderTopLeftRadius: msg.role === 'agent' ? '2px' : '12px',
                maxWidth: '85%',
                fontSize: '0.95rem',
                lineHeight: 1.5,
                boxShadow: 'var(--shadow-sm)'
              }}>
                <ReactMarkdown
                  components={{
                    p: ({node, ...props}) => <p style={{ margin: msg.role === 'user' ? 0 : '0 0 0.5rem 0' }} {...props} />,
                    a: ({node, ...props}) => <a style={{ color: msg.role === 'user' ? 'white' : 'var(--blue)', textDecoration: 'underline' }} {...props} />,
                    ul: ({node, ...props}) => <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }} {...props} />,
                    li: ({node, ...props}) => <li style={{ marginBottom: '0.25rem' }} {...props} />
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ 
                width: '36px', height: '36px', borderRadius: '50%', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                background: 'var(--bg-card-hover)', color: 'var(--text-primary)'
              }}>
                <Bot size={20} />
              </div>
              <div style={{ 
                background: 'var(--bg-page)', padding: '1rem', borderRadius: '12px', borderTopLeftRadius: '2px',
                display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)'
              }}>
                <Loader2 size={16} className="animate-spin" />
                <span>Agent is analyzing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a bill, political event, or request an analysis..."
              style={{
                flexGrow: 1,
                background: 'var(--bg-page)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none',
              }}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              style={{
                background: input.trim() && !isLoading ? 'var(--rsp)' : 'var(--bg-card-hover)',
                color: input.trim() && !isLoading ? 'white' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '8px',
                padding: '0 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s'
              }}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
