import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Send, Bot, User, Loader, Minimize2 } from "lucide-react"
import { sendMessage } from "../api/chatApi"

const SUGGESTED_QUESTIONS = [
  "What products do you have?",
  "How does delivery work?",
  "What is your return policy?",
  "How do I become a vendor?",
  "What payment methods do you accept?",
]

function ChatMessage({ message }) {
  const isBot = message.role === "assistant"

  return (
    <div className={`flex gap-2 ${isBot ? "justify-start" : "justify-end"}`}>

      {isBot && (
        <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot size={14} />
        </div>
      )}

      <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm leading-relaxed
        ${isBot
          ? "bg-gray-100 text-gray-800 rounded-tl-sm"
          : "bg-primary text-white rounded-tr-sm"
        }`}
      >
        {message.content}
      </div>

      {!isBot && (
        <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center flex-shrink-0 mt-0.5">
          <User size={14} />
        </div>
      )}

    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-2 justify-start">
      <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
        <Bot size={14} />
      </div>
      <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  )
}

function ChatWidget() {
  const [isOpen,    setIsOpen]    = useState(false)
  const [messages,  setMessages]  = useState([
    {
      role:    "assistant",
      content: "Hi! 👋 I'm Vendly Assistant. I can help you find products, answer questions about orders, delivery and more. How can I help you today?",
    }
  ])
  const [input,     setInput]     = useState("")
  const [loading,   setLoading]   = useState(false)
  const [unread,    setUnread]    = useState(0)
  const messagesEndRef            = useRef(null)
  const inputRef                  = useRef(null)

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setUnread(0)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  async function handleSend(text) {
    const messageText = text || input.trim()
    if (!messageText || loading) return

    const userMessage = { role: "user", content: messageText }
    const newMessages = [...messages, userMessage]

    setMessages(newMessages)
    setInput("")
    setLoading(true)

    try {
      const data = await sendMessage(
        newMessages.map((m) => ({ role: m.role, content: m.content }))
      )
      const botMessage = { role: "assistant", content: data.message }
      setMessages((prev) => [...prev, botMessage])

      // If chat is closed show unread count
      if (!isOpen) setUnread((prev) => prev + 1)
    } catch (err) {
      setMessages((prev) => [...prev, {
        role:    "assistant",
        content: "Sorry, I'm having trouble right now. Please try again or contact support@vendly.ng 🙏",
      }])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleOpen() {
    setIsOpen(true)
    setUnread(0)
  }

  return (
    <>
      {/* Chat Window */}
      <div className={`fixed bottom-24 right-6 z-50 w-80 sm:w-96 transition-all duration-300 ease-in-out
        ${isOpen
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
          style={{ height: "520px" }}
        >

          {/* Header */}
          <div className="bg-dark px-5 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Vendly Assistant</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-gray-400 text-xs">Online 24/7</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition"
            >
              <Minimize2 size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">

            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}

            {loading && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions — show only at start */}
          {messages.length === 1 && !loading && (
            <div className="px-4 pb-3 flex flex-col gap-1.5 flex-shrink-0">
              <p className="text-xs text-gray-400 font-semibold">Suggested questions:</p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="text-xs bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition font-medium"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-2 flex-shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              disabled={loading}
              className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm outline-none focus:bg-gray-200 transition disabled:opacity-50"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:opacity-90 transition disabled:opacity-40 flex-shrink-0"
            >
              {loading
                ? <Loader size={16} className="text-white animate-spin" />
                : <Send size={16} className="text-white" />
              }
            </button>
          </div>

        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={isOpen ? () => setIsOpen(false) : handleOpen}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center hover:opacity-90 transition hover:scale-105 active:scale-95"
      >
        {isOpen ? (
          <X size={22} className="text-white" />
        ) : (
          <>
            <MessageCircle size={24} className="text-white" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {unread}
              </span>
            )}
          </>
        )}
      </button>
    </>
  )
}

export default ChatWidget