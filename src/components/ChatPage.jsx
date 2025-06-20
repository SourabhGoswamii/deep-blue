import { useState, useRef, useEffect } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  Volume2,
  Copy,
  Plus,
  Edit3,
  MoreHorizontal,
  Send,
  User,
  Sparkles,
  Menu,
  X,
  Trash2,
} from "lucide-react";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const messagesEndRef = useRef(null);

  const apiKey = import.meta.env.VITE_OPERO_API_KEY;

  // Load chat history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("chatHistory");
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      setChatHistory(history);

      // Load the most recent chat if exists
      if (history.length > 0) {
        const mostRecent = history[0];
        setCurrentChatId(mostRecent.id);
        setMessages(mostRecent.messages);
      }
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  useEffect(() => {
    if (!apiKey || apiKey === "your_api_key_here") {
      setMessages([
        {
          role: "assistant",
          content:
            "Please set your OpenRouter API key in the .env file to use the chat functionality.",
        },
      ]);
    }
  }, []);

  const handleNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat = {
      id: newChatId,
      title: "New conversation",
      timestamp: new Date().toISOString(),
      messages: [],
    };
    setChatHistory((prev) => [newChat, ...prev]);
    setCurrentChatId(newChatId);
    setMessages([]);
  };

  const handleSelectChat = (chatId) => {
    const chat = chatHistory.find((c) => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages);
      setIsSidebarOpen(false);
    }
  };

  const handleDeleteChat = (chatId, e) => {
    e.stopPropagation();
    const updatedHistory = chatHistory.filter((chat) => chat.id !== chatId);
    setChatHistory(updatedHistory);

    if (chatId === currentChatId) {
      if (updatedHistory.length > 0) {
        setCurrentChatId(updatedHistory[0].id);
        setMessages(updatedHistory[0].messages);
      } else {
        setCurrentChatId(null);
        setMessages([]);
      }
    }

    if (updatedHistory.length === 0) {
      localStorage.removeItem("chatHistory");
    }
  };

  const updateChatHistory = (newMessages) => {
    if (!currentChatId) {
      // Create new chat if none exists
      const newChatId = Date.now().toString();
      const newChat = {
        id: newChatId,
        title: newMessages[0]?.content?.slice(0, 30) + "...",
        timestamp: new Date().toISOString(),
        messages: newMessages,
      };
      setChatHistory((prev) => [newChat, ...prev]);
      setCurrentChatId(newChatId);
    } else {
      // Update existing chat
      setChatHistory((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? {
                ...chat,
                title: chat.messages[0]?.content?.slice(0, 30) + "...",
                messages: newMessages,
              }
            : chat
        )
      );
    }
  };

  const handleThumbsUp = (index) => {
    console.log("Thumbs up for message:", index);
  };

  const handleThumbsDown = (index) => {
    console.log("Thumbs down for message:", index);
  };

  const handleSpeak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.9;
    window.speechSynthesis.speak(speech);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 2000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    if (!apiKey || apiKey === "your_api_key_here") {
      const newMessages = [
        ...messages,
        {
          role: "assistant",
          content:
            "Please set your OpenRouter API key in the .env file to use the chat functionality.",
        },
      ];
      setMessages(newMessages);
      updateChatHistory(newMessages);
      return;
    }

    const userMessage = {
      role: "user",
      content: inputMessage,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    updateChatHistory(updatedMessages);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: updatedMessages,
            model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          response.status === 401 ? "Invalid API key" : "API request failed"
        );
      }

      const data = await response.json();
      const assistantMessage = {
        role: "assistant",
        content: data.choices[0].message.content,
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      updateChatHistory(finalMessages);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage =
        error.message === "Invalid API key"
          ? "Invalid API key. Please check your OpenRouter API key in the .env file."
          : "Sorry, there was an error processing your request.";

      const finalMessages = [
        ...updatedMessages,
        {
          role: "assistant",
          content: errorMessage,
        },
      ];
      setMessages(finalMessages);
      updateChatHistory(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  return (
    <div className="flex h-screen bg-white relative">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
      >
        {isSidebarOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out lg:transform-none z-40 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* New Chat Button */}
        <div className="p-3 border-b border-gray-700 mt-14 lg:mt-0">
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-md border border-gray-600 hover:bg-gray-800 transition-colors"
            onClick={handleNewChat}
          >
            <Plus className="w-4 h-4" />
            New chat
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-3">
          {chatHistory.length > 0 ? (
            chatHistory.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-800 cursor-pointer group mb-1 ${
                  currentChatId === chat.id ? "bg-gray-800" : ""
                }`}
              >
                <Edit3 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="truncate">
                    {chat.title || "New conversation"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(chat.timestamp)}
                  </div>
                </div>
                <button
                  onClick={(e) => handleDeleteChat(chat.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity"
                  title="Delete conversation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-sm text-center mt-4">
              No conversations yet
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toast */}
        {showCopyToast && (
          <div className="fixed top-4 right-4 bg-green-600 text-white px-3 py-2 rounded-md text-sm shadow-lg z-50">
            Copied to clipboard
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto pt-16 lg:pt-0">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-orange-600" />
              </div>
              <h1 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-2">
                How can I help you today?
              </h1>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`w-full ${
                message.role === "assistant" ? "bg-gray-50" : ""
              }`}
            >
              <div className="max-w-3xl mx-auto px-4 py-4 lg:py-6">
                <div className="flex gap-3 lg:gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {message.role === "user" ? (
                      <div className="w-7 h-7 lg:w-8 lg:h-8 bg-blue-500 rounded-sm flex items-center justify-center">
                        <User className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 lg:w-8 lg:h-8 bg-orange-500 rounded-sm flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          AI
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-gray-800 leading-7 text-sm lg:text-base">
                        {message.content}
                      </div>
                    </div>

                    {/* Action Buttons for Assistant */}
                    {message.role === "assistant" && (
                      <div className="flex flex-wrap items-center gap-2 mt-3 -ml-2">
                        <button
                          onClick={() => handleCopy(message.content)}
                          className="p-1.5 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleThumbsUp(index)}
                          className="p-1.5 hover:bg-gray-200 rounded text-gray-400 hover:text-green-600 transition-colors"
                          title="Good response"
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleThumbsDown(index)}
                          className="p-1.5 hover:bg-gray-200 rounded text-gray-400 hover:text-red-600 transition-colors"
                          title="Poor response"
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleSpeak(message.content)}
                          className="p-1.5 hover:bg-gray-200 rounded text-gray-400 hover:text-blue-600 transition-colors"
                          title="Read aloud"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Loading State */}
          {isLoading && (
            <div className="w-full bg-gray-50">
              <div className="max-w-3xl mx-auto px-4 py-4 lg:py-6">
                <div className="flex gap-3 lg:gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-7 h-7 lg:w-8 lg:h-8 bg-orange-500 rounded-sm flex items-center justify-center">
                      <span className="text-white font-medium text-sm">AI</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white">
          <div className="max-w-3xl mx-auto px-4 py-4 lg:py-6">
            <div className="relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Message Claude..."
                disabled={isLoading}
                rows={1}
                className="w-full resize-none border border-gray-300 rounded-xl px-3 py-2 lg:px-4 lg:py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 text-gray-900 placeholder-gray-500 text-sm lg:text-base"
                style={{
                  minHeight: "44px",
                  maxHeight: "200px",
                }}
              />
              <button
                onClick={handleSubmit}
                disabled={isLoading || !inputMessage.trim()}
                className="absolute right-2 bottom-1.5 lg:bottom-2 p-1.5 lg:p-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span className="text-xs">
                Claude can make mistakes. Please double-check responses.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
