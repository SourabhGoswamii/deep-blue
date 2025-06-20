import { Link } from 'react-router-dom'
import { MessageSquare, FileText, Github } from 'lucide-react'

function LandingPage() {
  return (
    <div className="min-h-screen bg-chatbg text-white">
      <nav className="bg-chatSecondary p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">DeepWhale AI</h1>
          <div className="flex gap-4">
            <Link to="/chat" className="hover:text-green-400">Chat</Link>
            <Link to="/docs" className="hover:text-green-400">Documentation</Link>
            <a 
              href="https://github.com/yourusername/deepwhale" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-green-400"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">Experience Advanced AI Chat</h2>
          <p className="text-xl text-gray-300 mb-8">
            Powered by DeepSeek's cutting-edge language models through OpenRouter
          </p>
          <Link
            to="/chat"
            className="bg-green-600 text-white px-8 py-4 rounded-lg text-xl font-medium hover:bg-green-700 transition-colors"
          >
            Start Chatting
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-chatSecondary p-6 rounded-lg">
            <MessageSquare className="w-12 h-12 mb-4 text-green-400" />
            <h3 className="text-xl font-semibold mb-2">Intelligent Chat</h3>
            <p className="text-gray-300">
              Engage in natural conversations with advanced AI models for better understanding and responses.
            </p>
          </div>

          <div className="bg-chatSecondary p-6 rounded-lg">
            <FileText className="w-12 h-12 mb-4 text-green-400" />
            <h3 className="text-xl font-semibold mb-2">Documentation</h3>
            <p className="text-gray-300">
              Comprehensive guides and examples to help you get the most out of the AI chat system.
            </p>
          </div>

          <div className="bg-chatSecondary p-6 rounded-lg">
            <Github className="w-12 h-12 mb-4 text-green-400" />
            <h3 className="text-xl font-semibold mb-2">Open Source</h3>
            <p className="text-gray-300">
              Free and open source implementation. Contribute and customize to your needs.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-chatSecondary mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>© 2024 DeepWhale AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage