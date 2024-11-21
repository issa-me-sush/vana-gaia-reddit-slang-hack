import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

type Message = {
  content: string;
  role: 'user' | 'assistant' | 'system';
};

type APIResponse = {
  choices?: [{
    message: Message;
  }];
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://0xb4fdccb01e96cbbe456c2d8fceede82688b238c3.us.gaianet.network/v1/chat/completions', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' } as Message,
            ...messages,
            userMessage
          ]
        }),
      });

      const data: APIResponse = await response.json();
      if (data.choices?.[0]?.message) {
        // @ts-ignore 
        setMessages(prev => [...prev, data.choices[0].message]);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = { 
        role: 'assistant', 
        content: 'Sorry, something went wrong. Please try again.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900">
      <Head>
        <title>VANA x GAIA Reddit Slang Chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto max-w-4xl p-4">
        <h1 className="text-4xl font-bold text-center text-white mb-8 pt-6">
          VANA x GAIA Reddit Slang Chat
        </h1>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-4 min-h-[600px] flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/20 text-white'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/20 text-white rounded-2xl px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="mt-auto">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-white/10 text-white placeholder-white/50 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
