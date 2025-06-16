// client/src/components/ChatHistorySidebar.js
import React from 'react';
import { useAuth } from '../AuthContext';

const ChatHistorySidebar = ({ chats, onSelectChat, onCreateNewChat, onDeleteChat, activeChatId }) => {
  const { logout } = useAuth();

  return (
    <div className="chat-sidebar">
      <h3>Chat History</h3>
      <button onClick={onCreateNewChat} className="new-chat-button">
        + New Chat
      </button>
      <ul className="chat-history-list">
        {chats.map((chat) => (
          <li
            key={chat._id}
            className={`chat-history-item ${activeChatId === chat._id ? 'active' : ''}`}
            onClick={() => onSelectChat(chat._id)}
          >
            <span className="chat-history-title">{chat.title || 'Untitled Chat'}</span>
            <button onClick={(e) => { e.stopPropagation(); onDeleteChat(chat._id); }} className="chat-delete-button">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
      <button onClick={logout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default ChatHistorySidebar;