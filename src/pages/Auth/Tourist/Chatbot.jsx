import { useState, useEffect, useRef } from "react";
import {
    Paperclip, Mic, Send, Download, Search, Share2, Settings,
    Copy, Bookmark, MessageSquareText, Volume2, VolumeX,
    Languages, Bot, User, BrainCircuit
} from "lucide-react";
import Confetti from "react-confetti";
import classNames from "classnames";

// --- MOCK AI RESPONSE FUNCTION ---
const getAIResponse = (message) => {
    const lowerCaseMessage = message.toLowerCase();
    if (lowerCaseMessage.includes("joke")) {
        return {
            text: "Why don't scientists trust atoms? Because they make up everything!",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
    }
    if (lowerCaseMessage.includes("booked") || lowerCaseMessage.includes("congratulations")) {
        return {
            text: "Your booking is confirmed. Congratulations on your upcoming trip!",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
    }
   return {
  text: `I am a mock AI assistant. I have received your message: "${message}". 
  To see a confetti effect, try sending a message with "booked" or "congratulations".`,
  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
};

};

// --- MAIN CHATBOT COMPONENT ---
export default function App() {
    // --- STATE MANAGEMENT ---
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [bookmarkedMessages, setBookmarkedMessages] = useState(new Set());
    const [isSearching, setIsSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isThinking, setIsThinking] = useState(false); // New state for thinking animation

    // --- REFS ---
    const fileInputRef = useRef(null);
    const recognitionRef = useRef(null);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    // --- EFFECTS ---
    useEffect(() => {
        const savedMessages = localStorage.getItem("chatMessages");
        setMessages(savedMessages ? JSON.parse(savedMessages) : []);
    }, []);

    useEffect(() => {
        localStorage.setItem("chatMessages", JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isThinking]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    // --- HANDLER FUNCTIONS ---
    const sendMessage = (messageText) => {
        const text = (messageText || input).trim();
        if (!text) return;

        const userMsg = {
            id: Date.now(),
            sender: "You",
            text,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsThinking(true); // Show thinking animation

        setTimeout(() => {
            const aiMsg = { id: Date.now() + 1, sender: "AI", ...getAIResponse(text) };
            setIsThinking(false); // Hide thinking animation
            setMessages((prev) => [...prev, aiMsg]);

            if (aiMsg.text.toLowerCase().includes("congratulations")) {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 5000);
            }

            if (isSpeechEnabled) speakText(aiMsg.text);
        }, 1500); // Simulate AI thinking time
    };

    const handleCopy = (text) => navigator.clipboard.writeText(text).then(() => alert("Copied!"));
    const handleShare = (text) =>
        navigator.share ? navigator.share({ title: "Chat Message", text }) : alert("Share not supported.");
    const toggleBookmark = (id) => {
        const newBookmarks = new Set(bookmarkedMessages);
        newBookmarks.has(id) ? newBookmarks.delete(id) : newBookmarks.add(id);
        setBookmarkedMessages(newBookmarks);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const newMsg = {
            id: Date.now(),
            sender: "You",
            text: `Uploaded file: ${file.name}`,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, newMsg]);
    };

    const handleVoiceInput = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech recognition is not supported in your browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.continuous = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event) => console.error("Speech recognition error:", event.error);
        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript.trim();
            if (transcript) {
                sendMessage(transcript);
            }
        };
        recognition.start();
    };

    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    };

    const handleSuggestionClick = (text) => {
        setInput(text);
        textareaRef.current?.focus();
    };

    const filteredMessages = messages.filter((msg) =>
        msg.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- RENDER ---
    return (
        <div className="flex flex-col h-screen bg-[#0D1117] text-gray-200 font-sans">
            {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

            {/* --- HEADER --- */}
            <header className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 text-white">
                <div className="flex items-center space-x-3">
                    <Bot size={24} />
                    <h1 className="text-lg font-semibold">Jharkhand Saathi</h1>
                </div>
                <div className="flex items-center space-x-1">
                    <button
                        onClick={() => setIsSearching(!isSearching)}
                        className="p-2 rounded-full hover:bg-white/10"
                    >
                        <Search size={20} />
                    </button>
                    <button
                        onClick={() => alert("Placeholder: Download conversation")}
                        className="p-2 rounded-full hover:bg-white/10"
                    >
                        <Download size={20} />
                    </button>
                    <button
                        onClick={() => alert("Placeholder: Summarize conversation")}
                        className="p-2 rounded-full hover:bg-white/10"
                    >
                        <MessageSquareText size={20} />
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-full hover:bg-white/10"
                        >
                            <Settings size={20} />
                        </button>
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-[#161B22] rounded-lg shadow-xl py-1 z-10 border border-gray-700">
                                <button
                                    onClick={() => {
                                        setIsSpeechEnabled(!isSpeechEnabled);
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full text-left flex items-center px-4 py-2 text-sm hover:bg-white/10"
                                >
                                    {isSpeechEnabled ? (
                                        <VolumeX size={16} className="mr-3" />
                                    ) : (
                                        <Volume2 size={16} className="mr-3" />
                                    )}
                                    {isSpeechEnabled ? "Disable Voice Output" : "Enable Voice Output"}
                                </button>
                                <button
                                    onClick={() => {
                                        alert("Placeholder: Change language");
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full text-left flex items-center px-4 py-2 text-sm hover:bg-white/10"
                                >
                                    <Languages size={16} className="mr-3" />
                                    Change Language
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {isSearching && (
                <div className="p-2 border-b border-gray-800">
                    <input
                        type="text"
                        placeholder="Search in conversation..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-transparent p-2 focus:outline-none"
                    />
                </div>
            )}

            {/* --- CHAT AREA --- */}
            <main className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mb-4"></div>
                        <h2 className="text-3xl font-bold text-gray-200">
                            Hello, how can I help you today?
                        </h2>
                    </div>
                )}

                {filteredMessages.map((msg) => (
                    <div
                        key={msg.id}
                        className={classNames("flex items-start gap-4 group", {
                            "justify-end": msg.sender === "You",
                        })}
                    >
                        {msg.sender === "AI" && (
                            <Bot size={24} className="flex-shrink-0 text-gray-500 mt-2" />
                        )}
                        <div
                            className={classNames("flex-1 max-w-2xl", {
                                "order-first": msg.sender === "You",
                            })}
                        >
                            <div className="font-semibold text-sm mb-1">
                                {msg.sender === "You" ? "You" : "AI"}
                            </div>
                            <div
                                className={classNames(
                                    "p-4 rounded-lg whitespace-pre-wrap break-words",
                                    {
                                        "bg-gradient-to-r from-blue-600 to-purple-600 text-white":
                                            msg.sender === "You",
                                        "bg-[#161B22]": msg.sender === "AI",
                                    }
                                )}
                            >
                                {msg.text}
                            </div>
                            <div className="flex items-center space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs text-gray-500">{msg.time}</span>
                                <button onClick={() => handleCopy(msg.text)}>
                                    <Copy size={14} className="hover:text-gray-300" />
                                </button>
                                <button onClick={() => handleShare(msg.text)}>
                                    <Share2 size={14} className="hover:text-gray-300" />
                                </button>
                                <button onClick={() => toggleBookmark(msg.id)}>
                                    <Bookmark
                                        size={14}
                                        className={classNames("hover:text-yellow-500", {
                                            "fill-yellow-400 text-yellow-500":
                                                bookmarkedMessages.has(msg.id),
                                        })}
                                    />
                                </button>
                            </div>
                        </div>
                        {msg.sender === "You" && (
                            <User size={24} className="flex-shrink-0 text-gray-500 mt-2" />
                        )}
                    </div>
                ))}

                {/* --- THINKING ANIMATION --- */}
                {isThinking && (
                    <div className="flex items-start gap-4">
                        <Bot size={24} className="flex-shrink-0 text-gray-500 mt-2" />
                        <div className="p-4 rounded-lg mt-1 bg-[#161B22]">
                            <div className="flex items-center justify-center space-x-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </main>

            {/* --- INPUT AREA --- */}
            <footer className="p-4 w-full max-w-4xl mx-auto">
                {messages.length === 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <button
                            onClick={() => handleSuggestionClick("Suggest a weekend trip in Jharkhand")}
                            className="p-4 bg-[#161B22] rounded-lg text-left hover:bg-[#21262d]"
                        >
                            <BrainCircuit size={20} className="mb-2 text-purple-400" />
                            <p className="font-semibold text-sm">Suggest a weekend trip</p>
                        </button>
                        <button
                            onClick={() => handleSuggestionClick("What are the top waterfalls to see?")}
                            className="p-4 bg-[#161B22] rounded-lg text-left hover:bg-[#21262d]"
                        >
                            <BrainCircuit size={20} className="mb-2 text-blue-400" />
                            <p className="font-semibold text-sm">Top waterfalls to see</p>
                        </button>
                        <button
                            onClick={() => handleSuggestionClick("Discover local art and crafts")}
                            className="p-4 bg-[#161B22] rounded-lg text-left hover:bg-[#21262d]"
                        >
                            <BrainCircuit size={20} className="mb-2 text-pink-400" />
                            <p className="font-semibold text-sm">Discover local art</p>
                        </button>
                        <button
                            onClick={() => handleSuggestionClick("Find a hidden gem for trekking")}
                            className="p-4 bg-[#161B22] rounded-lg text-left hover:bg-[#21262d]"
                        >
                            <BrainCircuit size={20} className="mb-2 text-green-400" />
                            <p className="font-semibold text-sm">Find a hidden gem</p>
                        </button>
                    </div>
                )}
                <div className="relative">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === "Enter" &&
                            !e.shiftKey &&
                            (e.preventDefault(), sendMessage())
                        }
                        placeholder="Type your message..."
                        rows="1"
                        className="w-full p-4 pr-32 bg-[#161B22] rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-gray-200"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="p-2 rounded-full hover:bg-white/10"
                        >
                            <Paperclip size={20} />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                        <button
                            onClick={handleVoiceInput}
                            className={classNames(
                                "p-2 rounded-full hover:bg-white/10",
                                { "bg-red-500/20 text-red-500": isListening }
                            )}
                        >
                            <Mic size={20} />
                        </button>
                        {input && (
                            <button
                                onClick={() => sendMessage()}
                                className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:opacity-90 transition-opacity"
                            >
                                <Send size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </footer>
        </div>
    );
}
