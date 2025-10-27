import { Layout } from "@/components/Layout";
import { Search, Send, Settings, Plus } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useSocket } from "@/hooks/useSocket";

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
  isOwn: boolean;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<string>(
    "conv1"
  );
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const { socket, isConnected } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const conversations: Conversation[] = [
    {
      id: "conv1",
      name: "Dr. Sarah Johnson",
      avatar: "SJ",
      lastMessage:
        "Great work on your last assignment! Keep it up.",
      timestamp: "2 hours ago",
      unread: true,
    },
    {
      id: "conv2",
      name: "Emily Brown",
      avatar: "EB",
      lastMessage:
        "Thanks for helping me with the algorithm problem!",
      timestamp: "1 day ago",
      unread: false,
    },
    {
      id: "conv3",
      name: "Study Group - CS101",
      avatar: "SG",
      lastMessage:
        "Meeting at the library at 3 PM tomorrow. Who's in?",
      timestamp: "2 days ago",
      unread: false,
    },
    {
      id: "conv4",
      name: "Prof. Michael Chen",
      avatar: "MC",
      lastMessage: "I'll have the midterm grades posted by Friday",
      timestamp: "3 days ago",
      unread: false,
    },
    {
      id: "conv5",
      name: "Alex Martinez",
      avatar: "AM",
      lastMessage:
        "Did you understand the binary tree implementation?",
      timestamp: "1 week ago",
      unread: false,
    },
  ];

  const messagesMap: Record<string, Message[]> = {
    conv1: [
      {
        id: 1,
        text: "Hi John, how are you progressing with the coursework?",
        sender: "Dr. Sarah Johnson",
        timestamp: "2 days ago",
        isOwn: false,
      },
      {
        id: 2,
        text: "Hello Dr. Johnson! I'm doing well. The last assignment was interesting.",
        sender: "You",
        timestamp: "2 days ago",
        isOwn: true,
      },
      {
        id: 3,
        text: "Great work on your last assignment! Keep it up.",
        sender: "Dr. Sarah Johnson",
        timestamp: "2 hours ago",
        isOwn: false,
      },
    ],
    conv2: [
      {
        id: 1,
        text: "Hey! I'm stuck on the sorting algorithm problem. Can you help?",
        sender: "Emily Brown",
        timestamp: "3 days ago",
        isOwn: false,
      },
      {
        id: 2,
        text: "Sure! Which part are you stuck on?",
        sender: "You",
        timestamp: "3 days ago",
        isOwn: true,
      },
      {
        id: 3,
        text: "The implementation of the pivot selection. I think I'm overcomplicating it.",
        sender: "Emily Brown",
        timestamp: "3 days ago",
        isOwn: false,
      },
      {
        id: 4,
        text: "Let me send you the approach I used. It's actually simpler than you think!",
        sender: "You",
        timestamp: "3 days ago",
        isOwn: true,
      },
      {
        id: 5,
        text: "Thanks for helping me with the algorithm problem!",
        sender: "Emily Brown",
        timestamp: "1 day ago",
        isOwn: false,
      },
    ],
    conv3: [
      {
        id: 1,
        text: "Hey everyone! Want to do a study session for the upcoming midterm?",
        sender: "You",
        timestamp: "3 days ago",
        isOwn: true,
      },
      {
        id: 2,
        text: "Yes! I definitely need help with the data structures unit",
        sender: "Emily Brown",
        timestamp: "3 days ago",
        isOwn: false,
      },
      {
        id: 3,
        text: "Count me in! Library at 3 PM?",
        sender: "Dr. Sarah Johnson",
        timestamp: "2 days ago",
        isOwn: false,
      },
      {
        id: 4,
        text: "Meeting at the library at 3 PM tomorrow. Who's in?",
        sender: "You",
        timestamp: "2 days ago",
        isOwn: true,
      },
    ],
    conv4: [
      {
        id: 1,
        text: "Professor, when will you have the midterm grades posted?",
        sender: "You",
        timestamp: "4 days ago",
        isOwn: true,
      },
      {
        id: 2,
        text: "I'll have the midterm grades posted by Friday",
        sender: "Prof. Michael Chen",
        timestamp: "3 days ago",
        isOwn: false,
      },
    ],
    conv5: [
      {
        id: 1,
        text: "Hey John, did you get the binary tree assignment done?",
        sender: "Alex Martinez",
        timestamp: "1 week ago",
        isOwn: false,
      },
      {
        id: 2,
        text: "Yes, just finished it. The traversal methods were tricky!",
        sender: "You",
        timestamp: "1 week ago",
        isOwn: true,
      },
      {
        id: 3,
        text: "Did you understand the binary tree implementation?",
        sender: "Alex Martinez",
        timestamp: "1 week ago",
        isOwn: false,
      },
    ],
  };

  const currentConversation = conversations.find(
    (c) => c.id === selectedConversation
  );
  // Merge initial messages with new messages
  const currentMessages = [
    ...(messagesMap[selectedConversation] || []),
    ...(messages[selectedConversation] || [])
  ];

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Socket.io effects
  useEffect(() => {
    if (!socket || !selectedConversation) return;

    // Join conversation room
    socket.emit("join_conversation", selectedConversation);

    // Listen for new messages
    socket.on("new_message", (message: any) => {
      setMessages((prev) => ({
        ...prev,
        [selectedConversation]: [
          ...(prev[selectedConversation] || []),
          {
            id: message.id,
            text: message.content,
            sender: message.sender_email,
            timestamp: new Date(message.created_at).toLocaleTimeString(),
            isOwn: false,
          },
        ],
      }));
    });

    // Listen for typing indicators
    socket.on("user_typing", (data: any) => {
      setTypingUser(data.userEmail);
      setIsTyping(true);
    });

    socket.on("user_stopped_typing", () => {
      setIsTyping(false);
      setTypingUser(null);
    });

    return () => {
      socket.emit("leave_conversation", selectedConversation);
      socket.off("new_message");
      socket.off("user_typing");
      socket.off("user_stopped_typing");
    };
  }, [socket, selectedConversation]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedConversation]);

  const handleSendMessage = () => {
    if (!messageText.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (!selectedConversation) {
      toast.error("Please select a conversation");
      return;
    }

    const newMessage: Message = {
      id: Date.now(),
      text: messageText.trim(),
      sender: "You",
      timestamp: "Just now",
      isOwn: true,
    };

    setMessages((prev) => ({
      ...prev,
      [selectedConversation]: [
        ...(prev[selectedConversation] || []),
        newMessage,
      ],
    }));

    // Send via Socket.io if connected
    if (socket && isConnected) {
      socket.emit("send_message", {
        conversationId: selectedConversation,
        content: messageText.trim(),
        timestamp: new Date().toISOString(),
      });
    }

    setMessageText("");
    
    // Stop typing indicator
    if (socket) {
      socket.emit("typing_stop", selectedConversation);
    }
  };

  const handleTyping = (text: string) => {
    setMessageText(text);

    if (!socket || !selectedConversation) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Emit typing start
    socket.emit("typing_start", selectedConversation);

    // Set timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing_stop", selectedConversation);
    }, 1000);
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-4rem)] bg-background">
        {/* Conversations Sidebar */}
        <div className="w-full md:w-80 border-r border-border bg-card flex flex-col">
          {/* Search Bar */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* New Conversation Button */}
          <div className="p-3 border-b border-border">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
              <Plus size={18} />
              New Message
            </button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`w-full px-4 py-3 border-b border-border text-left transition-colors ${
                  selectedConversation === conv.id
                    ? "bg-primary/10 border-l-4 border-l-primary"
                    : "hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
                    {conv.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">
                        {conv.name}
                      </h3>
                      {conv.unread && (
                        <div className="h-2 w-2 bg-primary rounded-full" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {conv.lastMessage}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {conv.timestamp}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Messages Area */}
        {currentConversation ? (
          <div className="hidden md:flex md:flex-col md:flex-1">
            {/* Chat Header */}
            <div className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
                  {currentConversation.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {currentConversation.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {currentConversation.timestamp}
                  </p>
                </div>
              </div>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Settings size={20} className="text-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {currentMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isOwn ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isOwn
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Typing Indicator */}
            {isTyping && typingUser && (
              <div className="px-4 py-2 text-sm text-muted-foreground italic">
                {typingUser} is typing...
              </div>
            )}

            {/* Message Input */}
            <div className="h-20 border-t border-border bg-card p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => handleTyping(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                  className="flex-1 px-4 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex md:flex-1 items-center justify-center text-center">
            <div>
              <p className="text-muted-foreground mb-4">
                Select a conversation to start messaging
              </p>
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                Start New Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
