'use client';
import { useState, useEffect, useRef } from 'react';

interface Message {
  id: number;
  senderId: number;
  senderName: string;
  recipientId?: number;
  subject?: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface User {
  id: number;
  name: string;
  username: string;
  role: string;
}

interface Conversation {
  userId: number;
  userName: string;
  lastMessage?: Message;
  unreadCount: number;
  messages: Message[];
}

interface FloatingChatProps {
  currentUserId: number;
  currentUserName: string;
}

export default function FloatingChat({ currentUserId, currentUserName }: FloatingChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [showUserList, setShowUserList] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      fetchUsers();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [conversations, activeChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/messages?userId=${currentUserId}`);
      if (response.ok) {
        const messages: Message[] = await response.json();
        organizeConversations(messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.filter((user: User) => user.id !== currentUserId));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const organizeConversations = (messages: Message[]) => {
    const convMap = new Map<number, Conversation>();
    
    // Add broadcast messages as a special conversation
    const broadcastMessages = messages.filter(msg => !msg.recipientId);
    if (broadcastMessages.length > 0) {
      convMap.set(0, {
        userId: 0,
        userName: 'Announcements',
        messages: broadcastMessages,
        lastMessage: broadcastMessages[0],
        unreadCount: broadcastMessages.filter(msg => !msg.isRead && msg.senderId !== currentUserId).length
      });
    }

    // Organize direct messages
    messages.filter(msg => msg.recipientId).forEach(msg => {
      const otherUserId = msg.senderId === currentUserId ? msg.recipientId! : msg.senderId;
      const otherUserName = msg.senderId === currentUserId ? 
        users.find(u => u.id === msg.recipientId)?.name || 'Unknown' : msg.senderName;

      if (!convMap.has(otherUserId)) {
        convMap.set(otherUserId, {
          userId: otherUserId,
          userName: otherUserName,
          messages: [],
          unreadCount: 0
        });
      }

      const conv = convMap.get(otherUserId)!;
      conv.messages.push(msg);
      
      if (!conv.lastMessage || new Date(msg.createdAt) > new Date(conv.lastMessage.createdAt)) {
        conv.lastMessage = msg;
      }
      
      if (!msg.isRead && msg.senderId !== currentUserId) {
        conv.unreadCount++;
      }
    });

    // Sort conversations by last message time
    const sortedConversations = Array.from(convMap.values()).sort((a, b) => {
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime();
    });

    setConversations(sortedConversations);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || activeChat === null) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUserId,
          senderName: currentUserName,
          recipientId: activeChat === 0 ? null : activeChat,
          content: newMessage
        })
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const startNewChat = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const existingConv = conversations.find(c => c.userId === userId);
    if (existingConv) {
      setActiveChat(userId);
    } else {
      const newConv: Conversation = {
        userId,
        userName: user.name,
        messages: [],
        unreadCount: 0
      };
      setConversations(prev => [newConv, ...prev]);
      setActiveChat(userId);
    }
    setShowUserList(false);
  };

  const markAsRead = async (messageId: number) => {
    try {
      await fetch(`/api/messages/${messageId}`, { method: 'PUT' });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
  const activeConversation = conversations.find(c => c.userId === activeChat);

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {totalUnread > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalUnread > 9 ? '9+' : totalUnread}
            </span>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 h-96 bg-white rounded-lg shadow-xl border z-50 flex flex-col">
          {/* Header */}
          <div className="bg-blue-500 text-white p-3 rounded-t-lg flex items-center justify-between">
            <h3 className="font-semibold">
              {activeChat === null ? 'Messages' : activeConversation?.userName}
            </h3>
            <div className="flex items-center space-x-2">
              {activeChat === null && (
                <button
                  onClick={() => setShowUserList(true)}
                  className="p-1 hover:bg-blue-600 rounded"
                  title="New Message"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              )}
              {activeChat !== null && (
                <button
                  onClick={() => setActiveChat(null)}
                  className="p-1 hover:bg-blue-600 rounded"
                  title="Back"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-blue-600 rounded"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {showUserList ? (
              /* User List */
              <div className="h-full overflow-y-auto">
                <div className="p-2 border-b bg-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Start new conversation</span>
                    <button
                      onClick={() => setShowUserList(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                {users.map(user => (
                  <div
                    key={user.id}
                    onClick={() => startNewChat(user.id)}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : activeChat === null ? (
              /* Conversations List */
              <div className="h-full overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                ) : conversations.length > 0 ? (
                  conversations.map(conv => (
                    <div
                      key={conv.userId}
                      onClick={() => setActiveChat(conv.userId)}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b flex items-center space-x-3"
                    >
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                        {conv.userId === 0 ? '📢' : conv.userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm truncate">{conv.userName}</span>
                          {conv.unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-2">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        {conv.lastMessage && (
                          <p className="text-xs text-gray-500 truncate">
                            {conv.lastMessage.content}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p className="text-sm">No conversations yet</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Chat Messages */
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {activeConversation?.messages
                    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                    .map(msg => {
                      const isOwn = msg.senderId === currentUserId;
                      if (!msg.isRead && !isOwn) {
                        markAsRead(msg.id);
                      }
                      
                      return (
                        <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                            isOwn 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 text-gray-800'
                          }`}>
                            {!isOwn && activeChat !== 0 && (
                              <div className="text-xs opacity-75 mb-1">{msg.senderName}</div>
                            )}
                            <div>{msg.content}</div>
                            <div className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Message Input */}
                {activeChat !== 0 && (
                  <div className="border-t p-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-3 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-2 rounded-full"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}