// client/src/pages/ChatPage.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import ChatHistorySidebar from '../components/ChatHistorySidebar';

// Custom component to render code blocks with a copy button
const CodeBlock = ({ node, inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  const [copied, setCopied] = useState(false);
  const codeContent = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = codeContent;
      textarea.style.position = 'fixed';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return !inline && match ? (
    <div className="code-block-container">
      <div className="code-block-header">
        <span className="font-mono">{match[1] || 'Code'}</span>
        <button onClick={handleCopy} className="copy-button">
          {copied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      <pre className="code-content">
        <code className={className} {...props}>
          {codeContent}
        </code>
      </pre>
    </div>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};


function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState([]); // List of chat history items
  const [activeChatId, setActiveChatId] = useState(null); // Currently selected chat
  const [isInitialLoadOfChatListDone, setIsInitialLoadOfChatListDone] = useState(false); // Flag to ensure initial chat list load logic runs only once
  const messagesEndRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Initial greeting message for a new chat
  const initialGreeting = 'Hello! I\'m your AI Career Guide. Tell me about your interests, academic performance, or long-term goals, and I can help you explore career paths.';

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const API_BASE_URL = 'http://localhost:5000/api'; // Your backend API URL
  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY; // Your Gemini API Key

  // Scroll to the latest message whenever messages state updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // handleSelectChat: Fetches and displays messages for a specific chat ID
  const handleSelectChat = useCallback(async (chatId) => {
    if (!user || !user.token) return;
    setActiveChatId(chatId);
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/chat/${chatId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching selected chat:', error);
      if (error.response && (error.response.status === 401 || error.response.status === 404)) {
        console.log('Selected chat not found or unauthorized, starting a new chat.');
        setActiveChatId(null); // Clear active chat ID if not found
        setMessages([{ sender: 'bot', text: initialGreeting }]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, initialGreeting]);


  // fetchChatList: Fetches only the list of chat titles for the sidebar
  const fetchChatList = useCallback(async () => {
    if (!user || !user.token) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/chat`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chat list:', error);
      if (error.response && error.response.status === 401) {
        logout();
      }
    }
  }, [user, logout]);

  // useEffect to fetch chat list initially
  useEffect(() => {
    fetchChatList();
  }, [fetchChatList]);


  // useEffect to handle initial chat display logic after chat list is loaded
  // This runs only once per user session to decide the *initial* chat view.
  useEffect(() => {
    // Only proceed if user is logged in, chats have been loaded, and initial load hasn't completed
    if (user && chats.length > 0 && !isInitialLoadOfChatListDone) {
      handleSelectChat(chats[0]._id); // Load the most recent chat
      setIsInitialLoadOfChatListDone(true); // Mark initial load as complete
    } else if (user && chats.length === 0 && !isInitialLoadOfChatListDone) {
      // If no chats exist for the user, display initial greeting for a fresh start
      setMessages([{ sender: 'bot', text: initialGreeting }]);
      setIsInitialLoadOfChatListDone(true); // Mark initial load as complete
    }
  }, [user, chats, isInitialLoadOfChatListDone, handleSelectChat, initialGreeting]);


  // handleCreateNewChat: Explicitly creates a new chat UI state
  const handleCreateNewChat = useCallback(() => {
    setActiveChatId(null); // Explicitly set to null to indicate a new chat
    setMessages([{ sender: 'bot', text: initialGreeting }]); // Display initial greeting for new chat
    setInput(''); // Clear input
    // When a new chat is created, we ensure the initial load logic doesn't override this
    setIsInitialLoadOfChatListDone(true); // Treat this as fulfilling the "initial load"
  }, [initialGreeting]);

  // handleDeleteChat: Deletes a chat from history
  const handleDeleteChat = async (chatId) => {
    if (!user || !user.token) return;
    console.log('Attempting to delete chat ID:', chatId);
    const confirmed = window.confirm('Are you sure you want to delete this chat?'); // Temporary use of window.confirm

    if (confirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/chat/${chatId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        await fetchChatList(); // Refresh sidebar after deletion

        if (activeChatId === chatId) {
          // If the currently displayed chat was deleted, go to a new chat state
          handleCreateNewChat();
        } else if (activeChatId !== null && chats.length > 0) {
          // If a different chat was deleted, but one is still active, re-select it
          // This ensures the displayed chat corresponds to an existing chat in the sidebar.
          handleSelectChat(activeChatId);
        } else {
            // If the active chat was deleted and there are no other chats, or activeChatId was null,
            // ensure a new chat state is displayed.
            handleCreateNewChat();
        }
      } catch (error) {
        console.error('Error deleting chat:', error);
        if (error.response && error.response.status === 401) {
          logout();
        }
      }
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    if (!user || !user.token) {
      console.log('You must be logged in to send messages. Redirecting to login.');
      navigate('/login');
      return;
    }

    const userMessage = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    let currentChatId = activeChatId;

    try {
      // Step 1: Save user message to backend.
      // If activeChatId is null, a new chat document will be created.
      const userSaveResponse = await axios.post(`${API_BASE_URL}/chat/message`,
        {
          chatId: currentChatId,
          sender: userMessage.sender,
          text: userMessage.text,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      // If a new chat was created (currentChatId was null), update the activeChatId
      // and immediately refresh the chat list in the sidebar.
      if (!currentChatId) {
        currentChatId = userSaveResponse.data._id;
        setActiveChatId(currentChatId); // Set the newly created chat as active
        fetchChatList(); // Refresh the sidebar to show the new chat
      }

      // Step 2: Call Gemini API for bot response.
      const chatHistoryForGemini = [
        {
          role: "user",
          parts: [{ text: "You are an AI-powered career guidance chatbot. Your purpose is to help students choose the right career path by asking about their interests, academic performance, and long-term goals. Based on their answers, you will recommend career paths, courses, relevant job roles, and provide links to online resources like Coursera or Udemy (e.g., 'For Python programming, check out: [Coursera: Python for Everybody](https://www.coursera.org/learn/python)'). Always provide helpful, encouraging, and actionable advice. If you recommend online courses, suggest a general topic or course name and then invent a plausible URL from Coursera or Udemy that matches that topic. Do not just say 'links to online courses' but actually provide example links. Your responses should be conversational and easy to understand. Start by asking open-ended questions to gather information. For example, if someone likes programming, suggest Software Engineering, Data Science, or AI careers. If someone likes biology, suggest Healthcare AI, Biotechnology, or Research careers. Adapt your advice based on the user's input. When providing roadmaps, multi-step advice, or 'flowcharts' for career paths, please use Markdown numbered lists or bullet points for clarity and readability, detailing each step in a logical sequence. If the user asks for code or programming examples, provide simple, illustrative code snippets formatted as Markdown code blocks (e.g., ```python\\nprint('Hello World')\\n```). Specify the programming language in the code block. Focus on code relevant to career paths (e.g., data analysis, web development basics)." }]
        },
        ...messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        })),
        { role: "user", parts: [{ text: userMessage.text }] }
      ];

      const payload = {
        contents: chatHistoryForGemini,
      };

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

      const geminiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const geminiResult = await geminiResponse.json();

      let botResponseText = 'I apologize, but I could not get a response. Please try again.';
      if (geminiResult.candidates && geminiResult.candidates.length > 0 &&
          geminiResult.candidates[0].content && geminiResult.candidates[0].content.parts &&
          geminiResult.candidates[0].content.parts.length > 0) {
        botResponseText = geminiResult.candidates[0].content.parts[0].text;
      } else {
        console.error('Unexpected Gemini API response structure:', geminiResult);
      }

      const botMessage = { sender: 'bot', text: botResponseText };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

      // Step 3: Save bot message to backend using the (potentially new) activeChatId
      await axios.post(`${API_BASE_URL}/chat/message`,
        {
          chatId: currentChatId,
          sender: botMessage.sender,
          text: botMessage.text,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

    } catch (error) {
      console.error('Error in sendMessage:', error);
      setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: 'I\'m having trouble connecting right now. Please check your internet connection or try again later.' }]);
      if (error.response && error.response.status === 401) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="chat-page-layout">
      <ChatHistorySidebar
        chats={chats}
        onSelectChat={handleSelectChat}
        onCreateNewChat={handleCreateNewChat}
        onDeleteChat={handleDeleteChat}
        activeChatId={activeChatId}
      />
      <div className="chat-main-content app-container-wrapper">
        <div className="app-container">
          {/* Header/Title Bar */}
          <header>
            <div>
              <span>CareerPath AI</span>
              {/* Display the logged-in user's username */}
              {user && <span className="user-display">| Logged in as: {user.username}</span>}
              {!user && <span>| Your Future Navigator</span>}
            </div>
          </header>

          {/* Chat Messages Area */}
          <main>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={msg.sender === 'user' ? 'message-end' : 'message-start'}
              >
                <div className={`message-bubble ${msg.sender}`}>
                  <ReactMarkdown
                    components={{
                      code: CodeBlock,
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message-start">
                <div className="message-bubble bot">
                  <div className="loading-dots">
                    <div className="loading-dot" style={{ animationDelay: '0s' }}></div>
                    <div className="loading-dot" style={{ animationDelay: '0.2s' }}></div>
                    <div className="loading-dot" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </main>

          {/* Input Area */}
          <form onSubmit={sendMessage}>
            <div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isLoading ? 'AI is thinking...' : 'Ask about your career path...'}
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
