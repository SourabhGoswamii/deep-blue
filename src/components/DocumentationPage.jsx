import { Link } from 'react-router-dom'
import { Code, Key, MessageSquare } from 'lucide-react'

function DocumentationPage() {
  return (
    <div className="min-h-screen bg-chatbg text-[#333333]">
      <nav className="bg-chatSecondary p-4 border-b border-chatBorder">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">DeepWhale AI</h1>
          <div className="flex gap-4">
            <Link to="/" className="hover:text-green-600">Home</Link>
            <Link to="/chat" className="hover:text-green-600">Chat</Link>
            <a 
              href="https://github.com/yourusername/deepwhale" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-green-600"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <div className="sticky top-4">
              <h3 className="text-lg font-semibold mb-4">Contents</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#getting-started" className="hover:text-green-600">Getting Started</a>
                </li>
                <li>
                  <a href="#setup" className="hover:text-green-600">Setup</a>
                </li>
                <li>
                  <a href="#usage" className="hover:text-green-600">Usage</a>
                </li>
                <li>
                  <a href="#api-reference" className="hover:text-green-600">API Reference</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-12">
            <section id="getting-started">
              <h2 className="text-3xl font-bold mb-6">Getting Started</h2>
              <p className="text-gray-600 mb-4">
                DeepWhale AI is a chat interface powered by DeepSeek's language models through OpenRouter. 
                This documentation will guide you through setup and usage of the application.
              </p>
              <div className="bg-chatSecondary p-4 rounded-lg border border-chatBorder">
                <Code className="w-6 h-6 mb-2 text-green-600" />
                <p className="text-sm">
                  Clone the repository:<br />
                  <code className="bg-white bg-opacity-50 px-2 py-1 rounded border border-chatBorder">
                    git clone https://github.com/yourusername/deepwhale.git
                  </code>
                </p>
              </div>
            </section>

            <section id="setup">
              <h2 className="text-3xl font-bold mb-6">Setup</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Follow these steps to set up your development environment:
                </p>
                <ol className="list-decimal list-inside space-y-4 text-gray-600">
                  <li>
                    Install dependencies:
                    <code className="block bg-white bg-opacity-50 p-2 rounded mt-2 border border-chatBorder">
                      npm install
                    </code>
                  </li>
                  <li>
                    Create a .env file in the root directory:
                    <code className="block bg-white bg-opacity-50 p-2 rounded mt-2 border border-chatBorder">
                      VITE_OPERO_API_KEY=your_api_key_here
                    </code>
                  </li>
                  <li>
                    Start the development server:
                    <code className="block bg-white bg-opacity-50 p-2 rounded mt-2 border border-chatBorder">
                      npm run dev
                    </code>
                  </li>
                </ol>
              </div>
            </section>

            <section id="usage">
              <h2 className="text-3xl font-bold mb-6">Usage</h2>
              <div className="space-y-4">
                <div className="bg-chatSecondary p-6 rounded-lg border border-chatBorder">
                  <MessageSquare className="w-6 h-6 mb-2 text-green-600" />
                  <h3 className="text-xl font-semibold mb-2">Chat Interface</h3>
                  <p className="text-gray-600">
                    The chat interface provides several features:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-gray-600">
                    <li>Real-time AI responses</li>
                    <li>Message feedback buttons (thumbs up/down)</li>
                    <li>Text-to-speech capability</li>
                    <li>Copy message functionality</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="api-reference">
              <h2 className="text-3xl font-bold mb-6">API Reference</h2>
              <div className="space-y-4">
                <div className="bg-chatSecondary p-6 rounded-lg border border-chatBorder">
                  <Key className="w-6 h-6 mb-2 text-green-600" />
                  <h3 className="text-xl font-semibold mb-2">Authentication</h3>
                  <p className="text-gray-600">
                    API requests require authentication using your OpenRouter API key.
                    The key should be included in the Authorization header:
                  </p>
                  <code className="block bg-white bg-opacity-50 p-2 rounded mt-2 border border-chatBorder">
                    Authorization: Bearer your_api_key_here
                  </code>
                </div>

                <div className="bg-chatSecondary p-6 rounded-lg border border-chatBorder mt-4">
                  <h3 className="text-xl font-semibold mb-2">Endpoints</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-green-600">POST /chat</h4>
                      <p className="text-gray-600 mt-1">
                        Send a chat message to the AI model.
                      </p>
                      <pre className="bg-white bg-opacity-50 p-2 rounded mt-2 text-sm border border-chatBorder">
{`{
  "messages": [
    {"role": "user", "content": "Your message here"}
  ],
  "model": "deepseek/deepseek-r1-0528-qwen3-8b:free"
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-chatSecondary mt-16 py-8 border-t border-chatBorder">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p>© 2024 DeepWhale AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default DocumentationPage