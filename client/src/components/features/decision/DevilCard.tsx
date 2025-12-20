"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import ScrollMessage from "./ScrollMessage"

interface DevilCardProps {
    content: string
    loading: boolean
}

export default function DevilCard({ content, loading }: DevilCardProps) {
    const [isScrollOpen, setScrollOpen] = useState(false)

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full relative pointer-events-none">
            {/* Horns Animation - Drops from top */}
            <motion.img
                src="/horns.png"
                alt="Horns"
                initial={{ y: -200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 10, delay: 0.1 }}
                className="w-32 h-auto z-20 mb-[-10px] pointer-events-auto drop-shadow-2xl"
            />

            {/* Devil Character - Fades in after Horns */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative z-10 cursor-pointer pointer-events-auto"
                onClick={() => !loading && setScrollOpen(!isScrollOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <img
                    src="/devil.png"
                    alt="Devil"
                    className="w-48 h-auto drop-shadow-2xl contrast-125 hover:brightness-110 transition-all duration-300"
                    style={{ filter: "drop-shadow(0 0 20px rgba(255,100,0,0.3))" }}
                />
            </motion.div>

            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-4xl font-black text-red-500 mt-4 tracking-wider uppercase bg-black/70 px-6 py-2 rounded-lg backdrop-blur-sm pointer-events-auto border-2 border-red-800/50 shadow-2xl"
                style={{
                    fontFamily: "var(--font-black-ops), sans-serif",
                    textShadow: "3px 3px 0 rgba(0,0,0,0.5), 0 0 20px rgba(255,0,0,0.5)",
                }}
            >
                The Devil
            </motion.h2>

            {/* Loading State or Scroll Message */}
            <div className="mt-8 w-full max-w-md px-4 min-h-[100px] flex justify-center pointer-events-auto">
                {loading ? (
                    <motion.div
                        animate={{ skewX: [0, -5, 5, 0], opacity: [0.8, 1, 0.8] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                        className="text-red-400 font-black text-lg bg-black/90 px-8 py-4 rounded-lg border-2 border-red-900 shadow-red-900/40 shadow-xl"
                        style={{
                            fontFamily: "var(--font-black-ops), sans-serif",
                            textShadow: "2px 2px 0 rgba(0,0,0,0.5)",
                        }}
                    >
                        Plotting mischief...
                    </motion.div>
                ) : (
                    <ScrollMessage text={content || "Tap the Devil to see the message..."} isOpen={isScrollOpen} />
                )}
            </div>

            {/* Hint */}
            {!isScrollOpen && !loading && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: 1.5 }}
                    className="absolute bottom-10 text-red-700/50 text-sm font-black uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-black-ops), sans-serif" }}
                >
                    (Poke the Devil)
                </motion.p>
            )}
        </div>
    )
}
