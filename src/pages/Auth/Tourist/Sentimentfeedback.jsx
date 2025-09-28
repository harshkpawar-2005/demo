import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { User, MapPin, MessageSquareText, Star, Send, Loader2, Check, X } from 'lucide-react';
import clsx from 'clsx';

// ## CHANGED: This component has been simplified to remove the floating label animation ##
const InputField = ({ id, icon, placeholder, value, onChange, type = 'text' }) => {
    const isTextarea = type === 'textarea';
    return (
        <div className="relative flex items-center">
            {/* The icon is positioned absolutely inside the container */}
            <div className="absolute left-4 pointer-events-none">{icon}</div>
            
            {isTextarea ? (
                <textarea
                    id={id}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    rows="4"
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 rounded-lg text-white placeholder-gray-500 border-2 border-transparent focus:border-teal-400 focus:outline-none transition-colors duration-300"
                />
            ) : (
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 rounded-lg text-white placeholder-gray-500 border-2 border-transparent focus:border-teal-400 focus:outline-none transition-colors duration-300"
                />
            )}
        </div>
    );
};

// A component to animate text letter by letter
const AnimatedText = ({ text, className }) => {
    const letters = Array.from(text);
    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
        }),
    };
    const child = {
        visible: { opacity: 1, x: 0, y: 0, transition: { type: "spring", damping: 12, stiffness: 100 } },
        hidden: { opacity: 0, x: -20, y: 10 },
    };
    return (
        <motion.h2
            className={className}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            {letters.map((letter, index) => (
                <motion.span key={index} variants={child}>
                    {letter === " " ? "\u00A0" : letter}
                </motion.span>
            ))}
        </motion.h2>
    );
};

