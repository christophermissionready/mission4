import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [chatStarted, setChatStarted] = useState(false)
  const messagesEndRef = useRef(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const startChat = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:5998/api/insurance/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })

      if (!response.ok) throw new Error('Failed to start chat')

      const data = await response.json()
      setMessages([{
        text: data.question,
        isAI: true
      }])
      window.chatHistory = data.history
      setChatStarted(true)
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to start chat. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const userMessage = inputValue.trim()
    setInputValue('')
    setMessages(prev => [...prev, { text: userMessage, isAI: false }])
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:5998/api/insurance/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          response: userMessage,
          history: window.chatHistory
        }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()
      window.chatHistory = data.history
      setMessages(prev => [...prev, { text: data.question, isAI: true }])
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to get response. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getRecommendations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:5998/api/insurance/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          history: window.chatHistory
        }),
      })

      if (!response.ok) throw new Error('Failed to get recommendations')

      const data = await response.json()
      setMessages(prev => [...prev, { 
        text: data.analysis, 
        isAI: true,
        isRecommendation: true 
      }])
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to get recommendations. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="chat-container">
      <h1>Insurance Policy Advisor</h1>
      
      {!chatStarted ? (
        <button 
          onClick={startChat} 
          disabled={isLoading}
          className="start-button"
        >
          Start Chat
        </button>
      ) : (
        <>
          <div className="messages-container">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.isAI ? 'ai' : 'user'} ${message.isRecommendation ? 'recommendation' : ''}`}
              >
                {message.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-container">
            <form onSubmit={handleSubmit}>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message... (Press Enter to send)"
                // disabled={isLoading}
              />
              <div className="button-container">
                <button type="submit" disabled={isLoading}>
                  Send
                </button>
                <button 
                  type="button" 
                  onClick={getRecommendations} 
                  disabled={isLoading}
                >
                  Get Recommendations
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}

export default App
