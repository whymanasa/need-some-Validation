"use client"

import { motion } from "framer-motion"
import ScrollMessage from "./ScrollMessage"

interface JudgeVerdictProps {
    content?: string
    loading?: boolean
}

export default function JudgeVerdict({ content, loading }: JudgeVerdictProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 z-30 w-full max-w-2xl mx-auto">
            <div className="relative w-full">
                {/* Gavel Animation Area */}
                <div className="flex justify-center mb-8 h-40 relative">
                    <motion.div
                        className="w-48 h-48 origin-bottom-right drop-shadow-2xl"
                        initial={{ rotate: 0, y: -20 }}
                        animate={{
                            rotate: [0, 0, -55, 0], // Wait (0), Slam (-90), Return (0)
                            y: [0, 0, -10, 0]
                        }}
                        transition={{
                            duration: 2.5, // 2s wait + 0.5s slam
                            times: [0, 0.8, 0.9, 1], // 0-0.8 (wait), 0.8-0.9 (slam), 0.9-1 (return)
                            ease: "easeInOut",
                            repeat: 0
                        }}
                        style={{ filter: "drop-shadow(0 10px 10px rgba(0,0,0,0.3))" }}
                    >
                        {/* Custom SVG Gavel */}
                        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Handle */}
                            <path d="M50 40 L50 90 A 3 3 0 0 0 56 90 L 56 40 Z" fill="#78350f" stroke="#451a03" strokeWidth="2" />
                            {/* Head Main */}
                            <rect x="20" y="25" width="60" height="20" rx="2" fill="#92400e" stroke="#451a03" strokeWidth="2" />
                            {/* Head Gold Bands */}
                            <rect x="25" y="25" width="5" height="20" fill="#f59e0b" />
                            <rect x="70" y="25" width="5" height="20" fill="#f59e0b" />
                            {/* Head Ends */}

                        </svg>
                    </motion.div>

                    {/* Impact Dust Effect */}
                    {!loading && content && (
                        <motion.div
                            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-40 h-10 bg-amber-100 rounded-[100%] blur-xl opacity-0"
                            animate={{ opacity: [0, 0.6, 0], scale: [0.5, 1.5, 2] }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        />
                    )}
                </div>

                {loading ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-amber-900/80 font-serif font-bold text-2xl text-center bg-white/40 px-8 py-4 rounded-lg shadow-sm border border-amber-900/10 backdrop-blur-sm"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                        Deliberating...
                    </motion.div>
                ) : (
                    <ScrollMessage
                        text={content || "The Court is in session."}
                        isOpen={true}
                        theme="judge"
                    />
                )}
            </div>

            {/* Hint */}
            {!loading && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-10 text-amber-900/60 text-sm font-bold uppercase tracking-widest"
                >
                    (Final Verdict)
                </motion.p>
            )}
        </div>
    )
}
