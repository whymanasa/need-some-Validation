'use client';

import { motion } from 'framer-motion';

interface AngelCardProps {
    content: string;
    loading: boolean;
}

export default function AngelCard({ content, loading }: AngelCardProps) {
    return (
        <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="p-8 w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl border border-blue-200 shadow-lg text-slate-700 min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden"
        >
            <h2 className="text-2xl font-semibold text-blue-500 mb-4 tracking-wide">The Angel</h2>

            {loading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-24 h-24 bg-blue-100 rounded-full blur-xl"
                    />
                    <div className="relative text-blue-400 font-medium">Listening...</div>
                </div>
            ) : (
                <div className="text-lg leading-relaxed text-center font-medium opacity-90">
                    {content || "What's on your mind, dear?"}
                </div>
            )}
        </motion.div>
    );
}
