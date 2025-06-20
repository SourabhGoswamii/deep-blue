import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { ThumbsUp, ThumbsDown, Volume2, Copy } from 'lucide-react'

function ChatPage() {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showCopyToast, setShowCopyToast] = useState(false)
  const messagesEndRef = useRef(null)

  const apiKey = import.meta.env.VITE_OPERO_API_KEY

  useEffect(() => {
    if (!apiKey || apiKey === 'your_api_key_here') {
      setMessages([{
        role: 'assistant',
        content: 'Please set your OpenRouter API key in the .env file to use the chat functionality.'
      }])
    }
  }, [])

  const handleThumbsUp = (index) => {
    console.log('Thumbs up for message:', index)
  }

  const handleThumbsDown = (index) => {
    console.log('Thumbs down for message:', index)
  }

  const handleSpeak = (text) => {
    const speech = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(speech)
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    setShowCopyToast(true)
    setTimeout(() => setShowCopyToast(false), 2000)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return
    
    if (!apiKey || apiKey === 'your_api_key_here') {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Please set your OpenRouter API key in the .env file to use the chat functionality.'
      }])
      return
    }

    const userMessage = {
      role: 'user',
      content: inputMessage
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        messages: [...messages, userMessage],
        model: 'deepseek/deepseek-r1-0528-qwen3-8b:free'
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      const assistantMessage = {
        role: 'assistant',
        content: response.data.choices[0].message.content || response.data.choices[0].delta.content
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = error.response?.status === 401 
        ? 'Invalid API key. Please check your OpenRouter API key in the .env file.'
        : 'Sorry, there was an error processing your request.'
        
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMessage
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-chatbg text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-chatSecondary border-r border-chatBorder hidden md:flex flex-col">
        <button 
          className="m-4 p-3 border border-chatBorder rounded-md hover:bg-chatBorder transition-colors flex items-center gap-2"
          onClick={() => window.location.reload()}
        >
          <span className="text-lg">+</span>
          New Chat
        </button>
        
        <div className="flex-1 overflow-y-auto p-2">
          {/* Chat history would go here */}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {showCopyToast && (
          <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-10">
            Copied to clipboard!
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto pt-4 pb-32">
            {messages.length === 0 && (
              <div className="text-center py-8 text-xl text-gray-400">
                How can I help you today?
              </div>
            )}

            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`p-8 ${
                  message.role === 'user' 
                    ? 'bg-chatbg' 
                    : 'bg-chatSecondary'
                }`}
              >
                <div className="max-w-3xl mx-auto flex gap-6 items-start">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-green-600' 
                      : 'bg-purple-600'
                  }`}>
                    {message.role === 'user' ? 'U' : 'AI'}
                  </div>
                  
                  <div className="flex-1">
                    <div className="whitespace-pre-wrap mb-2">
                      {message.content}
                    </div>
                    {message.role === 'assistant' && (
                      <div className="flex gap-2 justify-end mt-2">
                        <button 
                          onClick={() => handleThumbsUp(index)}
                          className="p-2 hover:bg-green-600 rounded transition-colors flex items-center gap-1"
                          title="Thumbs Up"
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleThumbsDown(index)}
                          className="p-2 hover:bg-red-600 rounded transition-colors flex items-center gap-1"
                          title="Thumbs Down"
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleSpeak(message.content)}
                          className="p-2 hover:bg-blue-600 rounded transition-colors flex items-center gap-1"
                          title="Read Aloud"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleCopy(message.content)}
                          className="p-2 hover:bg-gray-600 rounded transition-colors flex items-center gap-1"
                          title="Copy Message"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="p-8 bg-chatSecondary">
                <div className="max-w-3xl mx-auto flex gap-6 items-start">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                    AI
                  </div>
                  <div className="flex-1 animate-pulse">
                    Thinking...
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-chatbg to-transparent pt-20 pb-4">
          <footer className="max-w-3xl mx-auto px-4">
            <form onSubmit={handleSubmit} className="flex gap-2 bg-chatSecondary rounded-lg border border-chatBorder shadow-xl">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message here..."
                disabled={isLoading}
                className="flex-1 p-4 bg-transparent text-white placeholder-gray-400 focus:outline-none disabled:opacity-50"
              />
              <button 
                type="submit" 
                disabled={isLoading}
                className="px-4 py-2 m-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50 disabled:bg-green-800 transition-colors"
              >
                Send
              </button>
            </form>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default ChatPage