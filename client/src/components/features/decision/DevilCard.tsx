'use client';

import { motion } from 'framer-motion';

interface DevilCardProps {
    content: string;
    loading: boolean;
}

export default function DevilCard({ content, loading }: DevilCardProps) {
    return (
        <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="p-8 w-full max-w-md bg-red-950/90 backdrop-blur-md rounded-tl-3xl rounded-br-3xl border-2 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)] text-red-100 min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden"
        >
            <h2 className="text-2xl font-bold text-red-500 mb-4 uppercase tracking-widest">The Devil</h2>

            {loading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
                    <motion.div
                        animate={{ skewX: [0, 10, -10, 0], opacity: [0.8, 1, 0.8] }}
                        transition={{ repeat: Infinity, duration: 0.2 }}
                        className="text-red-600 text-6xl font-black"
                    >
                        ?!!?
                    </motion.div>
                </div>
            ) : (
                <div className="text-lg leading-relaxed text-center font-bold text-orange-200">
                    {content || "Come on, live a little..."}
                </div>
            )}
        </motion.div>
    );
}
