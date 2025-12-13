import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, FileQuestion, Send, Bot, User, ArrowLeft, GraduationCap, CheckCircle2, AlertCircle, Loader2, Sparkles, BrainCircuit } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { QuizQuestion } from '../types';

type ToolView = 'hub' | 'chat' | 'quiz';

const AIToolsView: React.FC = () => {
  const [currentView, setCurrentView] = useState<ToolView>('hub');

  return (
    <div className="h-full flex flex-col bg-slate-900">
      {/* Header */}
      <div className="h-16 border-b border-slate-800 flex items-center px-6 justify-between flex-shrink-0 bg-slate-900/50 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
            {currentView !== 'hub' && (
                <button 
                    onClick={() => setCurrentView('hub')}
                    className="p-2 -ml-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
            )}
            <div className="flex items-center gap-2">
                <BrainCircuit className="w-6 h-6 text-indigo-500" />
                <h1 className="text-xl font-bold text-white">
                    {currentView === 'hub' ? 'AI Study Tools' : currentView === 'chat' ? 'Chat Tutor' : 'Quiz Generator'}
                </h1>
            </div>
        </div>
        <div className="hidden md:block text-xs text-slate-500 font-medium px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
            Powered by Gemini 2.0 Flash
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative">
        {currentView === 'hub' && <ToolsHub onViewChange={setCurrentView} />}
        {currentView === 'chat' && <ChatTutor />}
        {currentView === 'quiz' && <QuizGenerator />}
      </div>
    </div>
  );
};