// Main Enhanced Feedback Form Component
export default function HyperAnimatedForm() {
    const [formData, setFormData] = useState({ userId: '', location: '', comment: '' });
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [feedbackList, setFeedbackList] = useState([]);
    const [buttonState, setButtonState] = useState('idle');

    // Logic for the 3D tilt effect on the form card
    const cardX = useMotionValue(0);
    const cardY = useMotionValue(0);
    const rotateX = useTransform(cardY, [-300, 300], [10, -10]);
    const rotateY = useTransform(cardX, [-300, 300], [-10, 10]);
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const { width, height } = rect;
        const x = e.clientX - rect.left - width / 2;
        const y = e.clientY - rect.top - height / 2;
        cardX.set(x);
        cardY.set(y);
    };
    const handleMouseLeave = () => {
        cardX.set(0);
        cardY.set(0);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleDeleteFeedback = (id) => {
        setFeedbackList(currentFeedback => currentFeedback.filter(fb => fb.id !== id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (buttonState !== 'idle') return;
        if (!formData.userId || !formData.location || !formData.comment || rating === 0) {
            alert('Please fill all fields and provide a rating.');
            return;
        }

        setButtonState('loading');
        setTimeout(() => {
            const newFeedback = { id: Date.now(), timestamp: new Date().toLocaleString(), ...formData, rating };
            setFeedbackList((prev) => [newFeedback, ...prev]);
            
            setButtonState('success');

            setTimeout(() => {
                setFormData({ userId: '', location: '', comment: '' });
                setRating(0);
                setButtonState('idle');
            }, 1500);
        }, 1000);
    };

    const pageVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
    };

    const childVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
    };

    return (
        <div className="min-h-screen w-full bg-[#111827] text-gray-200 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops)),radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black animate-aurora opacity-30"></div>
            <main className="container mx-auto px-4 py-12 relative z-10">
                <motion.div variants={pageVariants} initial="hidden" animate="visible" className="max-w-2xl mx-auto">
                    <motion.header variants={childVariants} className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-400 mb-2">
                            Submit Your Feedback
                        </h1>
                        <p className="text-gray-400">Your experience matters to us.</p>
                    </motion.header>

                    <motion.div
                        style={{ perspective: 800 }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        variants={childVariants}
                        className="relative"
                    >
                        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-600 via-teal-500 to-fuchsia-500 animate-border-spin blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

                        <motion.form
                            style={{ rotateX, rotateY }}
                            onSubmit={handleSubmit}
                            className="relative space-y-6 bg-black/80 backdrop-blur-xl p-8 rounded-2xl border border-gray-700 shadow-2xl shadow-purple-900/10"
                        >
                            {/* ## CHANGED: Using the simplified InputField with 'placeholder' prop ## */}
                            <InputField id="userId" placeholder="Enter your User ID" icon={<User className="text-gray-500" />} value={formData.userId} onChange={handleInputChange} />
                            <InputField id="location" placeholder="Enter location visited" icon={<MapPin className="text-gray-500" />} value={formData.location} onChange={handleInputChange} />
                            <InputField id="comment" placeholder="Share your detailed feedback" icon={<MessageSquareText className="text-gray-500" />} value={formData.comment} onChange={handleInputChange} type="textarea" />
                            
                            <div className="text-center space-y-3 pt-2">
                                <h3 className="text-lg font-medium text-gray-300">Rate your experience</h3>
                                <div className="flex justify-center" onMouseLeave={() => setHoveredRating(0)}>
                                    {[...Array(5)].map((_, i) => (
                                        <motion.div key={i} onHoverStart={() => setHoveredRating(i + 1)} onClick={() => setRating(i + 1)} whileHover={{ scale: 1.25, y: -5 }} whileTap={{ scale: 0.9 }} className="cursor-pointer">
                                            <Star size={36} className={clsx('transition-colors duration-200', (i + 1 <= (hoveredRating || rating)) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600')} />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                            
                            <motion.button
                                type="submit"
                                className="w-full font-semibold py-3 px-6 rounded-lg text-white bg-gradient-to-r from-purple-600 via-fuchsia-500 to-teal-400 [background-size:200%] animate-gradient-shine transition-all duration-300"
                                whileHover={{ scale: 1.05, boxShadow: '0px 0px 20px rgba(139, 92, 246, 0.5)' }}
                                whileTap={{ scale: 0.95 }}
                                animate={{
                                    backgroundColor: buttonState === 'success' ? 'rgb(34 197 94)' : 'rgb(139 92 246)',
                                }}
                            >
                                <AnimatePresence mode="wait">
                                    {buttonState === 'idle' && <motion.span key="idle" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="flex items-center justify-center gap-2"><Send size={20} />Submit Feedback</motion.span>}
                                    {buttonState === 'loading' && <motion.span key="loading" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="flex items-center justify-center gap-2"><Loader2 size={20} className="animate-spin" /></motion.span>}
                                    {buttonState === 'success' && <motion.span key="success" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="flex items-center justify-center gap-2"><Check size={20} />Success!</motion.span>}
                                </AnimatePresence>
                            </motion.button>
                        </motion.form>
                    </motion.div>

                    <motion.div variants={childVariants} className="mt-16">
                        <AnimatedText text="Live Feedback Dashboard" className="text-3xl font-bold text-center mb-8" />
                        <div className="space-y-4">
                            <AnimatePresence>
                                {feedbackList.map((fb) => (
                                    <motion.div
                                        key={fb.id}
                                        layout
                                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }}
                                        whileHover={{ scale: 1.02, zIndex: 10, boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.3)' }}
                                        className="bg-gray-800/50 p-5 rounded-lg border-l-4 border-teal-400 relative group"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-lg text-teal-300">@{fb.userId}</p>
                                                <p className="text-sm text-gray-400">📍 {fb.location}</p>
                                            </div>
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => <Star key={i} size={16} className={clsx(i < fb.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600')} />)}
                                            </div>
                                        </div>
                                        <p className="mt-3 text-gray-300 italic">"{fb.comment}"</p>
                                        <p className="text-xs text-right text-gray-500 mt-2">{fb.timestamp}</p>
                                        
                                        <motion.button
                                            onClick={() => handleDeleteFeedback(fb.id)}
                                            className="absolute top-2 right-2 p-1 bg-gray-700/50 rounded-full text-gray-400 hover:bg-red-500/50 hover:text-white"
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            aria-label="Delete feedback"
                                        >
                                            <X size={16} />
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {feedbackList.length === 0 && <p className="text-center text-gray-500">No feedback yet...</p>}
                        </div>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
}