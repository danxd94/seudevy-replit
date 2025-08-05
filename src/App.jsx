import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Send, Copy, Play, RefreshCw, Code, Eye, MessageSquare, Settings, Loader2 } from 'lucide-react'
import './App.css'

// Componente principal do SeuDevy Replit
function App() {
  const [activeTab, setActiveTab] = useState('chat')
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCode, setGeneratedCode] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const textareaRef = useRef(null)

  // Ajustar altura do textarea automaticamente
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [inputValue])

  // Simular geração de código com IA
  const generateCode = async (prompt) => {
    setIsGenerating(true)
    
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Código de exemplo baseado no prompt
    const exampleCode = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>App Gerado</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            text-align: center;
            max-width: 500px;
            width: 100%;
        }
        h1 {
            color: #333;
            margin-bottom: 1rem;
        }
        p {
            color: #666;
            line-height: 1.6;
        }
        .button {
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 1rem;
            transition: background 0.3s;
        }
        .button:hover {
            background: #5a6fd8;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Aplicação Gerada com IA</h1>
        <p>Esta aplicação foi criada baseada no seu prompt: "${prompt}"</p>
        <button class="button" onclick="alert('Funcionalidade implementada!')">
            Clique aqui
        </button>
    </div>
    
    <script>
        console.log('Aplicação carregada com sucesso!');
        
        // Adicionar interatividade
        document.querySelector('.button').addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    </script>
</body>
</html>
    `.trim()
    
    setGeneratedCode(exampleCode)
    setIsGenerating(false)
    
    return exampleCode
  }

  // Enviar mensagem para a IA
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isGenerating) return
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    const currentPrompt = inputValue
    setInputValue('')
    
    // Gerar código
    const code = await generateCode(currentPrompt)
    
    const aiMessage = {
      id: Date.now() + 1,
      type: 'assistant',
      content: 'Criei uma aplicação baseada no seu pedido! Você pode ver o código na aba "Código" e o preview na aba "Preview".',
      code: code,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, aiMessage])
  }

  // Copiar código para clipboard
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode)
      alert('Código copiado para a área de transferência!')
    } catch (err) {
      console.error('Erro ao copiar código:', err)
    }
  }

  // Executar código no preview
  const runCode = () => {
    if (!generatedCode) return
    
    const blob = new Blob([generatedCode], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    setPreviewUrl(url)
    setActiveTab('preview')
  }

  // Componente de configurações
  const SettingsPanel = () => (
    <div className="p-4 border-b bg-gray-50">
      <h3 className="font-semibold mb-3">Configurações</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            Chave da API OpenAI
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <Button 
          onClick={() => setIsSettingsOpen(false)}
          className="w-full"
        >
          Salvar
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">SeuDevy</h1>
          <p className="text-sm text-gray-600">Gerador de Código com IA</p>
        </div>
        
        {isSettingsOpen && <SettingsPanel />}
        
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <button
              onClick={() => {setActiveTab('chat'); setIsSettingsOpen(false)}}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === 'chat' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
            >
              <MessageSquare size={20} />
              Chat
            </button>
            
            <button
              onClick={() => {setActiveTab('code'); setIsSettingsOpen(false)}}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === 'code' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
            >
              <Code size={20} />
              Código
            </button>
            
            <button
              onClick={() => {setActiveTab('preview'); setIsSettingsOpen(false)}}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === 'preview' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
            >
              <Eye size={20} />
              Preview
            </button>
          </div>
        </nav>
        
        <div className="p-4 border-t">
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-gray-100 transition-colors"
          >
            <Settings size={20} />
            Configurações
          </button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col">
        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Bem-vindo ao SeuDevy!</h3>
                  <p>Descreva o que você quer criar e eu vou gerar o código para você.</p>
                  <div className="mt-4 text-sm">
                    <p className="mb-2">Exemplos:</p>
                    <ul className="space-y-1 text-gray-400">
                      <li>• "Crie uma landing page para uma empresa de tecnologia"</li>
                      <li>• "Faça um calculadora simples com JavaScript"</li>
                      <li>• "Desenvolva um formulário de contato responsivo"</li>
                    </ul>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              
              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      <span className="text-sm">Gerando código...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Input de Chat */}
            <div className="border-t bg-white p-4">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    placeholder="Descreva o que você quer criar..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="1"
                    style={{ minHeight: '40px', maxHeight: '120px' }}
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isGenerating}
                  className="px-4 py-2"
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Code Tab */}
        {activeTab === 'code' && (
          <div className="flex-1 flex flex-col">
            <div className="border-b bg-white p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Código Gerado</h2>
              <div className="flex gap-2">
                <Button
                  onClick={copyCode}
                  disabled={!generatedCode}
                  variant="outline"
                  size="sm"
                >
                  <Copy size={16} className="mr-2" />
                  Copiar
                </Button>
                <Button
                  onClick={runCode}
                  disabled={!generatedCode}
                  size="sm"
                >
                  <Play size={16} className="mr-2" />
                  Executar
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden">
              {generatedCode ? (
                <pre className="h-full overflow-auto p-4 bg-gray-900 text-green-400 text-sm font-mono">
                  <code>{generatedCode}</code>
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Code size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>Nenhum código gerado ainda</p>
                    <p className="text-sm mt-2">Use o chat para gerar código</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="flex-1 flex flex-col">
            <div className="border-b bg-white p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Preview</h2>
              <Button
                onClick={() => {
                  if (previewUrl) {
                    URL.revokeObjectURL(previewUrl)
                    setPreviewUrl('')
                    runCode()
                  }
                }}
                disabled={!generatedCode}
                variant="outline"
                size="sm"
              >
                <RefreshCw size={16} className="mr-2" />
                Atualizar
              </Button>
            </div>
            
            <div className="flex-1">
              {previewUrl ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-full border-0"
                  title="Preview da Aplicação"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Eye size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>Nenhum preview disponível</p>
                    <p className="text-sm mt-2">Gere código e clique em "Executar"</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

