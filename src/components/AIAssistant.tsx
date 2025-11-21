import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X, MessageCircle, RotateCcw, ThumbsUp, ThumbsDown, Clock, DollarSign, Rocket, Briefcase, Calendar, Heart } from 'lucide-react'
import axios from 'axios'
import './AIAssistant.css'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
  helpful?: boolean
}

interface AIAssistantProps {
  pageContext?: string
}

interface QuickReplySuggestion {
  text: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

const QUICK_REPLY_SUGGESTIONS: QuickReplySuggestion[] = [
  { text: "Tell me about Focus", icon: Clock },
  { text: "How do I track budgeting?", icon: DollarSign },
  { text: "What is RiseReady?", icon: Rocket },
  { text: "Help with internships", icon: Briefcase },
  { text: "Calendar features", icon: Calendar },
  { text: "Wellbeing check-in", icon: Heart },
]

const AIAssistant: React.FC<AIAssistantProps> = ({ pageContext }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  })

  // Initialize session on component mount
  useEffect(() => {
    initializeSession()
  }, [])

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const initializeSession = async () => {
    try {
      const response = await apiClient.post('/ai/session', {
        metadata: {
          userAgent: navigator.userAgent,
          pageUrl: window.location.pathname,
          pageContext: pageContext || 'general',
        },
      })
      setSessionId(response.data.sessionId)

      // Add greeting message
      setMessages([
        {
          id: '0',
          role: 'assistant',
          content:
            "Hey there! I'm RiseReady Assistant — how can I help you today? Feel free to ask me about our features, modules, or anything about navigating RiseReady!",
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      console.error('Failed to initialize session:', error)
    }
  }

  const sendMessage = async (messageContent?: string) => {
    const textToSend = messageContent || inputValue.trim()

    if (!textToSend || !sessionId) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setShowFeedback(null)

    try {
      const response = await apiClient.post('/ai/chat', {
        sessionId,
        message: textToSend,
        pageContext: pageContext || 'general',
        metadata: {
          pageUrl: window.location.pathname,
        },
      })

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.message,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          "Sorry, I'm having trouble right now. Could you try again? If the issue persists, please contact our support team.",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickReply = (suggestion: string) => {
    sendMessage(suggestion)
  }

  const submitFeedback = async (messageIndex: number, helpful: boolean) => {
    try {
      await apiClient.post('/ai/feedback', {
        sessionId,
        messageIndex,
        helpful,
        comment: '',
      })
      setShowFeedback(null)
    } catch (error) {
      console.error('Failed to submit feedback:', error)
    }
  }

  const handleReset = () => {
    setMessages([
      {
        id: '0',
        role: 'assistant',
        content:
          "Hey there! I'm RiseReady Assistant — how can I help you today? Feel free to ask me about our features, modules, or anything about navigating RiseReady!",
        timestamp: new Date(),
      },
    ])
    setShowFeedback(null)
  }

  return (
    <div className="ai-assistant-container">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          // Floating Orb
          <motion.button
            key="orb"
            className="ai-orb"
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="orb-glow"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(46, 73, 56, 0.3)',
                  '0 0 40px rgba(28, 94, 52, 0.6)',
                  '0 0 20px rgba(34, 197, 94, 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="orb-dots"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, linear: true }}
              >
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="dot"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.6,
                    }}
                  />
                ))}
              </motion.div>
              <MessageCircle size={24} className="orb-icon" />
            </motion.div>
          </motion.button>
        ) : (
          // Chat Window
          <motion.div
            key="chat"
            className="ai-chat-window"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="chat-header">
              <div className="header-content">
                <div className="header-title">
                  <MessageCircle size={18} className="header-icon" />
                  <h3>RiseReady Assistant</h3>
                </div>
                <motion.button
                  className="reset-btn"
                  onClick={handleReset}
                  title="Start new conversation"
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.35)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 180] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <RotateCcw size={20} />
                  </motion.div>
                </motion.button>
              </div>
              <motion.button
                className="close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close assistant"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Messages Area */}
            <div className="messages-container">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  className={`message ${msg.role}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="message-bubble">
                    <p>{msg.content}</p>
                  </div>

                  {/* Feedback UI for assistant messages */}
                  {msg.role === 'assistant' && index === messages.length - 1 && !isLoading && (
                    <motion.div
                      className="feedback-container"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {showFeedback === index ? (
                        <div className="feedback-buttons">
                          <p className="feedback-label">Was this helpful?</p>
                          <div className="feedback-actions">
                            <button
                              className="feedback-btn helpful"
                              onClick={() => {
                                submitFeedback(index, true)
                              }}
                            >
                              <ThumbsUp size={14} /> Yes
                            </button>
                            <button
                              className="feedback-btn not-helpful"
                              onClick={() => {
                                submitFeedback(index, false)
                              }}
                            >
                              <ThumbsDown size={14} /> No
                            </button>
                          </div>
                        </div>
                      ) : (
                        <motion.button
                           className="show-feedback-btn"
                           onClick={() => setShowFeedback(index)}
                           whileHover={{ scale: 1.1 }}
                           whileTap={{ scale: 0.95 }}
                         >
                           <ThumbsUp size={16} />
                           <ThumbsDown size={16} />
                         </motion.button>
                      )}
                    </motion.div>
                  )}

                  {isLoading && index === messages.length - 1 && msg.role === 'user' && (
                    <div className="loading-indicator">
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                        }}
                        className="loading-dot"
                      />
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: 0.2,
                        }}
                        className="loading-dot"
                      />
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: 0.4,
                        }}
                        className="loading-dot"
                      />
                    </div>
                  )}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies (show only if last message is assistant greeting) */}
            {messages.length === 1 && messages[0].role === 'assistant' && !isLoading && (
              <motion.div
                className="quick-replies"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="quick-replies-label">Quick suggestions:</p>
                <div className="quick-replies-grid">
                  {QUICK_REPLY_SUGGESTIONS.slice(0, 4).map((suggestion, idx) => (
                    <motion.button
                       key={idx}
                       className="quick-reply-btn"
                       onClick={() => handleQuickReply(suggestion.text)}
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                     >
                       <suggestion.icon size={20} className="suggestion-icon" />
                       <span className="suggestion-text">{suggestion.text}</span>
                     </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Input Area */}
            <div className="input-container">
              <input
                type="text"
                className="message-input"
                placeholder="Ask me about RiseReady..."
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyPress={e => {
                  if (e.key === 'Enter' && !isLoading) {
                    sendMessage()
                  }
                }}
                disabled={isLoading}
              />
              <motion.button
                className="send-btn"
                onClick={() => sendMessage()}
                disabled={isLoading || !inputValue.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send size={18} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AIAssistant