const ToolsHub: React.FC<{ onViewChange: (view: ToolView) => void }> = ({ onViewChange }) => {
    return (
        <div className="h-full p-6 md:p-12 overflow-y-auto custom-scrollbar">
            <div className="max-w-4xl mx-auto animate-fade-in">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-white mb-3">Supercharge your learning</h2>
                    <p className="text-slate-400 text-lg">Select a tool to get started with your AI study companion.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Chat Card */}
                    <div 
                        onClick={() => onViewChange('chat')}
                        className="group bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-indigo-500/50 rounded-2xl p-8 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-indigo-500/10 flex flex-col items-center text-center"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <MessageSquare className="w-8 h-8 text-indigo-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Chat Tutor</h3>
                        <p className="text-slate-400 mb-6">Ask questions, get explanations, and break down complex topics into simple terms.</p>
                        <span className="text-indigo-400 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                            Start Chatting <ArrowLeft className="w-4 h-4 rotate-180" />
                        </span>
                    </div>

                    {/* Quiz Card */}
                    <div 
                        onClick={() => onViewChange('quiz')}
                        className="group bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-purple-500/50 rounded-2xl p-8 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-purple-500/10 flex flex-col items-center text-center"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <FileQuestion className="w-8 h-8 text-purple-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Quiz Generator</h3>
                        <p className="text-slate-400 mb-6">Test your knowledge. Generate multiple-choice quizzes on any subject instantly.</p>
                        <span className="text-purple-400 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                            Create Quiz <ArrowLeft className="w-4 h-4 rotate-180" />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ChatTutor: React.FC = () => {
    const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
        { role: 'model', text: "Hi! I am your AI Study Companion. I can explain complex topics. " }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };

    useEffect(() => {
        scrollToBottom('smooth');
    }, [messages]);
    
    // Initial scroll on mount
    useEffect(() => {
        scrollToBottom('auto');
    }, []);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input;
        setInput('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
        
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);

        const historyForApi = messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        }));

        const responseText = await geminiService.chat(userMsg, historyForApi);

        setMessages(prev => [...prev, { role: 'model', text: responseText }]);
        setIsLoading(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 overflow-y-auto p-4 md:p-6 custom-scrollbar">
            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
                <div className="max-w-3xl mx-auto space-y-6 pt-4">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex gap-4 max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                {/* Avatar */}
                                <div className={`
                                    flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                                    ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-green-500'}
                                    shadow-lg
                                `}>
                                    {msg.role === 'user' ? <User className="w-6 h-6 text-white" /> : <BrainCircuit className="w-6 h-6 text-white" />}
                                </div>

                                {/* Bubble */}
                                <div className={`
                                    p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm min-w-0 border
                                    ${msg.role === 'user' 
                                        ? 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none' 
                                        : 'bg-slate-800 text-slate-200 border-slate-700 rounded-tl-none'}
                                `}>
                                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Typing Indicator */}
                    {isLoading && (
                        <div className="flex justify-start w-full">
                            <div className="flex gap-4 max-w-[85%]">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                                    <BrainCircuit className="w-6 h-6 text-white" />
                                </div>
                                <div className="bg-slate-800 border border-slate-700 px-5 py-4 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            
            {/* Input Area */}
            <div className="p-6 bg-slate-900 border-t border-slate-800">
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSend} className="relative flex items-end gap-2 bg-slate-800 p-2 pl-4 rounded-2xl border border-slate-700 shadow-xl focus-within:border-slate-600 transition-colors">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={handleInput}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask anything..."
                            rows={1}
                            className="flex-1 bg-transparent text-white py-3 focus:outline-none placeholder-slate-400 text-base resize-none custom-scrollbar max-h-[150px]"
                        />
                        <button 
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="p-3 mb-0.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const QuizGenerator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setIsLoading(true);
        setQuestions([]);
        setUserAnswers({});
        setIsSubmitted(false);

        const generatedQuestions = await geminiService.generateQuiz(topic);
        setQuestions(generatedQuestions);
        setIsLoading(false);
    };

    const handleSelectOption = (questionId: number, optionIdx: number) => {
        if (isSubmitted) return;
        setUserAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
    };

    const calculateScore = () => {
        let score = 0;
        questions.forEach(q => {
            if (userAnswers[q.id] === q.correctAnswer) score++;
        });
        return score;
    };

    return (
        <div className="h-full overflow-y-auto p-6 custom-scrollbar">
            <div className="max-w-3xl mx-auto">
                {questions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center animate-fade-in">
                         <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
                            <Sparkles className="w-10 h-10 text-indigo-500" />
                         </div>
                         <h2 className="text-2xl font-bold text-white mb-2">Instant Quiz Generator</h2>
                         <p className="text-slate-400 mb-8 max-w-md">Enter any topic—like "Photosynthesis", "World War II", or "Calculus"—and we'll generate a practice quiz for you.</p>
                         
                         <form onSubmit={handleGenerate} className="w-full max-w-lg flex gap-2">
                             <input 
                                type="text" 
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Enter a topic..."
                                className="flex-1 bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                             />
                             <button 
                                type="submit" 
                                disabled={!topic.trim() || isLoading}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50 flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20"
                             >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate'}
                             </button>
                         </form>
                    </div>
                ) : (
                    <div className="space-y-6 pb-10 animate-fade-in">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">Quiz: <span className="text-indigo-400">{topic}</span></h2>
                            <button 
                                onClick={() => { setQuestions([]); setTopic(''); }}
                                className="text-sm text-slate-400 hover:text-white transition-colors"
                            >
                                Start Over
                            </button>
                        </div>

                        {questions.map((q, idx) => (
                            <div key={q.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                                <h3 className="text-lg font-medium text-white mb-4 flex gap-3">
                                    <span className="text-slate-500">{idx + 1}.</span>
                                    {q.question}
                                </h3>
                                <div className="space-y-2">
                                    {q.options.map((opt, optIdx) => {
                                        let btnClass = "w-full text-left p-4 rounded-lg border transition-all flex justify-between items-center ";
                                        const isSelected = userAnswers[q.id] === optIdx;
                                        
                                        if (isSubmitted) {
                                            if (optIdx === q.correctAnswer) {
                                                btnClass += "bg-emerald-500/10 border-emerald-500/50 text-emerald-200";
                                            } else if (isSelected && optIdx !== q.correctAnswer) {
                                                btnClass += "bg-red-500/10 border-red-500/50 text-red-200";
                                            } else {
                                                btnClass += "border-slate-700 opacity-50";
                                            }
                                        } else {
                                            if (isSelected) {
                                                btnClass += "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/10";
                                            } else {
                                                btnClass += "bg-slate-900/50 border-slate-700 text-slate-300 hover:bg-slate-750";
                                            }
                                        }

                                        return (
                                            <button
                                                key={optIdx}
                                                onClick={() => handleSelectOption(q.id, optIdx)}
                                                disabled={isSubmitted}
                                                className={btnClass}
                                            >
                                                <span>{opt}</span>
                                                {isSubmitted && optIdx === q.correctAnswer && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                                                {isSubmitted && isSelected && optIdx !== q.correctAnswer && <AlertCircle className="w-5 h-5 text-red-500" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        {!isSubmitted ? (
                            <button 
                                onClick={() => setIsSubmitted(true)}
                                disabled={Object.keys(userAnswers).length < questions.length}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-500/20"
                            >
                                Submit Answers
                            </button>
                        ) : (
                            <div className="bg-slate-750 border border-slate-600 rounded-xl p-8 text-center animate-fade-in">
                                <p className="text-slate-400 mb-2">You scored</p>
                                <div className="text-5xl font-bold text-white mb-6">
                                    {calculateScore()} <span className="text-2xl text-slate-500">/ {questions.length}</span>
                                </div>
                                <button 
                                    onClick={() => { setQuestions([]); setTopic(''); }}
                                    className="bg-slate-600 hover:bg-slate-500 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg"
                                >
                                    Try Another Quiz
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIToolsView;